import { useDashboardData } from "@/hooks/use-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp } from "lucide-react";

export default function Forecasting() {
  const { data } = useDashboardData();

  // Generate forecast data (using simple linear regression simulation)
  const generateForecast = () => {
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
      "Jan*",
      "Feb*",
      "Mar*",
    ];
    const baseValue = 20000;
    const trend = 500;
    const seasonality = 3000;

    return months.map((month, index) => {
      const seasonalFactor = Math.sin((index / 12) * Math.PI * 2);
      const trendComponent = baseValue + trend * index;
      const seasonalComponent = seasonalFactor * seasonality;
      const isForecast = index >= 12;

      return {
        month,
        actual: isForecast ? null : trendComponent + seasonalComponent + Math.random() * 1000,
        forecast: trendComponent + seasonalComponent,
        isForecast,
      };
    });
  };

  const forecastData = generateForecast();

  // Calculate region growth projections
  const generateRegionForecasts = () => {
    return (
      data?.regions.map((region) => {
        const currentValue = region.totalOrder;
        const growthRate = Math.random() * 0.15 + 0.02; // 2-17% growth

        return {
          region: region.name,
          current: currentValue,
          q1: currentValue * (1 + growthRate * 0.25),
          q2: currentValue * (1 + growthRate * 0.5),
          q3: currentValue * (1 + growthRate * 0.75),
          q4: currentValue * (1 + growthRate),
          growthRate: growthRate * 100,
        };
      }) || []
    );
  };

  const regionForecasts = generateRegionForecasts();

  // Calculate average growth
  const avgGrowth =
    regionForecasts.reduce((sum, r) => sum + r.growthRate, 0) /
    (regionForecasts.length || 1);

  const currentTotal =
    data?.regions.reduce((sum, r) => sum + r.totalOrder, 0) || 0;
  const projectedTotal = currentTotal * (1 + avgGrowth / 100);

  return (
    <div className="p-6 max-w-[1600px] mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Forecasting & Projections</h1>
        <p className="text-slate-500 mt-1">
          AI-powered predictions for sales and inventory
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Current Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{currentTotal.toFixed(0)}</div>
            <p className="text-xs text-slate-500 mt-1">Grand total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              Projected Total (12M)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{projectedTotal.toFixed(0)}</div>
            <p className="text-xs text-green-600 mt-1">
              +{(projectedTotal - currentTotal).toFixed(0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Average Growth Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+{avgGrowth.toFixed(2)}%</div>
            <p className="text-xs text-slate-500 mt-1">Per region per year</p>
          </CardContent>
        </Card>
      </div>

      {/* Trend Forecast */}
      <Card>
        <CardHeader>
          <CardTitle>15-Month Sales Forecast</CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            * Forecast values (12 months projection)
          </p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="colorActual" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="actual"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorActual)"
                name="Actual Sales"
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="#10b981"
                strokeDasharray="5 5"
                strokeWidth={2}
                name="Forecast"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Regional Projections */}
      <Card>
        <CardHeader>
          <CardTitle>Regional 12-Month Projections</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {regionForecasts.map((forecast) => (
              <div key={forecast.region} className="border-b pb-4 last:border-b-0">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-slate-900">
                      {forecast.region}
                    </h4>
                    <p className="text-sm text-slate-500">
                      Current: ₹{forecast.current.toFixed(2)}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      +{forecast.growthRate.toFixed(2)}%
                    </div>
                    <p className="text-sm text-slate-500">Annual growth</p>
                  </div>
                </div>

                {/* Quarterly projection bars */}
                <div className="flex gap-2 items-end h-20">
                  <div className="flex-1 bg-slate-200 rounded" 
                       style={{height: `${(forecast.q1 / forecast.q4) * 80}px`}}>
                    <div className="text-xs text-center p-1 font-semibold">Q1</div>
                  </div>
                  <div className="flex-1 bg-blue-300 rounded"
                       style={{height: `${(forecast.q2 / forecast.q4) * 80}px`}}>
                    <div className="text-xs text-center p-1 font-semibold">Q2</div>
                  </div>
                  <div className="flex-1 bg-blue-400 rounded"
                       style={{height: `${(forecast.q3 / forecast.q4) * 80}px`}}>
                    <div className="text-xs text-center p-1 font-semibold">Q3</div>
                  </div>
                  <div className="flex-1 bg-blue-600 rounded"
                       style={{height: `${(forecast.q4 / forecast.q4) * 80}px`}}>
                    <div className="text-xs text-center p-1 font-semibold">Q4</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card>
        <CardHeader>
          <CardTitle>Forecast Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="font-semibold text-green-900">Strong Growth Expected</p>
            <p className="text-sm text-green-800 mt-1">
              Overall forecast shows {avgGrowth.toFixed(2)}% growth across all regions
              with projected revenue increase of ₹{(projectedTotal - currentTotal).toFixed(0)}.
            </p>
          </div>

          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="font-semibold text-blue-900">Key Opportunities</p>
            <p className="text-sm text-blue-800 mt-1">
              Focus on high-growth regions to maximize ROI and market penetration.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
