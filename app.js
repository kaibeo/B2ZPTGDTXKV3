Auth.requireLogin();
const session = Auth.getSession();
document.getElementById('sbUsername').textContent = session.username;
document.getElementById('sbRole').textContent = session.role;

/* ===== Toast ===== */
function toast(msg, type = '') {
  const wrap = document.getElementById('toastWrap');
  const t = document.createElement('div');
  t.className = 'toast ' + type;
  t.textContent = msg;
  wrap.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

/* ===== Navigation ===== */
const pages = document.querySelectorAll('.page');
const navLinks = document.querySelectorAll('.sidebar nav a');
const pageTitle = document.getElementById('pageTitle');
function showPage(name) {
  pages.forEach(p => p.classList.toggle('active', p.id === 'page-' + name));
  navLinks.forEach(a => a.classList.toggle('active', a.dataset.page === name));
  pageTitle.textContent = navLinks[[...navLinks].findIndex(a => a.dataset.page === name)]?.textContent.trim() || name;
  document.getElementById('sidebar').classList.remove('open');
}
navLinks.forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  showPage(a.dataset.page);
}));
window.addEventListener('hashchange', () => {
  const p = location.hash.replace('#', '') || 'dashboard';
  showPage(p);
});
showPage(location.hash.replace('#', '') || 'dashboard');

document.getElementById('menuToggle').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});
document.getElementById('logoutBtn').addEventListener('click', () => Auth.logout());

/* Clock */
setInterval(() => {
  document.getElementById('clock').textContent = new Date().toLocaleString('vi-VN');
}, 1000);

/* =====================================================
   DEMO NETWORK ENGINE  (thay bằng API/backend sau này)
===================================================== */
const DemoEngine = (() => {
  const state = {
    internet: true,
    ping: 22, download: 85, upload: 18, cpu: 34, ram: 52,
    trafficHistory: Array(20).fill(0).map(() => ({ d: 0, u: 0 })),
  };

  const devices = [
    { name: 'Router-Gateway', ip: '192.168.1.1', mac: '00:1A:2B:3C:4D:01', type: 'Router', status: 'online', ping: 1, lastSeen: 'now' },
    { name: 'Server-Main', ip: '192.168.1.2', mac: '00:1A:2B:3C:4D:02', type: 'Server', status: 'online', ping: 3, lastSeen: 'now' },
    { name: 'PC-Office-01', ip: '192.168.1.10', mac: '00:1A:2B:3C:4D:10', type: 'PC', status: 'online', ping: 12, lastSeen: 'now' },
    { name: 'PC-Office-02', ip: '192.168.1.11', mac: '00:1A:2B:3C:4D:11', type: 'PC', status: 'online', ping: 15, lastSeen: 'now' },
    { name: 'Laptop-Sale', ip: '192.168.1.20', mac: '00:1A:2B:3C:4D:20', type: 'Laptop', status: 'offline', ping: 0, lastSeen: '10 phút trước' },
    { name: 'Printer-HP', ip: '192.168.1.30', mac: '00:1A:2B:3C:4D:30', type: 'Printer', status: 'online', ping: 8, lastSeen: 'now' },
    { name: 'Camera-Gate', ip: '192.168.1.40', mac: '00:1A:2B:3C:4D:40', type: 'Camera', status: 'online', ping: 20, lastSeen: 'now' },
    { name: 'Phone-Guest', ip: '192.168.1.55', mac: '00:1A:2B:3C:4D:55', type: 'Mobile', status: 'offline', ping: 0, lastSeen: '1 giờ trước' },
  ];

  const services = [
    { name: 'Internet', status: 'operational', uptime: '99.9%' },
    { name: 'Gateway', status: 'operational', uptime: '99.8%' },
    { name: 'DNS', status: 'operational', uptime: '99.9%' },
    { name: 'DHCP', status: 'operational', uptime: '99.7%' },
    { name: 'Router', status: 'operational', uptime: '99.9%' },
    { name: 'API', status: 'operational', uptime: '99.5%' },
    { name: 'Database', status: 'operational', uptime: '99.6%' },
    { name: 'Web Server', status: 'operational', uptime: '99.9%' },
  ];

  const alerts = [
    { id: 1, type: 'High Ping', title: 'High Ping detected', desc: 'PC-Office-02 ping vượt 150ms', time: '2 phút trước', read: false },
    { id: 2, type: 'Device Offline', title: 'Laptop-Sale mất kết nối', desc: 'Không phản hồi trong 10 phút', time: '10 phút trước', read: false },
    { id: 3, type: 'High Bandwidth', title: 'Băng thông cao bất thường', desc: 'Upload vượt ngưỡng 80%', time: '20 phút trước', read: true },
  ];

  const logMessages = [
    ['INFO', 'Network connected'], ['SUCCESS', 'Gateway ONLINE'], ['WARNING', 'High traffic detected'],
    ['INFO', 'DHCP lease renewed'], ['SUCCESS', 'DNS resolved successfully'], ['ERROR', 'Packet loss on PC-Office-02'],
    ['INFO', 'New device connected: Camera-Gate'], ['WARNING', 'CPU usage above 70%'], ['SUCCESS', 'Backup completed'],
    ['INFO', 'Firewall rules updated'], ['ERROR', 'Device Laptop-Sale timeout'], ['WARNING', 'RAM usage high'],
  ];

  function tick() {
    state.ping = Math.max(8, Math.round(state.ping + (Math.random() * 14 - 7)));
    state.download = Math.max(5, Math.round(state.download + (Math.random() * 20 - 10)));
    state.upload = Math.max(2, Math.round(state.upload + (Math.random() * 8 - 4)));
    state.cpu = Math.min(95, Math.max(10, Math.round(state.cpu + (Math.random() * 10 - 5))));
    state.ram = Math.min(95, Math.max(20, Math.round(state.ram + (Math.random() * 8 - 4))));
    state.trafficHistory.push({ d: state.download, u: state.upload });
    if (state.trafficHistory.length > 20) state.trafficHistory.shift();

    devices.forEach(d => {
      if (d.status === 'online') {
        d.ping = Math.max(1, Math.round(d.ping + (Math.random() * 6 - 3)));
        d.lastSeen = 'now';
      }
    });
  }

  function randomLog() {
    const [level, msg] = logMessages[Math.floor(Math.random() * logMessages.length)];
    const time = new Date().toLocaleTimeString('vi-VN', { hour12: false });
    return { time, level, msg };
  }

  return { state, devices, services, alerts, tick, randomLog };
})();

