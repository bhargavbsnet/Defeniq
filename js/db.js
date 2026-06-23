// DEFENIQ Client-Side Simulated Database Manager

const DB_KEYS = {
  CONTACTS: 'defeniq_contacts',
  SUBSCRIBERS: 'defeniq_subscribers',
  BLOGS: 'defeniq_blogs',
  APPLICATIONS: 'defeniq_applications',
  METRICS: 'defeniq_metrics'
};

// Default Blog Posts
const DEFAULT_BLOGS = [
  {
    id: '1',
    title: 'Migrating Enterprise Workloads to AWS Fargate: A Pragmatic Guide',
    excerpt: 'Learn how to transition complex containerized applications to AWS ECS Fargate with zero-downtime deployment pipelines and optimized resource allocation.',
    category: 'AWS',
    author: 'Elena Rostova, Principal Cloud Architect',
    date: 'June 12, 2026',
    readTime: '6 min read',
    tags: ['AWS', 'Fargate', 'Docker', 'DevOps'],
    content: `<h3>Introduction to Serverless Containers</h3>
    <p>Containerization has revolutionized how we package and deploy applications. However, managing the underlying infrastructure—scaling EC2 instances, provisioning clusters, patching operating systems—still introduces operational overhead. This is where AWS ECS Fargate steps in, offering a serverless compute engine for containers that eliminates the need to manage servers.</p>
    
    <h3>Why Fargate for Enterprise?</h3>
    <p>For large organizations, Fargate offers major advantages: security isolation by design (each task runs in its own dedicated kernel), seamless integration with AWS IAM and CloudWatch, and automatic horizontal scaling based on real-time traffic demand.</p>
    
    <h3>Step-by-Step Migration Strategy</h3>
    <p>1. <strong>Containerize the Application:</strong> Ensure your application adheres to 12-factor app principles, particularly using environment variables for configuration.<br>
    2. <strong>Define Task Definitions:</strong> Set precise CPU and Memory constraints to optimize cost. Start small and let autoscaling scale out rather than vertically over-provisioning.<br>
    3. <strong>Configure VPC and Security Groups:</strong> Ensure tasks run in private subnets with traffic routed through an Application Load Balancer (ALB) and protected by AWS WAF.</p>`
  },
  {
    id: '2',
    title: 'Designing High-Throughput APIs with AWS API Gateway and Lambda',
    excerpt: 'Deep dive into serverless backend design patterns, rate limiting, token bucket algorithms, and caching strategies for global scale.',
    category: 'Cloud',
    author: 'Marcus Vance, Head of Engineering',
    date: 'June 08, 2026',
    readTime: '8 min read',
    tags: ['Serverless', 'Lambda', 'API Gateway', 'Architecture'],
    content: `<h3>The Power of Serverless APIs</h3>
    <p>Traditional server-based architectures struggle with sudden spikes in traffic, often leading to over-provisioning and wasted budget. Building APIs with AWS Gateway and Lambda allows your backend to scale instantly from zero to thousands of concurrent requests automatically.</p>
    
    <h3>Optimizing Cold Starts</h3>
    <p>One common concern with AWS Lambda is "cold starts." We mitigate this using several techniques: writing lightweight Lambda handlers, using Node.js or Go for faster runtime initiation, and implementing Provisioned Concurrency for latency-critical endpoints.</p>`
  },
  {
    id: '3',
    title: 'Navigating the Freelancer Shift: Niche Skills in the Age of AI',
    excerpt: 'How highly specialized independent professionals—like DevOps engineers and cloud security experts—are outcompeting generalists.',
    category: 'Freelancing',
    author: 'David Chen, Founder of SkillForge',
    date: 'May 28, 2026',
    readTime: '5 min read',
    tags: ['Freelancing', 'SkillForge', 'AI', 'DevOps'],
    content: `<h3>The Death of the Generalist</h3>
    <p>As AI tools become capable of generating standard code and templates, the demand for generic web developers is shifting. Today, the most successful freelancers are highly specialized niche experts: AWS cloud engineers, DevOps automation wizards, and cybersecurity specialists.</p>
    
    <h3>Building Your Niche Brand</h3>
    <p>To succeed on platforms like SkillForge, experts must demonstrate deep domain authority. This means holding advanced certifications, contributing to open-source projects, and showcasing robust portfolio architectures rather than simple client websites.</p>`
  }
];

