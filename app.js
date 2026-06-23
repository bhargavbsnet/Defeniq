// DEFENIQ SPA Router and Controller

// Router Configuration
const ROUTES = {
  '': 'home',
  'home': 'home',
  'about': 'about',
  'services': 'services',
  'products': 'products',
  'demo': 'demo',
  'technology': 'technology',
  'blog': 'blog',
  'careers': 'careers',
  'contact': 'contact',
  'login': 'login',
  'register': 'register',
  'forgot-password': 'forgot-password',
  'reset-password': 'reset-password',
  'admin-dashboard': 'admin-dashboard'
};

let activeRoute = 'home';
let particleNetworkInstance = null;

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  setupNavigation();
  handleUrlChange();
  
  // Intercept all route clicks on document level
  document.addEventListener('click', (e) => {
    const routeBtn = e.target.closest('[data-route]');
    if (routeBtn) {
      e.preventDefault();
      const route = routeBtn.getAttribute('data-route');
      navigate(route);
    }
  });

  window.addEventListener('popstate', () => {
    handleUrlChange();
  });
});

// Routing Navigation Engine
function navigate(route) {
  const normalizedRoute = ROUTES[route] || 'home';
  window.history.pushState({}, '', '/' + (normalizedRoute === 'home' ? '' : normalizedRoute));
  loadView(normalizedRoute);
}

function handleUrlChange() {
  const path = window.location.pathname.replace(/^\/|\/$/g, '');
  const route = ROUTES[path] || 'home';
  loadView(route);
}

function loadView(route) {
  activeRoute = route;
  updateActiveNavLink();
  updateAuthNavBarState();
  
  // Render View HTML
  const appContainer = document.getElementById('app');
  appContainer.innerHTML = getViewHtml(route);

  // Manage Particle Canvas Visibility (Only show on Home, or keep hidden/shown dynamically)
  const canvasWrap = document.getElementById('hero-canvas-wrap');
  if (route === 'home') {
    canvasWrap.style.display = 'block';
    if (!particleNetworkInstance) {
      particleNetworkInstance = window.initParticleNetwork('particle-canvas');
    }
  } else {
    canvasWrap.style.display = 'none';
  }

  // Scroll to top on page swap
  window.scrollTo(0, 0);

  // Initialize Route Controllers
  initializeRouteController(route);
}

// Global Nav & Footer Controls
function setupNavigation() {
  const mainNav = document.getElementById('main-nav');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');

  // Change nav style on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      mainNav.classList.add('scrolled');
    } else {
      mainNav.classList.remove('scrolled');
    }
  });

  // Mobile Toggle Menu
  mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  // Close menu when clicking nav link
  navMenu.addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-link')) {
      navMenu.classList.remove('open');
    }
  });

  // Logo Navigation
  document.getElementById('nav-logo-btn').addEventListener('click', () => {
    navigate('home');
  });

  // Auth Button Click
  document.getElementById('nav-auth-btn').addEventListener('click', () => {
    const user = window.DEFENIQ_AUTH.getCurrentUser();
    if (user) {
      if (user.role === 'admin') {
        navigate('admin-dashboard');
      } else {
        window.DEFENIQ_AUTH.logout();
        showToast('Logged out successfully', 'success');
        navigate('home');
      }
    } else {
      navigate('login');
    }
  });
}

function updateActiveNavLink() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach(link => {
    const route = link.getAttribute('data-route');
    if (route === activeRoute) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function updateAuthNavBarState() {
  const user = window.DEFENIQ_AUTH.getCurrentUser();
  const authContainer = document.getElementById('auth-nav-container');
  
  if (user) {
    if (user.role === 'admin') {
      authContainer.innerHTML = `
        <div style="display:flex; align-items:center; gap:16px;">
          <span style="font-size:0.85rem; color:#32D9FF; cursor:pointer;" data-route="admin-dashboard">Portal</span>
          <button class="btn btn-secondary" style="padding: 8px 16px; font-size:0.85rem;" id="nav-logout-action">Logout</button>
        </div>
      `;
    } else {
      authContainer.innerHTML = `
        <div style="display:flex; align-items:center; gap:16px;">
          <span style="font-size:0.85rem; color:#B7C3D1;">Hello, ${user.name.split(' ')[0]}</span>
          <button class="btn btn-secondary" style="padding: 8px 16px; font-size:0.85rem;" id="nav-logout-action">Logout</button>
        </div>
      `;
    }
    
    // Wire logout listener
    const logoutBtn = document.getElementById('nav-logout-action');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => {
        window.DEFENIQ_AUTH.logout();
        showToast('Logged out successfully', 'success');
        navigate('home');
      });
    }
  } else {
    authContainer.innerHTML = `<button class="btn btn-secondary" id="nav-auth-btn" style="padding: 8px 20px; font-size:0.85rem;">Login</button>`;
    
    // Wire login listener
    const loginBtn = document.getElementById('nav-auth-btn');
    if (loginBtn) {
      loginBtn.addEventListener('click', () => {
        navigate('login');
      });
    }
  }
}

