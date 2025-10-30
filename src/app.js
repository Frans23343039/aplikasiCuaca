const express = require('express')
const path = require('path')
const hbs = require('hbs')

// Import fungsi dari folder utils
const geocode = require('./utils/geocode')
const prediksiCuaca = require('./utils/prediksiCuaca')

// Inisialisasi aplikasi express
const app = express()

// Tentukan direktori public, views, dan partials
const direktoriPublic = path.join(__dirname, '../public')
const direktoriViews = path.join(__dirname, '../templates/views')
const direktoriPartials = path.join(__dirname, '../templates/partials')

// Setting view engine & lokasi views
app.set('view engine', 'hbs')
app.set('views', direktoriViews)
hbs.registerPartials(direktoriPartials)

// Aktifkan akses file statis
app.use(express.static(direktoriPublic))

// Routes
app.get('/', (req, res) => {
  res.render('index', {
    judul: 'Aplikasi Cek Cuaca',
    nama: 'Frans Surya Pati Harau'
  })
})

app.get('/tentang', (req, res) => {
  res.render('tentang', {
    judul: 'Tentang Saya',
    nama: 'Frans Surya Pati Harau'
  })
})

app.get('/bantuan', (req, res) => {
  res.render('bantuan', { 
    teksBantuan: 'Ini adalah teks bantuan',
    nama: 'Frans Surya Pati Harau'
  })
})

app.get('/infoCuaca', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Kamu harus memasukan lokasi yang ingin dicari'
        })
    }

    geocode(req.query.address, (error, dataGeocode) => {
        if (error) {
            return res.send({ error })
        }

        prediksiCuaca(dataGeocode.latitude, dataGeocode.longitude, (error, dataCuaca) => {
            if (error) {
                return res.send({ error })
            }

            res.send({
                lokasi: dataGeocode.lokasi,
                prediksi: dataCuaca.deskripsi,
                suhu: dataCuaca.suhu,
                terasa: dataCuaca.terasa,
                address: req.query.address
            })
        })
    })
})

// Wildcard khusus halaman bantuan
app.get(/^\/bantuan\/.*/, (req, res) => {
    res.render('404', {
        judul: '404',
        nama: 'Frans Surya Pati Harau',
        pesanKesalahan: 'Artikel yang dicari tidak ditemukan.'
    })
})

// Wildcard umum untuk semua halaman lain
app.get(/.*/, (req, res) => {
    res.render('404', {
        judul: '404',
        nama: 'Frans Surya Pati Harau',
        pesanKesalahan: 'Halaman tidak ditemukan.'
    })
})


app.listen(4000, () => {
  console.log('Server berjalan pada port 4000.')
})
