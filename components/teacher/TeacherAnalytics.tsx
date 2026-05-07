"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts";

interface TeacherAnalyticsProps {
  data: { name: string; students: number; avgFocus: number; totalTime: number }[];
}

export function ClassPerformanceChart({ data }: TeacherAnalyticsProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="var(--color-border)" />
          <XAxis type="number" hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: "var(--color-primary)", fontSize: 12, fontWeight: "black" }}
            width={100}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "var(--color-card)", 
              border: "1px solid var(--color-border)",
              borderRadius: "16px"
            }}
          />
          <Bar dataKey="avgFocus" radius={[0, 6, 6, 0]} barSize={20} fill="var(--color-accent)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ClassEnrollmentChart({ data }: TeacherAnalyticsProps) {
  const COLORS = ["var(--color-primary)", "var(--color-secondary)", "var(--color-accent)", "var(--color-destructive)"];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="students"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "var(--color-card)", 
              border: "1px solid var(--color-border)",
              borderRadius: "16px"
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
