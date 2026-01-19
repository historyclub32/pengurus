/**
 * HISTORY CLUB 32 - ADMIN COMPONENTS (Full UI + Enhanced Header with Real Data)
 * File: pengurus/components.js
 */

/* =========================
   0) SETUP ICON
   ========================= */
const HC32_ICON_FAVICON_32 = "https://lh3.googleusercontent.com/d/1fo2n6rqQngLG0HiCdGkwPudPJ2Z_JyJt";
const HC32_THEME_COLOR     = "#1a4787";

function hc32EnsureSiteIcons() {
    const head = document.head;
    const ensure = (tag, attrs) => {
        if ([...head.querySelectorAll(tag)].some(el => Object.entries(attrs).every(([k, v]) => el.getAttribute(k) === v))) return;
        const el = document.createElement(tag);
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
        head.appendChild(el);
    };
    ensure("link", { rel: "icon", type: "image/png", sizes: "32x32", href: HC32_ICON_FAVICON_32 });
    ensure("meta", { name: "theme-color", content: HC32_THEME_COLOR });
}

// === MENU SIDEBAR PENGURUS ===
const ADMIN_ROOT = "../"; 

const HC32_ADMIN_MENU = [
    { type: 'category', text: 'Utama' },
    { type: 'link', text: 'Dashboard', href: ADMIN_ROOT + 'dashboard/', icon: 'ri-dashboard-line', id: 'dashboard' },
    
    { type: 'category', text: 'Manajemen' },
    { type: 'link', text: 'Agenda', href: ADMIN_ROOT + 'agenda/', icon: 'ri-calendar-event-line', id: 'agenda' },
    { type: 'link', text: 'Input Presensi', href: ADMIN_ROOT + 'presensi/', icon: 'ri-fingerprint-line', id: 'presensi' },

    { type: 'category', text: 'Maintenance' },
    { type: 'link', text: 'Perbaikan Data', href: ADMIN_ROOT + 'perbaikan/', icon: 'ri-tools-line', id: 'perbaikan' },

    { type: 'category', text: 'Akun' },
    { type: 'link', text: 'Keluar', href: '../../keanggotaan/login pengurus/index.html', icon: 'ri-logout-box-line', id: 'logout', isLogout: true }
];

