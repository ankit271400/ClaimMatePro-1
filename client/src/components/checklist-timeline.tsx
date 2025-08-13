import { useState } from "react";
import type { ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check, Upload, FileText, Clock, Paperclip } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { ChecklistItem } from "@shared/schema";

interface ChecklistTimelineProps {
  items: ChecklistItem[];
  claimId: string;
}

export default function ChecklistTimeline({ items, claimId }: ChecklistTimelineProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const updateItemMutation = useMutation({
    mutationFn: async ({ itemId, isCompleted }: { itemId: string; isCompleted: boolean }) => {
      await apiRequest('PUT', `/api/checklist/${itemId}`, { isCompleted });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/claims/${claimId}`] });
      toast({
        title: "Progress Updated",
        description: "Checklist item updated successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleItemToggle = (itemId: string, currentStatus: boolean) => {
    updateItemMutation.mutate({ itemId, isCompleted: !currentStatus });
  };

  const getItemIcon = (item: ChecklistItem, index: number) => {
    if (item.isCompleted) {
      return <Check className="w-4 h-4 text-white" />;
    }
    
    // Current item (first incomplete item)
    const currentItemIndex = items.findIndex(item => !item.isCompleted);
    if (index === currentItemIndex) {
      return <div className="w-2 h-2 bg-white rounded-full animate-pulse" />;
    }
    
    return <div className="w-2 h-2 bg-slate-400 rounded-full" />;
  };

  const getItemStyle = (item: ChecklistItem, index: number) => {
    if (item.isCompleted) {
      return "w-8 h-8 bg-success rounded-full flex items-center justify-center flex-shrink-0 mt-1";
    }
    
    const currentItemIndex = items.findIndex(item => !item.isCompleted);
    if (index === currentItemIndex) {
      return "w-8 h-8 bg-secondary border-4 border-secondary/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1";
    }
    
    return "w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center flex-shrink-0 mt-1";
  };

  const getConnectorStyle = (index: number) => {
    if (index === items.length - 1) return "";
    
    const isCurrentOrCompleted = items[index].isCompleted;
    return isCurrentOrCompleted 
      ? "border-l border-success ml-4 pl-6"
      : "border-l border-slate-200 ml-4 pl-6";
  };

  return (
    <div className="space-y-6" data-testid="checklist-timeline">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="flex items-start space-x-4"
        > {/* explicit div declaration */}
          <div className={getItemStyle(item, index)}>
            {getItemIcon(item, index)}
          </div>
          
          <div className={`flex-1 pb-6 ${getConnectorStyle(index)}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={item.isCompleted || false}
                      onCheckedChange={() => handleItemToggle(item.id, item.isCompleted || false)}
                      disabled={updateItemMutation.isPending}
                      data-testid={`checkbox-item-${item.id}`}
                    />
                    <div>
                      <h4 className={`font-semibold ${item.isCompleted ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                        {item.title}
                      </h4>
                      {item.completedAt && (
                        <p className="text-xs text-success mt-1">
                          Completed {new Date(item.completedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {item.isCompleted && (
                      <div className="flex items-center space-x-2 text-success text-sm">
                        <Check className="w-4 h-4" />
                        <span>Complete</span>
                      </div>
                    )}
                  </div>
                </div>

                <p className={`text-sm mb-4 ${item.isCompleted ? 'text-slate-400' : 'text-slate-600'}`}>
                  {item.description}
                </p>

                {/* File Upload Area */}
                {!item.isCompleted && (
                  <div className="space-y-4">
                    <div 
                      className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-secondary/40 transition-colors cursor-pointer"
                      onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                      data-testid={`upload-area-${item.id}`}
                    >
                      <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm text-slate-600">
                        {item.requiredDocuments && (item.requiredDocuments as string[]).length > 0
                          ? `Upload ${(item.requiredDocuments as string[]).join(', ')}`
                          : 'Upload supporting documents'
                        }
                      </p>
                    </div>

                    {expandedItem === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-slate-50 rounded-lg p-4"
                      >
                        <h5 className="font-medium text-slate-900 mb-2">Required Documents:</h5>
                        <ul className="text-sm text-slate-600 space-y-1">
                          {item.requiredDocuments && (item.requiredDocuments as string[]).length > 0 ? (
                            (item.requiredDocuments as string[]).map((doc, i) => (
                              <li key={i} className="flex items-center space-x-2">
                                <FileText className="w-4 h-4" />
                                <span>{doc}</span>
                              </li>
                            ))
                          ) : (
                            <li className="flex items-center space-x-2">
                              <FileText className="w-4 h-4" />
                              <span>Any relevant supporting documentation</span>
                            </li>
                          )}
                        </ul>
                        <Button 
                          size="sm" 
                          className="mt-3"
                          onClick={() => {
                            // Simulate file upload
                            toast({
                              title: "Upload Simulation",
                              description: "File upload would be implemented here with actual file handling.",
                            });
                          }}
                          data-testid={`button-upload-${item.id}`}
                        >
                          Choose Files
                        </Button>
                      </motion.div>
                    )}
                  </div>
                )}

                {/* Uploaded Documents Display */}
                {item.uploadedDocuments && (item.uploadedDocuments as any[]).length > 0 && (
                  <div className="mt-4 p-3 bg-success/5 rounded-lg border border-success/20">
                    <div className="flex items-center space-x-2 text-success text-sm">
                      <Paperclip className="w-4 h-4" />
                      <span>
                        {(item.uploadedDocuments as any[]).length} document(s) uploaded
                      </span>
                    </div>
                  </div>
                )}

                {/* Progress Status */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center space-x-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span>
                      {item.isCompleted ? 'Completed' : 'In Progress'}
                    </span>
                  </div>
                  
                  {!item.isCompleted && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleItemToggle(item.id, item.isCompleted || false)}
                      disabled={updateItemMutation.isPending}
                      data-testid={`button-mark-complete-${item.id}`}
                    >
                      Mark Complete
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
