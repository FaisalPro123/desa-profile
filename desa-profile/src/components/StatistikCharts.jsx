import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  AreaChart,
  Area
} from "recharts";

const COLORS = [
  "#10b981",
  "#3b82f6",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#06b6d4"
];

export default function StatistikCharts({
  total,
  lk,
  pr,
  anak,
  dewasa,
  lansia,
  kk,
  growthData,
  pendData,
  jobData,
  ageData,
  agamaData,
  nikahData,
  adminData,
  sosialData,
  kesehatanBpjs,
  statistik
}) {

  const genderData = [
    { name: "Laki-laki", value: lk },
    { name: "Perempuan", value: pr }
  ];

  return (
    <div style={{
      display:"grid",
      gridTemplateColumns:"repeat(auto-fit,minmax(450px,1fr))",
      gap:"20px"
    }}>

      {/* LINE */}
      <div className="chart-box">
        <h3>Trend Pertumbuhan Penduduk</h3>

        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={growthData}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="tahun"/>
            <YAxis/>
            <Tooltip/>
            <Legend/>

            <Line
              type="monotone"
              dataKey="Total Penduduk"
              stroke="#10b981"
              strokeWidth={4}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* BAR */}
      <div className="chart-box">
        <h3>Kelompok Umur</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ageData}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="name"/>
            <YAxis/>
            <Tooltip/>

            <Bar
              dataKey="value"
              fill="#10b981"
              radius={[6,6,0,0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* PIE */}
      <div className="chart-box">
        <h3>Jenis Kelamin</h3>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>

            <Pie
              data={genderData}
              dataKey="value"
              outerRadius={100}
              label
            >
              {genderData.map((e,i)=>(
                <Cell
                  key={i}
                  fill={COLORS[i]}
                />
              ))}
            </Pie>

            <Tooltip/>
            <Legend/>

          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* AREA */}
      <div className="chart-box">
        <h3>Pendidikan</h3>

        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={pendData}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="name"/>
            <YAxis/>
            <Tooltip/>

            <Area
              type="monotone"
              dataKey="value"
              stroke="#3b82f6"
              fill="#93c5fd"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* BAR */}
      <div className="chart-box">
        <h3>Pekerjaan</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={jobData}>
            <CartesianGrid strokeDasharray="3 3"/>
            <XAxis dataKey="name"/>
            <YAxis/>
            <Tooltip/>

            <Bar
              dataKey="value"
              fill="#f59e0b"
              radius={[6,6,0,0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );

}