// UI Notification Toasts helper
function showToast(message, type = 'info') {
  const wrap = document.getElementById('toast-wrap');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${message}</span>
  `;
  wrap.appendChild(toast);
  
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

// Views HTML Generator mapping
function getViewHtml(route) {
  switch (route) {
    case 'home':
      return getHomeHtml();
    case 'about':
      return getAboutHtml();
    case 'services':
      return getServicesHtml();
    case 'products':
      return getProductsHtml();
    case 'demo':
      return getDemoHtml();
    case 'technology':
      return getTechnologyHtml();
    case 'blog':
      return getBlogHtml();
    case 'careers':
      return getCareersHtml();
    case 'contact':
      return getContactHtml();
    case 'login':
      return getLoginHtml();
    case 'register':
      return getRegisterHtml();
    case 'forgot-password':
      return getForgotPasswordHtml();
    case 'reset-password':
      return getResetPasswordHtml();
    case 'admin-dashboard':
      return getAdminDashboardHtml();
    default:
      return getHomeHtml();
  }
}

// ----------------------------------------------------
// PAGE VIEW CONTENT GENERATORS
// ----------------------------------------------------

function getHomeHtml() {
  const stats = window.DEFENIQ_DB.getMetrics();
  return `
    <section class="hero page-view">
      <div class="grid-overlay"></div>
      <div class="hero-content">
        <div class="hero-badge"><span></span> AWS Qualified Software Partner</div>
        <h1>Building Digital Platforms That Create <span>Real Business Impact</span></h1>
        <p class="hero-desc">From cloud-native container applications to specialized freelancer ecosystems, DEFENIQ helps organizations launch, scale, and automate digital products globally.</p>
        <div class="hero-actions">
          <button class="btn btn-primary" data-route="services">Explore Solutions</button>
          <button class="btn btn-secondary" data-route="products">View Our Platforms</button>
        </div>
      </div>
    </section>

    <!-- Stats Bar -->
    <div class="stats-bar">
      <div class="stat-item">
        <div class="stat-num" id="stat-projects">0</div>
        <div class="stat-label">Projects Delivered</div>
      </div>
      <div class="stat-item">
        <div class="stat-num" id="stat-users">0</div>
        <div class="stat-label">Platform Users</div>
      </div>
      <div class="stat-item">
        <div class="stat-num" id="stat-deployments">0</div>
        <div class="stat-label">Cloud Deployments</div>
      </div>
      <div class="stat-item">
        <div class="stat-num" id="stat-satisfaction">0%</div>
        <div class="stat-label">Client Satisfaction</div>
      </div>
    </div>

    <!-- Timeline Layout for Capabilities -->
    <section class="timeline-section">
      <div class="section-hdr">
        <div class="hero-badge" style="margin-bottom:12px;">Core Capabilities</div>
        <h2>Engineering the <span>Future of Software</span></h2>
        <p>A step-by-step roadmap demonstrating how we deliver scalable cloud-native architectures.</p>
      </div>

      <div class="timeline">
        <div class="timeline-item timeline-left">
          <div class="timeline-content">
            <div class="timeline-num">Stage 01</div>
            <h3>Cloud Infrastructure Design</h3>
            <p>Architecting multi-availability zone AWS network infrastructure using Terraform, enabling automated load-balancing, auto-scaling, and failover capabilities.</p>
          </div>
        </div>
        <div class="timeline-item timeline-right">
          <div class="timeline-content">
            <div class="timeline-num">Stage 02</div>
            <h3>Custom Software Engineering</h3>
            <p>Developing robust, performant web applications using modern frameworks, keeping clean interfaces, standard API design, and highly optimized code components.</p>
          </div>
        </div>
        <div class="timeline-item timeline-left">
          <div class="timeline-content">
            <div class="timeline-num">Stage 03</div>
            <h3>Marketplace Development</h3>
            <p>Deploying transactional architectures optimized for high scalability, supporting complex search, digital billing systems, and interactive client workspaces.</p>
          </div>
        </div>
        <div class="timeline-item timeline-right">
          <div class="timeline-content">
            <div class="timeline-num">Stage 04</div>
            <h3>Enterprise AI Integration</h3>
            <p>Injecting intelligent operations into existing workflows, utilizing large language models and cognitive services for automatic content curation and analysis.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Cloud Architecture Interactive Visualizer -->
    <section class="aws-diagram-section">
      <div class="section-hdr">
        <div class="hero-badge" style="margin-bottom:12px;">AWS Cloud Ecosystem</div>
        <h2>Enterprise-Grade <span>Serverless Architecture</span></h2>
        <p>Hover over components below to see how DEFENIQ structures its global workloads for maximum security, scalability, and latency optimization.</p>
      </div>

      <div class="architecture-container">
        <!-- Interactive Node Diagram -->
        <div class="architecture-visualization">
          <svg class="arch-lines-svg">
            <!-- Interconnecting lines between layers -->
            <line x1="25%" y1="18%" x2="50%" y2="45%" stroke="rgba(50,217,255,0.2)" stroke-width="1.5" />
            <line x1="75%" y1="18%" x2="50%" y2="45%" stroke="rgba(50,217,255,0.2)" stroke-width="1.5" />
            <line x1="50%" y1="45%" x2="25%" y2="82%" stroke="rgba(50,217,255,0.2)" stroke-width="1.5" />
            <line x1="50%" y1="45%" x2="75%" y2="82%" stroke="rgba(50,217,255,0.2)" stroke-width="1.5" />
          </svg>

          <!-- Layer 1: Edge (DNS & CDN) -->
          <div class="architecture-layer">
            <div class="cloud-node" data-node="cloudfront">
              <svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
              <span>CloudFront</span>
            </div>
            <div class="cloud-node" data-node="waf">
              <svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <span>AWS WAF</span>
            </div>
          </div>

          <!-- Layer 2: API Gateway & Lambda (Compute) -->
          <div class="architecture-layer">
            <div class="cloud-node" data-node="lambda">
              <svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
              <span>AWS Lambda</span>
            </div>
          </div>

          <!-- Layer 3: Database & Auth (Storage) -->
          <div class="architecture-layer">
            <div class="cloud-node" data-node="rds">
              <svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>
              <span>RDS Postgres</span>
            </div>
            <div class="cloud-node" data-node="cognito">
              <svg viewBox="0 0 24 24" stroke-width="1.5" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>Cognito Auth</span>
            </div>
          </div>
        </div>

        <!-- Component Details Card -->
        <div class="architecture-details">
          <div class="tech-info-card glass-panel" id="arch-info-card">
            <h3>Select a Node</h3>
            <p class="tech-info-desc">Click on any cloud resource icon on the architecture diagram to inspect how it coordinates our cloud data traffic.</p>
            <div class="tech-metrics">
              <div class="tech-metric-box">
                <div class="tech-metric-val">99.99%</div>
                <div class="tech-metric-lbl">Availability</div>
              </div>
              <div class="tech-metric-box">
                <div class="tech-metric-val">&lt; 50ms</div>
                <div class="tech-metric-lbl">Target Latency</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why DEFENIQ (Non-standard creative visual grid layout) -->
    <section class="why-grid-container" style="background:#0E1624; padding:80px 0;">
      <div class="section-hdr">
        <h2>Designed for <span>Resilience & Trust</span></h2>
        <p>Why modern companies deploy their flagship tech stacks with DEFENIQ.</p>
      </div>
      <div class="why-grid">
        <div class="why-block">
          <svg class="why-icon" viewBox="0 0 24 24" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <h3>Security First</h3>
          <p>We build security into the design phase. Every application is configured with TLS termination, WAF threat filtration, and role-based IAM policies.</p>
        </div>
        <div class="why-block">
          <svg class="why-icon" viewBox="0 0 24 24" stroke-linecap="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <h3>Cloud Native</h3>
          <p>Zero dependency on legacy machinery. Built utilizing AWS serverless nodes to offer elastic horizontal scaling and zero idle-server bills.</p>
        </div>
        <div class="why-block">
          <svg class="why-icon" viewBox="0 0 24 24" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          <h3>Accelerated Delivery</h3>
          <p>Utilizing pre-engineered core architectures and fully modular components, we deploy complete enterprise platforms in weeks instead of quarters.</p>
        </div>
      </div>
    </section>

    <!-- Products Immersive Showcase -->
    <section class="showcase-section">
      <div class="section-hdr">
        <div class="hero-badge" style="margin-bottom:12px;">Flagship SaaS Platforms</div>
        <h2>Enabling Modern <span>Freelance Ecosystems</span></h2>
        <p>Inspect our own proprietary products designed to empower independent professionals globally.</p>
      </div>

      <!-- Product 1: SkillForge -->
      <div class="product-block">
        <div class="product-details-col">
          <div class="product-badge">Platform One</div>
          <h3>SkillForge Marketplace™</h3>
          <p class="product-desc">A specialized freelance ecosystem configured exclusively for advanced cloud architecture, DevOps automation, and security specialists.</p>
          <ul class="product-feats">
            <li>Strict vetting protocol ensuring access only to verified tech specialists.</li>
            <li>Fully automated workspace creation upon contract execution.</li>
            <li>Embedded milestone-escrow systems for secure billing validation.</li>
          </ul>
          <button class="btn btn-primary" data-route="demo">Launch Demo Sandbox</button>
        </div>
        <div class="product-visual-col">
          <div class="product-screen">
            <div class="browser-bar">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            </div>
            <div style="text-align:center; padding: 40px 20px;">
              <h4 style="color:#32D9FF; margin-bottom:16px; font-size:1.25rem;">SkillForge™ Interface</h4>
              <p style="font-size:0.9rem; margin-bottom:20px;">A modern search engine dashboard tailored for cloud projects.</p>
              <div style="background:rgba(20,125,245,0.05); padding:16px; border: 1px dashed var(--color-border); border-radius:8px;">
                <code style="font-size:0.8rem; color:#F8FAFC;">query: "AWS DevOps Engineer" <br>found: 14 matches (Verified)</code>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Product 2: Legal Toolkit -->
      <div class="product-block reverse">
        <div class="product-details-col">
          <div class="product-badge">Platform Two</div>
          <h3>Freelancer Legal Toolkit™</h3>
          <p class="product-desc">A comprehensive, automated document generator protecting independent contractors with enterprise-grade legal templates.</p>
          <ul class="product-feats">
            <li>Fully customizable NDAs, Master Service Agreements, and Statements of Work.</li>
            <li>Direct integration with electronic signature protocols.</li>
            <li>Automatic invoice and milestone payment scheduling configurations.</li>
          </ul>
          <button class="btn btn-secondary" data-route="demo">Inspect Document Engine</button>
        </div>
        <div class="product-visual-col">
          <div class="product-screen">
            <div class="browser-bar">
              <span class="dot"></span><span class="dot"></span><span class="dot"></span>
            </div>
            <div style="text-align:center; padding: 40px 20px;">
              <h4 style="color:#2ECC71; margin-bottom:16px; font-size:1.25rem;">Legal Toolkit Generator</h4>
              <p style="font-size:0.9rem; margin-bottom:20px;">Automated Contract Generator Engine.</p>
              <div style="background:rgba(46,204,113,0.05); padding:16px; border: 1px dashed rgba(46,204,113,0.2); border-radius:8px; text-align:left;">
                <code style="font-size:0.8rem; color:#B7C3D1;">[MUTUAL NDA TEMPLATE]<br>BETWEEN: Client Corp<br>AND: Cloud Engineer LLC<br>STATUS: Draft generated (100% compliant)</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Case Studies / Client Success Preview -->
    <section class="success-section">
      <div class="case-study-hero">
        <div class="case-study-body">
          <div class="hero-badge">Enterprise Case Study</div>
          <h3>Deploying Global Billing Systems For FinTech</h3>
          <p>How DEFENIQ assisted a major payment facilitator in migrating their transaction reconciliation engines to AWS serverless nodes, shrinking monthly processing costs by 45%.</p>
          <div class="case-metrics-grid">
            <div class="case-metric-item">
              <div class="case-metric-num">-45%</div>
              <div style="font-size:0.8rem; color:var(--color-muted);">Operating Costs</div>
            </div>
            <div class="case-metric-item">
              <div class="case-metric-num">30M+</div>
              <div style="font-size:0.8rem; color:var(--color-muted);">Daily API Requests</div>
            </div>
            <div class="case-metric-item">
              <div class="case-metric-num">99.999%</div>
              <div style="font-size:0.8rem; color:var(--color-muted);">System Uptime</div>
            </div>
          </div>
        </div>
        <div>
          <div class="glass-panel" style="border-color:rgba(20, 125, 245, 0.2);">
            <h4 style="margin-bottom:16px; color:#32D9FF;">Architecture Scope</h4>
            <p style="font-size:0.9rem; margin-bottom:12px;"><strong>Compute:</strong> AWS ECS Fargate, AWS Lambda</p>
            <p style="font-size:0.9rem; margin-bottom:12px;"><strong>Database:</strong> AWS RDS PostgreSQL (Multi-AZ)</p>
            <p style="font-size:0.9rem; margin-bottom:12px;"><strong>Security:</strong> AWS Shield Advanced, AWS WAF Rules</p>
            <p style="font-size:0.9rem; margin-bottom:12px;"><strong>Messaging:</strong> AWS SNS + SQS queues</p>
          </div>
        </div>
      </div>
    </section>
  `;
}

function getAboutHtml() {
  return `
    <section style="padding: 80px 8% 40px;" class="page-view">
      <div class="section-hdr">
        <div class="hero-badge" style="margin-bottom:12px;">Our Story</div>
        <h2>Who We Are</h2>
        <p>Architecting software systems that scale dynamically to meet the needs of global businesses.</p>
      </div>
      
      <div style="max-width: 800px; margin: 0 auto 60px;">
        <p style="font-size:1.15rem; margin-bottom:24px; color:#FFFFFF;">DEFENIQ was founded on the principle that digital platforms should be designed from the ground up to support rapid business transformation, scale elastically without infrastructure overhead, and remain securely guarded at all times.</p>
        <p style="margin-bottom:24px;">Our engineering culture centers on AWS-first technologies. By avoiding legacy virtualization systems, we construct client software architectures that are modern, resilient, and highly secure. We pair this with specialized marketplace products—like SkillForge Marketplace™ and Freelancer Legal Toolkit™—designed to elevate independent professional contractors.</p>
      </div>

      <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap:24px; max-width:1000px; margin: 0 auto 80px;">
        <div class="glass-panel">
          <h4 style="color:#32D9FF; margin-bottom:12px;">Our Mission</h4>
          <p style="font-size:0.9rem;">To empower organizations and professionals by deploying intelligent, resilient, cloud-native technology platforms.</p>
        </div>
        <div class="glass-panel">
          <h4 style="color:#32D9FF; margin-bottom:12px;">Our Vision</h4>
          <p style="font-size:0.9rem;">To be the global benchmark for AWS cloud engineering, serverless SaaS product innovation, and freelancer marketplaces.</p>
        </div>
        <div class="glass-panel">
          <h4 style="color:#32D9FF; margin-bottom:12px;">Our Philosophy</h4>
          <p style="font-size:0.9rem;">Security first, infrastructure as code, serverless compute, and rapid deployment without compromise.</p>
        </div>
      </div>
    </section>
  `;
}

function getServicesHtml() {
  return `
    <section style="padding: 80px 8%;" class="page-view">
      <div class="section-hdr">
        <div class="hero-badge" style="margin-bottom:12px;">Our Services</div>
        <h2>Core Technology Capabilities</h2>
        <p>We deliver comprehensive digital transformations powered by robust cloud architecture and modern code.</p>
      </div>

      <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:32px; max-width:1000px; margin: 0 auto;">
        <div class="glass-panel">
          <h3 style="color:#32D9FF; margin-bottom:16px;">AWS Cloud Engineering</h3>
          <p style="margin-bottom:16px;">Provisioning enterprise cloud platforms with automated load-balancing, multiple availability zones, and strict VPC networks.</p>
          <ul style="list-style:none; font-size:0.9rem; color:var(--color-muted);">
            <li>• Infrastructure as Code (Terraform)</li>
            <li>• Serverless Architectures (Lambda, Gateway)</li>
            <li>• Relational & NoSQL Datastores</li>
          </ul>
        </div>
        <div class="glass-panel">
          <h3 style="color:#32D9FF; margin-bottom:16px;">Custom SaaS Development</h3>
          <p style="margin-bottom:16px;">Building multi-tenant software architectures supporting scalable subscriber plans, microservices backends, and responsive frontends.</p>
          <ul style="list-style:none; font-size:0.9rem; color:var(--color-muted);">
            <li>• React/Next.js/Node.js API Routes</li>
            <li>• Fully Integrated Billing Engines</li>
            <li>• Microservice Component Splitting</li>
          </ul>
        </div>
        <div class="glass-panel">
          <h3 style="color:#32D9FF; margin-bottom:16px;">Marketplace Platforms</h3>
          <p style="margin-bottom:16px;">Creating interactive peer-to-peer marketplaces tailored for high search volumes, secure messaging, and transactional tracking.</p>
          <ul style="list-style:none; font-size:0.9rem; color:var(--color-muted);">
            <li>• Real-Time Category Indexing</li>
            <li>• Safe Escrow Payment Systems</li>
            <li>• Interactive Collaboration Dashboards</li>
          </ul>
        </div>
        <div class="glass-panel">
          <h3 style="color:#32D9FF; margin-bottom:16px;">DevOps & Cybersecurity</h3>
          <p style="margin-bottom:16px;">Automating deployment pipelines with built-in security auditing and AWS WAF edge protection to intercept vulnerabilities.</p>
          <ul style="list-style:none; font-size:0.9rem; color:var(--color-muted);">
            <li>• GitHub Actions CI/CD</li>
            <li>• CloudWatch Monitoring & Metrics</li>
            <li>• Identity Access Management (Cognito/IAM)</li>
          </ul>
        </div>
      </div>
    </section>
  `;
}

function getProductsHtml() {
  return `
    <section style="padding: 80px 8%;" class="page-view">
      <div class="section-hdr">
        <div class="hero-badge" style="margin-bottom:12px;">Proprietary Ecosystem</div>
        <h2>Flagship Software Products</h2>
        <p>Explore our active software platforms deployed globally to support independent contractors.</p>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:40px; max-width:1100px; margin:0 auto;">
        
        <!-- Product Card 1 -->
        <div class="glass-panel" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="font-size:0.8rem; font-weight:700; color:#32D9FF; text-transform:uppercase; margin-bottom:12px;">SaaS Marketplace</div>
            <h3 style="font-size:1.8rem; margin-bottom:16px;">SkillForge Marketplace™</h3>
            <p style="margin-bottom:24px;">An elite hub for matching top-tier certified AWS Cloud Engineers, Cybersecurity Architects, and DevOps specialists with global enterprises looking for targeted talent.</p>
            <h4 style="font-size:1rem; margin-bottom:12px; color:#FFFFFF;">Key Capabilities:</h4>
            <ul style="list-style:none; font-size:0.9rem; margin-bottom:24px; padding-left:0;">
              <li style="margin-bottom:8px;">✓ Pre-vetted profiles checking certifications and codebase portfolios.</li>
              <li style="margin-bottom:8px;">✓ Automated environment creation inside AWS for developer sandboxes.</li>
              <li style="margin-bottom:8px;">✓ Embedded milestone tracking systems for secure billing validation.</li>
            </ul>
          </div>
          <button class="btn btn-primary" data-route="demo">Launch Demo Sandbox</button>
        </div>

        <!-- Product Card 2 -->
        <div class="glass-panel" style="display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div style="font-size:0.8rem; font-weight:700; color:#2ECC71; text-transform:uppercase; margin-bottom:12px;">Legal SaaS Ecosystem</div>
            <h3 style="font-size:1.8rem; margin-bottom:16px;">Freelancer Legal Toolkit™</h3>
            <p style="margin-bottom:24px;">Protecting freelance businesses with legally sound templates, service agreements, scope documents, and invoice packages compiled by contract experts.</p>
            <h4 style="font-size:1rem; margin-bottom:12px; color:#FFFFFF;">Key Capabilities:</h4>
            <ul style="list-style:none; font-size:0.9rem; margin-bottom:24px; padding-left:0;">
              <li style="margin-bottom:8px;">✓ Dynamic customization fields matching client specifications.</li>
              <li style="margin-bottom:8px;">✓ Encrypted electronic signature generation.</li>
              <li style="margin-bottom:8px;">✓ Structured statement of work generator with PDF exporting support.</li>
            </ul>
          </div>
          <button class="btn btn-secondary" data-route="demo">Launch Document Generator</button>
        </div>

      </div>
    </section>
  `;
}

function getDemoHtml() {
  return `
    <section style="padding: 80px 8%;" class="page-view">
      <div class="section-hdr">
        <div class="hero-badge" style="margin-bottom:12px;">Interactive Sandbox</div>
        <h2>Product Sandbox & Demo</h2>
        <p>Interact with working prototype representations of our flagship platforms built with simulated data models.</p>
      </div>

      <div style="display:grid; grid-template-columns: 1fr 1fr; gap:40px; max-width:1200px; margin: 0 auto;">
        
        <!-- SkillForge Search Demo -->
        <div class="glass-panel">
          <div style="display:flex; justify-content:between; align-items:center; margin-bottom:20px; border-bottom:1px solid rgba(255, 255, 255, 0.05); padding-bottom:12px;">
            <h3 style="color:#32D9FF; font-size:1.3rem;">SkillForge™ Search Engine</h3>
            <span style="font-size:0.75rem; background:rgba(20,125,245,0.1); padding:4px 8px; border-radius:4px; color:#32D9FF;">Live Sandbox</span>
          </div>
          <p style="font-size:0.9rem; margin-bottom:16px;">Filter and inspect verified AWS engineers, security experts, and automation developers in our database.</p>
          
          <div class="demo-search-bar">
            <input type="text" class="search-input" id="demo-search-input" placeholder="Search e.g. AWS, Security, DevOps, DevOps Specialist...">
            <button class="btn btn-primary" style="padding:8px 16px; font-size:0.85rem;" id="demo-search-btn">Filter</button>
          </div>

          <div class="freelancer-grid" id="demo-freelancer-results">
            <!-- Dynamic Freelancers Rendered Here -->
          </div>
        </div>

        <!-- Legal Document Generator Demo -->
        <div class="glass-panel">
          <div style="display:flex; justify-content:between; align-items:center; margin-bottom:20px; border-bottom:1px solid rgba(255, 255, 255, 0.05); padding-bottom:12px;">
            <h3 style="color:#2ECC71; font-size:1.3rem;">Freelancer Legal Toolkit™</h3>
            <span style="font-size:0.75rem; background:rgba(46,204,113,0.1); padding:4px 8px; border-radius:4px; color:#2ECC71;">Live Sandbox</span>
          </div>
          <p style="font-size:0.9rem; margin-bottom:16px;">Select a document template, enter parameters, and compile your professional legal contract draft.</p>
          
          <div class="form-group">
            <label>Template Type</label>
            <select class="form-control" id="doc-template-select">
              <option value="nda">Mutual Non-Disclosure Agreement (NDA)</option>
              <option value="msa">Master Services Agreement (Contract)</option>
              <option value="sow">Statement of Work (SOW)</option>
            </select>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-bottom:16px;">
            <div class="form-group" style="margin-bottom:0;">
              <label>Client Name</label>
              <input type="text" class="form-control" id="doc-client-name" value="Acme Corp">
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label>Consultant Name</label>
              <input type="text" class="form-control" id="doc-consultant-name" value="Cloud Architect LLC">
            </div>
          </div>

          <button class="btn btn-primary" style="width:100%; margin-bottom:20px; font-size:0.85rem;" id="doc-generate-btn">Compile Legal Document</button>
          
          <h4 style="font-size:0.9rem; margin-bottom:8px; color:#FFFFFF;">Document Preview Panel:</h4>
          <div class="toolkit-preview-box" id="doc-preview-output">
            Select parameters and click Compile above to load contract text...
          </div>
        </div>

      </div>
    </section>
  `;
}

function getTechnologyHtml() {
  return `
    <section style="padding: 80px 8%;" class="page-view">
      <div class="section-hdr">
        <div class="hero-badge" style="margin-bottom:12px;">Architecture Stack</div>
        <h2>Enterprise Ecosystem Map</h2>
        <p>Our stack is selected for scalability, security isolation, global edge delivery, and fast loading performance.</p>
      </div>

      <div class="ecosystem-container">
        <div class="ecosystem-card">
          <h3>
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="#32D9FF" stroke-width="2" fill="none"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            Frontend Core
          </h3>
          <ul>
            <li><span>HTML5 & CSS3</span> <span>Semantic Layout</span></li>
            <li><span>TypeScript / JavaScript</span> <span>Type-safe Logic</span></li>
            <li><span>Next.js</span> <span>Framework (SaaS Webapp)</span></li>
            <li><span>Tailwind CSS</span> <span>Adaptive Layouts</span></li>
          </ul>
        </div>

        <div class="ecosystem-card">
          <h3>
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="#32D9FF" stroke-width="2" fill="none"><rect x="2" y="2" width="20" height="8" rx="2" ry="2"/><rect x="2" y="14" width="20" height="8" rx="2" ry="2"/><line x1="6" y1="6" x2="6.01" y2="6"/><line x1="6" y1="18" x2="6.01" y2="18"/></svg>
            Backend & Compute
          </h3>
          <ul>
            <li><span>Node.js / Express</span> <span>API Foundations</span></li>
            <li><span>AWS Lambda</span> <span>Serverless Compute</span></li>
            <li><span>AWS API Gateway</span> <span>Routing & Throttling</span></li>
            <li><span>Next.js API Routes</span> <span>Serverless Framework</span></li>
          </ul>
        </div>

        <div class="ecosystem-card">
          <h3>
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="#32D9FF" stroke-width="2" fill="none"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/></svg>
            Database & Auth
          </h3>
          <ul>
            <li><span>PostgreSQL</span> <span>Relational Database</span></li>
            <li><span>Prisma ORM</span> <span>Data Migrations</span></li>
            <li><span>AWS RDS Postgres</span> <span>Hosted Database</span></li>
            <li><span>AWS Cognito</span> <span>Identity Integration</span></li>
          </ul>
        </div>

        <div class="ecosystem-card">
          <h3>
            <svg viewBox="0 0 24 24" width="20" height="20" stroke="#32D9FF" stroke-width="2" fill="none"><polygon points="12 2 2 22 22 22 12 2"/></svg>
            Cloud Operations
          </h3>
          <ul>
            <li><span>Terraform</span> <span>Infrastructure as Code</span></li>
            <li><span>GitHub Actions</span> <span>Deployment CI/CD</span></li>
            <li><span>AWS S3 & CloudFront</span> <span>Edge Asset Delivery</span></li>
            <li><span>AWS CloudWatch</span> <span>Metrics & Alarm Logs</span></li>
          </ul>
        </div>
      </div>
    </section>
  `;
}

function getBlogHtml() {
  return `
    <section style="padding: 80px 8% 40px;" class="page-view">
      <div class="section-hdr">
        <div class="hero-badge" style="margin-bottom:12px;">Insights & Engineering</div>
        <h2>Company Engineering Blog</h2>
        <p>Technical publications from our DevOps specialists, cloud architects, and software engineers.</p>
      </div>

      <div class="blog-layout">
        <div>
          <div class="blog-grid" id="blog-posts-container">
            <!-- Dynamic Blog Posts Rendered Here -->
          </div>
        </div>

        <!-- Sidebar Widget -->
        <div>
          <div class="blog-sidebar-widget">
            <h3>Search Articles</h3>
            <div class="form-group" style="margin-bottom:0;">
              <input type="text" class="form-control" id="blog-search-input" placeholder="Keyword search...">
            </div>
          </div>

          <div class="blog-sidebar-widget">
            <h3>Filter Categories</h3>
            <div class="widget-tags" id="blog-category-filters">
              <span class="widget-tag active" data-category="all">All Categories</span>
              <span class="widget-tag" data-category="AWS">AWS Cloud</span>
              <span class="widget-tag" data-category="Cloud">Serverless Architecture</span>
              <span class="widget-tag" data-category="Freelancing">Niche Marketplace</span>
            </div>
          </div>
          
          <div class="blog-sidebar-widget">
            <h3>Join Newsletter</h3>
            <p style="font-size:0.8rem; margin-bottom:16px;">Receive deep-dives on serverless containers and legal toolkits monthly.</p>
            <div class="form-group">
              <input type="email" class="form-control" id="blog-newsletter-email" placeholder="email@address.com">
            </div>
            <button class="btn btn-primary" style="width:100%; font-size:0.85rem;" id="blog-newsletter-btn">Subscribe</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function getCareersHtml() {
  return `
    <section style="padding: 80px 8%;" class="page-view">
      <div class="section-hdr">
        <div class="hero-badge" style="margin-bottom:12px;">Careers</div>
        <h2>Join Our Technology Team</h2>
        <p>DEFENIQ is always seeking elite cloud engineers, systems programmers, and designers.</p>
      </div>

      <div style="display:grid; grid-template-columns:1.2fr 0.8fr; gap:48px; max-width:1100px; margin: 0 auto;">
        
        <!-- Job Openings -->
        <div>
          <h3 style="margin-bottom:24px; color:#32D9FF;">Active Positions</h3>
          
          <div class="glass-panel" style="margin-bottom:16px; padding:24px;">
            <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:8px;">
              <h4 style="font-size:1.15rem; color:#FFFFFF;">Senior AWS DevOps Engineer</h4>
              <span style="font-size:0.75rem; background:rgba(20,125,245,0.1); color:#32D9FF; padding:4px 8px; border-radius:4px;">Remote / Full-time</span>
            </div>
            <p style="font-size:0.9rem; margin-bottom:12px;">Specialist in managing AWS ECS, Fargate clusters, IAM configurations, and Terraform codebase deployments.</p>
            <div style="font-size:0.8rem; color:var(--color-muted);">Skills: AWS, Terraform, Docker, CI/CD pipelines</div>
          </div>

          <div class="glass-panel" style="margin-bottom:16px; padding:24px;">
            <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:8px;">
              <h4 style="font-size:1.15rem; color:#FFFFFF;">Platform Security Architect</h4>
              <span style="font-size:0.75rem; background:rgba(20,125,245,0.1); color:#32D9FF; padding:4px 8px; border-radius:4px;">Remote / Full-time</span>
            </div>
            <p style="font-size:0.9rem; margin-bottom:12px;">Designing threat detection systems, AWS WAF rules, identity schemas, and leading vulnerability remediation audits.</p>
            <div style="font-size:0.8rem; color:var(--color-muted);">Skills: AWS WAF, IAM, Cognito, Cryptography</div>
          </div>

          <div class="glass-panel" style="margin-bottom:16px; padding:24px;">
            <div style="display:flex; justify-content:space-between; align-items:start; margin-bottom:8px;">
              <h4 style="font-size:1.15rem; color:#FFFFFF;">Staff Fullstack Developer</h4>
              <span style="font-size:0.75rem; background:rgba(20,125,245,0.1); color:#32D9FF; padding:4px 8px; border-radius:4px;">Remote / Full-time</span>
            </div>
            <p style="font-size:0.9rem; margin-bottom:12px;">Developing responsive frontend layers, serverless API endpoints, and SQL database migrations.</p>
            <div style="font-size:0.8rem; color:var(--color-muted);">Skills: React, Next.js, Node.js, PostgreSQL</div>
          </div>
        </div>

        <!-- Application Form -->
        <div class="glass-panel" style="height:fit-content;">
          <h3 style="margin-bottom:16px; font-size:1.25rem;">Apply for Role</h3>
          <form id="careers-app-form">
            <div class="form-group">
              <label>Full Name</label>
              <input type="text" class="form-control" id="career-name" required>
            </div>
            <div class="form-group">
              <label>Email Address</label>
              <input type="email" class="form-control" id="career-email" required>
            </div>
            <div class="form-group">
              <label>Target Role</label>
              <select class="form-control" id="career-role">
                <option value="DevOps">Senior AWS DevOps Engineer</option>
                <option value="Security">Platform Security Architect</option>
                <option value="Fullstack">Staff Fullstack Developer</option>
              </select>
            </div>
            <div class="form-group">
              <label>Portfolio / LinkedIn URL</label>
              <input type="url" class="form-control" id="career-portfolio" placeholder="https://" required>
            </div>
            <button type="submit" class="btn btn-primary" style="width:100%; font-size:0.9rem;">Submit Application</button>
          </form>
        </div>

      </div>
    </section>
  `;
}

function getContactHtml() {
  return `
    <section style="padding: 80px 8%;" class="page-view">
      <div class="section-hdr">
        <div class="hero-badge" style="margin-bottom:12px;">Get In Touch</div>
        <h2>Enterprise Solutions Consultation</h2>
        <p>Submit an inquiry. Our solution architects will review your project parameters within 24 hours.</p>
      </div>

      <div style="max-width: 600px; margin: 0 auto;" class="glass-panel">
        <h3 style="margin-bottom:24px; text-align:center;">Request For Quote (RFQ)</h3>
        <form id="rfq-contact-form">
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:20px;">
            <div class="form-group" style="margin-bottom:0;">
              <label>Contact Name</label>
              <input type="text" class="form-control" id="rfq-name" required>
            </div>
            <div class="form-group" style="margin-bottom:0;">
              <label>Work Email</label>
              <input type="email" class="form-control" id="rfq-email" required>
            </div>
          </div>

          <div class="form-group">
            <label>Inquiry Type</label>
            <select class="form-control" id="rfq-type">
              <option value="Cloud Migration">AWS Cloud Migration</option>
              <option value="Custom SaaS">Custom SaaS Platform Engineering</option>
              <option value="Marketplace Development">Freelance Marketplace Integration</option>
              <option value="Cybersecurity Setup">Security & Compliance Consultation</option>
            </select>
          </div>

          <div class="form-group">
            <label>Target Project Timeline</label>
            <select class="form-control" id="rfq-timeline">
              <option value="1 month">Immediate Launch (&lt; 1 month)</option>
              <option value="1-3 months">Rapid MVP (1-3 months)</option>
              <option value="3-6 months">Enterprise Scope (3-6 months)</option>
            </select>
          </div>

          <div class="form-group">
            <div class="budget-slider-container">
              <label>Estimated Project Budget (USD)</label>
              <input type="range" min="10000" max="250000" step="5000" value="50000" class="form-control" style="padding:0;" id="rfq-budget-range">
              <div class="budget-val" id="rfq-budget-val">$50,000</div>
            </div>
          </div>

          <div class="form-group">
            <label>Brief Project Context / Requirements</label>
            <textarea class="form-control" rows="4" id="rfq-details" placeholder="Describe the application features, expected user numbers, database requirements..." required></textarea>
          </div>

          <button type="submit" class="btn btn-primary" style="width:100%; font-size:0.95rem;">Submit Request</button>
        </form>
      </div>
    </section>
  `;
}

function getLoginHtml() {
  return `
    <div class="auth-wrapper page-view">
      <div class="glass-panel auth-card">
        <h3 class="auth-title">Welcome Back</h3>
        <p class="auth-subtitle">Sign in to your DEFENIQ administrative portal</p>
        
        <form id="auth-login-form">
          <div class="form-group">
            <label>Corporate Email</label>
            <input type="email" class="form-control" id="login-email" placeholder="admin@defeniq.com" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" id="login-password" placeholder="••••••••" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%; font-size:0.95rem;">Authenticate</button>
        </form>

        <div class="auth-links">
          <span class="auth-link-btn" data-route="forgot-password">Forgot Password?</span>
          <span class="auth-link-btn" data-route="register">Create Portal Account</span>
        </div>
        
        <div style="margin-top:20px; font-size:0.75rem; text-align:center; color:var(--color-muted); border-top: 1px solid rgba(255,255,255,0.05); padding-top:12px;">
          <span>Demo admin credentials: <br><strong>admin@defeniq.com</strong> / <strong>adminpassword</strong></span>
        </div>
      </div>
    </div>
  `;
}

function getRegisterHtml() {
  return `
    <div class="auth-wrapper page-view">
      <div class="glass-panel auth-card">
        <h3 class="auth-title">Register Portal Account</h3>
        <p class="auth-subtitle">Create accounts to manage blog releases and contact queries</p>
        
        <form id="auth-register-form">
          <div class="form-group">
            <label>Full Name</label>
            <input type="text" class="form-control" id="reg-name" required>
          </div>
          <div class="form-group">
            <label>Corporate Email</label>
            <input type="email" class="form-control" id="reg-email" required>
          </div>
          <div class="form-group">
            <label>Password</label>
            <input type="password" class="form-control" id="reg-password" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%; font-size:0.95rem;">Request Access</button>
        </form>

        <div class="auth-links">
          <span>Already registered? <span class="auth-link-btn" data-route="login">Sign In</span></span>
        </div>
      </div>
    </div>
  `;
}

function getForgotPasswordHtml() {
  return `
    <div class="auth-wrapper page-view">
      <div class="glass-panel auth-card">
        <h3 class="auth-title">Forgot Password</h3>
        <p class="auth-subtitle">Trigger AWS Cognito password verification code reset</p>
        
        <form id="auth-forgot-form">
          <div class="form-group">
            <label>Registered Email</label>
            <input type="email" class="form-control" id="forgot-email" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%; font-size:0.95rem;">Send Code</button>
        </form>

        <div class="auth-links" style="justify-content:center;">
          <span class="auth-link-btn" data-route="login">Return to login</span>
        </div>
      </div>
    </div>
  `;
}

function getResetPasswordHtml() {
  return `
    <div class="auth-wrapper page-view">
      <div class="glass-panel auth-card">
        <h3 class="auth-title">Reset Password</h3>
        <p class="auth-subtitle">Submit verification code and establish new password</p>
        
        <form id="auth-reset-form">
          <div class="form-group">
            <label>Email Address</label>
            <input type="email" class="form-control" id="reset-email" required>
          </div>
          <div class="form-group">
            <label>Verification Code (Sent to Email)</label>
            <input type="text" class="form-control" id="reset-code" placeholder="e.g. 123456" required>
          </div>
          <div class="form-group">
            <label>New Password</label>
            <input type="password" class="form-control" id="reset-new-password" required>
          </div>
          <button type="submit" class="btn btn-primary" style="width:100%; font-size:0.95rem;">Update Password</button>
        </form>
      </div>
    </div>
  `;
}

function getAdminDashboardHtml() {
  const user = window.DEFENIQ_AUTH.getCurrentUser();
  if (!user || user.role !== 'admin') {
    return `
      <div class="auth-wrapper page-view">
        <div class="glass-panel auth-card" style="text-align:center;">
          <h3 style="color:#FF5F56; margin-bottom:12px;">Access Prohibited</h3>
          <p style="margin-bottom:20px;">You must be logged in as an administrator to access this section.</p>
          <button class="btn btn-primary" data-route="login">Sign In</button>
        </div>
      </div>
    `;
  }

  return `
    <div class="admin-layout page-view">
      <div class="admin-sidebar">
        <div>
          <h4 style="color:#32D9FF; font-size:0.8rem; text-transform:uppercase; letter-spacing:0.1em; margin-bottom:24px; padding-left:16px;">Control Panel</h4>
          <ul class="admin-nav">
            <li class="admin-nav-item active" data-tab="dashboard">Dashboard</li>
            <li class="admin-nav-item" data-tab="inbox">Client RFQs</li>
            <li class="admin-nav-item" data-tab="subscribers">Subscribers</li>
            <li class="admin-nav-item" data-tab="blogs">Blog Manager</li>
            <li class="admin-nav-item" data-tab="careers">Applications</li>
          </ul>
        </div>
        <div style="padding:16px; border-top:1px solid rgba(255,255,255,0.05);">
          <span style="font-size:0.8rem; color:var(--color-muted);">User: ${user.name}</span>
        </div>
      </div>

      <div class="admin-content" id="admin-tab-container">
        <!-- Dynamic tabs rendered here -->
      </div>
    </div>
  `;
}

// ----------------------------------------------------
// ROUTE CONTROLLERS & DATA ACTIONS
// ----------------------------------------------------

function initializeRouteController(route) {
  switch (route) {
    case 'home':
      animateCounters();
      initArchDiagram();
      break;
    case 'demo':
      initDemoSandbox();
      break;
    case 'blog':
      initBlogPage();
      break;
    case 'careers':
      initCareersPage();
      break;
    case 'contact':
      initContactPage();
      break;
    case 'login':
      initLoginPage();
      break;
    case 'register':
      initRegisterPage();
      break;
    case 'forgot-password':
      initForgotPage();
      break;
    case 'reset-password':
      initResetPage();
      break;
    case 'admin-dashboard':
      initAdminDashboard();
      break;
  }
}

// Home Counter Animation
function animateCounters() {
  const targets = {
    'stat-projects': 94,
    'stat-users': 843,
    'stat-deployments': 118,
    'stat-satisfaction': 99
  };

  Object.entries(targets).forEach(([id, max]) => {
    const el = document.getElementById(id);
    if (!el) return;
    let count = 0;
    const duration = 1500;
    const step = Math.ceil(max / (duration / 30));
    const timer = setInterval(() => {
      count += step;
      if (count >= max) {
        el.innerText = max + (id === 'stat-satisfaction' ? '%' : '+');
        clearInterval(timer);
      } else {
        el.innerText = count + (id === 'stat-satisfaction' ? '%' : '+');
      }
    }, 30);
  });
}

// AWS Infrastructure Map Interactives
function initArchDiagram() {
  const nodes = document.querySelectorAll('.cloud-node');
  const infoCard = document.getElementById('arch-info-card');
  
  const nodeInfo = {
    cloudfront: {
      title: 'AWS CloudFront CDN',
      desc: 'Global content delivery network caching client assets at edge locations. Intercepts DNS queries, reducing time-to-first-byte down to 18ms.',
      avail: '99.999%',
      latency: '18ms'
    },
    waf: {
      title: 'AWS Web Application Firewall',
      desc: 'Filtering malicious traffic rules, SQL injection signatures, and cross-site scripting blockages at the CloudFront distribution layer.',
      avail: '99.99%',
      latency: '< 2ms'
    },
    lambda: {
      title: 'AWS Lambda Compute',
      desc: 'Event-driven, serverless backend microservices. Scaled horizontally on demand from zero to 10k concurrent executions in response to API requests.',
      avail: '99.95%',
      latency: '35ms'
    },
    rds: {
      title: 'AWS RDS PostgreSQL',
      desc: 'Highly available Relational Database service configured in Multi-Availability Zones with automatic read replica scaling and hourly encrypted backups.',
      avail: '99.99%',
      latency: '< 5ms'
    },
    cognito: {
      title: 'AWS Cognito User Pools',
      desc: 'Secure identity federation and token directory. Validating user registration, multi-factor logins, and delivering encrypted OAuth 2.0 signatures.',
      avail: '99.9%',
      latency: '45ms'
    }
  };

  nodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
      const type = node.getAttribute('data-node');
      const data = nodeInfo[type];
      if (data && infoCard) {
        infoCard.innerHTML = `
          <h3 style="color:#32D9FF; margin-bottom: 16px;">${data.title}</h3>
          <p class="tech-info-desc">${data.desc}</p>
          <div class="tech-metrics">
            <div class="tech-metric-box">
              <div class="tech-metric-val">${data.avail}</div>
              <div class="tech-metric-lbl">Availability</div>
            </div>
            <div class="tech-metric-box">
              <div class="tech-metric-val">${data.latency}</div>
              <div class="tech-metric-lbl">Latency</div>
            </div>
          </div>
        `;
      }
    });
  });
}

