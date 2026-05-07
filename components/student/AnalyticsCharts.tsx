"use client";

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";

interface StudentAnalyticsProps {
  data: { date: string; minutes: number; xp: number }[];
}

export function StudyTimeChart({ data }: StudentAnalyticsProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-secondary)" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="var(--color-secondary)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 10, fontWeight: "bold" }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 10, fontWeight: "bold" }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "var(--color-card)", 
              border: "1px solid var(--color-border)",
              borderRadius: "16px",
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)"
            }}
            labelStyle={{ fontWeight: "black", color: "var(--color-primary)", marginBottom: "4px" }}
          />
          <Area 
            type="monotone" 
            dataKey="minutes" 
            stroke="var(--color-secondary)" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorMinutes)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function XpPerformanceChart({ data }: StudentAnalyticsProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 10, fontWeight: "bold" }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "var(--color-muted-foreground)", fontSize: 10, fontWeight: "bold" }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "var(--color-card)", 
              border: "1px solid var(--color-border)",
              borderRadius: "16px"
            }}
            cursor={{ fill: "var(--color-muted)", opacity: 0.4 }}
          />
          <Bar dataKey="xp" radius={[6, 6, 0, 0]} barSize={24}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index === data.length - 1 ? "var(--color-accent)" : "var(--color-accent)/40"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
