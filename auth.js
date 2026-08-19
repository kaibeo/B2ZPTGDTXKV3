const Auth = (() => {
  const USERS_KEY = 'ng_users';
  const SESSION_KEY = 'ng_session';
  const LOGS_KEY = 'ng_activity_logs';

  function seedUsers() {
    if (!localStorage.getItem(USERS_KEY)) {
      const users = [{
        id: 1, username: 'admin', password: 'admin123',
        role: 'Super Admin', status: 'active', createdAt: Date.now()
      }];
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    }
  }
  seedUsers();

  function getUsers() { return JSON.parse(localStorage.getItem(USERS_KEY) || '[]'); }
  function saveUsers(list) { localStorage.setItem(USERS_KEY, JSON.stringify(list)); }

  function logActivity(admin, action, status) {
    const logs = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]');
    logs.unshift({
      admin, action, status,
      ip: '192.168.1.' + (10 + Math.floor(Math.random() * 200)),
      time: new Date().toLocaleString('vi-VN')
    });
    if (logs.length > 200) logs.length = 200;
    localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
  }
  function getLogs() { return JSON.parse(localStorage.getItem(LOGS_KEY) || '[]'); }

  function login(username, password) {
    const users = getUsers();
    const user = users.find(u => u.username === username);
    if (!user) return { ok: false, msg: 'Sai tài khoản hoặc mật khẩu!' };
    if (user.status === 'locked') return { ok: false, msg: 'Tài khoản đã bị khóa!' };
    if (user.password !== password) return { ok: false, msg: 'Sai tài khoản hoặc mật khẩu!' };
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id: user.id, username: user.username, role: user.role }));
    logActivity(username, 'Đăng nhập', 'success');
    return { ok: true };
  }

  function logout() {
    const s = getSession();
    if (s) logActivity(s.username, 'Đăng xuất', 'success');
    sessionStorage.removeItem(SESSION_KEY);
    window.location.href = 'login.html';
  }

  function getSession() {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
  }
  function isLoggedIn() { return !!getSession(); }

  function requireLogin() {
    if (!isLoggedIn()) window.location.href = 'login.html';
  }

  return { login, logout, getSession, isLoggedIn, requireLogin, getUsers, saveUsers, logActivity, getLogs };
})();