// Sandbox Interactive Prototype
function initDemoSandbox() {
  const searchInput = document.getElementById('demo-search-input');
  const searchBtn = document.getElementById('demo-search-btn');
  const resultsContainer = document.getElementById('demo-freelancer-results');

  const freelancers = [
    { name: 'Sarah Connor', role: 'AWS DevOps Lead', certs: '5x AWS Certified', rate: '$120/hr', tags: ['aws', 'devops', 'terraform'] },
    { name: 'Alex Mercer', role: 'Cybersecurity Analyst', certs: 'CISSP, AWS Security', rate: '$140/hr', tags: ['security', 'aws', 'audit'] },
    { name: 'Mei Ling', role: 'Staff Fullstack Engineer', certs: 'AWS Solutions Architect', rate: '$105/hr', tags: ['react', 'next.js', 'postgresql'] },
    { name: 'Marcus Brody', role: 'Data Pipeline Specialist', certs: 'AWS Big Data', rate: '$115/hr', tags: ['data', 'aws', 'lambda'] }
  ];

  function renderFreelancers(list) {
    if (list.length === 0) {
      resultsContainer.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:20px; font-size:0.9rem; color:var(--color-muted);">No matching certified specialists found.</p>`;
      return;
    }
    resultsContainer.innerHTML = list.map(f => `
      <div class="freelancer-card">
        <div class="freelancer-name">${f.name}</div>
        <div class="freelancer-role">${f.role}</div>
        <div style="font-size:0.75rem; color:var(--color-muted); margin-bottom:8px;">${f.certs}</div>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
          <span class="freelancer-rate">${f.rate}</span>
          <button class="btn btn-primary" style="padding:4px 8px; font-size:0.7rem;" onclick="window.DEFENIQ_DB.incrementMetric('activeUsers'); alert('Simulating contract request to ${f.name}...')">Hire</button>
        </div>
      </div>
    `).join('');
  }

  // Initial render
  renderFreelancers(freelancers);

  // Filter Action
  const runFilter = () => {
    const term = searchInput.value.toLowerCase().trim();
    if (!term) {
      renderFreelancers(freelancers);
    } else {
      const filtered = freelancers.filter(f => 
        f.name.toLowerCase().includes(term) || 
        f.role.toLowerCase().includes(term) || 
        f.tags.some(t => t.includes(term))
      );
      renderFreelancers(filtered);
    }
  };

  searchBtn.addEventListener('click', runFilter);
  searchInput.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') runFilter();
  });

  // Legal Document Generator Controller
  const generateBtn = document.getElementById('doc-generate-btn');
  const templateSelect = document.getElementById('doc-template-select');
  const clientInput = document.getElementById('doc-client-name');
  const consultantInput = document.getElementById('doc-consultant-name');
  const previewOutput = document.getElementById('doc-preview-output');

  generateBtn.addEventListener('click', () => {
    const client = clientInput.value || 'Client Corp';
    const consultant = consultantInput.value || 'Consultant LLC';
    const template = templateSelect.value;

    let docText = '';
    const date = new Date().toLocaleDateString();

    if (template === 'nda') {
      docText = `MUTUAL NON-DISCLOSURE AGREEMENT
---------------------------------------
DATE: ${date}
PARTIES:
1. ${client} (Disclosing Party)
2. ${consultant} (Receiving Party)

1. PURPOSE
The parties wish to explore a business relationship concerning AWS Cloud Migrations and Software Architectures.

2. CONFIDENTIALITY
Receiving Party agrees to retain all proprietary source configurations, tokens, database schemas, and intellectual data in strict confidence.

SIGNATURES:
For Client: _______________________
For Consultant: __________________`;
    } else if (template === 'msa') {
      docText = `MASTER SERVICES AGREEMENT
-------------------------
DATE: ${date}
ENGAGEMENT:
${consultant} will provide cloud deployment, serverless api integrations, and development support to ${client}.

BILLING:
Services rendered invoiced at configured milestones. Net 15 terms apply.

COMPLIANCE:
All configurations engineered under AWS CIS benchmark standards.

SIGNATURES:
For Client: _______________________
For Consultant: __________________`;
    } else {
      docText = `STATEMENT OF WORK (SOW)
------------------------
DATE: ${date}
ATTACHMENT TO MSA BETWEEN:
- ${client} and ${consultant}

SCOPE OF WORK:
Provision cloud environments via Terraform. Initialize CI/CD pipelines.

ESTIMATED BUDGET: $50,000 USD
ESTIMATED COMPLETION: 90 Days

DELIVERABLES:
1. GitHub codebase structure containing TF config.
2. Cognito verification routing setup.

SIGNATURES:
For Client: _______________________
For Consultant: __________________`;
    }

    previewOutput.innerText = docText;
    showToast('Document draft compiled successfully!', 'success');
  });
}

