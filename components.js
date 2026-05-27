/**
 * HISTORY CLUB 32 - ADMIN COMPONENTS (Fix Timer Persistence + Auto Logout)
 * File: pengurus/components.js
 */

/* =========================
   0) SETUP ICON
   ========================= */
const HC32_ICON_FAVICON_32 = "https://lh3.googleusercontent.com/d/1fo2n6rqQngLG0HiCdGkwPudPJ2Z_JyJt";
const HC32_THEME_COLOR = "#1a4787";

function hc32EnsureSiteIcons() {
    const head = document.head;

    const ensure = (tag, attrs) => {
        if ([...head.querySelectorAll(tag)].some(el =>
            Object.entries(attrs).every(([k, v]) => el.getAttribute(k) === v)
        )) return;

        const el = document.createElement(tag);
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
        head.appendChild(el);
    };

    ensure("link", {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: HC32_ICON_FAVICON_32
    });

    ensure("meta", {
        name: "theme-color",
        content: HC32_THEME_COLOR
    });
}

/* =========================
   MENU SIDEBAR
   ========================= */
const ADMIN_ROOT = "../";

const HC32_ADMIN_MENU = [
    { type: 'category', text: 'Utama' },
    { type: 'link', text: 'Dashboard', href: ADMIN_ROOT + 'dashboard/', icon: 'ri-dashboard-line', id: 'dashboard' },

    { type: 'category', text: 'Manajemen' },
    { type: 'link', text: 'Agenda', href: ADMIN_ROOT + 'agenda/', icon: 'ri-calendar-event-line', id: 'agenda' },
    { type: 'link', text: 'Presensi', href: ADMIN_ROOT + 'presensi/', icon: 'ri-fingerprint-line', id: 'presensi' },
    { type: 'link', text: 'Kelola Lacak Status', href: ADMIN_ROOT + 'tracking/', icon: 'ri-radar-line', id: 'tracking' },
    { type: 'link', text: 'Formulir', href: ADMIN_ROOT + 'formulir/', icon: 'ri-file-list-3-line', id: 'formulir' },
    { type: 'link', text: 'SISBENDU', href: ADMIN_ROOT + 'sisbendu/', icon: 'ri-wallet-3-line', id: 'sisbendu' },

    { type: 'category', text: 'Maintenance' },
    { type: 'link', text: 'Perbaikan Data', href: ADMIN_ROOT + 'perbaikan/', icon: 'ri-tools-line', id: 'perbaikan' },

    { type: 'category', text: 'Akun' },
    {
        type: 'link',
        text: 'Keluar',
        href: '../../keanggotaan/login pengurus/index.html',
        icon: 'ri-logout-box-line',
        id: 'logout',
        isLogout: true
    }
];

/* =========================
   CSS ADMIN
   ========================= */
const HC32_ADMIN_STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
@import url('https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css');

:root {
    --hc-blue: #1a4787;
    --hc-toska: #0f8a94;
    --hc-dark: #2e2e2e;
    --hc-bg: #f8fafc;
    --border: #e2e8f0;
    --card: #ffffff;

    --hc-green: #10b981;
    --hc-red: #ef4444;
    --hc-yellow: #facc15;
    --hc-orange: #f97316;
}

body {
    font-family: 'Poppins', sans-serif;
    background-color: var(--hc-bg);
    margin: 0;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
}

.admin-header {
    position: sticky;
    top: 0;
    z-index: 1000;
    background: #fff;
    height: 70px;
    border-bottom: 1px solid var(--border);

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 0 24px;

    box-shadow: 0 1px 3px rgba(0,0,0,0.03);
}

.header-left {
    display: flex;
    align-items: center;
    gap: 16px;
}

.header-logo {
    height: 45px;
    width: auto;
    object-fit: contain;
}

.menu-btn {
    background: none;
    border: none;
    font-size: 24px;
    color: var(--hc-dark);
    cursor: pointer;
    padding: 4px;
    display: flex;
}

.header-right {
    display: flex;
    align-items: center;
    gap: 20px;
}

.header-icon-btn {
    position: relative;
    background: none;
    border: none;
    font-size: 22px;
    color: #64748b;
    cursor: pointer;
    display: flex;
    align-items: center;
}

