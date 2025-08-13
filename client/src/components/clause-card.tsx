import { useState } from "react";
import { ChevronDown, AlertTriangle, Info, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface ClauseCardProps {
  clause: {
    title: string;
    summary: string;
    originalText?: string;
    riskLevel: 'high' | 'medium' | 'low';
    category?: string;
  };
}

export default function ClauseCard({ clause }: ClauseCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRiskConfig = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return {
          color: 'border-destructive',
          bgColor: 'bg-destructive/10',
          textColor: 'text-destructive',
          icon: AlertTriangle,
          badge: 'High Risk',
          badgeClass: 'bg-destructive/10 text-destructive',
        };
      case 'medium':
        return {
          color: 'border-warning',
          bgColor: 'bg-warning/10',
          textColor: 'text-warning',
          icon: Info,
          badge: 'Medium Risk',
          badgeClass: 'bg-warning/10 text-warning',
        };
      case 'low':
        return {
          color: 'border-success',
          bgColor: 'bg-success/10',
          textColor: 'text-success',
          icon: CheckCircle,
          badge: 'Favorable',
          badgeClass: 'bg-success/10 text-success',
        };
      default:
        return {
          color: 'border-slate-200',
          bgColor: 'bg-slate/10',
          textColor: 'text-slate-600',
          icon: Info,
          badge: 'Unknown',
          badgeClass: 'bg-slate-100 text-slate-600',
        };
    }
  };

  const config = getRiskConfig(clause.riskLevel);
  const Icon = config.icon;

  return (
    <Card className={`shadow-sm border-l-4 ${config.color}`} data-testid={`clause-card-${clause.riskLevel}`}>
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <div className={`w-8 h-8 ${config.bgColor} rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
            <Icon className={`w-4 h-4 ${config.textColor}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <h4 className="font-semibold text-slate-900" data-testid="clause-title">
                {clause.title}
              </h4>
              <Badge className={config.badgeClass}>
                {config.badge}
              </Badge>
            </div>
            
            <p className="text-slate-600 mb-3" data-testid="clause-summary">
              {clause.summary}
            </p>
            
            {clause.originalText && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="text-primary hover:text-primary/80 p-0 h-auto font-medium"
                data-testid="button-toggle-original-text"
              >
                View Original Text
                <ChevronDown className={`w-4 h-4 ml-1 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
              </Button>
            )}
            
            <AnimatePresence>
              {isExpanded && clause.originalText && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 p-4 bg-slate-50 rounded-lg text-sm text-slate-700">
                    <strong>Original Policy Language:</strong>
                    <br />
                    <span data-testid="clause-original-text">{clause.originalText}</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
