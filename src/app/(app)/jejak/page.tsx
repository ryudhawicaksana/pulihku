"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Flame, ArrowUpRight, ArrowDownRight, Flag } from "lucide-react";
import { useUser } from "@/components/user-provider";
import { differenceInDays, parseISO } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";

export default function JejakPulih() {
  const { user, recordRelapse } = useUser();
  const [isRelapseModalOpen, setIsRelapseModalOpen] = useState(false);

  const streak = user?.startDate ? differenceInDays(new Date(), parseISO(user.startDate)) : 0;
  const totalRelapse = user?.relapseCount || 0;
  const successRate = Math.max(0, 100 - (totalRelapse * 4));

  // Generate 6 months of data ending in the current month
  const chartData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const isCurrentMonth = i === 5;
    return {
      name: d.toLocaleString('id-ID', { month: 'short' }),
      sukses: isCurrentMonth ? streak : 0,
      relapse: isCurrentMonth ? totalRelapse : 0,
    };
  });

  return (
    <div className="flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <Dialog open={isRelapseModalOpen} onOpenChange={setIsRelapseModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogTitle>Catat Relapse</DialogTitle>
          <DialogDescription>
            Tidak apa-apa, setiap perjalanan pasti ada kerikilnya. Apakah Anda yakin ingin mencatat relapse dan mengatur ulang streak Anda?
          </DialogDescription>
          <DialogFooter className="flex gap-2 sm:justify-end mt-4">
            <Button variant="outline" onClick={() => setIsRelapseModalOpen(false)}>
              Batal
            </Button>
            <Button variant="destructive" onClick={() => {
              recordRelapse();
              setIsRelapseModalOpen(false);
              toast.error("Relapse tercatat. Mari bangkit dan mulai lagi dari sekarang!");
            }}>
              Ya, Catat Relapse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="flex flex-col md:flex-row gap-6 md:items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Jejak Pulih</h1>
          <p className="text-muted-foreground text-lg">Lihat seberapa jauh kamu telah melangkah.</p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Button 
            variant="outline" 
            className="flex-1 md:flex-none h-12 px-6 rounded-xl border-2"
            onClick={() => toast.success("Semua riwayat check-in Anda aman! Teruskan perjuangan.")}
          >
            Riwayat Check-in
          </Button>
          <Button 
            variant="destructive" 
            className="flex-1 md:flex-none h-12 px-6 rounded-xl shadow-md"
            onClick={() => setIsRelapseModalOpen(true)}
          >
            <Flag className="w-5 h-5 mr-2" />
            Catat Relapse
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Flame className="w-5 h-5 text-primary" />
                <h3 className="font-medium">Streak Saat Ini</h3>
              </div>
            </div>
            <p className="text-4xl font-bold mb-2">{streak}</p>
            <div className="flex items-center text-sm text-primary font-medium">
              <ArrowUpRight className="w-4 h-4 mr-1" />
              <span>Lebih baik dari bulan lalu</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Activity className="w-5 h-5" />
                <h3 className="font-medium">Total Relapse</h3>
              </div>
            </div>
            <p className="text-4xl font-bold mb-2">{totalRelapse}</p>
            <div className="flex items-center text-sm text-primary font-medium">
              <ArrowDownRight className="w-4 h-4 mr-1" />
              <span>Menurun 50%</span>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tingkat Kesuksesan (Bulan Ini)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-4">
              <div className="text-5xl font-bold text-primary">{successRate}%</div>
              <p className="text-muted-foreground pb-1">Hari tanpa relapse</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Statistik Bulanan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--muted))" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--color-muted-foreground)" }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--color-muted-foreground)" }}
                />
                <Tooltip 
                  cursor={{ fill: "var(--color-muted)" }}
                  contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
                />
                <Bar 
                  dataKey="sukses" 
                  name="Berhasil" 
                  fill="var(--color-primary)" 
                  radius={[4, 4, 0, 0]} 
                />
                <Bar 
                  dataKey="relapse" 
                  name="Relapse" 
                  fill="var(--color-destructive)" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