// Blog Curation and Filters
function initBlogPage() {
  const container = document.getElementById('blog-posts-container');
  const searchInput = document.getElementById('blog-search-input');
  const categoryFilters = document.getElementById('blog-category-filters');
  
  let currentCategory = 'all';

  function renderBlogs() {
    const allBlogs = window.DEFENIQ_DB.getBlogs();
    const searchTerm = searchInput.value.toLowerCase().trim();

    const filtered = allBlogs.filter(b => {
      const matchCategory = currentCategory === 'all' || b.category === currentCategory;
      const matchSearch = b.title.toLowerCase().includes(searchTerm) || 
                          b.excerpt.toLowerCase().includes(searchTerm) ||
                          b.tags.some(t => t.toLowerCase().includes(searchTerm));
      return matchCategory && matchSearch;
    });

    if (filtered.length === 0) {
      container.innerHTML = `<p style="text-align:center; padding:40px; color:var(--color-muted); grid-column: 1/-1;">No publications match your filter criteria.</p>`;
      return;
    }

    container.innerHTML = filtered.map(b => `
      <article class="blog-card">
        <div class="blog-card-img">
          <span class="blog-tag">${b.category}</span>
          <img src="logo.svg" style="width:50px; opacity:0.1;" alt="Visual">
        </div>
        <div class="blog-card-body">
          <div>
            <div class="blog-card-meta">${b.date} • ${b.readTime}</div>
            <h3>${b.title}</h3>
            <p>${b.excerpt}</p>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px;">
            <span class="blog-author">${b.author}</span>
            <span style="color:var(--color-accent); font-size:0.85rem; cursor:pointer;" onclick="alert('Full article text:\\n\\n' + document.getElementById('blog-content-${b.id}').innerText)">Read Article →</span>
          </div>
          <div id="blog-content-${b.id}" style="display:none;">${b.content}</div>
        </div>
      </article>
    `).join('');
  }

  // Search trigger
  searchInput.addEventListener('input', renderBlogs);

  // Category Selector triggers
  categoryFilters.addEventListener('click', (e) => {
    const filterTag = e.target.closest('.widget-tag');
    if (filterTag) {
      categoryFilters.querySelectorAll('.widget-tag').forEach(t => t.classList.remove('active'));
      filterTag.classList.add('active');
      currentCategory = filterTag.getAttribute('data-category');
      renderBlogs();
    }
  });

  // Newsletter subscription submit
  const newsletterBtn = document.getElementById('blog-newsletter-btn');
  const newsletterEmail = document.getElementById('blog-newsletter-email');
  
  newsletterBtn.addEventListener('click', () => {
    const email = newsletterEmail.value.trim();
    if (!email || !email.includes('@')) {
      showToast('Please submit a valid email address.', 'info');
      return;
    }
    const success = window.DEFENIQ_DB.addSubscriber(email);
    if (success) {
      showToast('Thank you! You are subscribed to our insights feed.', 'success');
      newsletterEmail.value = '';
    } else {
      showToast('This email is already in our subscription list.', 'info');
    }
  });

  // Initial Draw
  renderBlogs();
}

