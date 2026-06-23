# DEFENIQ Cloud Infrastructure Provisioning (Terraform)
# Defines standard enterprise AWS hosting framework

terraform {
  required_version = ">= 1.0.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

#---------------------------------------------------
# FRONTEND HOSTING: S3 & CloudFront CDN
#---------------------------------------------------

# S3 Bucket for hosting index.html, styles.css, app.js
resource "aws_s3_bucket" "frontend_bucket" {
  bucket        = "defeniq-production-frontend"
  force_destroy = true
}

resource "aws_s3_bucket_website_configuration" "frontend_web" {
  bucket = aws_s3_bucket.frontend_bucket.id
  index_document { suffix = "index.html" }
  error_document { key = "index.html" } # Enables client-side router rewrites
}

# CloudFront Origin Access Identity (OAI)
resource "aws_cloudfront_origin_access_identity" "oai" {
  comment = "OAI access for DEFENIQ frontend"
}

# S3 policy for OAI access
resource "aws_s3_bucket_policy" "frontend_policy" {
  bucket = aws_s3_bucket.frontend_bucket.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = { AWS = aws_cloudfront_origin_access_identity.oai.iam_arn }
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend_bucket.arn}/*"
      }
    ]
  })
}

# AWS WAF Web ACL (Security Edge)
resource "aws_wafv2_web_acl" "waf" {
  name     = "defeniq-waf"
  scope    = "CLOUDFRONT"
  provider = aws

  default_action {
    allow {}
  }

  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1
    override_action { none {} }
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "CommonRulesMetric"
      sampled_requests_enabled   = true
    }
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "DefeniqWafACLMetric"
    sampled_requests_enabled   = true
  }
}

# CloudFront Distribution
resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = aws_s3_bucket.frontend_bucket.bucket_regional_domain_name
    origin_id   = "S3-DEFENIQ-Frontend"
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"
  web_acl_id          = aws_wafv2_web_acl.waf.arn

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-DEFENIQ-Frontend"

    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html" # Forces SPA router fallback
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

#---------------------------------------------------
# AUTHENTICATION: AWS Cognito User Pools
#---------------------------------------------------
resource "aws_cognito_user_pool" "pool" {
  name = "defeniq-user-pool"

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
  }

  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]
}

resource "aws_cognito_user_pool_client" "client" {
  name         = "defeniq-client"
  user_pool_id = aws_cognito_user_pool.pool.id
  
  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH"
  ]
}

#---------------------------------------------------
# DATABASE: AWS RDS PostgreSQL
#---------------------------------------------------
resource "aws_db_instance" "db" {
  allocated_storage      = 20
  engine                 = "postgres"
  engine_version         = "15.4"
  instance_class         = "db.t4g.micro"
  db_name                = "defeniq_db"
  username               = "db_admin"
  password               = "secure_rds_password" # Set via variables in prod
  publicly_accessible    = false
  skip_final_snapshot    = true
  vpc_security_group_ids = [] # VPC configuration required
}