.header-icon-btn:hover {
    color: var(--hc-blue);
}

.notif-badge {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 8px;
    height: 8px;
    background: var(--hc-red);
    border-radius: 50%;
    border: 2px solid #fff;
}

.session-timer {
    font-size: 13px;
    font-weight: 600;
    background: #f1f5f9;
    color: #64748b;
    padding: 6px 12px;
    border-radius: 20px;

    display: flex;
    align-items: center;
    gap: 6px;

    font-variant-numeric: tabular-nums;
    transition: color 0.3s;
}

.session-timer i {
    color: var(--hc-toska);
}

.sidebar-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.5);
    z-index: 1100;

    opacity: 0;
    visibility: hidden;
    transition: 0.3s;
}

.sidebar-overlay.active {
    opacity: 1;
    visibility: visible;
}

.sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;

    width: 260px;
    background: #fff;
    z-index: 1200;

    transform: translateX(-100%);
    transition: transform 0.3s ease-out;

    display: flex;
    flex-direction: column;

    border-right: 1px solid var(--border);
}

.sidebar.active {
    transform: translateX(0);
}

.sidebar-header {
    padding: 24px 24px 15px;
    border-bottom: 1px solid var(--border);

    display: flex;
    flex-direction: column;
    gap: 15px;
}

.sidebar-user {
    display: flex;
    align-items: center;
    gap: 12px;
}

.sidebar-avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid var(--hc-toska);
    padding: 2px;
}

.sidebar-user-info {
    flex: 1;
    overflow: hidden;
}

.sidebar-username {
    font-size: 14px;
    font-weight: 700;
    color: var(--hc-dark);

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.sidebar-role {
    font-size: 12px;
    color: #64748b;
    font-weight: 500;
}

.sidebar-content {
    flex: 1;
    overflow-y: auto;
    padding: 15px 0;
}

.menu-cat {
    padding: 0 24px;
    margin-top: 20px;
    margin-bottom: 8px;

    font-size: 11px;
    font-weight: 600;
    color: #94a3b8;

    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.menu-cat:first-child {
    margin-top: 0;
}

.nav-link {
    display: flex;
    align-items: center;
    gap: 12px;

    padding: 12px 24px;

    color: #475569;
    text-decoration: none;
    font-size: 14px;
    font-weight: 500;

    transition: 0.2s;
    border-left: 3px solid transparent;
}

.nav-link:hover,
.nav-link.active {
    background: #eff6ff;
    color: var(--hc-blue);
    border-left-color: var(--hc-blue);
}

.nav-link i {
    font-size: 18px;
    color: #94a3b8;
    transition: 0.2s;
}

.nav-link:hover i,
.nav-link.active i {
    color: var(--hc-blue);
}

.admin-footer {
    margin-top: auto;
    padding: 20px;
    text-align: center;
    font-size: 11px;
    color: #94a3b8;
    border-top: 1px solid var(--border);
    background: #fff;
}

#hc32-global-overlay {
    position: fixed;
    inset: 0;
    background: rgba(255,255,255,0.95);

    display: none;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    z-index: 99999;

    backdrop-filter: blur(2px);
    transition: opacity 0.3s;
}

#hc32-global-overlay.active {
    display: flex;
}

.hc-status-card {
    background: white;
    padding: 30px;
    border-radius: 24px;

    box-shadow: 0 20px 60px rgba(0,0,0,0.15);

    text-align: center;
    max-width: 320px;
    width: 90%;
}

.hc-spinner-box {
    position: relative;
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;
}

.hc-spinner-ring {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    border: 5px solid var(--hc-blue);
    border-top-color: var(--hc-toska);

    animation: hcspin 1s linear infinite;
}

.hc-spinner-logo {
    position: absolute;
    inset: 0;
    margin: auto;

    width: 45px;
    height: 45px;

    object-fit: contain;
    border-radius: 50%;
}

.hc-status-icon-box {
    width: 80px;
    height: 80px;
    margin: 0 auto 20px;

    border-radius: 50%;

    display: none;
    align-items: center;
    justify-content: center;

    font-size: 40px;
}

.hc-status-title {
    font-size: 18px;
    font-weight: 700;
    color: var(--hc-dark);
    margin-bottom: 8px;
}