/* ===== Dashboard render ===== */
function renderDashboard() {
  const s = DemoEngine.state;
  document.getElementById('c-internet').innerHTML = s.internet
    ? '<span class="status-dot dot-online"></span>Online'
    : '<span class="status-dot dot-offline"></span>Offline';
  const online = DemoEngine.devices.filter(d => d.status === 'online').length;
  const offline = DemoEngine.devices.length - online;
  document.getElementById('c-online').textContent = online;
  document.getElementById('c-offline').textContent = offline;
  document.getElementById('c-ping').textContent = s.ping + ' ms';
  document.getElementById('c-down').textContent = s.download + ' Mbps';
  document.getElementById('c-up').textContent = s.upload + ' Mbps';
  document.getElementById('c-cpu').textContent = s.cpu + '%';
  document.getElementById('c-ram').textContent = s.ram + '%';
  drawChart();
}

/* Simple canvas line chart, no libs */
function drawChart() {
  const canvas = document.getElementById('trafficChart');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.clientWidth, h = 220;
  canvas.width = w; canvas.height = h;
  ctx.clearRect(0, 0, w, h);
  const data = DemoEngine.state.trafficHistory;
  const max = Math.max(...data.map(p => Math.max(p.d, p.u)), 10) * 1.2;
  const stepX = w / (data.length - 1);

  function drawLine(key, color) {
    ctx.beginPath();
    ctx.strokeStyle = color; ctx.lineWidth = 2;
    data.forEach((p, i) => {
      const x = i * stepX, y = h - (p[key] / max) * (h - 20) - 10;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
  }
  drawLine('d', '#c00');
  drawLine('u', '#f39c12');
}

/* ===== Console ===== */
let consoleLogs = [];
let consolePaused = false;
let autoScroll = true;
let activeFilter = 'ALL';

function addConsoleLog(entry) {
  consoleLogs.push(entry);
  if (consoleLogs.length > 500) consoleLogs.shift();
  renderConsole();
}
function renderConsole() {
  const box = document.getElementById('consoleBox');
  if (!box) return;
  const search = document.getElementById('consoleSearch').value.toLowerCase();
  const filtered = consoleLogs.filter(l =>
    (activeFilter === 'ALL' || l.level === activeFilter) &&
    (l.msg.toLowerCase().includes(search) || !search)
  );
  box.innerHTML = filtered.map(l =>
    `<div class="line">[${l.time}] <span class="tag-${l.level}">${l.level}</span> ${l.msg}</div>`
  ).join('');
  if (autoScroll) box.scrollTop = box.scrollHeight;
}
document.getElementById('btnPause').addEventListener('click', function () {
  consolePaused = !consolePaused;
  this.innerHTML = consolePaused ? '<svg class="icon icon-sm"><use href="#ic-console"/></svg> Resume' : '<svg class="icon icon-sm"><use href="#ic-pause"/></svg> Pause';
});
document.getElementById('btnAutoScroll').addEventListener('click', function () {
  autoScroll = !autoScroll;
  this.innerHTML = '<svg class="icon icon-sm"><use href="#ic-scroll"/></svg> Auto Scroll: ' + (autoScroll ? 'ON' : 'OFF');
});
document.getElementById('btnClear').addEventListener('click', () => { consoleLogs = []; renderConsole(); });
document.getElementById('btnExport').addEventListener('click', () => {
  const text = consoleLogs.map(l => `[${l.time}] ${l.level} ${l.msg}`).join('\n');
  const blob = new Blob([text], { type: 'text/plain' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'network_logs.txt';
  a.click();
  toast('Đã export logs', 'success');
});
document.getElementById('consoleSearch').addEventListener('input', renderConsole);
document.querySelectorAll('.chip').forEach(chip => {
  chip.addEventListener('click', () => {
    document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    activeFilter = chip.dataset.filter;
    renderConsole();
  });
});

/* ===== Devices table ===== */
let devSortKey = 'name', devSortAsc = true;
function renderDevices() {
  const tbody = document.getElementById('devTbody');
  if (!tbody) return;
  const search = document.getElementById('devSearch').value.toLowerCase();
  const filter = document.getElementById('devFilter').value;
  let list = DemoEngine.devices.filter(d =>
    (filter === 'ALL' || d.status === filter) &&
    (d.name.toLowerCase().includes(search) || d.ip.includes(search))
  );
  list.sort((a, b) => {
    let r = String(a[devSortKey]).localeCompare(String(b[devSortKey]), undefined, { numeric: true });
    return devSortAsc ? r : -r;
  });
  if (!list.length) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state">Không có thiết bị phù hợp</div></td></tr>`;
    return;
  }
  tbody.innerHTML = list.map(d => `
    <tr>
      <td>${d.name}</td><td>${d.ip}</td><td>${d.mac}</td><td>${d.type}</td>
      <td><span class="badge badge-${d.status}">${d.status}</span></td>
      <td>${d.status === 'online' ? d.ping + ' ms' : '-'}</td>
      <td>${d.lastSeen}</td>
    </tr>`).join('');
}
document.getElementById('devSearch').addEventListener('input', renderDevices);
document.getElementById('devFilter').addEventListener('change', renderDevices);
document.querySelectorAll('#devTable th').forEach(th => {
  th.addEventListener('click', () => {
    const key = th.dataset.sort;
    devSortAsc = devSortKey === key ? !devSortAsc : true;
    devSortKey = key;
    renderDevices();
  });
});

/* ===== Network status ===== */
function renderStatus() {
  const grid = document.getElementById('statusGrid');
  if (!grid) return;
  grid.innerHTML = DemoEngine.services.map(s => `
    <div class="card">
      <div class="label">${s.name}</div>
      <div class="value" style="font-size:16px">
        <span class="status-dot dot-${s.status}"></span>${s.status === 'operational' ? 'Operational' : s.status === 'warning' ? 'Warning' : 'Offline'}
      </div>
      <div class="sub">Uptime: ${s.uptime}</div>
    </div>`).join('');
}

/* ===== Alerts ===== */
function renderAlerts() {
  const list = document.getElementById('alertList');
  if (!list) return;
  const filter = document.getElementById('alertFilter').value;
  let items = DemoEngine.alerts.filter(a => {
    if (filter === 'ALL') return true;
    if (filter === 'unread') return !a.read;
    return a.type === filter;
  });
  if (!items.length) {
    list.innerHTML = `<div class="empty-state">Không có cảnh báo</div>`;
    return;
  }
  const icons = { 'High Ping': '📶', 'Packet Loss': '📉', 'Internet Offline': '🌐', 'Device Offline': '💻', 'High Bandwidth': '📊' };
  list.innerHTML = items.map(a => `
    <div class="alert-item ${a.read ? 'read' : ''}">
      <div class="icon">${icons[a.type] || '🚨'}</div>
      <div class="body">
        <div class="title">${a.title}</div>
        <div class="desc">${a.desc}</div>
        <div class="time">${a.time}</div>
      </div>
      <div class="acts">
        <button class="icon-btn" onclick="markAlertRead(${a.id})" title="Đánh dấu đã đọc">✓</button>
        <button class="icon-btn" onclick="deleteAlert(${a.id})" title="Xóa">✕</button>
      </div>
    </div>`).join('');
}
function markAlertRead(id) {
  const a = DemoEngine.alerts.find(x => x.id === id);
  if (a) a.read = true;
  renderAlerts();
}
function deleteAlert(id) {
  const idx = DemoEngine.alerts.findIndex(x => x.id === id);
  if (idx > -1) DemoEngine.alerts.splice(idx, 1);
  renderAlerts();
  toast('Đã xóa cảnh báo');
}
document.getElementById('alertFilter').addEventListener('change', renderAlerts);

/* ===== Admin Management ===== */
function renderAdmins() {
  const tbody = document.getElementById('adminTbody');
  if (!tbody) return;
  const users = Auth.getUsers();
  tbody.innerHTML = users.map(u => `
    <tr>
      <td>${u.username}</td>
      <td>${u.role}</td>
      <td><span class="badge badge-${u.status === 'active' ? 'online' : 'offline'}">${u.status}</span></td>
      <td>${new Date(u.createdAt).toLocaleDateString('vi-VN')}</td>
      <td style="display:flex;gap:6px;flex-wrap:wrap">
        <button class="icon-btn" onclick="editAdmin(${u.id})" title="Sửa">✎</button>
        <button class="icon-btn" onclick="toggleLockAdmin(${u.id})" title="Khóa/Mở">${u.status === 'active' ? '🔒' : '🔓'}</button>
        <button class="icon-btn" onclick="deleteAdmin(${u.id})" title="Xóa">🗑</button>
      </td>
    </tr>`).join('');
}
let editingId = null;
const adminModal = document.getElementById('adminModal');
document.getElementById('btnAddAdmin').addEventListener('click', () => {
  editingId = null;
  document.getElementById('adminModalTitle').textContent = 'Tạo Admin';
  document.getElementById('adminForm').reset();
  adminModal.classList.add('show');
});
document.getElementById('btnCancelModal').addEventListener('click', () => adminModal.classList.remove('show'));
document.getElementById('adminForm').addEventListener('submit', e => {
  e.preventDefault();
  const users = Auth.getUsers();
  const username = document.getElementById('fUsername').value.trim();
  const password = document.getElementById('fPassword').value;
  const role = document.getElementById('fRole').value;
  if (editingId) {
    const u = users.find(x => x.id === editingId);
    u.username = username; u.password = password; u.role = role;
    Auth.logActivity(session.username, `Sửa admin ${username}`, 'success');
    toast('Đã cập nhật admin', 'success');
  } else {
    if (users.some(u => u.username === username)) { toast('Username đã tồn tại'); return; }
    users.push({ id: Date.now(), username, password, role, status: 'active', createdAt: Date.now() });
    Auth.logActivity(session.username, `Tạo admin ${username}`, 'success');
    toast('Đã tạo admin mới', 'success');
  }
  Auth.saveUsers(users);
  adminModal.classList.remove('show');
  renderAdmins();
});
function editAdmin(id) {
  const u = Auth.getUsers().find(x => x.id === id);
  if (!u) return;
  editingId = id;
  document.getElementById('adminModalTitle').textContent = 'Sửa Admin';
  document.getElementById('fUsername').value = u.username;
  document.getElementById('fPassword').value = u.password;
  document.getElementById('fRole').value = u.role;
  adminModal.classList.add('show');
}
function toggleLockAdmin(id) {
  const users = Auth.getUsers();
  const u = users.find(x => x.id === id);
  u.status = u.status === 'active' ? 'locked' : 'active';
  Auth.saveUsers(users);
  Auth.logActivity(session.username, `${u.status === 'locked' ? 'Khóa' : 'Mở khóa'} admin ${u.username}`, 'success');
  renderAdmins();
  toast('Đã cập nhật trạng thái');
}
function deleteAdmin(id) {
  let users = Auth.getUsers();
  const u = users.find(x => x.id === id);
  if (u.username === 'admin') { toast('Không thể xóa tài khoản gốc'); return; }
  if (!confirm(`Xóa admin ${u.username}?`)) return;
  users = users.filter(x => x.id !== id);
  Auth.saveUsers(users);
  Auth.logActivity(session.username, `Xóa admin ${u.username}`, 'success');
  renderAdmins();
  toast('Đã xóa admin', 'success');
}

/* ===== Activity Logs ===== */
function renderLogs() {
  const tbody = document.getElementById('logsTbody');
  if (!tbody) return;
  const logs = Auth.getLogs();
  if (!logs.length) {
    tbody.innerHTML = `<tr><td colspan="5"><div class="empty-state">Chưa có hoạt động nào</div></td></tr>`;
    return;
  }
  tbody.innerHTML = logs.map(l => `
    <tr>
      <td>${l.admin}</td><td>${l.action}</td><td>${l.ip}</td><td>${l.time}</td>
      <td><span class="badge badge-online">${l.status}</span></td>
    </tr>`).join('');
}

/* ===== Settings ===== */
document.getElementById('setAutoRefresh')?.addEventListener('change', e => {
  autoRefreshEnabled = e.target.checked;
  toast(autoRefreshEnabled ? 'Đã bật Auto Refresh' : 'Đã tắt Auto Refresh');
});
document.getElementById('setAutoScroll')?.addEventListener('change', e => {
  autoScroll = e.target.checked;
});
document.getElementById('setNotify')?.addEventListener('change', e => {
  notifyEnabled = e.target.checked;
});

/* ===== Master tick loop ===== */
let autoRefreshEnabled = true;
let notifyEnabled = true;
let tickCount = 0;

function masterTick() {
  if (autoRefreshEnabled) {
    DemoEngine.tick();
    renderDashboard();
    renderDevices();
  }
  if (!consolePaused) {
    if (Math.random() < 0.7) addConsoleLog(DemoEngine.randomLog());
  }
  tickCount++;
  if (tickCount % 8 === 0 && Math.random() < 0.4) {
    const types = ['High Ping', 'Packet Loss', 'Device Offline', 'High Bandwidth'];
    const type = types[Math.floor(Math.random() * types.length)];
    DemoEngine.alerts.unshift({
      id: Date.now(), type, title: type + ' detected',
      desc: 'Phát hiện bất thường trên hệ thống mạng',
      time: 'vừa xong', read: false
    });
    if (DemoEngine.alerts.length > 30) DemoEngine.alerts.pop();
    renderAlerts();
    if (notifyEnabled) toast('🚨 Alert mới: ' + type);
  }
}
setInterval(masterTick, 2500);

/* ===== Initial render ===== */
addConsoleLog({ time: new Date().toLocaleTimeString('vi-VN', { hour12: false }), level: 'INFO', msg: 'Network connected' });
addConsoleLog({ time: new Date().toLocaleTimeString('vi-VN', { hour12: false }), level: 'SUCCESS', msg: 'Gateway ONLINE' });
renderDashboard();
renderDevices();
renderStatus();
renderAlerts();
renderAdmins();
renderLogs();
window.addEventListener('resize', drawChart);