// Careers Application Form Submit
function initCareersPage() {
  const form = document.getElementById('careers-app-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const appData = {
      name: document.getElementById('career-name').value,
      email: document.getElementById('career-email').value,
      role: document.getElementById('career-role').value,
      portfolio: document.getElementById('career-portfolio').value
    };

    window.DEFENIQ_DB.saveApplication(appData);
    showToast('Application submitted successfully! Our talent team will review it.', 'success');
    form.reset();
  });
}

// Contact RFQ form submit
function initContactPage() {
  const form = document.getElementById('rfq-contact-form');
  const slider = document.getElementById('rfq-budget-range');
  const sliderVal = document.getElementById('rfq-budget-val');

  if (slider && sliderVal) {
    slider.addEventListener('input', () => {
      const val = parseInt(slider.value).toLocaleString();
      sliderVal.innerText = `$${val}`;
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const rfqData = {
        name: document.getElementById('rfq-name').value,
        email: document.getElementById('rfq-email').value,
        type: document.getElementById('rfq-type').value,
        timeline: document.getElementById('rfq-timeline').value,
        budget: `$${parseInt(slider.value).toLocaleString()}`,
        details: document.getElementById('rfq-details').value
      };

      window.DEFENIQ_DB.saveContact(rfqData);
      showToast('Request for Quote (RFQ) submitted! Confirmation code sent.', 'success');
      form.reset();
      if (sliderVal) sliderVal.innerText = '$50,000';
    });
  }
}

