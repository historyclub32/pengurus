/**
 * HISTORY CLUB 32 - ADMIN COMPONENTS (Fix Timer Persistence & Auto Logout)
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
const ADMIN_ROOT = "/"; 

const HC32_ADMIN_MENU = [
    { type: 'category', text: 'Utama' },
    { type: 'link', text: 'Dashboard', href: ADMIN_ROOT + 'dashboard/', icon: 'ri-dashboard-line', id: 'dashboard' },
    
    { type: 'category', text: 'Manajemen' },
    { type: 'link', text: 'Agenda', href: ADMIN_ROOT + 'agenda/', icon: 'ri-calendar-event-line', id: 'agenda' },
    { type: 'link', text: 'Presensi', href: ADMIN_ROOT + 'presensi/', icon: 'ri-fingerprint-line', id: 'presensi' },
    { type: 'link', text: 'Anggota', href: ADMIN_ROOT + 'anggota', icon: 'ri-group-line', id: 'anggota' },
    { type: 'link', text: 'Kelola Lacak Status', href: ADMIN_ROOT + 'tracking/', icon: 'ri-radar-line', id: 'tracking' },
    { type: 'link', text: 'Formulir', href: ADMIN_ROOT + 'formulir/', icon: 'ri-file-list-3-line', id: 'formulir' },
    { type: 'link', text: 'SISBENDU', href: ADMIN_ROOT + 'sisbendu/', icon: 'ri-wallet-3-line', id: 'sisbendu' },

    { type: 'category', text: 'Maintenance' },
    { type: 'link', text: 'Perbaikan Data', href: ADMIN_ROOT + 'perbaikan/', icon: 'ri-tools-line', id: 'perbaikan' },

    { type: 'category', text: 'Akun' },
    { type: 'link', text: 'Keluar', href: '../../keanggotaan/login pengurus/index.html', icon: 'ri-logout-box-line', id: 'logout', isLogout: true }
];

// === CSS ADMIN (termasuk animasi pulse dan popup modern) ===
const HC32_ADMIN_STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    @import url('https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css');

    :root {
        --hc-blue: #1a4787; --hc-toska: #0f8a94; --hc-dark: #2e2e2e;
        --hc-bg: #f8fafc; --border: #e2e8f0; --card: #ffffff;
        --hc-green: #10b981; --hc-red: #ef4444; --hc-yellow: #facc15; --hc-orange: #f97316;
    }
    
    body { font-family: 'Poppins', sans-serif; background-color: var(--hc-bg); margin: 0; display: flex; flex-direction: column; min-height: 100vh; }

    /* HEADER ADMIN */
    .admin-header {
        position: sticky; top: 0; z-index: 1000;
        background: #fff; height: 70px; border-bottom: 1px solid var(--border);
        display: flex; align-items: center; justify-content: space-between; padding: 0 24px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.03);
    }
    .header-left { display: flex; align-items: center; gap: 16px; }
    .header-logo { height: 45px; width: auto; object-fit: contain; } 
    .menu-btn { background: none; border: none; font-size: 24px; color: var(--hc-dark); cursor: pointer; padding: 4px; display: flex; }

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

    /* Timer Sesi - Warna Dinamis */
    .session-timer {
        font-size: 13px; font-weight: 600; background: #f1f5f9; color: #64748b;
        padding: 6px 12px; border-radius: 20px; display: flex; align-items: center; gap: 6px;
        font-variant-numeric: tabular-nums; transition: color 0.3s;
    }
    .session-timer i { color: var(--hc-toska); }

    /* SIDEBAR ADMIN */
    .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1100; opacity: 0; visibility: hidden; transition: 0.3s; }
    .sidebar-overlay.active { opacity: 1; visibility: visible; }
    .sidebar {
        position: fixed; top: 0; left: 0; bottom: 0; width: 260px; background: #fff; z-index: 1200;
        transform: translateX(-100%); transition: transform 0.3s ease-out; display: flex; flex-direction: column;
        border-right: 1px solid var(--border);
    }
    .sidebar.active { transform: translateX(0); }
    
    .sidebar-header { 
        padding: 24px 24px 15px; border-bottom: 1px solid var(--border); 
        display: flex; flex-direction: column; gap: 15px;
    }
    
    /* User Profile di Sidebar */
    .sidebar-user { display: flex; align-items: center; gap: 12px; }
    .sidebar-avatar { 
        width: 48px; height: 48px; border-radius: 50%; object-fit: cover; 
        border: 2px solid var(--hc-toska); padding: 2px;
    }
    .sidebar-user-info { flex: 1; overflow: hidden; }
    .sidebar-username { font-size: 14px; font-weight: 700; color: var(--hc-dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sidebar-role { font-size: 12px; color: #64748b; font-weight: 500; }

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

    /* === STATUS OVERLAY (LOADER, SUCCESS, ERROR) === */
    #hc32-global-overlay {
        position: fixed; inset: 0; background: rgba(255, 255, 255, 0.95);
        display: none; flex-direction: column; align-items: center; justify-content: center;
        z-index: 99999; backdrop-filter: blur(2px); transition: opacity 0.3s;
    }
    #hc32-global-overlay.active { display: flex; }

    .hc-status-card {
        background: white; padding: 30px; border-radius: 24px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.15); text-align: center;
        max-width: 320px; width: 90%; transform: scale(0.9); opacity: 0;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    }
    #hc32-global-overlay.active .hc-status-card { transform: scale(1); opacity: 1; }

    /* Spinner */
    .hc-spinner-box { position: relative; width: 80px; height: 80px; margin: 0 auto 20px; }
    .hc-spinner-ring {
        position: absolute; inset: 0; border-radius: 50%;
        border: 5px solid var(--hc-blue);
        border-top-color: var(--hc-toska);
        animation: hcspin 1s linear infinite;
    }
    .hc-spinner-logo {
        position: absolute; inset: 0; margin: auto;
        width: 45px; height: 45px; object-fit: contain;
        border-radius: 50%;
    }

    /* Icons */
    .hc-status-icon-box {
        width: 80px; height: 80px; margin: 0 auto 20px; border-radius: 50%;
        display: none; align-items: center; justify-content: center;
        font-size: 40px; 
    }
    .state-success .hc-status-icon-box { display: flex; background: #dcfce7; color: var(--hc-green); border: 4px solid #bbf7d0; animation: popIn 0.4s; }
    .state-error .hc-status-icon-box { display: flex; background: #fee2e2; color: var(--hc-red); border: 4px solid #fecaca; animation: shake 0.4s; }

    .hc-status-title { font-family: 'Poppins', sans-serif; font-size: 18px; font-weight: 700; color: var(--hc-dark); margin-bottom: 8px; }
    .hc-status-desc { font-family: 'Poppins', sans-serif; font-size: 14px; color: #64748b; line-height: 1.5; margin-bottom: 20px; }

    .hc-status-btn {
        width: 100%; padding: 14px; border: none; border-radius: 12px;
        background: var(--hc-blue); color: white; font-weight: 600; font-family: 'Poppins', sans-serif;
        cursor: pointer; transition: all 0.1s ease-in-out; 
        display: none; box-shadow: 0 4px 12px rgba(26, 71, 135, 0.2);
    }
    .hc-status-btn:hover { background: var(--hc-toska); }
    
    .state-loading .hc-spinner-box { display: block; }
    .state-loading .hc-status-icon-box, .state-loading .hc-status-btn { display: none; }
    .state-success .hc-spinner-box, .state-error .hc-spinner-box { display: none; }
    .state-success .hc-status-btn, .state-error .hc-status-btn { display: block; }

    /* POPUP MODERN HC32 */
    .hc32-popup-overlay {
        position: fixed; inset: 0; background: rgba(0,0,0,0.45);
        display: none; align-items: center; justify-content: center;
        z-index: 100000; backdrop-filter: blur(4px);
    }
    .hc32-popup-overlay.active { display: flex; }
    .hc32-popup-card {
        width: 90%; max-width: 360px; background: white;
        border-radius: 28px; padding: 28px; text-align: center;
        animation: popupIn 0.25s ease; box-shadow: 0 20px 60px rgba(0,0,0,0.2);
    }
    .hc32-popup-icon {
        width: 82px; height: 82px; margin: 0 auto 18px;
        border-radius: 50%; display: flex; align-items: center;
        justify-content: center; font-size: 42px;
    }
    .hc32-popup-title {
        font-size: 20px; font-weight: 700; color: var(--hc-dark);
        margin-bottom: 10px;
    }
    .hc32-popup-message {
        font-size: 14px; line-height: 1.6; color: #64748b;
        margin-bottom: 24px;
    }
    .hc32-popup-actions {
        display: flex; gap: 12px;
    }
    .hc32-btn-primary, .hc32-btn-secondary {
        flex: 1; border: none; border-radius: 14px;
        padding: 14px; font-family: 'Poppins', sans-serif;
        font-weight: 600; cursor: pointer;
    }
    .hc32-btn-primary { background: var(--hc-blue); color: white; }
    .hc32-btn-secondary { background: #e2e8f0; color: #334155; }

    @keyframes hcspin { to { transform: rotate(360deg); } }
    @keyframes popIn { 0%{transform:scale(0)} 80%{transform:scale(1.1)} 100%{transform:scale(1)} }
    @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
    @keyframes popupIn { from { transform: scale(0.85); opacity: 0; } to { transform: scale(1); opacity: 1; } }
`;

// === VARIABEL GLOBAL TIMER ===
let globalTimerInterval = null;
let autologoutTriggered = false;

// === FUNGSI UTAMA ===
async function initHC32AdminNavigation(activePageId) {
    hc32EnsureSiteIcons();

    // Inject CSS
    const styleTag = document.createElement('style');
    styleTag.textContent = HC32_ADMIN_STYLES;
    document.head.appendChild(styleTag);

    // Inject Loader HTML dan Popup HTML
    if (!document.getElementById('hc32-global-overlay')) {
        document.body.insertAdjacentHTML('beforeend', `
            <div id="hc32-global-overlay">
                <div class="hc-status-card" id="hc32-status-card">
                    <div class="hc-spinner-box" id="hc32-spinner-box">
                        <div class="hc-spinner-ring"></div>
                        <img src="https://drive.google.com/thumbnail?id=16VXxbcOF9h5zAzYEo2faAzmgqqhtHLlH&sz=w200" class="hc-spinner-logo" alt="HC">
                    </div>
                    <div class="hc-status-icon-box" id="hc32-status-icon-box">
                        <i id="hc32-status-icon"></i>
                    </div>
                    <div class="hc-status-title" id="hc32-status-title">Memuat...</div>
                    <div class="hc-status-desc" id="hc32-status-desc"></div>
                    <button class="hc-status-btn" id="hc32-status-btn" onclick="hideHC32Status()">Oke</button>
                </div>
            </div>
            <div id="hc32-popup-overlay" class="hc32-popup-overlay">
                <div class="hc32-popup-card">
                    <div class="hc32-popup-icon" id="hc32-popup-icon">
                        <i id="hc32-popup-icon-i" class="ri-information-line"></i>
                    </div>
                    <div class="hc32-popup-title" id="hc32-popup-title">Judul</div>
                    <div class="hc32-popup-message" id="hc32-popup-message">Isi popup</div>
                    <div class="hc32-popup-actions">
                        <button class="hc32-btn-secondary" id="hc32-popup-cancel">Batal</button>
                        <button class="hc32-btn-primary" id="hc32-popup-confirm">Ok</button>
                    </div>
                </div>
            </div>
        `);
    }

    // Status Helper (Kompatibel dengan Web Utama)
    window.showHC32Status = (type, title, message) => {
        const overlay = document.getElementById('hc32-global-overlay');
        const card = document.getElementById('hc32-status-card');
        
        if (overlay) {
            overlay.classList.remove('active', 'state-loading', 'state-success', 'state-error');
            card.classList.remove('state-success', 'state-error'); 
            
            document.getElementById('hc32-status-title').textContent = title;
            document.getElementById('hc32-status-desc').innerHTML = message || '';

            if (type === 'loading') {
                overlay.classList.add('state-loading');
            } else {
                const iconBox = document.getElementById('hc32-status-icon-box');
                const icon = document.getElementById('hc32-status-icon');
                
                if (type === 'success') {
                    overlay.classList.add('state-success');
                    icon.className = 'ri-check-line';
                } else {
                    overlay.classList.add('state-error');
                    icon.className = 'ri-close-line';
                }
            }
            
            void overlay.offsetWidth;
            overlay.classList.add('active');
        }
    };

    window.hideHC32Status = () => {
        const overlay = document.getElementById('hc32-global-overlay');
        if (overlay) overlay.classList.remove('active');
    };

    // Popup Modern HC32
    window.showHC32Popup = ({ type = 'info', title = 'Informasi', message = '', buttonText = 'Oke', cancelText = '', onConfirm = null }) => {
        const overlay = document.getElementById('hc32-popup-overlay');
        const titleEl = document.getElementById('hc32-popup-title');
        const msgEl = document.getElementById('hc32-popup-message');
        const confirmBtn = document.getElementById('hc32-popup-confirm');
        const cancelBtn = document.getElementById('hc32-popup-cancel');
        const iconBox = document.getElementById('hc32-popup-icon');
        const icon = document.getElementById('hc32-popup-icon-i');

        if (!overlay) return;

        titleEl.textContent = title;
        msgEl.innerHTML = message;
        confirmBtn.textContent = buttonText;

        confirmBtn.onclick = () => {
            overlay.classList.remove('active');
            if (onConfirm) onConfirm();
        };

        if (cancelText) {
            cancelBtn.style.display = 'block';
            cancelBtn.textContent = cancelText;
            cancelBtn.onclick = () => {
                overlay.classList.remove('active');
            };
        } else {
            cancelBtn.style.display = 'none';
        }

        // Styling icon
        if (type === 'error') {
            icon.className = 'ri-close-line';
            iconBox.style.background = '#fee2e2';
            iconBox.style.color = '#ef4444';
        } else if (type === 'warning') {
            icon.className = 'ri-alert-line';
            iconBox.style.background = '#fef3c7';
            iconBox.style.color = '#f59e0b';
        } else {
            icon.className = 'ri-information-line';
            iconBox.style.background = '#dbeafe';
            iconBox.style.color = '#2563eb';
        }
        overlay.classList.add('active');
    };

    // Logo Header
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
            <img src="${logoSrc}" alt="Logo HC" class="header-logo">
        </div>
        
        <div class="header-right">
            <div class="session-timer" title="Sisa Waktu Sesi">
                <i class="ri-time-line"></i> <span id="header-timer">--:--:--</span>
            </div>
            <button class="header-icon-btn" title="Notifikasi">
                <i class="ri-notification-3-line"></i>
                <span class="notif-badge"></span>
            </button>
        </div>
    `;

    // Render Sidebar
    const sideOverlay = document.createElement('div');
    sideOverlay.id = 'sidebar-overlay'; sideOverlay.className = 'sidebar-overlay';
    const sidebarEl = document.createElement('aside');
    sidebarEl.id = 'admin-sidebar'; sidebarEl.className = 'sidebar';

    // === PERBAIKAN: Ambil token dari URL atau localStorage ===
    let urlToken = new URLSearchParams(window.location.search).get('token') || '';
    let finalToken = urlToken;
    
    // Jika tidak ada token di URL, coba ambil dari localStorage
    if (!finalToken) {
        const savedSession = localStorage.getItem('hc32_session');
        if (savedSession) {
            try {
                const parsed = JSON.parse(savedSession);
                // Coba ambil token dari session jika tersimpan
                const savedToken = localStorage.getItem('hc32_token');
                if (savedToken) {
                    finalToken = savedToken;
                }
            } catch(e) {}
        }
    }
    
    // Simpan token ke URL jika belum ada (untuk konsistensi antar halaman)
    if (finalToken && !urlToken) {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('token', finalToken);
        window.history.replaceState({}, '', newUrl);
    }
    
    // --- LOAD SAVED SESSION FIRST (AGAR HEADER INSTAN) ---
    const savedSession = localStorage.getItem('hc32_session');
    let userData = { nama: 'Pengurus', jabatan: 'Admin', foto: '' };
    let savedExpiry = null;
    
    if (savedSession) {
        try { 
            const p = JSON.parse(savedSession); 
            if(p.nama) userData.nama = p.nama;
            if(p.jabatan) userData.jabatan = p.jabatan;
            if(p.foto) userData.foto = p.foto;
            if(p.expiredAt) savedExpiry = p.expiredAt;
        } catch(e) {}
    }

    // Tampilkan Timer segera dari LocalStorage (jika ada)
    if(savedExpiry) {
        startSessionTimer(new Date(savedExpiry));
    }
    
    // Fallback avatar
    const avatarSrc = userData.foto || `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.nama)}&background=random&color=fff`;

    // === PERBAIKAN: Buat menu links dengan token yang benar ===
    let menuHTML = '';
    HC32_ADMIN_MENU.forEach(item => {
        if (item.type === 'category') {
            menuHTML += `<div class="menu-cat">${item.text}</div>`;
        } else {
            const isActive = item.id === activePageId ? 'active' : '';
            let finalHref = item.href;
            // PERBAIKAN: Gunakan finalToken, bukan urlToken
            if (finalToken && !item.isLogout && !item.href.includes('#')) {
                finalHref += item.href.includes('?') ? `&token=${encodeURIComponent(finalToken)}` : `?token=${encodeURIComponent(finalToken)}`;
            }
            menuHTML += `
                <a href="${finalHref}" class="nav-link ${isActive}" ${item.isLogout ? 'onclick="confirmLogout(event)"' : ''}>
                    <i class="${item.icon}"></i> <span>${item.text}</span>
                </a>`;
        }
    });

    // Sidebar Header: User Info
    sidebarEl.innerHTML = `
        <div class="sidebar-header">
            <div class="sidebar-user">
                <img src="${avatarSrc}" alt="User" class="sidebar-avatar" id="sidebar-user-img">
                <div class="sidebar-user-info">
                    <div class="sidebar-username" id="sidebar-user-name">${userData.nama}</div>
                    <div class="sidebar-role" id="sidebar-user-role">${userData.jabatan}</div>
                </div>
            </div>
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

    // Sidebar Events
    const toggleBtn = document.getElementById('sidebar-toggle');
    const overlay = document.getElementById('sidebar-overlay');
    const sidebar = document.getElementById('admin-sidebar');
    window.toggleSidebar = () => { sidebar.classList.toggle('active'); overlay.classList.toggle('active'); };
    if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);

    // Validasi Session Saat Load
    await validateSessionOnLoad();

    // Fetch Realtime Data (Background Sync)
    fetchHeaderData();

    // ===== PERBAIKAN 1: Sinkronisasi antar tab =====
    window.addEventListener('storage', (e) => {
        if (e.key === 'hc32_session' || e.key === 'hc32_token') {
            // Refresh data sidebar dan timer
            fetchHeaderData();
            const saved = localStorage.getItem('hc32_session');
            if (saved) {
                try {
                    const data = JSON.parse(saved);
                    document.getElementById('sidebar-user-name').textContent = data.nama || 'Pengurus';
                    document.getElementById('sidebar-user-role').textContent = data.jabatan || 'Admin';
                    if (data.foto) document.getElementById('sidebar-user-img').src = data.foto;
                    if (data.expiredAt) startSessionTimer(new Date(data.expiredAt));
                } catch(e) {}
            }
        }
    });

    // Refresh berkala (misal tiap 5 menit) untuk menjaga token tetap valid
    setInterval(() => {
        fetchHeaderData();
    }, 5 * 60 * 1000);
}

// === VALIDASI SESSION SAAT LOAD ===
async function validateSessionOnLoad() {
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) {
        forceLogout();
        return;
    }
    try {
        const response = await hc32_post('getSessionInfo', { token: token });
        if (response.status !== 'ok') {
            forceLogout();
        }
    } catch (err) {
        forceLogout();
    }
}

// === FORCE LOGOUT ===
function forceLogout() {
    localStorage.removeItem('hc32_session');
    localStorage.removeItem('hc32_token');
    sessionStorage.clear();
    showHC32Popup({
        type: 'error',
        title: 'Sesi Tidak Valid',
        message: 'Silakan login kembali untuk melanjutkan.',
        buttonText: 'Login',
        onConfirm: () => {
            // PERBAIKAN 2: Redirect ke URL absolut
            window.location.href = 'https://www.historyclub32.or.id/keanggotaan/login%20pengurus/index.html';
        }
    });
}

// === REVISI TIMER SESSION DENGAN AUTO LOGOUT ===
function startSessionTimer(expiryDate) {
    const timerEl = document.getElementById('header-timer');
    if (!timerEl) return;

    // Bersihkan interval sebelumnya jika ada
    if (globalTimerInterval) {
        clearInterval(globalTimerInterval);
    }
    autologoutTriggered = false;

    const update = async () => {
        const now = new Date();
        const diff = expiryDate - now;

        // ===== SESSION HABIS =====
        if (diff <= 0) {
            clearInterval(globalTimerInterval);
            timerEl.textContent = "00:00:00";
            timerEl.style.color = "var(--hc-red)";
            timerEl.style.fontWeight = "700";
            
            // Hindari trigger berulang
            if (autologoutTriggered) return;
            autologoutTriggered = true;

            try {
                const token = new URLSearchParams(window.location.search).get('token');
                if (token) {
                    await hc32_post('logoutAdmin', { token });
                }
            } catch (err) {
                console.error('Auto logout gagal:', err);
            }

            // Bersihkan storage
            localStorage.removeItem('hc32_session');
            localStorage.removeItem('hc32_token');
            sessionStorage.clear();

            // Tampilkan popup session expired
            showHC32Popup({
                type: 'error',
                title: 'Waktu Sesi Habis',
                message: 'Sesi keamanan telah berakhir. Silakan login kembali.',
                buttonText: 'Login Ulang',
                onConfirm: () => {
                    // PERBAIKAN 2: Redirect ke URL absolut
                    window.location.href = 'https://www.historyclub32.or.id/keanggotaan/login%20pengurus/index.html';
                }
            });
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // ===== LOGIKA WARNA TIMER =====
        if (hours > 0 || minutes >= 5) {
            timerEl.style.color = "var(--hc-green)";
            timerEl.style.fontWeight = "500";
            timerEl.style.animation = "none";
        } else if (minutes >= 2) {
            timerEl.style.color = "var(--hc-yellow)";
            timerEl.style.fontWeight = "700";
            timerEl.style.animation = "none";
        } else if (minutes >= 1) {
            timerEl.style.color = "var(--hc-orange)";
            timerEl.style.fontWeight = "700";
            timerEl.style.animation = "pulse 1s infinite";
        } else {
            timerEl.style.color = "var(--hc-red)";
            timerEl.style.fontWeight = "700";
            timerEl.style.animation = "pulse 0.8s infinite";
        }

        // Tampilkan timer (jika jam > 0, tampilkan jam)
        if (hours > 0) {
            timerEl.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        } else {
            timerEl.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        }
    };

    update(); // Jalankan sekali langsung
    globalTimerInterval = setInterval(update, 1000);
}

// === HELPER FUNGSI ===
async function fetchHeaderData() {
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) return;

    try {
        const response = await hc32_post('getSessionInfo', { token: token });
        
        if (response.status === 'ok') {
            const data = response.data;
            
            // Update Sidebar Info
            document.getElementById('sidebar-user-name').textContent = data.nama || 'Pengurus';
            document.getElementById('sidebar-user-role').textContent = data.jabatan || 'Anggota';
            
            // Photo handling
            const imgEl = document.getElementById('sidebar-user-img');
            if (data.foto && data.foto.trim() !== '') {
                imgEl.src = data.foto;
            } else {
                const initials = (data.nama || 'U').charAt(0).toUpperCase();
                imgEl.src = `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff`;
            }

            // Simpan token juga ke localStorage
            localStorage.setItem('hc32_token', token);
            
            // Simpan ke LocalStorage agar persisten saat pindah tab
            localStorage.setItem('hc32_session', JSON.stringify({
                nama: data.nama,
                jabatan: data.jabatan,
                foto: data.foto,
                expiredAt: data.expiredAt
            }));

            // Start Timer (Sinkronisasi Server)
            if (data.expiredAt) {
                startSessionTimer(new Date(data.expiredAt));
            }
        }
    } catch (e) {
        console.error("Gagal memuat info header:", e);
    }
}

// === REVISI LOGOUT BUTTON DENGAN POPUP MODERN ===
async function confirmLogout(event) {
    event.preventDefault();
    showHC32Popup({
        type: 'warning',
        title: 'Keluar dari Panel?',
        message: 'Apakah Anda yakin ingin keluar dari Panel Pengurus HC 32?',
        buttonText: 'Keluar',
        cancelText: 'Batal',
        onConfirm: async () => {
            try {
                showHC32Status('loading', 'Mengakhiri Sesi', 'Mohon tunggu sebentar...');
                const token = new URLSearchParams(window.location.search).get('token');
                if (token) {
                    await hc32_post('logoutAdmin', { token });
                }
                localStorage.removeItem('hc32_session');
                localStorage.removeItem('hc32_token');
                sessionStorage.clear();
                // PERBAIKAN 2: Redirect ke URL absolut
                window.location.href = 'https://www.historyclub32.or.id/keanggotaan/login%20pengurus/index.html';
            } catch (err) {
                hideHC32Status();
                showHC32Popup({
                    type: 'error',
                    title: 'Logout Gagal',
                    message: err.message || 'Terjadi kesalahan.',
                    buttonText: 'Tutup'
                });
            }
        }
    });
}
