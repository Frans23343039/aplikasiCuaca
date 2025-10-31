const express = require('express')
const path = require('path')
const hbs = require('hbs')

// Import fungsi dari folder utils
const geocode = require('./utils/geocode')
const prediksiCuaca = require('./utils/prediksiCuaca')

// Inisialisasi aplikasi express
const app = express()
const port = process.env.PORT || 4000
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

const axios = require('axios')
// Halaman Berita
app.get('/berita', async (req, res) => {
  try {
    const response = await axios.get('http://api.mediastack.com/v1/news', {
      params: {
        access_key: '46b722bafe23f5aa8692634c7f19699f',
        limit: 5,
        sort: 'published_desc', // berita terbaru duluan
      }
    });

    console.log(response.data); // tampilkan hasil di terminal

    if (response.data.error) {
      throw new Error(response.data.error.message);
    }

    const berita = response.data.data;

    res.render('berita', {
      judul: 'Berita Terkini',
      nama: 'Frans Surya Pati Harau',
      berita
    });
  } catch (error) {
    console.error('❌ Gagal mengambil berita:', error.message);
    res.render('berita', {
      judul: 'Berita Terkini',
      nama: 'Frans Surya Pati Harau',
      error: 'Gagal memuat berita. Silakan coba lagi nanti.'
    });
  }
});


// Wildcard umum untuk semua halaman lain
app.get(/.*/, (req, res) => {
    res.render('404', {
        judul: '404',
        nama: 'Frans Surya Pati Harau',
        pesanKesalahan: 'Halaman tidak ditemukan.'
    })
})


app.listen(port, () => {
  console.log('Server berjalan pada port '+ port)
})