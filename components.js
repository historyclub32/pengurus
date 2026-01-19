/**
 * HISTORY CLUB 32 - ADMIN COMPONENTS (Final Fix: Persistent Session)
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
        --hc-green: #10b981; --hc-red: #ef4444; --hc-yellow: #f59e0b; --hc-orange: #f97316;
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
        position: absolute; top: 0; right: 0; width: 8px; height: 8px;
        background: var(--hc-red); border-radius: 50%; border: 2px solid #fff;
    }

    /* Timer Sesi - Warna Dinamis */
    .session-timer {
        font-size: 13px; font-weight: 600; background: #f1f5f9; color: #64748b;
        padding: 6px 14px; border-radius: 20px; display: flex; align-items: center; gap: 8px;
        font-variant-numeric: tabular-nums; transition: all 0.3s ease;
    }
    .session-timer.safe { color: var(--hc-green); background: #ecfdf5; }
    .session-timer.warn { color: var(--hc-yellow); background: #fffbeb; }
    .session-timer.danger { color: var(--hc-orange); background: #fff7ed; }
    .session-timer.critical { color: var(--hc-red); background: #fef2f2; animation: pulse 1s infinite; }

    @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.7; } 100% { opacity: 1; } }

    /* Profil di Sidebar (Mobile Friendly) */
    .sidebar-profile {
        padding: 20px 24px; border-bottom: 1px solid var(--border);
        display: flex; align-items: center; gap: 12px; background: #f8fafc;
    }
    .sidebar-profile img {
        width: 48px; height: 48px; border-radius: 50%; object-fit: cover;
        border: 2px solid #e2e8f0;
    }
    .sidebar-profile-info { flex: 1; min-width: 0; }
    .sidebar-name { font-size: 14px; font-weight: 600; color: var(--hc-dark); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .sidebar-role { font-size: 12px; color: #64748b; }

    /* SIDEBAR ADMIN */
    .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1100; opacity: 0; visibility: hidden; transition: 0.3s; }
    .sidebar-overlay.active { opacity: 1; visibility: visible; }
    .sidebar {
        position: fixed; top: 0; left: 0; bottom: 0; width: 280px; background: #fff; z-index: 1200;
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
    .nav-link:hover { background: #f8fafc; color: var(--hc-blue); }
    .nav-link.active { background: #eff6ff; color: var(--hc-blue); border-left-color: var(--hc-blue); font-weight: 600; }
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

    // Logo Header dari Drive
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
            <div class="session-timer safe" title="Sisa Waktu Sesi">
                <i class="ri-time-line"></i>
                <span id="header-timer">Memuat...</span>
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
        
        <div class="sidebar-profile">
            <img src="" alt="User" id="sidebar-user-img">
            <div class="sidebar-profile-info">
                <div class="sidebar-name" id="sidebar-user-name">Memuat...</div>
                <div class="sidebar-role" id="sidebar-user-role">...</div>
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

    // Initial Data Fetch
    fetchHeaderData();
}

// === HELPER FUNGSI ===

// 1. Fetch Data Sesi (Load Local dulu, lalu fetch server)
async function fetchHeaderData() {
    let token = new URLSearchParams(window.location.search).get('token');
    
    // Cek Local Storage jika URL tidak ada token
    if (!token) {
        // Asumsi token tersimpan di localStorage (dari login)
        // Jika tidak ada di URL, kita ambil dari config.js helper jika ada, atau skip
    }

    if (!token) return;

    // STEP 1: LOAD FROM CACHE (INSTANT)
    const cached = localStorage.getItem('hc32_session_data');
    if (cached) {
        updateUI(JSON.parse(cached));
    }

    try {
        // STEP 2: FETCH FRESH DATA
        const response = await hc32_post('getSessionInfo', { token: token });
        
        if (response.status === 'ok') {
            const data = response.data;
            // Update UI dengan data terbaru
            updateUI(data);
            // Simpan ke Cache
            localStorage.setItem('hc32_session_data', JSON.stringify(data));
        }
    } catch (e) {
        console.error("Gagal memuat info header:", e);
    }
}

// Fungsi Update Tampilan (Shared)
function updateUI(data) {
    // Update Text di Sidebar
    const elName = document.getElementById('sidebar-user-name');
    const elRole = document.getElementById('sidebar-user-role');
    
    if (elName) elName.textContent = data.nama || 'Pengurus';
    if (elRole) elRole.textContent = data.jabatan || 'Anggota';
    
    // Update Foto di Sidebar
    const imgEl = document.getElementById('sidebar-user-img');
    if (imgEl) {
        if (data.foto && data.foto.trim() !== '') {
            imgEl.src = data.foto;
        } else {
            const initials = (data.nama || 'U').charAt(0).toUpperCase();
            imgEl.src = `https://ui-avatars.com/api/?name=${initials}&background=random&color=fff`;
        }
    }

    // Start Timer
    if (data.expiredAt) {
        startSessionTimer(new Date(data.expiredAt));
    }
}

// 2. Countdown Timer dengan Warna
let timerInterval;

function startSessionTimer(expiryDate) {
    const timerEl = document.getElementById('header-timer');
    const timerBox = document.querySelector('.session-timer');
    
    if (timerInterval) clearInterval(timerInterval); // Reset timer lama

    const update = () => {
        const now = new Date();
        const diff = expiryDate - now;

        if (diff <= 0) {
            if (timerEl) timerEl.textContent = "00:00:00";
            if (timerBox) {
                timerBox.className = "session-timer critical"; // Merah kedip
            }
            return; 
        }

        // Hitung Waktu
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        
        // Tampilkan
        if (timerEl) {
            timerEl.textContent = 
                (hours > 0 ? String(hours).padStart(2, '0') + ':' : '') + 
                String(minutes).padStart(2, '0') + ':' + 
                String(seconds).padStart(2, '0');
        }

        // Logika Warna
        if (timerBox) {
            const totalMinutes = diff / (1000 * 60);
            
            // Reset class
            timerBox.className = "session-timer";

            if (totalMinutes > 60) {
                timerBox.classList.add("safe"); // Hijau (> 1 jam)
            } else if (totalMinutes > 30) {
                timerBox.classList.add("safe"); // Tetap Hijau
            } else if (totalMinutes > 10) {
                timerBox.classList.add("warn"); // Kuning (< 30 menit)
            } else if (totalMinutes > 5) {
                timerBox.classList.add("danger"); // Oranye (< 10 menit)
            } else {
                timerBox.classList.add("critical"); // Merah (< 5 menit)
            }
        }
    };

    update();
    timerInterval = setInterval(update, 1000); 
}

// 3. Status Helpers (Tetap sama)
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
    if (!confirm('Apakah Anda yakin ingin keluar dari Panel Pengurus?')) e.preventDefault();
    else {
        localStorage.removeItem('hc32_token');
        localStorage.removeItem('hc32_session_data'); // Hapus cache sesi
    }
}
