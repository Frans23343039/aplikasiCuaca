const request = require('postman-request')

// Fungsi untuk mendapatkan info cuaca dari koordinat
const prediksiCuaca = (latitude, longitude, callback) => {
    const url = 'http://api.weatherstack.com/current?access_key=307c0fb6d3b8a31ddd3ecc52d712876d&query=' + latitude + ',' + longitude

    request({ url: url, json: true }, (error, response) => {
        if (error) {
            callback('Tidak dapat terhubung ke layanan cuaca!', undefined)
        } else if (response.body.error) {
            callback('Tidak dapat menemukan lokasi cuaca tersebut.', undefined)
        } else {
            const data = response.body.current
            callback(undefined, {
                deskripsi: data.weather_descriptions[0],
                suhu: data.temperature,
                terasa: data.feelslike,
                kelembapan: data.humidity
            })
        }
    })
}

module.exports = prediksiCuaca