import { useState } from "react";
import { useDashboardData } from "@/hooks/use-dashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  Bell,
  Trash2,
  Settings,
} from "lucide-react";

interface Alert {
  id: number;
  title: string;
  message: string;
  type: "warning" | "error" | "info" | "success";
  timestamp: Date;
  isRead: boolean;
  region?: string;
}

export default function Alerts() {
  const { data } = useDashboardData();
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: 1,
      title: "Low Stock Alert",
      message: "Maharashtra inventory below threshold",
      type: "warning",
      timestamp: new Date(Date.now() - 3600000),
      isRead: false,
      region: "Maharashtra",
    },
    {
      id: 2,
      title: "Target Achieved",
      message: "Gujarat exceeded quarterly target",
      type: "success",
      timestamp: new Date(Date.now() - 7200000),
      isRead: true,
      region: "Gujarat",
    },
    {
      id: 3,
      title: "Critical Alert",
      message: "Supply chain disruption detected in Madhya Pradesh",
      type: "error",
      timestamp: new Date(Date.now() - 86400000),
      isRead: false,
      region: "Madhya Pradesh",
    },
  ]);

  const [alertThresholds, setAlertThresholds] = useState({
    lowStock: 500,
    highFreight: 200,
    targetMiss: 80,
  });

  const [showSettings, setShowSettings] = useState(false);

  const markAsRead = (id: number) => {
    setAlerts(alerts.map((a) => (a.id === id ? { ...a, isRead: true } : a)));
  };

  const deleteAlert = (id: number) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const markAllAsRead = () => {
    setAlerts(alerts.map((a) => ({ ...a, isRead: true })));
  };

  const unreadCount = alerts.filter((a) => !a.isRead).length;

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case "success":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      default:
        return <Bell className="w-5 h-5 text-blue-600" />;
    }
  };

  const getAlertBg = (type: string) => {
    switch (type) {
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "success":
        return "bg-green-50 border-green-200";
      default:
        return "bg-blue-50 border-blue-200";
    }
  };

  return (
    <div className="p-6 max-w-[1200px] mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Alerts & Notifications</h1>
          <p className="text-slate-500 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread alerts` : "All caught up!"}
          </p>
        </div>
        <div className="flex gap-2">
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="gap-2"
          >
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </div>
      </div>

      {/* Alert Settings */}
      {showSettings && (
        <Card className="bg-slate-50">
          <CardHeader>
            <CardTitle>Alert Thresholds</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Low Stock Threshold (units)
              </label>
              <Input
                type="number"
                value={alertThresholds.lowStock}
                onChange={(e) =>
                  setAlertThresholds({
                    ...alertThresholds,
                    lowStock: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                High Freight Cost Threshold (₹)
              </label>
              <Input
                type="number"
                value={alertThresholds.highFreight}
                onChange={(e) =>
                  setAlertThresholds({
                    ...alertThresholds,
                    highFreight: Number(e.target.value),
                  })
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Target Miss Threshold (%)
              </label>
              <Input
                type="number"
                value={alertThresholds.targetMiss}
                onChange={(e) =>
                  setAlertThresholds({
                    ...alertThresholds,
                    targetMiss: Number(e.target.value),
                  })
                }
              />
            </div>
            <Button>Save Thresholds</Button>
          </CardContent>
        </Card>
      )}

      {/* Alerts List */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center text-slate-500">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No alerts at this time</p>
            </CardContent>
          </Card>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-4 border rounded-lg flex items-start gap-4 ${getAlertBg(
                alert.type
              )} ${!alert.isRead ? "border-l-4" : ""}`}
            >
              <div className="pt-1">{getAlertIcon(alert.type)}</div>

              <div className="flex-1">
                <h3 className="font-semibold text-slate-900">{alert.title}</h3>
                <p className="text-sm text-slate-600 mt-1">{alert.message}</p>
                <div className="flex gap-4 mt-2 text-xs text-slate-500">
                  <span>
                    {alert.timestamp.toLocaleDateString()} at{" "}
                    {alert.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                  {alert.region && <span className="font-medium">{alert.region}</span>}
                </div>
              </div>

              <div className="flex gap-2">
                {!alert.isRead && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => markAsRead(alert.id)}
                  >
                    Mark read
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteAlert(alert.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Alert Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{alerts.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Unread</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{unreadCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Errors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">
              {alerts.filter((a) => a.type === "error").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Resolved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {alerts.filter((a) => a.isRead).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Region-specific Alerts */}
      {data && (
        <Card>
          <CardHeader>
            <CardTitle>Alerts by Region</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {data.regions.map((region) => {
                const regionAlerts = alerts.filter((a) => a.region === region.name);
                return (
                  <div
                    key={region.key}
                    className="p-4 border rounded-lg bg-slate-50"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{region.name}</h4>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                        {regionAlerts.length} alerts
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mt-2">
                      Current stock: {region.totalOrder.toFixed(0)} units
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
