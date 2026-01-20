/**
 * HISTORY CLUB 32 - ADMIN COMPONENTS (Fix Timer Persistence)
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

    @keyframes hcspin { to { transform: rotate(360deg); } }
    @keyframes popIn { 0%{transform:scale(0)} 80%{transform:scale(1.1)} 100%{transform:scale(1)} }
    @keyframes shake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-5px)} 75%{transform:translateX(5px)} }
`;

// === FUNGSI UTAMA ===
function initHC32AdminNavigation(activePageId) {
    hc32EnsureSiteIcons();

    // Inject CSS
    const styleTag = document.createElement('style');
    styleTag.textContent = HC32_ADMIN_STYLES;
    document.head.appendChild(styleTag);

    // Inject Loader HTML (Versi Web Utama)
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

    const urlToken = new URLSearchParams(window.location.search).get('token') || '';
    
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

    // Sidebar Header: User Info (Dipindah ke sini agar ramah mobile)
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

    // Fetch Realtime Data (Background Sync)
    fetchHeaderData();
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

            // Simpan ke LocalStorage agar persisten saat pindah tab
            localStorage.setItem('hc32_session', JSON.stringify({
                nama: data.nama,
                jabatan: data.jabatan,
                foto: data.foto,
                expiredAt: data.expiredAt // Simpan waktu expired juga
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

// Variabel global untuk menyimpan interval timer
let globalTimerInterval = null;

function startSessionTimer(expiryDate) {
    const timerEl = document.getElementById('header-timer');
    if (!timerEl) return;

    // Bersihkan interval sebelumnya jika ada (PENTING untuk mencegah reset/kedip)
    if (globalTimerInterval) clearInterval(globalTimerInterval);

    const update = () => {
        const now = new Date();
        const diff = expiryDate - now;

        if (diff <= 0) {
            timerEl.textContent = "00:00:00";
            timerEl.style.color = "var(--hc-red)";
            return; 
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        // LOGIKA WARNA (Hijau -> Kuning -> Oranye -> Merah)
        if (minutes >= 5 || hours > 0) {
            timerEl.style.color = "var(--hc-green)"; 
            timerEl.style.fontWeight = "500";
        } else if (minutes >= 2) {
            timerEl.style.color = "var(--hc-yellow)"; // Kuning
            timerEl.style.fontWeight = "bold";
        } else if (minutes >= 1) {
            timerEl.style.color = "var(--hc-orange)"; // Oranye
            timerEl.style.fontWeight = "bold";
        } else {
            timerEl.style.color = "var(--hc-red)"; // Merah (Kritis)
            timerEl.style.fontWeight = "bold";
        }

        timerEl.textContent = 
            (hours > 0 ? String(hours).padStart(2, '0') + ':' : '') + 
            String(minutes).padStart(2, '0') + ':' + 
            String(seconds).padStart(2, '0');
    };

    update(); // Jalankan sekali langsung
    globalTimerInterval = setInterval(update, 1000); // Simpan ID interval
}

function confirmLogout(e) {
    if (!confirm('Apakah Anda yakin ingin keluar dari Panel Pengurus?')) e.preventDefault();
    else {
        localStorage.removeItem('hc32_token');
        localStorage.removeItem('hc32_session'); 
    }
}
