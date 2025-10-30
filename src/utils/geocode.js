const request = require('postman-request')

// Fungsi untuk mendapatkan koordinat dari nama kota
const geocode = (address, callback) => {
    const url = 'http://api.positionstack.com/v1/forward?access_key=1cebf5a9dcbb22702870c48c94f92274&query=' + encodeURIComponent(address)

    request({ url: url, json: true }, (error, response) => {
        if (error) {
            callback('Tidak dapat terhubung ke layanan geocoding!', undefined)
        } else if (response.body.error || response.body.data.length === 0) {
            callback('Lokasi tidak ditemukan. Coba masukkan nama kota yang benar.', undefined)
        } else {
            const data = response.body.data[0]
            callback(undefined, {
                latitude: data.latitude,
                longitude: data.longitude,
                lokasi: data.label
            })
        }
    })
}

module.exports = geocode