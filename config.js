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
        // Menggunakan text/plain untuk menghindari CORS preflight
        'Content-Type': 'text/plain',
      },
      body: JSON.stringify(payload)
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
 * Menyimpan semua data yang diperlukan.
 */
function hc32_saveSession(token, nama, jabatan, foto) {
  localStorage.setItem('adminToken', token);
  localStorage.setItem('adminNama', nama);
  localStorage.setItem('adminJabatan', jabatan || 'Admin');
  localStorage.setItem('adminFoto', foto || '');
}

/**
 * Menghapus sesi admin dari localStorage dan redirect ke halaman login.
 * Menggunakan URL absolut ke domain utama.
 */
function hc32_logout() {
  localStorage.removeItem('adminToken');
  localStorage.removeItem('adminNama');
  localStorage.removeItem('adminJabatan');
  localStorage.removeItem('adminFoto');
  // Redirect ke halaman login menggunakan URL absolut
  window.location.href = 'https://www.historyclub32.or.id/keanggotaan/login%20pengurus/index.html';
}
