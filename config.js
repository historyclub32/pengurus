/* ==========================================================
 * *             FILE KONFIGURASI (config.js)
 *             
 * ========================================================== */

// ▼▼▼ GANTI DENGAN URL WEB APP ANDA YANG SUDAH DIDEPLOY ▼▼▼
const GAS_URL = 'https://script.google.com/macros/s/AKfycbzRJr31SeGSAG1uJcVTboTTfH-RNswG5P7z0zsPljNUvW-vTVClGJgKjxYgvAv1Jy8lTw/exec';
// ▲▲▲ GANTI DENGAN URL WEB APP ANDA YANG SUDAH DIDEPLOY ▲▲▲


/**
 * Fungsi utama untuk mengirim data ke Google Apps Script.
 * @param {string} action - Nama fungsi/case di backend (mis: 'listAnggotaAdmin')
 * @param {object} body - Data yang akan dikirim (mis: { token: '123' })
 * @returns {Promise<object>} - Hasil JSON dari backend
 */
async function hc32_post(action, body = {}) {
  // Gabungkan 'action' ke dalam 'body' untuk payload akhir
  const payload = { ...body, action: action };

  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });

    // Cek jika fetch gagal (mis: server down, CORS, dll)
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }

    const result = await response.json();

    // Cek jika backend melempar error sesi tidak valid
    if (result.status === 'error' && result.message === 'Sesi tidak valid') {
      alert('Sesi Anda telah berakhir. Silakan login kembali.');
      hc32_logout(); // Panggil fungsi logout
      return null; // Hentikan eksekusi
    }
    
    // Kembalikan hasil penuh
    return result;

  } catch (error) {
    console.error(`Error during hc32_post (action: ${action}):`, error);
    // Tampilkan error ke admin
    if (document.getElementById("hc32-loading-overlay")) {
      document.getElementById("hc32-loading-overlay").innerText = `Error: ${error.message}`;
    }
    // Kembalikan struktur error yang aman
    return { status: 'error', message: error.message, data: [] };
  }
}

/**
 * Mengambil sesi (token & nama) admin dari localStorage.
 * Ini adalah fungsi yang HILANG dan menyebabkan error.
 * @returns {object} - { token: string|null, nama: string|null }
 */
function hc32_getSession() {
  return {
    token: localStorage.getItem('adminToken'),
    nama: localStorage.getItem('adminNama')
  };
}

/**
 * Menyimpan sesi admin ke localStorage (dipakai di halaman login).
 * @param {string} token - Token yang didapat dari backend
 * @param {string} nama - Nama admin yang login
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
  // Arahkan ke halaman login Anda
  window.location.href = 'https://sites.google.com/view/history-club-32/keanggotaan/login-pengurus'; 
}
