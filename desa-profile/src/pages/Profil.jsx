import {
  MapPin, Users, Calendar, Award, BookOpen, Target, Landmark,
  Maximize2, Map, Building2, Camera, TrendingUp, BarChart3,
  GraduationCap, Heart, Briefcase, Home, Activity, UserCheck,
  Baby, Layers, ShieldCheck, Droplets
} from 'lucide-react';
import PageHeaderPhoto from '../components/PageHeaderPhoto';
import { useApp } from '../context/AppContext';
import InteractiveMap from '../components/InteractiveMap';
import {
  BarChart, Bar, PieChart as RechartsPie, Pie, Cell,
  ResponsiveContainer, Legend, Tooltip, XAxis, YAxis,
  CartesianGrid, AreaChart, Area, LineChart, Line
} from 'recharts';

import StatistikCharts from "../components/StatistikCharts";

/* ── colour palette ─────────────────────────────────── */
const C = ['#6366f1','#10b981','#f59e0b','#ef4444','#8b5cf6',
           '#06b6d4','#ec4899','#22c55e','#3b82f6','#a855f7'];

/* ── custom tooltip ─────────────────────────────────── */
const TT = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{background:'#1e293b',border:'none',borderRadius:10,padding:'10px 14px',boxShadow:'0 8px 24px rgba(0,0,0,.25)'}}>
      {label && <p style={{color:'#94a3b8',fontSize:12,margin:'0 0 6px'}}>{label}</p>}
      {payload.map((p,i) => (
        <p key={i} style={{color:p.color||'#fff',fontSize:13,fontWeight:700,margin:'2px 0'}}>
          {p.name}: <span style={{color:'#fff'}}>{Number(p.value).toLocaleString('id-ID')}</span>
        </p>
      ))}
    </div>
  );
};

/* ── bar chart with progress rows ───────────────────── */
const ProgressBar = ({ label, value, max, color, icon }) => (
  <div style={{marginBottom:14}}>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
      <span style={{display:'flex',alignItems:'center',gap:6,fontSize:13,color:'#475569',fontWeight:600}}>
        {icon && <span style={{color}}>{icon}</span>}{label}
      </span>
      <span style={{fontSize:13,fontWeight:800,color:'#172033'}}>{Number(value).toLocaleString('id-ID')}</span>
    </div>
    <div style={{height:8,borderRadius:99,background:'#f1f5f9',overflow:'hidden'}}>
      <div style={{height:'100%',width:`${Math.min((value/max)*100,100)}%`,background:color,borderRadius:99,transition:'width .6s ease'}}/>
    </div>
    <div style={{fontSize:11,color:'#94a3b8',marginTop:3}}>{((value/max)*100).toFixed(1)}%</div>
  </div>
);

