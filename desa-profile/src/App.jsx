import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from 'react-router-dom';
import 'leaflet/dist/leaflet.css';

import { AppProvider } from './context/AppContext';

import ErrorBoundary from './components/ErrorBoundary';


// ======================================================
// PUBLIC COMPONENTS
// ======================================================

import Navbar from './components/Navbar';

import Footer from './components/Footer';


// ======================================================
// PUBLIC PAGES
// ======================================================

import Home from './pages/Home';

import Profil from './pages/Profil';

import Anggota from './pages/Anggota';

import Statistik from './pages/Statistik';

import Berita from './pages/Berita';

import UMKM from './pages/UMKM';

import PengajuanDokumen
  from './pages/PengajuanDokumen';

import PetaInteraktif
  from './pages/PetaInteraktif';




// ======================================================
// ADMIN COMPONENTS
// ======================================================

import Login
  from './pages/admin/Login';

import AdminLayout
  from './components/admin/AdminLayout';

import ProtectedRoute
  from './components/admin/ProtectedRoute';


// ======================================================
// ADMIN PAGES
// ======================================================

import Dashboard
  from './pages/admin/Dashboard';

import AdminWarga
  from './pages/admin/AdminWarga';

import AdminAparat
  from './pages/admin/AdminAparat';

import AdminStatistik
  from './pages/admin/AdminStatistik';

import AdminBerita
  from './pages/admin/AdminBerita';

import AdminUmkm
  from './pages/admin/AdminUmkm';

import AdminLaporan
  from './pages/admin/AdminLaporan';

import AdminCctv
  from './pages/admin/AdminCctv';

import AdminPengajuanDokumen
  from './pages/admin/AdminPengajuanDokumen';

import AdminPeta
  from './pages/admin/AdminPeta';


// ======================================================
// GLOBAL CSS
// ======================================================

import './App.css';

import './admin.css';

import './cctv-pengaduan.css';


// ======================================================
// BACKGROUND
// ======================================================

import BackgroundBlobs
  from './components/BackgroundBlobs';


// ======================================================
// PUBLIC LAYOUT
// ======================================================

function PublicLayout({ children }) {

  return (

    <div className="app">

      {/* Background dekorasi */}

      <BackgroundBlobs />


      {/* Navbar */}

      <Navbar />


      {/* Konten halaman */}

      <main className="main-content">

        {children}

      </main>


      {/* Footer */}

      <Footer />

    </div>

  );

}


// ======================================================
// APP
// ======================================================

export default function App() {

  return (

    <AppProvider>

      <ErrorBoundary>

        <Router>

          <Routes>


            {/* ==================================================
                PUBLIC
            ================================================== */}


            {/* BERANDA */}

            <Route

              path="/"

              element={

                <PublicLayout>

                  <Home />

                </PublicLayout>

              }

            />


            {/* PROFIL DESA */}

            <Route

              path="/profil"

              element={

                <PublicLayout>

                  <Profil />

                </PublicLayout>

              }

            />


            {/* ANGGOTA / APARAT DESA */}

            <Route

              path="/anggota"

              element={

                <PublicLayout>

                  <Anggota />

                </PublicLayout>

              }

            />


            {/* STATISTIK */}

            <Route

              path="/statistik"

              element={

                <PublicLayout>

                  <Statistik />

                </PublicLayout>

              }

            />


            {/* BERITA */}

            <Route

              path="/berita"

              element={

                <PublicLayout>

                  <Berita />

                </PublicLayout>

              }

            />


            {/* UMKM */}

            <Route

              path="/umkm"

              element={

                <PublicLayout>

                  <UMKM />

                </PublicLayout>

              }

            />


            {/* PENGAJUAN DOKUMEN */}

            <Route

              path="/pengajuan-dokumen"

              element={

                <PublicLayout>

                  <PengajuanDokumen />

                </PublicLayout>

              }

            />


            {/* ==================================================
                PETA WILAYAH INTERAKTIF
            ================================================== */}

            <Route
              path="/peta"
              element={
                <PublicLayout>
                  <PetaInteraktif />
                </PublicLayout>
              }
            />

          


            {/* ==================================================
                ADMIN LOGIN
            ================================================== */}

            <Route

              path="/admin/login"

              element={

                <Login />

              }

            />


            {/* ==================================================
                ADMIN DASHBOARD
            ================================================== */}

            <Route

              path="/admin"

              element={

                <ProtectedRoute>

                  <AdminLayout />

                </ProtectedRoute>

              }

            >

              {/* Redirect /admin ke dashboard */}

              <Route

                index

                element={

                  <Navigate

                    to="/admin/dashboard"

                    replace

                  />

                }

              />


              {/* DASHBOARD */}

              <Route

                path="dashboard"

                element={

                  <Dashboard />

                }

              />


              {/* DATA WARGA */}

              <Route

                path="warga"

                element={

                  <AdminWarga />

                }

              />


              {/* APARAT DESA */}

              <Route

                path="aparat"

                element={

                  <AdminAparat />

                }

              />


              {/* STATISTIK ADMIN */}

              <Route

                path="statistik"

                element={

                  <AdminStatistik />

                }

              />


              {/* KELOLA BERITA */}

              <Route

                path="berita"

                element={

                  <AdminBerita />

                }

              />


              {/* KELOLA UMKM */}

              <Route

                path="umkm"

                element={

                  <AdminUmkm />

                }

              />


              {/* LAPORAN */}

              <Route

                path="laporan"

                element={

                  <AdminLaporan />

                }

              />


              {/* CCTV */}

              <Route

                path="cctv"

                element={

                  <AdminCctv />

                }

              />


              {/* PENGAJUAN DOKUMEN ADMIN */}

              <Route

                path="pengajuan-dokumen"

                element={

                  <AdminPengajuanDokumen />

                }

              />


              {/* PETA ADMIN */}

              <Route

                path="peta"

                element={

                  <AdminPeta />

                }

              />

            </Route>


            {/* ==================================================
                FALLBACK
            ================================================== */}

            <Route

              path="*"

              element={

                <Navigate

                  to="/"

                  replace

                />

              }

            />


          </Routes>

        </Router>

      </ErrorBoundary>

    </AppProvider>

  );

}