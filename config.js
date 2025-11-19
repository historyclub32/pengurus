/* ==========================================================
 * * FILE KONFIGURASI (config.js)
 * ========================================================== */

// ▼▼▼ URL INI SUDAH BENAR (sesuai tes Anda) ▼▼▼
const GAS_URL = 'https://script.google.com/macros/s/AKfycbz22NwYQ-WJwmdieMgzQxw1I2lXKTghebFO-oSY-wE_av-3oEYIi9TfSCqJCpy3iZKt/exec';
// ▲▲▲ URL INI SUDAH BENAR (sesuai tes Anda) ▲▲▲


/**
 * Fungsi utama untuk mengirim data ke Google Apps Script.
 * @param {string} action - Nama fungsi/case di backend
 * @param {object} body - Data yang akan dikirim
 * @returns {Promise<object>} - Hasil JSON dari backend
 */
async function hc32_post(action, body = {}) {
  const payload = { ...body, action: action };

  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        // --- ▼▼▼ INI ADALAH PERUBAHANNYA ▼▼▼ ---
        // Kita ubah dari 'application/json' ke 'text/plain'
        // untuk menghindari error CORS preflight.
        'Content-Type': 'text/plain', 
        // --- ▲▲▲ BATAS PERUBAHAN ▲▲▲ ---
      },
      body: JSON.stringify(payload) // Isinya tetap JSON string
    });

    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const result = await response.json();

    if (result.status === 'error' && result.message === 'Sesi tidak valid') {
      alert('Sesi Anda telah berakhir. Silakan login kembali.');
      hc32_logout(); 
      return null;
    }
    
    return result;

  } catch (error) {
    console.error(`Error during hc32_post (action: ${action}):`, error);
    if (document.getElementById("hc32-loading-overlay")) {
      document.getElementById("hc32-loading-overlay").innerText = `Error: ${error.message}`;
    }
    return { status: 'error', message: error.message, data: [] };
  }
}

/**
 * Mengambil sesi (token, nama, jabatan, foto) admin dari localStorage.
 */
function hc32_getSession() {
  return {
    token: localStorage.getItem('adminToken'),
    nama: localStorage.getItem('adminNama'),
    jabatan: localStorage.getItem('adminJabatan'),
    foto: localStorage.getItem('adminFoto')
  };
}

/**
 * Menyimpan sesi admin ke localStorage (dipakai di halaman login).
 */
function hc32_saveSession(token, nama, jabatan, foto) {
  localStorage.setItem('adminToken', token);
  localStorage.setItem('adminNama', nama);
  localStorage.setItem('adminJabatan', jabatan || 'Admin');
  localStorage.setItem('adminFoto', foto || '');
}

/**
 * Menghapus sesi admin dari localStorage dan redirect ke halaman login.
 */
function hc32_logout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminNama');
  localStorage.removeItem('adminJabatan');
  localStorage.removeItem('adminFoto');
  // Arahkan ke halaman login Anda
  window.location.href = 'https://sites.google.com/view/historyclub32/keanggotaan/login-pengurus'; 
}

/**
 * Menyimpan sesi admin ke localStorage (dipakai di halaman login).
 */
function hc32_saveSession(token, nama) {
  localStorage.setItem('adminToken', token);
  localStorage.setItem('adminNama', nama);
}

/**
 * Menghapus sesi admin dari localStorage dan redirect ke halaman login.
 */
function hc32_logout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminNama');
  window.location.href = 'https://sites.google.com/view/historyclub32/keanggotaan/login-pengurus'; 
}
