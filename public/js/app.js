console.log('Client-side JavaScript berhasil dimuat!')

// Tangkap elemen dari form dan input
const cuacaForm = document.querySelector('form')
const search = document.querySelector('input')
const pesan1 = document.querySelector('#pesan-1')
const pesan2 = document.querySelector('#pesan-2')

// Event ketika form di-submit
cuacaForm.addEventListener('submit', (e) => {
    e.preventDefault() // mencegah halaman reload otomatis

    const lokasi = search.value

    pesan1.textContent = 'Sedang mengambil data cuaca...'
    pesan2.textContent = ''

    // Panggil endpoint /infoCuaca dengan query parameter address
    fetch('/infoCuaca?address=' + lokasi).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                pesan1.textContent = data.error
            } else {
                pesan1.textContent = data.lokasi
                pesan2.textContent = data.prediksi
            }
        })
    })
})