import {
  Map,
  Building2,
  Camera,
  Lightbulb,
  AlertTriangle
} from 'lucide-react';


// ======================================================
// SIDEBAR PETA
// ======================================================

const MapSidebar = ({

  showWilayah,

  showAsset,

  showCctv,

  setShowWilayah,

  setShowAsset,

  setShowCctv

}) => {


  return (

    <aside className="map-sidebar">


      {/* ====================================== */}
      {/* HEADER */}
      {/* ====================================== */}

      <div className="sidebar-header">

        <h2>
          Peta Wilayah Interaktif
        </h2>

        <p>
          Filter tampilan batas administrasi
          dan infrastruktur wilayah.
        </p>

      </div>


      {/* ====================================== */}
      {/* STATUS DARURAT */}
      {/* ====================================== */}

      <div className="danger-box">

        <div className="danger-title">

          <AlertTriangle size={18} />

          <span>
            Status Darurat Aktif!
          </span>

        </div>


        <p>

          Tombol darurat ditekan dari
          perumahan warga. Segera periksa
          titik merah di peta.

        </p>


        <button
          type="button"
          onClick={() => {
            alert(
              'Status alarm dimatikan'
            );
          }}
        >

          Matikan Alarm

        </button>

      </div>


      {/* ====================================== */}
      {/* FILTER WILAYAH */}
      {/* ====================================== */}

      <button

        type="button"

        className={`
          filter-button
          wilayah
          ${showWilayah ? 'active' : ''}
        `}

        onClick={() =>
          setShowWilayah(
            !showWilayah
          )
        }

      >

        <Map size={18} />

        <span>
          Batas RW & RT
        </span>

      </button>


      {/* ====================================== */}
      {/* FILTER ASET */}
      {/* ====================================== */}

      <button

        type="button"

        className={`
          filter-button
          asset
          ${showAsset ? 'active' : ''}
        `}

        onClick={() =>
          setShowAsset(
            !showAsset
          )
        }

      >

        <Building2 size={18} />

        <span>
          Fasilitas Umum (Aset)
        </span>

      </button>


      {/* ====================================== */}
      {/* FILTER CCTV */}
      {/* ====================================== */}

      <button

        type="button"

        className={`
          filter-button
          cctv
          ${showCctv ? 'active' : ''}
        `}

        onClick={() =>
          setShowCctv(
            !showCctv
          )
        }

      >

        <Camera size={18} />

        <span>
          CCTV Pengawas
        </span>

      </button>


      {/* ====================================== */}
      {/* PJU */}
      {/* ====================================== */}

      <button

        type="button"

        className="
          filter-button
          pju
        "

        onClick={() => {

          alert(
            'Layer PJU belum tersedia'
          );

        }}

      >

        <Lightbulb size={18} />

        <span>
          PJU (Penerangan)
        </span>

      </button>


    </aside>

  );

};


export default MapSidebar;