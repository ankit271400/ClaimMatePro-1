import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

interface StatusStep {
  id: string;
  title: string;
  icon: LucideIcon;
  completed: boolean;
  current?: boolean;
  date?: string;
}

interface StatusTrackerProps {
  steps: StatusStep[];
}

export default function StatusTracker({ steps }: StatusTrackerProps) {
  const completedSteps = steps.filter(step => step.completed).length;
  const progressWidth = (completedSteps / steps.length) * 100;

  return (
    <div className="relative" data-testid="status-tracker">
      {/* Progress Line Background */}
      <div className="absolute top-4 left-0 right-0 h-1 bg-slate-200 rounded-full"></div>
      
      {/* Progress Line Active */}
      <motion.div 
        className="absolute top-4 left-0 h-1 bg-primary rounded-full transition-all duration-500"
        initial={{ width: 0 }}
        animate={{ width: `${progressWidth}%` }}
        transition={{ duration: 1, delay: 0.5 }}
      />

      {/* Status Steps */}
      <div className="relative flex justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="flex flex-col items-center"
              data-testid={`status-step-${step.id}`}
            >
              {/* Step Icon */}
              <div 
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all duration-300
                  ${step.completed 
                    ? 'bg-primary text-white shadow-lg' 
                    : step.current 
                    ? 'bg-secondary border-4 border-secondary/20 text-white animate-pulse' 
                    : 'bg-slate-200 text-slate-400'
                  }
                `}
              >
                {step.current && !step.completed ? (
                  <div className="w-2 h-2 bg-white rounded-full" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>

              {/* Step Content */}
              <div className="mt-2 text-center max-w-24">
                <div 
                  className={`
                    text-sm font-medium transition-colors
                    ${step.completed 
                      ? 'text-slate-900' 
                      : step.current 
                      ? 'text-secondary' 
                      : 'text-slate-600'
                    }
                  `}
                >
                  {step.title}
                </div>
                {step.date && (
                  <div className="text-xs text-slate-600 mt-1">
                    {step.date}
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Progress Percentage */}
      <motion.div 
        className="mt-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="text-sm text-slate-600">
          Progress: {completedSteps} of {steps.length} steps completed
        </div>
        <div className="text-xs text-slate-500 mt-1">
          {progressWidth.toFixed(0)}% Complete
        </div>
      </motion.div>
    </div>
  );
}
