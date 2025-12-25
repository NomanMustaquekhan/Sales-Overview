import { useState } from "react";
import { useDashboardData } from "@/hooks/use-dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export default function Comparisons() {
  const { data } = useDashboardData();
  const [comparisonType, setComparisonType] = useState<"mom" | "yoy">("mom");

  // Generate mock historical data for comparison
  const generateHistoricalData = () => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return months.map((month, index) => ({
      month,
      current: Math.random() * 5000 + 15000,
      previous: Math.random() * 5000 + 14000,
      growth: Math.random() * 20 - 5,
    }));
  };

  const historicalData = generateHistoricalData();

  // Calculate growth metrics
  const currentTotal =
    data?.regions.reduce((sum, r) => sum + r.totalOrder, 0) || 0;
  const previousTotal = currentTotal * (1 - Math.random() * 0.1);
  const growth = ((currentTotal - previousTotal) / previousTotal) * 100;

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Comparison Analysis</h1>
        <p className="text-slate-500 mt-1">
          Year-over-year and month-over-month analysis
        </p>
      </div>

      {/* Comparison Type Selector */}
      <div className="flex gap-2">
        <Button
          variant={comparisonType === "mom" ? "default" : "secondary"}
          onClick={() => setComparisonType("mom")}
        >
          Month-over-Month
        </Button>
        <Button
          variant={comparisonType === "yoy" ? "default" : "secondary"}
          onClick={() => setComparisonType("yoy")}
        >
          Year-over-Year
        </Button>
      </div>

      {/* Growth Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Current Period Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{currentTotal.toFixed(2)}</div>
            <p className="text-xs text-slate-500 mt-1">Grand total orders</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Previous Period Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{previousTotal.toFixed(2)}</div>
            <p className="text-xs text-slate-500 mt-1">
              {comparisonType === "mom" ? "Previous month" : "Previous year"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <div className="text-2xl font-bold">
                {growth > 0 ? "+" : ""}
                {growth.toFixed(2)}%
              </div>
              {growth > 0 ? (
                <ArrowUpRight className="w-5 h-5 text-green-600" />
              ) : (
                <ArrowDownRight className="w-5 h-5 text-red-600" />
              )}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {growth > 0 ? "Growth" : "Decline"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            {comparisonType === "mom"
              ? "Month-over-Month Comparison"
              : "Year-over-Year Comparison"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="current" fill="#3b82f6" name="Current Period" />
              <Bar dataKey="previous" fill="#94a3b8" name="Previous Period" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Growth Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Growth Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="growth"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Region Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Regional Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.regions.map((region, index) => {
              const previousValue = region.totalOrder * (1 - Math.random() * 0.15);
              const regionGrowth =
                ((region.totalOrder - previousValue) / previousValue) * 100;
              return (
                <div
                  key={region.key}
                  className="flex items-center justify-between p-4 bg-slate-50 rounded-lg"
                >
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {region.name}
                    </h4>
                    <p className="text-sm text-slate-500">
                      ₹{previousValue.toFixed(2)} → ₹{region.totalOrder.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className={`text-lg font-bold ${
                        regionGrowth > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {regionGrowth > 0 ? "+" : ""}
                      {regionGrowth.toFixed(1)}%
                    </div>
                    {regionGrowth > 0 ? (
                      <ArrowUpRight className="w-4 h-4 text-green-600" />
                    ) : (
                      <ArrowDownRight className="w-4 h-4 text-red-600" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