// === CSS ADMIN ===
const HC32_ADMIN_STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    @import url('https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css');

    :root {
        --hc-blue: #1a4787; --hc-toska: #0f8a94; --hc-dark: #2e2e2e;
        --hc-bg: #f8fafc; --border: #e2e8f0; --card: #ffffff;
        --hc-green: #10b981; --hc-red: #ef4444;
    }
    
    body { font-family: 'Poppins', sans-serif; background-color: var(--hc-bg); margin: 0; display: flex; flex-direction: column; min-height: 100vh; }

    /* HEADER ADMIN (Updated Layout) */
    .admin-header {
        position: sticky; top: 0; z-index: 1000;
        background: #fff; height: 70px; border-bottom: 1px solid var(--border);
        display: flex; align-items: center; justify-content: space-between; padding: 0 24px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    
    /* Header Left: Brand */
    .header-left { display: flex; align-items: center; gap: 16px; }
    .header-logo { height: 45px; width: auto; object-fit: contain; } /* Logo Kepengurusan */
    .menu-btn { background: none; border: none; font-size: 24px; color: var(--hc-dark); cursor: pointer; padding: 4px; display: flex; }

    /* Header Right: Actions & Profile */
    .header-right { display: flex; align-items: center; gap: 20px; }
    
    .header-icon-btn { 
        position: relative; background: none; border: none; font-size: 22px; 
        color: #64748b; cursor: pointer; display: flex; align-items: center;
    }
    .header-icon-btn:hover { color: var(--hc-blue); }
    .notif-badge {
        position: absolute; top: -2px; right: -2px; width: 8px; height: 8px;
        background: var(--hc-red); border-radius: 50%; border: 2px solid #fff;
    }

    .session-timer {
        font-size: 12px; color: #64748b; font-weight: 500; background: #f1f5f9;
        padding: 6px 12px; border-radius: 20px; display: flex; align-items: center; gap: 6px;
    }
    .session-timer i { color: var(--hc-toska); }

    .user-profile { display: flex; align-items: center; gap: 12px; border-left: 1px solid var(--border); padding-left: 20px; }
    .user-info { text-align: right; display: none; } /* Hide on mobile */
    .user-name { font-size: 13px; font-weight: 600; color: var(--hc-dark); line-height: 1.2; }
    .user-role { font-size: 11px; color: #64748b; }
    
    .user-avatar { 
        width: 40px; height: 40px; border-radius: 50%; object-fit: cover; 
        border: 2px solid #e2e8f0; 
    }

    @media (min-width: 768px) {
        .user-info { display: block; }
    }

    /* SIDEBAR ADMIN */
    .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1100; opacity: 0; visibility: hidden; transition: 0.3s; }
    .sidebar-overlay.active { opacity: 1; visibility: visible; }
    .sidebar {
        position: fixed; top: 0; left: 0; bottom: 0; width: 260px; background: #fff; z-index: 1200;
        transform: translateX(-100%); transition: transform 0.3s ease-out; display: flex; flex-direction: column;
        border-right: 1px solid var(--border);
    }
    .sidebar.active { transform: translateX(0); }
    .sidebar-header { height: 70px; display: flex; align-items: center; padding: 0 24px; border-bottom: 1px solid var(--border); justify-content: space-between; }
    .sidebar-brand { font-weight: 700; color: var(--hc-blue); font-size: 16px; letter-spacing: 0.5px; }
    .sidebar-content { flex: 1; overflow-y: auto; padding: 15px 0; }
    .menu-cat { padding: 0 24px; margin-top: 20px; margin-bottom: 8px; font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    .menu-cat:first-child { margin-top: 0; }
    .nav-link { 
        display: flex; align-items: center; gap: 12px; padding: 12px 24px; 
        color: #475569; text-decoration: none; font-size: 14px; font-weight: 500;
        transition: 0.2s; border-left: 3px solid transparent;
    }
    .nav-link:hover, .nav-link.active { background: #eff6ff; color: var(--hc-blue); border-left-color: var(--hc-blue); }
    .nav-link i { font-size: 18px; color: #94a3b8; transition: 0.2s; }
    .nav-link:hover i, .nav-link.active i { color: var(--hc-blue); }

    /* FOOTER */
    .admin-footer { margin-top: auto; padding: 20px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid var(--border); background: #fff; }

    /* MODAL STATUS */
    #hc32-global-overlay {
        position: fixed; inset: 0; background: rgba(255, 255, 255, 0.95);
        display: none; flex-direction: column; align-items: center; justify-content: center;
        z-index: 99999; backdrop-filter: blur(2px); transition: opacity 0.3s;
    }
    #hc32-global-overlay.active { display: flex; }
    .hc-status-card {
        background: white; padding: 30px; border-radius: 20px; text-align: center;
        box-shadow: 0 20px 50px rgba(0,0,0,0.1); width: 85%; max-width: 320px;
        transform: scale(0.9); transition: 0.3s;
    }
    #hc32-global-overlay.active .hc-status-card { transform: scale(1); }
    .hc-spinner-box { width: 50px; height: 50px; border: 4px solid #e2e8f0; border-top-color: var(--hc-blue); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 15px; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .hc-status-icon { width: 60px; height: 60px; border-radius: 50%; display: none; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 15px; }
    .state-success .hc-status-icon.success { display: flex; background: #d1fae5; color: var(--hc-green); }
    .state-error .hc-status-icon.error { display: flex; background: #fee2e2; color: var(--hc-red); }
    .state-success .hc-spinner-box, .state-error .hc-spinner-box { display: none; }
    .hc-status-title { font-weight: 700; font-size: 16px; margin-bottom: 8px; }
    .hc-status-desc { font-size: 13px; color: #64748b; margin-bottom: 20px; }
    .hc-status-btn { width: 100%; padding: 12px; border: none; border-radius: 10px; background: var(--hc-blue); color: white; font-weight: 600; cursor: pointer; display: none; }
    .state-success .hc-status-btn, .state-error .hc-status-btn { display: block; }
`;

// === FUNGSI UTAMA ===
function initHC32AdminNavigation(activePageId) {
    hc32EnsureSiteIcons();

    // Inject CSS
    const styleTag = document.createElement('style');
    styleTag.textContent = HC32_ADMIN_STYLES;
    document.head.appendChild(styleTag);

    // Inject Loader HTML
    if (!document.getElementById('hc32-global-overlay')) {
        document.body.insertAdjacentHTML('beforeend', `
            <div id="hc32-global-overlay">
                <div class="hc-status-card">
                    <div class="hc-spinner-box"></div>
                    <div class="hc-status-icon success"><i class="ri-check-line"></i></div>
                    <div class="hc-status-icon error"><i class="ri-close-line"></i></div>
                    <div class="hc-status-title" id="hc32-status-title">Memuat...</div>
                    <div class="hc-status-desc" id="hc32-status-desc">Mohon tunggu sebentar.</div>
                    <button class="hc-status-btn" onclick="hideHC32Status()">Tutup</button>
                </div>
            </div>
        `);
    }

    // Ambil Data Sesi (Real Data dari LocalStorage)
    // Pastikan saat login Anda menyimpan data ini dengan key 'hc32_session'
    let session = { nama: 'Pengurus', jabatan: 'Admin', foto: '' };
    try {
        const stored = localStorage.getItem('hc32_session');
        if (stored) session = JSON.parse(stored);
    } catch(e) { console.error("Gagal load sesi", e); }

    // Fallback Foto Profil jika kosong
    const userFoto = session.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(session.nama)}&background=random&color=fff`;

    // URL Logo Header Baru
    const logoSrc = "https://drive.google.com/thumbnail?id=1kb_yesHbnVPtCrjzlWZGD_XXtfQoaLEe&sz=w400";

    // Render Header
    let headerEl = document.querySelector('.admin-header');
    if (!headerEl) {
        headerEl = document.createElement('header');
        headerEl.className = 'admin-header';
        document.body.prepend(headerEl);
    }
    
    headerEl.innerHTML = `
        <div class="header-left">
            <button class="menu-btn" id="sidebar-toggle"><i class="ri-menu-2-line"></i></button>
            <img src="${logoSrc}" alt="HC 32 Logo" class="header-logo">
        </div>
        
        <div class="header-right">
            <div class="session-timer" title="Sisa Waktu Sesi">
                <i class="ri-time-line"></i>
                <span id="session-countdown">Memuat...</span>
            </div>

            <button class="header-icon-btn" title="Notifikasi">
                <i class="ri-notification-3-line"></i>
                <span class="notif-badge"></span>
            </button>

            <div class="user-profile">
                <div class="user-info">
                    <div class="user-name">${session.nama}</div>
                    <div class="user-role">${session.jabatan}</div>
                </div>
                <img src="${userFoto}" alt="Profile" class="user-avatar">
            </div>
        </div>
    `;

    // Render Sidebar
    const sideOverlay = document.createElement('div');
    sideOverlay.id = 'sidebar-overlay'; sideOverlay.className = 'sidebar-overlay';
    const sidebarEl = document.createElement('aside');
    sidebarEl.id = 'admin-sidebar'; sidebarEl.className = 'sidebar';

    const urlToken = new URLSearchParams(window.location.search).get('token') || '';
    
    let menuHTML = '';
    HC32_ADMIN_MENU.forEach(item => {
        if (item.type === 'category') {
            menuHTML += `<div class="menu-cat">${item.text}</div>`;
        } else {
            const isActive = item.id === activePageId ? 'active' : '';
            let finalHref = item.href;
            if (urlToken && !item.isLogout && !item.href.includes('#')) {
                finalHref += item.href.includes('?') ? `&token=${urlToken}` : `?token=${urlToken}`;
            }
            menuHTML += `
                <a href="${finalHref}" class="nav-link ${isActive}" ${item.isLogout ? 'onclick="confirmLogout(event)"' : ''}>
                    <i class="${item.icon}"></i> <span>${item.text}</span>
                </a>`;
        }
    });

    sidebarEl.innerHTML = `
        <div class="sidebar-header">
            <span class="sidebar-brand">PANEL PENGURUS</span>
            <button class="menu-btn" onclick="toggleSidebar()"><i class="ri-close-line"></i></button>
        </div>
        <div class="sidebar-content">${menuHTML}</div>
    `;

    document.body.appendChild(sideOverlay);
    document.body.appendChild(sidebarEl);

    // Render Footer
    let footerEl = document.querySelector('footer');
    if (!footerEl) {
        footerEl = document.createElement('footer');
        footerEl.className = 'admin-footer';
        document.body.appendChild(footerEl);
    }
    footerEl.innerHTML = `© 2026 History Club SMAN 32 Jakarta • Panel Pengurus`;

    // Sidebar Logic
    const toggleBtn = document.getElementById('sidebar-toggle');
    const overlay = document.getElementById('sidebar-overlay');
    const sidebar = document.getElementById('admin-sidebar');
    window.toggleSidebar = () => { sidebar.classList.toggle('active'); overlay.classList.toggle('active'); };
    if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);

    // Start Countdown Timer
    startSessionTimer();
}

// === HELPER LAINNYA ===

// Fungsi Countdown Sesi (8 Jam / Sesuai Login)
function startSessionTimer() {
    const el = document.getElementById('session-countdown');
    if (!el) return;

    // Ambil waktu login dari localStorage (pastikan diset saat login)
    // Jika tidak ada, kita set waktu sekarang sebagai fallback (reset timer)
    let loginTime = parseInt(localStorage.getItem('hc32_login_time'));
    
    // Jika tidak ada data login time, buat baru (untuk demo/fallback)
    if (!loginTime || isNaN(loginTime)) {
        loginTime = Date.now();
        localStorage.setItem('hc32_login_time', loginTime);
    }

    const sessionDuration = 8 * 60 * 60 * 1000; // 8 jam dalam milidetik
    const endTime = loginTime + sessionDuration;

    function updateTimer() {
        const now = Date.now();
        const diff = endTime - now;

        if (diff <= 0) {
            el.textContent = "Sesi Habis";
            el.style.color = "var(--hc-red)";
            // Opsional: Redirect logout otomatis
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        
        // Format HH:MM
        el.textContent = `${String(hours).padStart(2, '0')}j ${String(minutes).padStart(2, '0')}m`;
    }

    updateTimer(); // Jalankan langsung
    setInterval(updateTimer, 60000); // Update tiap 1 menit
}

window.showHC32Status = (type, title, message) => {
    const overlay = document.getElementById('hc32-global-overlay');
    const card = overlay.querySelector('.hc-status-card');
    const titleEl = document.getElementById('hc32-status-title');
    const descEl = document.getElementById('hc32-status-desc');

    if (overlay) {
        overlay.classList.remove('state-success', 'state-error');
        titleEl.textContent = title;
        descEl.innerHTML = message || '';

        if (type === 'success') card.classList.add('state-success');
        else if (type === 'error') card.classList.add('state-error');
        
        overlay.classList.add('active');
    }
};

window.hideHC32Status = () => {
    const overlay = document.getElementById('hc32-global-overlay');
    if (overlay) overlay.classList.remove('active');
};

function confirmLogout(e) {
    if (!confirm('Apakah Anda yakin ingin keluar dari Panel Pengurus?')) {
        e.preventDefault();
    } else {
        localStorage.removeItem('hc32_token');
        localStorage.removeItem('hc32_session'); // Hapus sesi user
        localStorage.removeItem('hc32_login_time'); // Hapus waktu login
    }
}
