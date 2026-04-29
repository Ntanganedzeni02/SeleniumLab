/* ═══════════════════════════════════════
   SELENIUMLAB – APP LOGIC
   All original functionality preserved,
   wired to the redesigned HTML.
═══════════════════════════════════════ */

const appState = {
  isLoggedIn: false,
  currentUser: null,
  currentPage: 1,
  itemsPerPage: 5,
  sortColumn: null,
  sortOrder: 'asc',
  allData: [
    { name: 'Ntakadzeni Phidzaglima',    email: 'ntaka@example.com',    age: 23 },
    { name: 'Ntanganedzeni Phidzaglima', email: 'ntanga@example.com',   age: 21 },
    { name: 'Elelwani Khavhagali',        email: 'ele@example.com',      age: 19 },
    { name: 'Livhuwani Khavhagali',       email: 'livhu@example.com',    age: 17 },
    { name: 'Thifhelimbilu Khavhagali',   email: 'fheli@example.com',    age: 15 },
    { name: 'Khathutshelo Khavhagali',    email: 'khathu@example.com',   age: 13 },
    { name: 'Wanga Phidzaglima',          email: 'wanga@example.com',    age: 11 },
    { name: 'Rotondwa Phidzaglima',       email: 'rotondwa@example.com', age: 9  },
    { name: 'Romeo Phidzaglima',          email: 'romeo@example.com',    age: 7  },
    { name: 'Zwoluga Phidzaglima',        email: 'zwolu@example.com',    age: 5  },
    { name: 'Rialivhuwa Phidzaglima',     email: 'ria@example.com',      age: 3  }
  ],
  filteredData: []
};

/* ──────────────────────────────────────
   NAVIGATION
────────────────────────────────────── */
function showSection(sectionId) {
  document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById(sectionId);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (sectionId === 'tables') {
      appState.filteredData = [...appState.allData];
      appState.currentPage  = 1;
      renderTable();
      renderPagination();
      updateTableCount();
    }
    if (sectionId === 'dynamic') {
      setupDynamicElements();
    }
  }
}

function scrollToScenarios() {
  document.getElementById('scenarios')?.scrollIntoView({ behavior: 'smooth' });
}

/* ──────────────────────────────────────
   MOBILE NAV
────────────────────────────────────── */
function toggleMobileMenu() {
  const links = document.getElementById('navLinks');
  const btn   = document.getElementById('hamburger');
  links.classList.toggle('open');
  btn.classList.toggle('open');
}
function closeMobileMenu() {
  document.getElementById('navLinks')?.classList.remove('open');
  document.getElementById('hamburger')?.classList.remove('open');
}

/* ──────────────────────────────────────
   AUTH
────────────────────────────────────── */
function handleLogin(event) {
  event.preventDefault();
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value;

  if (username === 'admin' && password === 'password123') {
    appState.isLoggedIn  = true;
    appState.currentUser = username;
    showInlineAlert('loginAlert', 'Login successful! Redirecting…', 'success');
    document.getElementById('logoutBtn').style.display = 'inline-flex';
    setTimeout(() => {
      document.getElementById('username').value = '';
      document.getElementById('password').value = '';
      showSection('home');
    }, 1500);
  } else {
    showInlineAlert('loginAlert', 'Invalid credentials. Try: admin / password123', 'error');
  }
}

function handleRegister(event) {
  event.preventDefault();
  const password        = document.getElementById('regPassword').value;
  const confirmPassword = document.getElementById('confirmPassword').value;
  const fullName        = document.getElementById('fullName').value.trim();
  const gender          = document.querySelector('input[name="gender"]:checked');

  if (password !== confirmPassword) {
    showInlineAlert('registerAlert', 'Passwords do not match!', 'error');
    return;
  }
  if (!gender) {
    showInlineAlert('registerAlert', 'Please select a gender.', 'error');
    return;
  }

  showInlineAlert('registerAlert', `Account created for ${fullName}! Redirecting to login…`, 'success');
  event.target.reset();
  document.getElementById('fileDropLabel').textContent = 'Click to upload or drag & drop';
  setTimeout(() => showSection('login'), 2000);
}

function logout() {
  appState.isLoggedIn  = false;
  appState.currentUser = null;
  document.getElementById('logoutBtn').style.display = 'none';
  showSection('home');
  showToast('Signed out successfully.');
}

/* ──────────────────────────────────────
   INLINE ALERTS (inside forms/panels)
────────────────────────────────────── */
function showInlineAlert(elementId, message, type) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent  = message;
  el.className    = `inline-alert ${type}`;
  el.style.display = 'block';
  el.style.marginBottom = '20px';
  clearTimeout(el._timer);
  el._timer = setTimeout(() => {
    el.style.display = 'none';
  }, 5000);
}