/* ── section header ─────────────────────────────────── */
const SecHead = ({ icon, title, sub, color='#6366f1' }) => (
  <div style={{display:'flex',alignItems:'center',gap:12,padding:'18px 22px',borderBottom:'1px solid #eef0f5',background:'#f8fafc'}}>
    <div style={{width:38,height:38,borderRadius:10,background:`${color}18`,color,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
      {icon}
    </div>
    <div>
      <div style={{fontWeight:700,fontSize:15,color:'#172033'}}>{title}</div>
      {sub && <div style={{fontSize:12,color:'#64748b',marginTop:2}}>{sub}</div>}
    </div>
  </div>
);

/* ── stat mini card ─────────────────────────────────── */
const MiniStat = ({ label, value, color, icon }) => (
  <div style={{background:'#fff',borderRadius:14,padding:'16px 18px',border:'1px solid #e8ebf2',boxShadow:'0 3px 10px rgba(0,0,0,.05)',position:'relative',overflow:'hidden'}}>
    <div style={{position:'absolute',top:0,left:0,right:0,height:3,background:color,borderRadius:'14px 14px 0 0'}}/>
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
      <div style={{width:34,height:34,borderRadius:9,background:`${color}15`,color,display:'flex',alignItems:'center',justifyContent:'center'}}>{icon}</div>
    </div>
    <div style={{fontSize:'1.7rem',fontWeight:800,color,lineHeight:1}}>{typeof value==='number'?Number(value).toLocaleString('id-ID'):value}</div>
    <div style={{fontSize:12,color:'#64748b',marginTop:4,fontWeight:600}}>{label}</div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
const Profil = () => {
  const { infoDesa, statistik, warga } = useApp();
  const d = infoDesa || {};
  const s = statistik || {};

  /* ── derive stats from warga sample ─────────────── */
  const total   = warga.length || s.totalPenduduk || 0;
  const lk      = warga.filter(w=>w.jenis_kelamin==='Laki-laki').length   || s.lakiLaki  || 0;
  const pr      = warga.filter(w=>w.jenis_kelamin==='Perempuan').length   || s.perempuan || 0;
  const curYear = new Date().getFullYear();
  const getAge  = w => curYear - parseInt(w.tanggal_lahir?.split('-')[0]||'1990');
  const anak    = warga.filter(w=>getAge(w)<18).length;
  const dewasa  = warga.filter(w=>getAge(w)>=18&&getAge(w)<60).length;
  const lansia  = warga.filter(w=>getAge(w)>=60).length;
  const kk      = s.kk || Math.floor(total/4);

  /* ── education from warga ───────────────────────── */
  const pendMap = {};
  warga.forEach(w=>{ const p=w.pendidikan||'Tidak Sekolah'; pendMap[p]=(pendMap[p]||0)+1; });
  const ORDER_PEND = ['SD','SMP','SMA','Diploma','Sarjana'];
  const pendData = ORDER_PEND.filter(k=>pendMap[k])
    .map(k=>({ name:k, value:pendMap[k] }));

  /* ── jobs from warga ────────────────────────────── */
  const jobMap = {};
  warga.forEach(w=>{ const p=w.pekerjaan||'Lainnya'; jobMap[p]=(jobMap[p]||0)+1; });
  const jobData = Object.entries(jobMap)
    .map(([name,value])=>({name,value}))
    .sort((a,b)=>b.value-a.value).slice(0,8);

  /* ── religion from warga ────────────────────────── */
  const agamaMap = {};
  warga.forEach(w=>{ const a=w.agama||'Islam'; agamaMap[a]=(agamaMap[a]||0)+1; });
  const agamaData = Object.entries(agamaMap)
    .map(([name,value])=>({name,value}));

  /* ── marital status from warga ──────────────────── */
  const nikahMap = {};
  warga.forEach(w=>{ const sp=w.status_perkawinan||'Belum Menikah'; nikahMap[sp]=(nikahMap[sp]||0)+1; });
  const nikahData = Object.entries(nikahMap)
    .map(([name,value])=>({name,value}));

  /* ── age group bar ──────────────────────────────── */
  const ageData = [
    { name:'Anak (<18)',    value:anak },
    { name:'Dewasa (18-59)', value:dewasa },
    { name:'Lansia (60+)',  value:lansia },
  ];

  /* ── pertumbuhan ────────────────────────────────── */
  const growthBase = s.pertumbuhan && s.pertumbuhan.length
    ? s.pertumbuhan
    : [
        { tahun:'2020', jumlah:Math.round(total*.83) },
        { tahun:'2021', jumlah:Math.round(total*.88) },
        { tahun:'2022', jumlah:Math.round(total*.92) },
        { tahun:'2023', jumlah:Math.round(total*.96) },
        { tahun:'2024', jumlah:total },
      ];
  const growthData = growthBase.map(g=>({
    tahun: g.tahun,
    'Total Penduduk': g.jumlah,
    'Laki-laki': Math.round(g.jumlah*(lk/Math.max(total,1))),
    'Perempuan':  Math.round(g.jumlah*(pr/Math.max(total,1))),
  }));

  const genderData = [
  { name: "Laki-laki", value: lk, color: "#3b82f6" },
  { name: "Perempuan", value: pr, color: "#ec4899" },
];

  /* ── kelengkapan admin (from s.kelengkapanAdmin) ── */
  const adminData = s.kelengkapanAdmin ? [
    { name:'KTP',        value:s.kelengkapanAdmin.ktp       },
    { name:'Kartu Keluarga', value:s.kelengkapanAdmin.kk    },
    { name:'Akte Lahir', value:s.kelengkapanAdmin.akteLahir },
    { name:'BPJS',       value:s.kelengkapanAdmin.bpjs      },
  ] : [];

  /* ── status sosial ──────────────────────────────── */
  const sosialData = s.statusSosial ? [
    { name:'Mampu',           value:s.statusSosial.mampu           },
    { name:'Kurang Mampu',    value:s.statusSosial.kurangMampu     },
    { name:'Sangat Kurang',   value:s.statusSosial.sangatKurangMampu },
    { name:'Penerima Bansos', value:s.statusSosial.penerimaBansos  },
  ] : [];

  /* ── kesehatan ──────────────────────────────────── */
  const kes = s.kesehatan || {};
  const kesehatanBpjs = [
    { name:'BPJS Aktif', value: kes.bpjs||0,   color:'#10b981' },
    { name:'Non BPJS',   value: kes.nonBpjs||0, color:'#ef4444' },
  ];

  return (
<>

<style>{`
/* ── profil page ── */
.profil-page{width:100%;min-height:100vh;background:#f5f7fb}
.profil-pg-body{width:100%;padding:40px 20px 80px}
.profil-pg-container{width:100%;max-width:1200px;margin:0 auto}
.profil-layout{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:22px;align-items:start}
.profil-main{display:flex;flex-direction:column;gap:22px;min-width:0}
.profil-sidebar{display:flex;flex-direction:column;gap:18px}
/* ── card ── */
.pc{background:#fff;border-radius:18px;overflow:hidden;border:1px solid #e8ebf2;box-shadow:0 6px 22px rgba(15,23,42,.06)}
/* ── identitas ── */
.id-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px}
.id-item{display:flex;align-items:center;gap:12px;padding:14px;border-radius:12px;background:#f8fafc;border:1px solid #edf0f5}
.id-ico{width:38px;height:38px;border-radius:9px;display:flex;align-items:center;justify-content:center;background:#eef2ff;color:#6366f1;flex-shrink:0}
.id-item label{display:block;color:#64748b;font-size:11px;margin-bottom:3px}
.id-item p{margin:0;color:#172033;font-size:14px;font-weight:700}
/* ── visi misi ── */
.visi-box{padding:18px;border-radius:12px;background:linear-gradient(135deg,#f5f3ff,#eef2ff);border:1px solid #ddd6fe}
.visi-tag{display:flex;align-items:center;gap:7px;color:#7c3aed;font-weight:700;margin-bottom:8px;font-size:13px}
.visi-text{margin:0;color:#374151;line-height:1.8;font-size:14px}
.misi-block{margin-top:20px}
.misi-block h3{display:flex;align-items:center;gap:7px;margin:0 0 14px;color:#172033;font-size:15px}
.misi-list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:10px}
.misi-list li{display:flex;align-items:flex-start;gap:10px;color:#475569;line-height:1.6;font-size:14px}
.misi-num{width:24px;height:24px;border-radius:50%;background:#6366f1;color:white;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;flex-shrink:0}
.sejarah-text{margin:0;color:#475569;line-height:1.9;white-space:pre-line;font-size:14px}
/* ── sidebar ── */
.sw{background:#fff;border:1px solid #e8ebf2;border-radius:16px;overflow:hidden;box-shadow:0 4px 14px rgba(15,23,42,.05)}
.sw-head{display:flex;align-items:center;gap:8px;padding:15px 18px;background:#f8fafc;border-bottom:1px solid #eef0f5;color:#172033;font-weight:700;font-size:13px}
.sw-head svg{color:#6366f1}
.sw-body{padding:14px 18px}
.sw-row{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #f1f5f9}
.sw-row:last-child{border-bottom:none}
.sw-label{color:#64748b;font-size:12px}
.sw-val{color:#172033;font-size:12px;font-weight:700;text-align:right}
.sw-grad{padding:22px;background:linear-gradient(135deg,#6366f1,#8b5cf6);color:white}
.sw-grad-ico{width:46px;height:46px;border-radius:12px;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;margin-bottom:13px}
.sw-grad p{margin:0;line-height:1.7;font-size:13px}
.koor-box{display:flex;justify-content:space-between;align-items:center;padding:10px;margin-bottom:8px;background:#f8fafc;border-radius:9px}
.koor-box:last-child{margin-bottom:0}
.koor-box strong{font-size:12px;color:#64748b}
.koor-box span{font-size:12px;font-weight:700;color:#172033}
/* ── peta ── */
.peta-stat-body{padding:0}
.peta-fbar{display:flex;flex-wrap:wrap;gap:8px;padding:16px 20px;background:#f8fafc;border-bottom:1px solid #e5e7eb}
.pfbtn{display:flex;align-items:center;gap:7px;padding:9px 14px;border:1px solid #dbe1ea;border-radius:9px;background:white;color:#64748b;cursor:pointer;font-weight:600;font-size:13px;transition:.2s}
.pfbtn.active{background:#6366f1;border-color:#6366f1;color:white}
.peta-con{width:100%;height:560px;overflow:hidden;border-radius:0}
.peta-leg{display:flex;flex-wrap:wrap;gap:16px;padding:16px 20px;background:white}
.leg-item{display:flex;align-items:center;gap:7px;font-size:12px;color:#475569}
.leg-dot{width:11px;height:11px;border-radius:50%}
/* ── stats dashboard ── */
.ov-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:14px;margin-bottom:22px}
.charts-wrap{display:flex;flex-direction:column;gap:22px}
.charts-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(340px,1fr));gap:22px}
.chart-box{background:#fff;border-radius:16px;overflow:hidden;border:1px solid #e8ebf2;box-shadow:0 4px 14px rgba(15,23,42,.05)}
.chart-box.full{grid-column:1/-1}
.chart-body{padding:20px}
/* ── progress bars section ── */
.two-col{display:grid;grid-template-columns:1fr 1fr;gap:32px}
/* ── responsive ── */
@media(max-width:900px){
  .profil-layout{grid-template-columns:1fr}
  .profil-sidebar{display:grid;grid-template-columns:repeat(2,1fr)}
  .sw-grad{grid-column:span 2}
}
@media(max-width:640px){
  .profil-pg-body{padding:20px 12px 50px}
  .id-grid{grid-template-columns:1fr}
  .profil-sidebar{display:flex}
  .sw-grad{grid-column:auto}
  .peta-con{height:380px}
  .charts-row{grid-template-columns:1fr}
  .two-col{grid-template-columns:1fr}
}
`}</style>

<div className="profil-page">
  <PageHeaderPhoto
    badgeIcon={<Landmark size={14}/>}
    title="Profil Desa"
    subtitle={`Informasi lengkap tentang ${d.nama||'Desa'}`}
  />
  <div className="profil-pg-body">
    <div className="profil-pg-container profil-layout">

      {/* ─── MAIN COLUMN ─────────────────────────────── */}
      <div className="profil-main">

        {/* IDENTITAS */}
        <div className="pc">
          <SecHead icon={<Landmark size={18}/>} title="Identitas Desa" color="#6366f1"/>
          <div style={{padding:'22px'}}>
            <div className="id-grid">
              {[
                {ico:<Landmark size={16}/>, label:'Nama Desa',        val:d.nama},
                {ico:<MapPin size={16}/>,   label:'Kecamatan',         val:d.kecamatan},
                {ico:<MapPin size={16}/>,   label:'Kota/Kabupaten',    val:d.kota},
                {ico:<MapPin size={16}/>,   label:'Provinsi',          val:d.provinsi},
                {ico:<Calendar size={16}/>, label:'Tahun Berdiri',     val:d.tahunBerdiri},
                {ico:<Users size={16}/>,    label:'Jumlah Penduduk',
                  val:total?`${Number(total).toLocaleString('id-ID')} Jiwa`:'-'},
              ].map((item,i)=>(
                <div className="id-item" key={i}>
                  <div className="id-ico">{item.ico}</div>
                  <div>
                    <label>{item.label}</label>
                    <p>{item.val||'-'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* VISI MISI */}
        <div className="pc">
          <SecHead icon={<Target size={18}/>} title="Visi & Misi" color="#d97706"/>
          <div style={{padding:'22px'}}>
            <div className="visi-box">
              <div className="visi-tag"><Award size={14}/><span>Visi</span></div>
              <p className="visi-text">{d.visi||'-'}</p>
            </div>
            <div className="misi-block">
              <h3><Target size={16}/>Misi</h3>
              <ul className="misi-list">
                {(d.misi||[]).map((item,i)=>(
                  <li key={i}><span className="misi-num">{i+1}</span><span>{item}</span></li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* SEJARAH */}
        <div className="pc">
          <SecHead icon={<BookOpen size={18}/>} title="Sejarah Desa" color="#16a34a"/>
          <div style={{padding:'22px'}}>
            <p className="sejarah-text">{d.sejarah||'-'}</p>
          </div>
        </div>


        {/* ══════════════════════════════════════════════
            STATISTIK KEPENDUDUKAN - FULL DASHBOARD
        ══════════════════════════════════════════════ */}
        <div className="pc">
          <SecHead
            icon={<BarChart3 size={18}/>}
            title="Statistik Kependudukan"
            sub={`Data real-time dari ${total} warga tercatat`}
            color="#6366f1"
          />
          <div style={{padding:'22px'}}>

            {/* ── Overview numbers ── */}
            <StatistikCharts
    total={total}
    lk={lk}
    pr={pr}
    anak={anak}
    dewasa={dewasa}
    lansia={lansia}
    kk={kk}
    growthData={growthData}
    pendData={pendData}
    jobData={jobData}
    ageData={ageData}
    agamaData={agamaData}
    nikahData={nikahData}
    adminData={adminData}
    sosialData={sosialData}
    kesehatanBpjs={kesehatanBpjs}
    statistik={s}
/>
          </div>{/* end card-body */}
        </div>{/* end stats card */}


        {/* ── PETA INTERAKTIF ── */}
        <div className="pc peta-statistik-card">
          <SecHead icon={<Map size={18}/>}
            title="Peta Statistik Wilayah"
            sub={`Peta interaktif batas wilayah, fasilitas umum dan CCTV Desa ${d.nama||''}`}
            color="#2563eb"/>
          <div className="peta-stat-body">
            <div className="peta-fbar">
              <button className="pfbtn active" type="button"><Map size={15}/>Batas RW / RT</button>
              <button className="pfbtn active" type="button"><Building2 size={15}/>Fasilitas</button>
              <button className="pfbtn active" type="button"><Camera size={15}/>CCTV</button>
            </div>
            <div className="peta-con">
              <InteractiveMap/>
            </div>
            <div className="peta-leg">
              <div className="leg-item"><span className="leg-dot" style={{background:'#3b82f6'}}/> Batas Wilayah</div>
              <div className="leg-item"><span className="leg-dot" style={{background:'#06b6d4'}}/> Fasilitas Umum</div>
              <div className="leg-item"><span className="leg-dot" style={{background:'#ec4899'}}/> CCTV</div>
              <div className="leg-item"><span className="leg-dot" style={{background:'#ef4444'}}/> Status Darurat</div>
            </div>
          </div>
        </div>

      </div>{/* end profil-main */}


      {/* ─── SIDEBAR ─────────────────────────────────── */}
      <aside className="profil-sidebar">

        {/* Data Wilayah */}
        <div className="sw">
          <div className="sw-head"><Maximize2 size={14}/><span>Data Wilayah</span></div>
          <div className="sw-body">
            {[
              ['Luas Wilayah', d.luas||'-'],
              ['Kode Pos',     d.kodePos||'-'],
              ['Kepala Desa',  d.kepala||'-'],
              ['Penduduk',     total?`${Number(total).toLocaleString('id-ID')} Jiwa`:'-'],
              ['KK',           kk?`${Number(kk).toLocaleString('id-ID')} KK`:'-'],
            ].map(([l,v])=>(
              <div className="sw-row" key={l}>
                <span className="sw-label">{l}</span>
                <span className="sw-val">{v}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Batas Wilayah */}
        <div className="sw">
          <div className="sw-head"><MapPin size={14}/><span>Batas Wilayah</span></div>
          <div className="sw-body">
            {[['Utara',d.batasDesa?.utara],['Selatan',d.batasDesa?.selatan],
              ['Timur',d.batasDesa?.timur],['Barat',d.batasDesa?.barat]].map(([a,v])=>(
              <div className="sw-row" key={a}>
                <span className="sw-label">{a}</span>
                <span className="sw-val">{v||'-'}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info gradient */}
        <div className="sw sw-grad">
          <div className="sw-grad-ico"><Award size={24}/></div>
          <p>Berdiri sejak <strong>{d.tahunBerdiri||'-'}</strong>, desa ini terus berkembang dengan semangat gotong royong.</p>
        </div>

        {/* Koordinat */}
        <div className="sw">
          <div className="sw-head"><MapPin size={14}/><span>Koordinat Desa</span></div>
          <div className="sw-body">
            <div className="koor-box"><strong>Latitude</strong><span>{d.koordinat?.lat||'-'}</span></div>
            <div className="koor-box"><strong>Longitude</strong><span>{d.koordinat?.lng||'-'}</span></div>
          </div>
        </div>

        {/* Ringkasan Statistik Sidebar */}
        {total>0 && (
          <div className="sw">
            <div className="sw-head"><BarChart3 size={14}/><span>Ringkasan Statistik</span></div>
            <div className="sw-body">
              {[
                ['Laki-laki', `${lk} jiwa (${((lk/Math.max(total,1))*100).toFixed(0)}%)`],
                ['Perempuan', `${pr} jiwa (${((pr/Math.max(total,1))*100).toFixed(0)}%)`],
                ['Usia Produktif', `${dewasa} jiwa`],
                ['Anak-anak', `${anak} jiwa`],
                ['Lansia', `${lansia} jiwa`],
                ...(kes.bpjs?[['BPJS Kesehatan', `${Number(kes.bpjs).toLocaleString('id-ID')} jiwa`]]:[]),
                ...(s.infrastruktur?.sekolah?[['Sekolah', `${s.infrastruktur.sekolah} unit`]]:[]),
                ...(s.infrastruktur?.posyandu?[['Posyandu', `${s.infrastruktur.posyandu} unit`]]:[]),
              ].map(([l,v])=>(
                <div className="sw-row" key={l}>
                  <span className="sw-label">{l}</span>
                  <span className="sw-val">{v}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </aside>

    </div>{/* end profil-layout */}
  </div>{/* end profil-pg-body */}
</div>{/* end profil-page */}

</>
  );
};

export default Profil;
