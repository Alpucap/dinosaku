"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Card } from "@/components/ui/card";

const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444"];

export function DashboardClient({
  stats,
  growthData,
  roleData,
}: {
  stats: { totalUsers: number; activeUsers: number; premiumUsers: number };
  growthData: { date: string; users: number }[];
  roleData: { name: string; value: number }[];
}) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6 bg-surface border-border rounded-xl">
          <h3 className="text-sm font-medium text-text-secondary">Total Pengguna</h3>
          <p className="text-3xl font-bold text-text-primary mt-2">{stats.totalUsers}</p>
        </Card>
        <Card className="p-6 bg-surface border-border rounded-xl">
          <h3 className="text-sm font-medium text-text-secondary">Pengguna Aktif</h3>
          <p className="text-3xl font-bold text-green-500 mt-2">{stats.activeUsers}</p>
        </Card>
        <Card className="p-6 bg-surface border-border rounded-xl">
          <h3 className="text-sm font-medium text-text-secondary">Pengguna Premium</h3>
          <p className="text-3xl font-bold text-amber-500 mt-2">{stats.premiumUsers}</p>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 bg-surface border-border rounded-xl">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Pertumbuhan Pengguna (30 Hari)</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" opacity={0.2} />
                <XAxis dataKey="date" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
                />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6 bg-surface border-border rounded-xl">
          <h3 className="text-lg font-semibold text-text-primary mb-4">Distribusi Role</h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={roleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {roleData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "none", borderRadius: "8px", color: "#fff" }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-2">
            {roleData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-xs text-text-secondary">{entry.name}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