/* ──────────────────────────────────────
   TOAST NOTIFICATIONS
────────────────────────────────────── */
function showToast(message, type = '') {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fadeOut');
    setTimeout(() => toast.remove(), 350);
  }, 3000);
}

// Keep backward compat alias
function showNotification(message) { showToast(message); }

/* ──────────────────────────────────────
   JS DIALOGS
────────────────────────────────────── */
function showSimpleAlert()  { alert('This is a simple JavaScript alert!'); }

function showConfirm() {
  const result = confirm('Do you want to proceed?');
  showToast(result ? 'You clicked OK' : 'You clicked Cancel');
}

function showPrompt() {
  const result = prompt('Please enter your name:');
  if (result) showToast(`Hello, ${result}!`);
}

function openNewTab() { window.open('about:blank', '_blank'); }

/* ──────────────────────────────────────
   DYNAMIC ELEMENTS
────────────────────────────────────── */
function setupDynamicElements() {
  const btn     = document.getElementById('delayedButton');
  const content = document.getElementById('delayedContent');
  const spinner = document.getElementById('loadingSpinner');
  const dynBtn  = document.getElementById('dynamicBtn');

  if (btn)     btn.style.display     = 'none';
  if (content) content.style.display = 'none';
  if (spinner) spinner.style.display = 'flex';

  setTimeout(() => {
    if (spinner) spinner.style.display = 'none';
    if (btn)     btn.style.display     = 'block';
    if (content) content.style.display = 'flex';
    if (dynBtn)  dynBtn.onclick = () => showToast('Dynamic button clicked!', 'success');
  }, 5000);
}

