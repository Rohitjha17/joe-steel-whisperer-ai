
import React from "react";
import { ExpertiseInfo } from "@/types/chat";
import { ShoppingCart, Database, FileText, CheckCircle, Truck, Activity } from "lucide-react";

interface ExpertiseAreaProps {
  expertise: ExpertiseInfo;
}

export function ExpertiseArea({ expertise }: ExpertiseAreaProps) {
  // Map of icon names to icon components
  const icons = {
    "shopping-cart": ShoppingCart,
    "database": Database,
    "file-text": FileText,
    "check-circle": CheckCircle,
    "truck": Truck,
    "activity": Activity,
  };

  // Get the icon component based on the icon name
  const IconComponent = icons[expertise.icon as keyof typeof icons];

  return (
    <div className="flex flex-col items-center p-4 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow border border-steel-100">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-steel-100 text-steel-700 mb-3">
        {IconComponent && <IconComponent className="h-6 w-6" />}
      </div>
      <h3 className="text-lg font-medium text-steel-800 mb-1">{expertise.title}</h3>
      <p className="text-sm text-steel-600 text-center">{expertise.description}</p>
    </div>
  );
}