// Auth Login Controller
function initLoginPage() {
  const form = document.getElementById('auth-login-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pass = document.getElementById('login-password').value;

    const res = window.DEFENIQ_AUTH.login(email, pass);
    if (res.success) {
      showToast('Authenticated. Opening administrative portal...', 'success');
      setTimeout(() => {
        navigate('admin-dashboard');
      }, 800);
    } else {
      showToast(res.message, 'info');
    }
  });
}

// Auth Signup Controller
function initRegisterPage() {
  const form = document.getElementById('auth-register-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const pass = document.getElementById('reg-password').value;

    const res = window.DEFENIQ_AUTH.register(name, email, pass);
    if (res.success) {
      showToast(res.message, 'success');
      navigate('login');
    } else {
      showToast(res.message, 'info');
    }
  });
}

// Forgot Password Request
function initForgotPage() {
  const form = document.getElementById('auth-forgot-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('forgot-email').value;
    const res = window.DEFENIQ_AUTH.forgotPassword(email);
    if (res.success) {
      showToast(res.message, 'success');
      navigate('reset-password');
    } else {
      showToast(res.message, 'info');
    }
  });
}

// Reset Password Submit
function initResetPage() {
  const form = document.getElementById('auth-reset-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('reset-email').value;
    const code = document.getElementById('reset-code').value;
    const newPass = document.getElementById('reset-new-password').value;

    const res = window.DEFENIQ_AUTH.resetPassword(email, code, newPass);
    if (res.success) {
      showToast(res.message, 'success');
      navigate('login');
    } else {
      showToast(res.message, 'info');
    }
  });
}