// Initialize Database if empty
function initDb() {
  if (!localStorage.getItem(DB_KEYS.BLOGS)) {
    localStorage.setItem(DB_KEYS.BLOGS, JSON.stringify(DEFAULT_BLOGS));
  }
  if (!localStorage.getItem(DB_KEYS.CONTACTS)) {
    localStorage.setItem(DB_KEYS.CONTACTS, JSON.stringify([]));
  }
  if (!localStorage.getItem(DB_KEYS.SUBSCRIBERS)) {
    localStorage.setItem(DB_KEYS.SUBSCRIBERS, JSON.stringify(['partner@aws.com', 'news@techcrunch.com']));
  }
  if (!localStorage.getItem(DB_KEYS.APPLICATIONS)) {
    localStorage.setItem(DB_KEYS.APPLICATIONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(DB_KEYS.METRICS)) {
    localStorage.setItem(DB_KEYS.METRICS, JSON.stringify({
      pageViews: 12450,
      activeUsers: 843,
      deployments: 94,
      satisfaction: 99.4
    }));
  }
}

// Database Actions
const db = {
  // Contacts
  getContacts: () => JSON.parse(localStorage.getItem(DB_KEYS.CONTACTS)) || [],
  saveContact: (contact) => {
    const list = db.getContacts();
    const newContact = { id: Date.now().toString(), date: new Date().toLocaleDateString(), ...contact };
    list.unshift(newContact);
    localStorage.setItem(DB_KEYS.CONTACTS, JSON.stringify(list));
    // Increment metrics view as demonstration of activity
    db.incrementMetric('pageViews');
    return newContact;
  },
  deleteContact: (id) => {
    const list = db.getContacts().filter(c => c.id !== id);
    localStorage.setItem(DB_KEYS.CONTACTS, JSON.stringify(list));
  },

  // Subscribers
  getSubscribers: () => JSON.parse(localStorage.getItem(DB_KEYS.SUBSCRIBERS)) || [],
  addSubscriber: (email) => {
    const list = db.getSubscribers();
    if (!list.includes(email)) {
      list.unshift(email);
      localStorage.setItem(DB_KEYS.SUBSCRIBERS, JSON.stringify(list));
      return true;
    }
    return false;
  },

  // Blogs
  getBlogs: () => JSON.parse(localStorage.getItem(DB_KEYS.BLOGS)) || [],
  saveBlog: (blog) => {
    const list = db.getBlogs();
    const newBlog = { 
      id: Date.now().toString(), 
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), 
      readTime: '4 min read',
      ...blog 
    };
    list.unshift(newBlog);
    localStorage.setItem(DB_KEYS.BLOGS, JSON.stringify(list));
    return newBlog;
  },
  deleteBlog: (id) => {
    const list = db.getBlogs().filter(b => b.id !== id);
    localStorage.setItem(DB_KEYS.BLOGS, JSON.stringify(list));
  },

  // Applications
  getApplications: () => JSON.parse(localStorage.getItem(DB_KEYS.APPLICATIONS)) || [],
  saveApplication: (app) => {
    const list = db.getApplications();
    const newApp = { id: Date.now().toString(), date: new Date().toLocaleDateString(), ...app };
    list.unshift(newApp);
    localStorage.setItem(DB_KEYS.APPLICATIONS, JSON.stringify(list));
    return newApp;
  },

  // Metrics
  getMetrics: () => JSON.parse(localStorage.getItem(DB_KEYS.METRICS)) || {},
  incrementMetric: (key) => {
    const metrics = db.getMetrics();
    if (metrics[key] !== undefined) {
      metrics[key] += 1;
      localStorage.setItem(DB_KEYS.METRICS, JSON.stringify(metrics));
    }
  }
};

// Auto-run init
initDb();
window.DEFENIQ_DB = db;