/* ──────────────────────────────────────
   TABLE – RENDER
────────────────────────────────────── */
function renderTable() {
  const tbody = document.getElementById('tableBody');
  if (!tbody) return;
  tbody.innerHTML = '';

  const start    = (appState.currentPage - 1) * appState.itemsPerPage;
  const pageData = appState.filteredData.slice(start, start + appState.itemsPerPage);

  if (pageData.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = '<td colspan="3" style="text-align:center;color:var(--text-muted);padding:32px;">No results found.</td>';
    tbody.appendChild(tr);
    return;
  }

  pageData.forEach(item => {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${item.name}</td><td>${item.email}</td><td>${item.age}</td>`;
    tbody.appendChild(tr);
  });
}

function renderPagination() {
  const pagination = document.getElementById('pagination');
  if (!pagination) return;
  pagination.innerHTML = '';

  const totalPages = Math.ceil(appState.filteredData.length / appState.itemsPerPage);
  for (let i = 1; i <= totalPages; i++) {
    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className   = i === appState.currentPage ? 'active' : '';
    btn.onclick     = () => {
      appState.currentPage = i;
      renderTable();
      renderPagination();
    };
    pagination.appendChild(btn);
  }
}

function updateTableCount() {
  const el = document.getElementById('tableCount');
  if (el) el.textContent = `${appState.filteredData.length} records`;
}

function filterTable() {
  const search = document.getElementById('searchInput')?.value.toLowerCase() || '';
  appState.filteredData = appState.allData.filter(item =>
    item.name.toLowerCase().includes(search) || item.email.toLowerCase().includes(search)
  );
  appState.currentPage = 1;
  renderTable();
  renderPagination();
  updateTableCount();
}

function sortTable(column) {
  if (appState.sortColumn === column) {
    appState.sortOrder = appState.sortOrder === 'asc' ? 'desc' : 'asc';
  } else {
    appState.sortColumn = column;
    appState.sortOrder  = 'asc';
  }

  appState.filteredData.sort((a, b) => {
    let A = a[column], B = b[column];
    if (typeof A === 'string') { A = A.toLowerCase(); B = B.toLowerCase(); }
    if (appState.sortOrder === 'asc')  return A > B ? 1 : -1;
    if (appState.sortOrder === 'desc') return A < B ? 1 : -1;
    return 0;
  });

  appState.currentPage = 1;
  renderTable();
  renderPagination();
}

/* ──────────────────────────────────────
   FILE UPLOAD
────────────────────────────────────── */
function handleFileUpload() {
  const fileInput = document.getElementById('fileUpload');
  if (!fileInput || fileInput.files.length === 0) {
    showInlineAlert('uploadStatus', 'Please select a file first!', 'error');
    return;
  }
  const file = fileInput.files[0];
  showInlineAlert('uploadStatus', `"${file.name}" uploaded successfully!`, 'success');
  fileInput.value = '';
  document.getElementById('uploadLabel').textContent = 'Click to choose file';
}

function updateFileLabel(input) {
  const label = document.getElementById('fileDropLabel');
  if (label && input.files.length > 0) {
    label.textContent = input.files[0].name;
  }
}

function updateUploadLabel(input) {
  const label = document.getElementById('uploadLabel');
  if (label && input.files.length > 0) {
    label.textContent = input.files[0].name;
  }
}

/* ──────────────────────────────────────
   DOWNLOADS
────────────────────────────────────── */
function downloadPDF() {
  triggerDownload(
    'data:text/plain;charset=utf-8,' + encodeURIComponent('This is a sample PDF file generated for Selenium testing.'),
    'sample.txt'
  );
  showToast('Download started: sample.txt');
}

function downloadTXT() {
  const content = `Selenium Practice App - Sample Download\n=====================================\nDate: ${new Date().toLocaleString()}\nContent: This is a text file for testing file downloads.\nThis file can be used to practice downloading files with Selenium.`;
  triggerDownload('data:text/plain;charset=utf-8,' + encodeURIComponent(content), 'selenium-sample.txt');
  showToast('Download started: selenium-sample.txt');
}

function triggerDownload(href, filename) {
  const a = document.createElement('a');
  a.setAttribute('href', href);
  a.setAttribute('download', filename);
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/* ──────────────────────────────────────
   HIDDEN ELEMENT TOGGLE
────────────────────────────────────── */
function toggleHidden() {
  const hidden = document.getElementById('hiddenElement');
  const btn    = document.getElementById('showHiddenBtn');
  if (!hidden || !btn) return;

  if (hidden.classList.contains('visible')) {
    hidden.classList.remove('visible');
    btn.textContent = 'Reveal Hidden Element';
  } else {
    hidden.classList.add('visible');
    btn.textContent = 'Hide Element';
  }
}

/* ──────────────────────────────────────
   API FETCH (mock)
────────────────────────────────────── */
function fetchUserData() {
  const results = document.getElementById('apiResults');
  const spinner = document.getElementById('loadingSpinner2');
  const btn     = document.getElementById('fetchBtn');

  if (!results || !spinner) return;

  spinner.style.display = 'flex';
  results.style.display = 'none';
  if (btn) btn.disabled = true;

  setTimeout(() => {
    spinner.style.display = 'none';
    if (btn) btn.disabled = false;

    const mockUsers = [
      { id: 1, name: 'Ntakadzeni Phidzaglima',    email: 'ntaka@example.com',  role: 'Admin' },
      { id: 2, name: 'Ntanganedzeni Phidzaglima', email: 'ntanga@example.com', role: 'User'  },
      { id: 3, name: 'Elelwani Khavhagali',        email: 'ele@example.com',    role: 'User'  }
    ];

    results.innerHTML =
      '<strong style="color:var(--text-head)">API Response (Mock Data):</strong><br><br>' +
      mockUsers.map(u =>
        `<span style="color:var(--text-muted);font-size:12px">ID ${u.id}</span>&nbsp;&nbsp;` +
        `<strong>${u.name}</strong> &mdash; ${u.email} &mdash; ` +
        `<span style="background:var(--primary-light);color:var(--primary);padding:2px 8px;border-radius:4px;font-size:12px;font-weight:600">${u.role}</span>`
      ).join('<br>');

    results.style.display = 'block';
    showToast('Data fetched successfully!', 'success');
  }, 2000);
}

/* ──────────────────────────────────────
   NAVBAR SCROLL SHADOW
────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const navbar = document.getElementById('navbar');
  if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 10);
});

/* ──────────────────────────────────────
   DOM READY – EVENT LISTENERS
────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* Table search */
  document.getElementById('searchInput')?.addEventListener('keyup', filterTable);

  /* Table sort headers */
  document.getElementById('nameHeader')?.addEventListener('click',  () => sortTable('name'));
  document.getElementById('emailHeader')?.addEventListener('click', () => sortTable('email'));
  document.getElementById('ageHeader')?.addEventListener('click',   () => sortTable('age'));

  /* ── Drag & Drop ── */
  const draggable = document.getElementById('draggableItem');
  const boxB      = document.getElementById('boxB');

  draggable?.addEventListener('dragstart', e => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', draggable.outerHTML);
    setTimeout(() => draggable.style.opacity = '0.4', 0);
  });

  draggable?.addEventListener('dragend', () => {
    draggable.style.opacity = '1';
  });

  boxB?.addEventListener('dragover', e => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    boxB.classList.add('drag-over');
  });

  boxB?.addEventListener('dragleave', () => boxB.classList.remove('drag-over'));

  boxB?.addEventListener('drop', e => {
    e.preventDefault();
    boxB.classList.remove('drag-over');

    // Move draggable into boxB
    draggable?.remove();
    boxB.innerHTML = '';
    const clone = document.createElement('div');
    clone.className   = 'draggable';
    clone.draggable   = true;
    clone.innerHTML   = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg> Dropped!`;
    boxB.appendChild(clone);

    // Update drop zone styling to success
    boxB.style.borderColor = '#10b981';
    boxB.style.background  = '#ecfdf5';

    showToast('Item dropped successfully!', 'success');
  });

  /* ── Keyboard nav for home cards ── */
  document.querySelectorAll('.card[tabindex]').forEach(card => {
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

});