import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface KPICardProps {
  title: string;
  subtitle: string;
  value: string;
  subValue?: string;
  icon: LucideIcon;
  gradientFrom: string;
  gradientTo: string;
  textColor?: string;
}

export function KPICard({ 
  title, 
  subtitle, 
  value, 
  subValue, 
  icon: Icon, 
  gradientFrom, 
  gradientTo,
  textColor = "text-white"
}: KPICardProps) {
  return (
    <div className={cn(
      "rounded-xl shadow-lg p-4 transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
      `bg-gradient-to-br ${gradientFrom} ${gradientTo}`,
      textColor
    )}>
      <div className="flex items-center justify-between mb-3">
        <Icon className="w-6 h-6 opacity-90" />
        <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
          {title}
        </span>
      </div>
      <p className="text-xs opacity-80 font-medium mb-1">{subtitle}</p>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
      {subValue && (
        <p className="text-xs mt-2 font-medium bg-black/10 inline-block px-2 py-0.5 rounded">
          {subValue}
        </p>
      )}
    </div>
  );
}