// Administrative Panel Controllers
function initAdminDashboard() {
  const sidebar = document.querySelector('.admin-sidebar');
  if (!sidebar) return;

  // Render first tab
  renderAdminTab('dashboard');

  sidebar.addEventListener('click', (e) => {
    const navItem = e.target.closest('.admin-nav-item');
    if (navItem) {
      sidebar.querySelectorAll('.admin-nav-item').forEach(i => i.classList.remove('active'));
      navItem.classList.add('active');
      const tab = navItem.getAttribute('data-tab');
      renderAdminTab(tab);
    }
  });
}

function renderAdminTab(tab) {
  const container = document.getElementById('admin-tab-container');
  if (!container) return;

  const db = window.DEFENIQ_DB;

  switch (tab) {
    case 'dashboard':
      const stats = db.getMetrics();
      const rfqs = db.getContacts();
      const subs = db.getSubscribers();
      const apps = db.getApplications();
      container.innerHTML = `
        <div class="admin-header">
          <h2>Platform Overview</h2>
          <span style="font-size:0.85rem; color:var(--color-accent);">Ecosystem Health: Operational</span>
        </div>
        
        <div class="admin-stats-grid">
          <div class="admin-stat-card">
            <div class="admin-stat-title">Aggregated Views</div>
            <div class="admin-stat-num">${stats.pageViews.toLocaleString()}</div>
          </div>
          <div class="admin-stat-card">
            <div class="admin-stat-title">Client RFQs</div>
            <div class="admin-stat-num">${rfqs.length}</div>
          </div>
          <div class="admin-stat-card">
            <div class="admin-stat-title">Newsletter Subs</div>
            <div class="admin-stat-num">${subs.length}</div>
          </div>
          <div class="admin-stat-card">
            <div class="admin-stat-title">Job Applications</div>
            <div class="admin-stat-num">${apps.length}</div>
          </div>
        </div>

        <div class="glass-panel">
          <h3 style="margin-bottom:16px; font-size:1.15rem; color:#32D9FF;">Quick Actions</h3>
          <div style="display:flex; gap:16px;">
            <button class="btn btn-secondary" style="font-size:0.8rem;" onclick="window.DEFENIQ_DB.incrementMetric('pageViews'); alert('Simulated analytical sync completed.')">Synchronize Metrics</button>
            <button class="btn btn-accent" style="font-size:0.8rem;" data-route="blog">View Live Site</button>
          </div>
        </div>
      `;
      break;

    case 'inbox':
      const contactsList = db.getContacts();
      container.innerHTML = `
        <div class="admin-header">
          <h2>Request For Quote (RFQ) Inbox</h2>
          <span>${contactsList.length} total requests</span>
        </div>
        <div class="data-table-container">
          <div class="table-header">Inquiries Queue</div>
          ${contactsList.length === 0 ? `
            <p style="padding:40px; text-align:center; color:var(--color-muted);">No inquiries submitted yet.</p>
          ` : `
            <table class="data-table">
              <thead>
                <tr>
                  <th>Client</th>
                  <th>Inquiry Type</th>
                  <th>Timeline</th>
                  <th>Budget</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                ${contactsList.map(c => `
                  <tr>
                    <td><strong>${c.name}</strong><br><small style="color:var(--color-muted);">${c.email}</small></td>
                    <td>${c.type}</td>
                    <td>${c.timeline}</td>
                    <td><span style="color:#2ECC71; font-weight:700;">${c.budget}</span></td>
                    <td>
                      <button class="btn btn-secondary" style="padding:4px 8px; font-size:0.75rem;" onclick="alert('Project details for ${c.name}:\\n\\n${c.details}')">Details</button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>
      `;
      break;

    case 'subscribers':
      const subscribersList = db.getSubscribers();
      container.innerHTML = `
        <div class="admin-header">
          <h2>Newsletter Subscriptions</h2>
          <span>${subscribersList.length} subscribers</span>
        </div>
        <div class="data-table-container" style="max-width:600px;">
          <div class="table-header">Mailing Roster</div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Subscriber Email</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${subscribersList.map(s => `
                <tr>
                  <td>${s}</td>
                  <td><span style="color:#2ECC71;">Active</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;
      break;

    case 'blogs':
      const blogsList = db.getBlogs();
      container.innerHTML = `
        <div class="admin-header">
          <h2>Blog Article Manager</h2>
          <span>${blogsList.length} articles published</span>
        </div>
        
        <!-- Add Blog Form -->
        <div class="glass-panel" style="margin-bottom:32px;">
          <h3 style="font-size:1.1rem; color:#32D9FF; margin-bottom:16px;">Publish New Article</h3>
          <form id="admin-publish-blog-form">
            <div class="form-group">
              <label>Article Title</label>
              <input type="text" class="form-control" id="new-blog-title" required>
            </div>
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px;">
              <div class="form-group">
                <label>Category</label>
                <select class="form-control" id="new-blog-category">
                  <option value="AWS">AWS Cloud</option>
                  <option value="Cloud">Serverless Architecture</option>
                  <option value="Freelancing">Niche Marketplace</option>
                </select>
              </div>
              <div class="form-group">
                <label>Author Details</label>
                <input type="text" class="form-control" id="new-blog-author" placeholder="Name, Title" required>
              </div>
            </div>
            <div class="form-group">
              <label>Brief Excerpt / Summary</label>
              <input type="text" class="form-control" id="new-blog-excerpt" required>
            </div>
            <div class="form-group">
              <label>Article Body (HTML/Text)</label>
              <textarea class="form-control" rows="5" id="new-blog-content" required></textarea>
            </div>
            <button type="submit" class="btn btn-primary" style="font-size:0.85rem;">Publish Article</button>
          </form>
        </div>

        <div class="data-table-container">
          <div class="table-header">Published Articles</div>
          <table class="data-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              ${blogsList.map(b => `
                <tr>
                  <td><strong>${b.title}</strong><br><small style="color:var(--color-muted);">${b.author}</small></td>
                  <td>${b.category}</td>
                  <td>${b.date}</td>
                  <td>
                    <button class="btn btn-accent" style="padding:4px 8px; font-size:0.75rem; border-color:#FF5F56; color:#FF5F56;" onclick="window.DEFENIQ_DB.deleteBlog('${b.id}'); renderAdminTab('blogs');">Delete</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `;

      // Wire Publish Blog Form
      const blogForm = document.getElementById('admin-publish-blog-form');
      if (blogForm) {
        blogForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const newBlog = {
            title: document.getElementById('new-blog-title').value,
            category: document.getElementById('new-blog-category').value,
            author: document.getElementById('new-blog-author').value,
            excerpt: document.getElementById('new-blog-excerpt').value,
            content: document.getElementById('new-blog-content').value,
            tags: [document.getElementById('new-blog-category').value, 'Engineering']
          };
          db.saveBlog(newBlog);
          showToast('New article published to blog page!', 'success');
          renderAdminTab('blogs');
        });
      }
      break;

    case 'careers':
      const appsList = db.getApplications();
      container.innerHTML = `
        <div class="admin-header">
          <h2>Careers Applications Portal</h2>
          <span>${appsList.length} applicant submissions</span>
        </div>
        <div class="data-table-container">
          <div class="table-header">Applicant Queue</div>
          ${appsList.length === 0 ? `
            <p style="padding:40px; text-align:center; color:var(--color-muted);">No applications submitted yet.</p>
          ` : `
            <table class="data-table">
              <thead>
                <tr>
                  <th>Candidate Name</th>
                  <th>Target Position</th>
                  <th>Application Date</th>
                  <th>Contact Email</th>
                  <th>Links</th>
                </tr>
              </thead>
              <tbody>
                ${appsList.map(a => `
                  <tr>
                    <td><strong>${a.name}</strong></td>
                    <td>${a.role === 'DevOps' ? 'Senior AWS DevOps Engineer' : a.role === 'Security' ? 'Platform Security Architect' : 'Staff Fullstack Developer'}</td>
                    <td>${a.date}</td>
                    <td>${a.email}</td>
                    <td>
                      <a href="${a.portfolio}" target="_blank" class="btn btn-secondary" style="padding:4px 8px; font-size:0.75rem;">Portfolio</a>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          `}
        </div>
      `;
      break;
  }
}
