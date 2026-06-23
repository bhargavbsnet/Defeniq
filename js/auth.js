// DEFENIQ Client-Side Simulated AWS Cognito Auth Manager

const AUTH_KEYS = {
  USERS: 'defeniq_users',
  SESSION: 'defeniq_session'
};

// Initial admin accounts
const DEFAULT_USERS = [
  {
    email: 'admin@defeniq.com',
    password: 'adminpassword',
    name: 'Chief Tech Officer',
    role: 'admin'
  },
  {
    email: 'demo@defeniq.com',
    password: 'demouser',
    name: 'John Doe',
    role: 'user'
  }
];

function initAuth() {
  if (!localStorage.getItem(AUTH_KEYS.USERS)) {
    localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(DEFAULT_USERS));
  }
}

const auth = {
  register: (name, email, password) => {
    const users = JSON.parse(localStorage.getItem(AUTH_KEYS.USERS)) || [];
    if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
      return { success: false, message: 'User already exists with this email address.' };
    }
    const newUser = { name, email: email.toLowerCase(), password, role: 'user' };
    users.push(newUser);
    localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(users));
    return { success: true, message: 'Verification code sent to your email. (Simulated registration complete!)' };
  },

  login: (email, password) => {
    const users = JSON.parse(localStorage.getItem(AUTH_KEYS.USERS)) || [];
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
    if (!user) {
      return { success: false, message: 'Invalid email or password.' };
    }
    // Set Session
    const sessionToken = {
      email: user.email,
      name: user.name,
      role: user.role,
      loggedInAt: Date.now()
    };
    localStorage.setItem(AUTH_KEYS.SESSION, JSON.stringify(sessionToken));
    return { success: true, user: sessionToken };
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEYS.SESSION);
    return { success: true };
  },

  getCurrentUser: () => {
    return JSON.parse(localStorage.getItem(AUTH_KEYS.SESSION)) || null;
  },

  forgotPassword: (email) => {
    const users = JSON.parse(localStorage.getItem(AUTH_KEYS.USERS)) || [];
    const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());
    if (!userExists) {
      return { success: false, message: 'No account found with this email.' };
    }
    return { success: true, message: 'Password reset instructions and verification code sent to email.' };
  },

  resetPassword: (email, code, newPassword) => {
    const users = JSON.parse(localStorage.getItem(AUTH_KEYS.USERS)) || [];
    const index = users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());
    if (index === -1) {
      return { success: false, message: 'No account found with this email.' };
    }
    if (!code || code.trim().length < 4) {
      return { success: false, message: 'Invalid verification code.' };
    }
    users[index].password = newPassword;
    localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(users));
    return { success: true, message: 'Password successfully updated. You can now log in.' };
  }
};

// Auto-run init
initAuth();
window.DEFENIQ_AUTH = auth;
