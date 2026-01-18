/**
 * HISTORY CLUB 32 - ADMIN UI COMPONENTS
 * File: components.js
 * Lokasi: /pengurus/components.js
 */

/* =========================
   0) SETUP ICON & PWA
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

// === HELPER PATH NAVIGASI ===
// Menghitung path relatif agar link sidebar berfungsi dari folder manapun (dashboard, agenda, dll)
function getAdminBasePath() {
    const path = window.location.pathname;
    // Jika berada di sub-folder (misal: /pengurus/dashboard/), naik satu level
    if (path.includes('/dashboard/') || 
        path.includes('/presensi/') || 
        path.includes('/agenda/') || 
        path.includes('/posting/') || 
        path.includes('/anggota/') || 
        path.includes('/perbaikan/')) {
        return '../'; 
    }
    return './'; // Jika di root pengurus
}

const ADMIN_BASE = getAdminBasePath();

// === KONFIGURASI MENU SIDEBAR PENGURUS ===
const HC32_ADMIN_MENU = [
    { type: 'category', text: 'Utama' },
    { type: 'link', text: 'Dashboard', href: ADMIN_BASE + 'dashboard/', icon: 'ri-dashboard-line', id: 'dashboard' },
    
    { type: 'category', text: 'Manajemen' },
    { type: 'link', text: 'Agenda', href: ADMIN_BASE + 'agenda/', icon: 'ri-calendar-event-line', id: 'agenda' },
    { type: 'link', text: 'Input Presensi', href: ADMIN_BASE + 'presensi/', icon: 'ri-fingerprint-line', id: 'presensi' },
    { type: 'link', text: 'Posting Artikel', href: ADMIN_BASE + 'posting/', icon: 'ri-article-line', id: 'posting' }, // Asumsi folder posting ada
    { type: 'link', text: 'Data Anggota', href: ADMIN_BASE + 'anggota/', icon: 'ri-group-line', id: 'anggota' }, // Asumsi folder anggota ada

    { type: 'category', text: 'Maintenance' },
    { type: 'link', text: 'Perbaikan Data', href: ADMIN_BASE + 'perbaikan/', icon: 'ri-tools-line', id: 'perbaikan' },

    { type: 'category', text: 'Akun' },
    // Link Keluar mengarah kembali ke Login Publik
    { type: 'link', text: 'Keluar', href: '../../keanggotaan/login pengurus/index.html', icon: 'ri-logout-box-line', id: 'logout', isLogout: true }
];

// === CSS GABUNGAN (STYLE ADMIN) ===
const HC32_ADMIN_STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
    @import url('https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css');

    :root {
        --hc-blue: #1a4787; --hc-toska: #0f8a94; --hc-dark: #2e2e2e;
        --hc-green: #15a256; --hc-red: #d30e14; --hc-bg: #f1f5f9; /* Background Admin lebih terang */
        --border: #e2e8f0; --card: #ffffff;
    }
    
    body { font-family: 'Poppins', sans-serif; background-color: var(--hc-bg); margin: 0; display: flex; flex-direction: column; min-height: 100vh; }

    /* LOADER GLOBAL */
    #hc32-global-overlay {
        position: fixed; inset: 0; background: rgba(255, 255, 255, 0.9);
        display: none; flex-direction: column; align-items: center; justify-content: center;
        z-index: 99999; backdrop-filter: blur(2px);
    }
    #hc32-global-overlay.active { display: flex; }
    .hc-spinner-box { width: 60px; height: 60px; border: 4px solid #e2e8f0; border-top-color: var(--hc-blue); border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
    .hc-status-text { margin-top: 15px; font-weight: 600; color: var(--hc-dark); font-size: 14px; }

    /* HEADER ADMIN */
    .admin-header {
        position: sticky; top: 0; z-index: 1000;
        background: #fff; height: 64px; border-bottom: 1px solid var(--border);
        display: flex; align-items: center; justify-content: space-between; padding: 0 20px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.05);
    }
    .header-brand { display: flex; align-items: center; gap: 12px; }
    .header-logo { height: 36px; width: auto; }
    .header-title { font-weight: 700; font-size: 16px; color: var(--hc-blue); display: none; }
    @media(min-width: 600px) { .header-title { display: block; } }

    .menu-btn { background: none; border: none; font-size: 24px; color: var(--hc-dark); cursor: pointer; }

    /* SIDEBAR ADMIN */
    .sidebar-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1100; opacity: 0; visibility: hidden; transition: 0.3s; }
    .sidebar-overlay.active { opacity: 1; visibility: visible; }
    
    .sidebar {
        position: fixed; top: 0; left: 0; bottom: 0; width: 260px; background: #fff; z-index: 1200;
        transform: translateX(-100%); transition: transform 0.3s ease-out; display: flex; flex-direction: column;
        border-right: 1px solid var(--border);
    }
    .sidebar.active { transform: translateX(0); }
    
    .sidebar-header { height: 64px; display: flex; align-items: center; padding: 0 20px; border-bottom: 1px solid var(--border); justify-content: space-between; }
    .sidebar-brand { font-weight: 700; color: var(--hc-blue); font-size: 18px; }
    
    .sidebar-content { flex: 1; overflow-y: auto; padding: 20px 0; }
    
    .menu-cat { padding: 0 24px; margin-top: 20px; margin-bottom: 8px; font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px; }
    .menu-cat:first-child { margin-top: 0; }
    
    .nav-link { 
        display: flex; align-items: center; gap: 12px; padding: 12px 24px; 
        color: var(--hc-dark); text-decoration: none; font-size: 14px; font-weight: 500;
        transition: 0.2s; border-left: 3px solid transparent;
    }
    .nav-link i { font-size: 18px; color: #64748b; }
    .nav-link:hover { background: #f8fafc; color: var(--hc-blue); }
    .nav-link:hover i { color: var(--hc-blue); }
    
    .nav-link.active { background: #eff6ff; color: var(--hc-blue); border-left-color: var(--hc-blue); font-weight: 600; }
    .nav-link.active i { color: var(--hc-blue); }

    /* FOOTER ADMIN (Simple) */
    .admin-footer { margin-top: auto; padding: 20px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid var(--border); background: #fff; }
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
        const loaderHTML = `
            <div id="hc32-global-overlay">
                <div class="hc-spinner-box"></div>
                <div class="hc-status-text" id="hc32-status-text">Memuat...</div>
            </div>`;
        document.body.insertAdjacentHTML('beforeend', loaderHTML);
    }

    // GLOBAL STATUS FUNCTIONS
    window.showHC32Status = (type, title, message) => {
        const overlay = document.getElementById('hc32-global-overlay');
        const text = document.getElementById('hc32-status-text');
        if (overlay && text) {
            text.textContent = title || 'Memuat...';
            overlay.classList.add('active');
            
            // Auto hide for success/error to allow alert usage if needed
            if (type !== 'loading') {
                setTimeout(() => {
                    alert(`${title}\n${message}`); // Simple fallback for admin
                    overlay.classList.remove('active');
                }, 100);
            }
        }
    };
    window.hideHC32Status = () => {
        const overlay = document.getElementById('hc32-global-overlay');
        if (overlay) overlay.classList.remove('active');
    };

    // RENDER HEADER
    let headerEl = document.querySelector('.admin-header');
    if (!headerEl) {
        headerEl = document.createElement('header');
        headerEl.className = 'admin-header';
        document.body.prepend(headerEl);
    }
    
    // Logo mengarah ke Dashboard Admin
    const logoSrc = "https://drive.google.com/thumbnail?id=1vq3Lj2j0jNa6DAIyB79nwglKzI1On-1w&sz=w400";
    headerEl.innerHTML = `
        <div class="header-brand">
            <button class="menu-btn" id="sidebar-toggle"><i class="ri-menu-2-line"></i></button>
            <img src="${logoSrc}" alt="Logo HC" class="header-logo">
            <span class="header-title">Admin Panel</span>
        </div>
        <div class="header-actions">
            </div>
    `;

    // RENDER SIDEBAR
    const sideOverlay = document.createElement('div');
    sideOverlay.className = 'sidebar-overlay';
    sideOverlay.id = 'sidebar-overlay';
    
    const sidebarEl = document.createElement('aside');
    sidebarEl.className = 'sidebar';
    sidebarEl.id = 'admin-sidebar';

    // Generate Menu Items
    // Kita tambahkan Token dari LocalStorage/URL ke setiap link agar sesi tidak hilang
    const token = new URLSearchParams(window.location.search).get('token') || localStorage.getItem('hc32_token') || '';
    
    let menuHTML = '';
    HC32_ADMIN_MENU.forEach(item => {
        if (item.type === 'category') {
            menuHTML += `<div class="menu-cat">${item.text}</div>`;
        } else {
            const isActive = item.id === activePageId ? 'active' : '';
            // Tambahkan token query param jika bukan logout
            let finalHref = item.href;
            if (!item.isLogout && token && !item.href.includes('#')) {
                finalHref += `?token=${token}`;
            }
            
            menuHTML += `
                <a href="${finalHref}" class="nav-link ${isActive}" ${item.isLogout ? 'onclick="confirmLogout(event)"' : ''}>
                    <i class="${item.icon}"></i>
                    <span>${item.text}</span>
                </a>
            `;
        }
    });

    sidebarEl.innerHTML = `
        <div class="sidebar-header">
            <span class="sidebar-brand">Menu Pengurus</span>
            <button class="menu-btn" onclick="toggleSidebar()"><i class="ri-close-line"></i></button>
        </div>
        <div class="sidebar-content">${menuHTML}</div>
    `;

    document.body.appendChild(sideOverlay);
    document.body.appendChild(sidebarEl);

    // RENDER FOOTER
    let footerEl = document.querySelector('footer');
    if (!footerEl) {
        footerEl = document.createElement('footer');
        footerEl.className = 'admin-footer';
        document.body.appendChild(footerEl);
    }
    footerEl.innerHTML = `&copy; 2026 History Club SMAN 32 Jakarta • Panel Pengurus`;

    // LOGIC SIDEBAR TOGGLE
    const toggleBtn = document.getElementById('sidebar-toggle');
    const overlay = document.getElementById('sidebar-overlay');
    const sidebar = document.getElementById('admin-sidebar');

    window.toggleSidebar = () => {
        sidebar.classList.toggle('active');
        overlay.classList.toggle('active');
    };

    if (toggleBtn) toggleBtn.addEventListener('click', toggleSidebar);
    if (overlay) overlay.addEventListener('click', toggleSidebar);
}

// LOGIC LOGOUT
function confirmLogout(e) {
    if (!confirm('Apakah Anda yakin ingin keluar?')) {
        e.preventDefault();
    } else {
        localStorage.removeItem('hc32_token'); // Hapus sesi lokal
    }
}
