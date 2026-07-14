import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from "recharts";

interface UptimeChartProps {
  currentUptime: number;
}

export default function UptimeChart({ currentUptime }: UptimeChartProps) {
  // Generate mock history based on active value
  // Supõe que a empresa melhorou gradualmente até o valor atual
  const startVal = Math.max(98.0, currentUptime - 1.25);
  const data = Array.from({ length: 6 }, (_, i) => {
    const factor = i / 5;
    const val = startVal + (currentUptime - startVal) * factor;
    return {
      name: i === 5 ? "Mês Atual" : `Mês -${5 - i}`,
      "Disponibilidade (%)": parseFloat(val.toFixed(2)),
    };
  });

  return (
    <div className="w-full h-64 mt-2" id="uptime-chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorUptime" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2edf7" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: "#64748b", fontSize: 11 }} 
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            domain={[97.5, 100]} 
            tick={{ fill: "#64748b", fontSize: 11 }} 
            tickLine={false}
            axisLine={false}
            tickFormatter={(tick) => `${tick}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2edf7",
              borderRadius: "12px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
            }}
            formatter={(value: number) => [`${value.toFixed(2)}%`, "Disponibilidade"]}
          />
          <Area
            type="monotone"
            dataKey="Disponibilidade (%)"
            stroke="#1a4a8b"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorUptime)"
            dot={{ r: 4, stroke: "#10b981", strokeWidth: 2, fill: "#ffffff" }}
            activeDot={{ r: 6 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
