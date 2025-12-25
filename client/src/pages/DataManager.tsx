import { useState } from 'react';
import { useDashboardData, useUpdateRegion, useUpdateLocation, useUpdateModeSummary } from '@/hooks/use-dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit2, Save } from 'lucide-react';

export default function DataManager() {
  const { data } = useDashboardData();

  if (!data) return null;

  return (
    <div className="max-w-[1800px] mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <h2 className="text-xl font-bold text-slate-900">Data Management Console</h2>
        <p className="text-slate-500 text-sm">Update core metrics, regional data, and logistics parameters directly.</p>
      </div>
      
      <div className="p-6">
        <Tabs defaultValue="regions" className="w-full">
          <TabsList className="mb-6 w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger value="regions" className="px-6 py-3 rounded-t-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
              Regional Data
            </TabsTrigger>
            <TabsTrigger value="locations" className="px-6 py-3 rounded-t-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
              Depots & Locations
            </TabsTrigger>
            <TabsTrigger value="modes" className="px-6 py-3 rounded-t-lg data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 data-[state=active]:border-b-2 data-[state=active]:border-blue-600">
              Mode Summaries (KPIs)
            </TabsTrigger>
          </TabsList>

          <TabsContent value="regions">
            <RegionsTable regions={data.regions} />
          </TabsContent>

          <TabsContent value="locations">
            <LocationsTable locations={data.locations} />
          </TabsContent>

          <TabsContent value="modes">
            <ModeSummaryTable summaries={data.modeSummaries} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

// --- SUB-COMPONENTS FOR TABLES ---

function RegionsTable({ regions }: { regions: any[] }) {
  const updateMutation = useUpdateRegion();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const startEdit = (region: any) => {
    setEditingId(region.key);
    setFormData(region);
  };

  const handleSave = async () => {
    if (!editingId) return;
    await updateMutation.mutateAsync({ 
      key: editingId, 
      updates: {
        totalOrder: Number(formData.totalOrder),
        lumps: Number(formData.lumps),
        pellet: Number(formData.pellet),
        fines: Number(formData.fines)
      } 
    });
    setEditingId(null);
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Region Name</TableHead>
            <TableHead>Total Order</TableHead>
            <TableHead>Lumps</TableHead>
            <TableHead>Pellet</TableHead>
            <TableHead>Fines</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {regions.map((region) => (
            <TableRow key={region.key}>
              <TableCell className="font-medium">{region.name}</TableCell>
              {editingId === region.key ? (
                <>
                  <TableCell><Input type="number" value={formData.totalOrder} onChange={e => setFormData({...formData, totalOrder: e.target.value})} className="h-8 w-24" /></TableCell>
                  <TableCell><Input type="number" value={formData.lumps} onChange={e => setFormData({...formData, lumps: e.target.value})} className="h-8 w-24" /></TableCell>
                  <TableCell><Input type="number" value={formData.pellet} onChange={e => setFormData({...formData, pellet: e.target.value})} className="h-8 w-24" /></TableCell>
                  <TableCell><Input type="number" value={formData.fines} onChange={e => setFormData({...formData, fines: e.target.value})} className="h-8 w-24" /></TableCell>
                  <TableCell>
                    <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending}>
                      <Save className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{region.totalOrder}</TableCell>
                  <TableCell>{region.lumps}</TableCell>
                  <TableCell>{region.pellet}</TableCell>
                  <TableCell>{region.fines}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => startEdit(region)}>
                      <Edit2 className="w-4 h-4 text-slate-500" />
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function LocationsTable({ locations }: { locations: any[] }) {
  const updateMutation = useUpdateLocation();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<any>({});

  const startEdit = (loc: any) => {
    setEditingId(loc.id);
    setFormData(loc);
  };

  const handleSave = async () => {
    if (!editingId) return;
    await updateMutation.mutateAsync({ 
      id: editingId, 
      updates: {
        distance: Number(formData.distance),
        freight: Number(formData.freight),
        capacity: Number(formData.capacity)
      } 
    });
    setEditingId(null);
  };

  return (
    <div className="rounded-lg border max-h-[600px] overflow-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Location Name</TableHead>
            <TableHead>Region</TableHead>
            <TableHead>Distance (km)</TableHead>
            <TableHead>Freight (₹)</TableHead>
            <TableHead>Capacity (MT)</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {locations.map((loc) => (
            <TableRow key={loc.id}>
              <TableCell className="font-medium">{loc.name}</TableCell>
              <TableCell className="text-slate-500 text-xs uppercase">{loc.regionKey}</TableCell>
              {editingId === loc.id ? (
                <>
                  <TableCell><Input type="number" value={formData.distance} onChange={e => setFormData({...formData, distance: e.target.value})} className="h-8 w-24" /></TableCell>
                  <TableCell><Input type="number" value={formData.freight} onChange={e => setFormData({...formData, freight: e.target.value})} className="h-8 w-24" /></TableCell>
                  <TableCell><Input type="number" value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="h-8 w-24" /></TableCell>
                  <TableCell>
                    <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending}>
                      <Save className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{loc.distance}</TableCell>
                  <TableCell>{loc.freight}</TableCell>
                  <TableCell>{loc.capacity}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => startEdit(loc)}>
                      <Edit2 className="w-4 h-4 text-slate-500" />
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function ModeSummaryTable({ summaries }: { summaries: any[] }) {
  const updateMutation = useUpdateModeSummary();
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState<any>({});

  const startEdit = (summary: any) => {
    setEditingCategory(summary.category);
    setFormData(summary);
  };

  const handleSave = async () => {
    if (!editingCategory) return;
    await updateMutation.mutateAsync({ 
      category: editingCategory, 
      updates: {
        total: Number(formData.total),
        under21: Number(formData.under21),
        over21: Number(formData.over21)
      } 
    });
    setEditingCategory(null);
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Category</TableHead>
            <TableHead>Total (MT)</TableHead>
            <TableHead>Under 21 Days</TableHead>
            <TableHead>Over 21 Days</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {summaries.map((summary) => (
            <TableRow key={summary.category}>
              <TableCell className="font-bold capitalize">{summary.category}</TableCell>
              {editingCategory === summary.category ? (
                <>
                  <TableCell><Input type="number" value={formData.total} onChange={e => setFormData({...formData, total: e.target.value})} className="h-8 w-24" /></TableCell>
                  <TableCell><Input type="number" value={formData.under21} onChange={e => setFormData({...formData, under21: e.target.value})} className="h-8 w-24" /></TableCell>
                  <TableCell><Input type="number" value={formData.over21} onChange={e => setFormData({...formData, over21: e.target.value})} className="h-8 w-24" /></TableCell>
                  <TableCell>
                    <Button size="sm" onClick={handleSave} disabled={updateMutation.isPending}>
                      <Save className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{summary.total}</TableCell>
                  <TableCell>{summary.under21}</TableCell>
                  <TableCell>{summary.over21}</TableCell>
                  <TableCell>
                    <Button size="sm" variant="ghost" onClick={() => startEdit(summary)}>
                      <Edit2 className="w-4 h-4 text-slate-500" />
                    </Button>
                  </TableCell>
                </>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