.hc-status-desc {
    font-size: 14px;
    color: #64748b;
    line-height: 1.5;
    margin-bottom: 20px;
}

.hc-status-btn {
    width: 100%;
    padding: 14px;
    border: none;
    border-radius: 12px;

    background: var(--hc-blue);
    color: white;

    font-weight: 600;
    cursor: pointer;

    display: none;
}

.hc-status-btn:hover {
    background: var(--hc-toska);
}

@keyframes hcspin {
    to {
        transform: rotate(360deg);
    }
}
`;

/* =========================
   INIT
   ========================= */
function initHC32AdminNavigation(activePageId) {

    hc32EnsureSiteIcons();

    const styleTag = document.createElement('style');
    styleTag.textContent = HC32_ADMIN_STYLES;
    document.head.appendChild(styleTag);

    if (!document.getElementById('hc32-global-overlay')) {
        document.body.insertAdjacentHTML('beforeend', `
            <div id="hc32-global-overlay">
                <div class="hc-status-card" id="hc32-status-card">

                    <div class="hc-spinner-box" id="hc32-spinner-box">
                        <div class="hc-spinner-ring"></div>
                        <img src="https://drive.google.com/thumbnail?id=16VXxbcOF9h5zAzYEo2faAzmgqqhtHLlH&sz=w200"
                             class="hc-spinner-logo">
                    </div>

                    <div class="hc-status-icon-box" id="hc32-status-icon-box">
                        <i id="hc32-status-icon"></i>
                    </div>

                    <div class="hc-status-title" id="hc32-status-title">
                        Memuat...
                    </div>

                    <div class="hc-status-desc" id="hc32-status-desc"></div>

                    <button class="hc-status-btn"
                            id="hc32-status-btn"
                            onclick="hideHC32Status()">
                        Oke
                    </button>

                </div>
            </div>
        `);
    }

    /* =========================
       STATUS HELPER
       ========================= */
    window.showHC32Status = (type, title, message) => {

        const overlay = document.getElementById('hc32-global-overlay');

        document.getElementById('hc32-status-title').textContent = title;
        document.getElementById('hc32-status-desc').innerHTML = message;

        const iconBox = document.getElementById('hc32-status-icon-box');
        const icon = document.getElementById('hc32-status-icon');

        document.getElementById('hc32-spinner-box').style.display = 'none';
        iconBox.style.display = 'flex';

        if (type === 'success') {
            icon.className = 'ri-check-line';
            iconBox.style.background = '#dcfce7';
            iconBox.style.color = '#16a34a';
        } else {
            icon.className = 'ri-close-line';
            iconBox.style.background = '#fee2e2';
            iconBox.style.color = '#dc2626';
        }

        const btn = document.getElementById('hc32-status-btn');
        btn.style.display = 'block';

        overlay.style.display = 'flex';

        void overlay.offsetWidth;

        overlay.classList.add('active');
    };

    window.hideHC32Status = () => {
        const overlay = document.getElementById('hc32-global-overlay');

        overlay.classList.remove('active');

        setTimeout(() => {
            overlay.style.display = 'none';
        }, 200);
    };

    /* =========================
       MODAL KONFIRMASI
       ========================= */
    window.showHC32Confirm = (title, message, onConfirm) => {

        const overlay = document.getElementById('hc32-global-overlay');

        document.getElementById('hc32-spinner-box').style.display = 'none';

        const iconBox = document.getElementById('hc32-status-icon-box');
        iconBox.style.display = 'flex';

        document.getElementById('hc32-status-icon').className = 'ri-question-mark';

        iconBox.style.background = '#fef3c7';
        iconBox.style.color = '#d97706';

        document.getElementById('hc32-status-title').textContent = title;
        document.getElementById('hc32-status-desc').innerHTML = message;

        const btn = document.getElementById('hc32-status-btn');

        btn.style.display = 'block';
        btn.textContent = 'Ya, Keluar';

        btn.onclick = () => {
            hideHC32Status();

            if (onConfirm) onConfirm();
        };

        overlay.style.display = 'flex';

        void overlay.offsetWidth;

        overlay.classList.add('active');
    };

    /* =========================
       HEADER
       ========================= */
    const logoSrc = "https://drive.google.com/thumbnail?id=1kb_yesHbnVPtCrjzlWZGD_XXtfQoaLEe&sz=w400";

    let headerEl = document.querySelector('.admin-header');

    if (!headerEl) {
        headerEl = document.createElement('header');
        headerEl.className = 'admin-header';
        document.body.prepend(headerEl);
    }

    headerEl.innerHTML = `
        <div class="header-left">
            <button class="menu-btn" id="sidebar-toggle">
                <i class="ri-menu-2-line"></i>
            </button>

            <img src="${logoSrc}" class="header-logo">
        </div>

        <div class="header-right">
            <div class="session-timer">
                <i class="ri-time-line"></i>
                <span id="header-timer">--:--:--</span>
            </div>

            <button class="header-icon-btn">
                <i class="ri-notification-3-line"></i>
                <span class="notif-badge"></span>
            </button>
        </div>
    `;

    fetchHeaderData();
}

/* =========================
   FETCH HEADER DATA
   ========================= */
async function fetchHeaderData() {

    const token = new URLSearchParams(window.location.search).get('token');

    if (!token) return;

    try {

        const response = await hc32_post('getSessionInfo', {
            token: token
        });

        if (response.status === 'ok') {

            const data = response.data;

            localStorage.setItem('hc32_session', JSON.stringify({
                nama: data.nama,
                jabatan: data.jabatan,
                foto: data.foto,
                expiredAt: data.expiredAt
            }));

            if (data.expiredAt) {
                startSessionTimer(new Date(data.expiredAt));
            }
        }

    } catch (e) {
        console.error(e);
    }
}

/* =========================
   TIMER SESSION
   ========================= */
let globalTimerInterval = null;

function startSessionTimer(expiryDate) {

    const timerEl = document.getElementById('header-timer');

    if (!timerEl) return;

    if (globalTimerInterval) {
        clearInterval(globalTimerInterval);
    }

    const update = () => {

        const now = new Date();

        const diff = expiryDate - now;

        if (diff <= 0) {

            timerEl.textContent = "00:00:00";
            timerEl.style.color = "var(--hc-red)";

            clearInterval(globalTimerInterval);

            // AUTO LOGOUT
            window.showHC32Status(
                'error',
                'Sesi Berakhir',
                'Waktu login Anda telah habis. Mohon login kembali.'
            );

            document.getElementById('hc32-status-btn').onclick = () => {

                localStorage.removeItem('hc32_token');
                localStorage.removeItem('hc32_session');

                window.location.href =
                    '../../keanggotaan/login pengurus/index.html';
            };

            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));

        const minutes = Math.floor(
            (diff % (1000 * 60 * 60)) / (1000 * 60)
        );

        const seconds = Math.floor(
            (diff % (1000 * 60)) / 1000
        );

        if (minutes >= 5 || hours > 0) {

            timerEl.style.color = "var(--hc-green)";
            timerEl.style.fontWeight = "500";

        } else if (minutes >= 2) {

            timerEl.style.color = "var(--hc-yellow)";
            timerEl.style.fontWeight = "bold";

        } else if (minutes >= 1) {

            timerEl.style.color = "var(--hc-orange)";
            timerEl.style.fontWeight = "bold";

        } else {

            timerEl.style.color = "var(--hc-red)";
            timerEl.style.fontWeight = "bold";
        }

        timerEl.textContent =
            (hours > 0
                ? String(hours).padStart(2, '0') + ':'
                : '') +
            String(minutes).padStart(2, '0') +
            ':' +
            String(seconds).padStart(2, '0');
    };

    update();

    globalTimerInterval = setInterval(update, 1000);
}

/* =========================
   LOGOUT
   ========================= */
function confirmLogout(e) {

    e.preventDefault();

    window.showHC32Confirm(
        'Konfirmasi Keluar',
        'Apakah Anda yakin ingin keluar dari Panel Pengurus?',

        async () => {

            const token = localStorage.getItem('hc32_token');

            await hc32_post('logoutAdmin', {
                token: token
            });

            localStorage.removeItem('hc32_token');
            localStorage.removeItem('hc32_session');

            window.location.href =
                '../../keanggotaan/login pengurus/index.html';
        }
    );
}
