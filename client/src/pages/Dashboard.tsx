import { useState } from 'react';
import { useDashboardData } from "@/hooks/use-dashboard";
import { KPICard } from "@/components/KPICard";
import { IndiaMap } from "@/components/IndiaMap";
import { 
  Package, Truck, AlertTriangle, CheckCircle2, Printer, 
  FileDown, Database, LayoutDashboard, Search, Filter,
  ArrowUpRight, Download
} from 'lucide-react';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import DataManager from './DataManager';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

export default function Dashboard() {
  const { data, isLoading, error } = useDashboardData();
  const [activeView, setActiveView] = useState<'dashboard' | 'data-manager'>('dashboard');
  const [isPrintMode, setIsPrintMode] = useState(false);
  const [selectedRegionKey, setSelectedRegionKey] = useState<string | null>(null);

  // Print Handlers
  const handlePrint = () => {
    setIsPrintMode(true);
    setTimeout(() => {
      window.print();
      setIsPrintMode(false);
    }, 100);
  };

  // Helper to get region name safely
  const getRegionName = (key: string) => {
    return data?.regions.find(r => r.key === key)?.name || key;
  };

  // Memoized derived data
  const modeSummary = data?.modeSummaries.reduce((acc: any, curr: any) => {
    acc[curr.category] = curr;
    return acc;
  }, {});

  const chartData = data?.regions
    .map((r: any) => ({
      name: r.name,
      value: r.totalOrder,
      lumps: r.lumps,
      pellet: r.pellet
    }))
    .sort((a: any, b: any) => b.value - a.value) || [];

  if (isLoading) return <DashboardSkeleton />;
  if (error) return <div className="p-8 text-center text-red-500">Error loading dashboard data.</div>;
  if (!data || !modeSummary) return null;

  return (
    <div className={`min-h-screen ${isPrintMode ? 'bg-white p-0' : 'bg-slate-50 p-4 lg:p-6'}`}>
      
      {/* Header - Hidden in Print */}
      {!isPrintMode && (
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-[1800px] mx-auto mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200"
        >
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 font-display tracking-tight">
              Executive Logistics Dashboard
            </h1>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Lloyds Metals & Energy Ltd • Live Data • {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handlePrint} className="gap-2">
              <Printer className="w-4 h-4" /> Print
            </Button>
            <Button variant="outline" className="gap-2">
              <FileDown className="w-4 h-4" /> Export PDF
            </Button>
            <Button 
              variant={activeView === 'data-manager' ? "default" : "secondary"}
              onClick={() => setActiveView(activeView === 'dashboard' ? 'data-manager' : 'dashboard')}
              className="gap-2"
            >
              {activeView === 'dashboard' ? <Database className="w-4 h-4" /> : <LayoutDashboard className="w-4 h-4" />}
              {activeView === 'dashboard' ? 'Manage Data' : 'View Dashboard'}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Main Content Area */}
      {activeView === 'dashboard' ? (
        <div className={`print-container ${isPrintMode ? 'w-full' : 'max-w-[1800px] mx-auto'}`}>
          
          {/* Print Header */}
          {isPrintMode && (
            <div className="mb-4 pb-2 border-b-2 border-blue-600 flex justify-between items-end">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">DRI Regional Sales & Logistics</h1>
                <p className="text-slate-600">Lloyds Metals & Energy Ltd, Ghugus, Maharashtra</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-slate-900">{new Date().toLocaleDateString('en-GB')}</p>
                <p className="text-xs text-slate-500">Report Generated Automatically</p>
              </div>
            </div>
          )}

          {/* Grid Layout */}
          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            
            {/* LEFT COLUMN: KPIs */}
            <div className="col-span-12 md:col-span-3 space-y-4">
              <KPICard 
                title="Total Volume" 
                subtitle="Grand Total Orders" 
                value={`${modeSummary.grand.total.toLocaleString()} MT`}
                icon={Package}
                gradientFrom="from-blue-500"
                gradientTo="to-blue-600"
              />
              <KPICard 
                title="Ex-Works" 
                subtitle="EXW Delivery Mode" 
                value={`${modeSummary.exw.total.toLocaleString()} MT`}
                subValue={`${((modeSummary.exw.total/modeSummary.grand.total)*100).toFixed(1)}% Share`}
                icon={CheckCircle2}
                gradientFrom="from-emerald-500"
                gradientTo="to-teal-600"
              />
              <KPICard 
                title="FOR Delivery" 
                subtitle="Freight on Road" 
                value={`${modeSummary.for.total.toLocaleString()} MT`}
                subValue={`${((modeSummary.for.total/modeSummary.grand.total)*100).toFixed(1)}% Share`}
                icon={Truck}
                gradientFrom="from-violet-500"
                gradientTo="to-purple-600"
              />
              <KPICard 
                title="Critical Alert" 
                subtitle="Over 21 Days Pending" 
                value={`${modeSummary.grand.over21.toLocaleString()} MT`}
                icon={AlertTriangle}
                gradientFrom="from-amber-500"
                gradientTo="to-orange-600"
              />

              {/* Mini Table Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 hidden md:block">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Regional Summary</h4>
                <div className="space-y-2">
                  {data.regions.slice(0, 5).map((r: any) => (
                    <div key={r.key} className="flex justify-between items-center text-sm border-b border-slate-50 pb-1 last:border-0">
                      <span className="font-medium text-slate-700">{r.name}</span>
                      <span className="font-bold text-slate-900">{r.totalOrder.toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* MIDDLE COLUMN: MAP */}
            <div className="col-span-12 md:col-span-6 min-h-[400px] md:min-h-[500px]">
              <IndiaMap data={data} onStateClick={setSelectedRegionKey} />
            </div>

            {/* RIGHT COLUMN: CHARTS */}
            <div className="col-span-12 md:col-span-3 space-y-4">
              
              {/* Pie Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 h-[240px]">
                <h4 className="text-sm font-bold text-slate-800 mb-2">State-wise Distribution</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie 
                      data={chartData.slice(0, 5)} 
                      cx="50%" 
                      cy="50%" 
                      innerRadius={40} 
                      outerRadius={70} 
                      paddingAngle={5} 
                      dataKey="value"
                    >
                      {chartData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      formatter={(value: number) => `${value.toFixed(0)} MT`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Bar Chart */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 h-[240px]">
                <h4 className="text-sm font-bold text-slate-800 mb-2">Top Performance</h4>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData.slice(0, 4)} layout="vertical" margin={{ left: 30 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" hide />
                    <YAxis 
                      dataKey="name" 
                      type="category" 
                      tick={{ fontSize: 10, fontWeight: 600 }} 
                      width={60}
                    />
                    <Tooltip 
                      cursor={{fill: '#f1f5f9'}}
                      contentStyle={{ borderRadius: '8px', border: 'none' }}
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Quick Actions */}
              <div className="bg-slate-900 text-white rounded-xl shadow-lg p-4 bg-gradient-to-br from-slate-800 to-slate-900">
                <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <Download className="w-4 h-4" /> Download Reports
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button size="sm" variant="secondary" className="text-xs h-8">Full Report</Button>
                  <Button size="sm" variant="secondary" className="text-xs h-8">Summary</Button>
                </div>
              </div>
            </div>

            {/* BOTTOM ROW: Detailed Table */}
            <div className="col-span-12 mt-4">
              <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-bold text-slate-800">Regional Breakdown & Logistics</h3>
                  <div className="flex gap-2">
                    <Input placeholder="Search regions..." className="h-8 w-48 text-xs" />
                    <Button size="sm" variant="outline" className="h-8"><Filter className="w-3 h-3 mr-1" /> Filter</Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[200px]">Region / State</TableHead>
                        <TableHead className="text-right">Total Order (MT)</TableHead>
                        <TableHead className="text-right">Lumps (MT)</TableHead>
                        <TableHead className="text-right">Pellet (MT)</TableHead>
                        <TableHead className="text-right">Fines (MT)</TableHead>
                        <TableHead className="text-right">Depots</TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.regions.map((region: any) => (
                        <TableRow key={region.key} className="group hover:bg-blue-50/30">
                          <TableCell className="font-medium text-slate-900">{region.name}</TableCell>
                          <TableCell className="text-right font-bold text-blue-600">{region.totalOrder.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{region.lumps.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{region.pellet.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{region.fines.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            {data.locations.filter((l: any) => l.regionKey === region.key).length}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={() => setSelectedRegionKey(region.key)}
                            >
                              Details <ArrowUpRight className="w-3 h-3 ml-1" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          </div>

          {/* Region Details Modal */}
          <Dialog open={!!selectedRegionKey} onOpenChange={() => setSelectedRegionKey(null)}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-2xl font-display flex items-center gap-2">
                  <div className="w-2 h-8 bg-blue-600 rounded-full" />
                  {selectedRegionKey ? getRegionName(selectedRegionKey) : ''} 
                  <span className="text-slate-400 font-normal text-lg">Logistics Detail</span>
                </DialogTitle>
              </DialogHeader>
              
              {selectedRegionKey && (
                <div className="mt-4">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow>
                        <TableHead>Location / Depot</TableHead>
                        <TableHead className="text-right">Distance (km)</TableHead>
                        <TableHead className="text-right">Freight (₹)</TableHead>
                        <TableHead className="text-right">Capacity (MT)</TableHead>
                        <TableHead className="text-right">Bal EXW</TableHead>
                        <TableHead className="text-right">Bal FOR</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.locations
                        .filter((l: any) => l.regionKey === selectedRegionKey)
                        .map((loc: any) => (
                          <TableRow key={loc.id}>
                            <TableCell className="font-medium">{loc.name}</TableCell>
                            <TableCell className="text-right">{loc.distance}</TableCell>
                            <TableCell className="text-right">{loc.freight}</TableCell>
                            <TableCell className="text-right">{loc.capacity}</TableCell>
                            <TableCell className="text-right font-mono text-slate-600">{loc.balExw.toFixed(2)}</TableCell>
                            <TableCell className="text-right font-mono text-slate-600">{loc.balFor.toFixed(2)}</TableCell>
                          </TableRow>
                      ))}
                      {data.locations.filter((l: any) => l.regionKey === selectedRegionKey).length === 0 && (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-slate-400">
                            No depot locations data available for this region.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </DialogContent>
          </Dialog>

        </div>
      ) : (
        <DataManager />
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 max-w-[1800px] mx-auto space-y-6">
      <div className="flex justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-3 space-y-4">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-32 rounded-xl" />)}
        </div>
        <div className="col-span-6">
          <Skeleton className="h-[550px] rounded-xl" />
        </div>
        <div className="col-span-3 space-y-4">
          <Skeleton className="h-64 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    </div>
  );
}
