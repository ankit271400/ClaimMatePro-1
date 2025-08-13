import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Navigation from "@/components/navigation";
import ChecklistTimeline from "@/components/checklist-timeline";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Policy, Claim, ChecklistItem } from "@shared/schema";

const claimSchema = z.object({
  policyId: z.string().min(1, "Policy is required"),
  amount: z.number().min(1, "Amount must be greater than 0"),
  description: z.string().min(10, "Description must be at least 10 characters"),
});

type ClaimFormData = z.infer<typeof claimSchema>;

interface ClaimDetailsResponse {
  claim: Claim;
  checklistItems: ChecklistItem[];
}

export default function ClaimPrepPage() {
  const { id } = useParams();
  const [location, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showClaimForm, setShowClaimForm] = useState(!id);

  // Get policy ID from URL params or query string
  const searchParams = new URLSearchParams(window.location.search);
  const policyId = searchParams.get('policyId');

  const { data: policies } = useQuery<Policy[]>({
    queryKey: ["/api/policies"],
    enabled: !policyId,
  });

  const { data: claimDetails, isLoading } = useQuery<ClaimDetailsResponse>({
    queryKey: [`/api/claims/${id}`],
    enabled: !!id,
  });

  const createClaimMutation = useMutation({
    mutationFn: async (data: ClaimFormData) => {
      const response = await apiRequest('POST', '/api/claims', {
        ...data,
        amount: Math.round(data.amount * 100), // Convert to cents
      });
      return response.json();
    },
    onSuccess: (claim) => {
      toast({
        title: "Claim Created",
        description: `Your claim ${claim.claimNumber} has been created successfully.`,
      });
      queryClient.invalidateQueries({ queryKey: ["/api/claims"] });
      setLocation(`/claim-prep/${claim.id}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const form = useForm<ClaimFormData>({
    resolver: zodResolver(claimSchema),
    defaultValues: {
      policyId: policyId || "",
      amount: 0,
      description: "",
    },
  });

  const onSubmit = (data: ClaimFormData) => {
    createClaimMutation.mutate(data);
  };

  if (id && isLoading) {
    return (
      <div className="min-h-screen bg-bg-light">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 bg-white rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (id && !claimDetails) {
    return (
      <div className="min-h-screen bg-bg-light">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Claim Not Found</h3>
              <p className="text-slate-600 mb-6">
                The claim you're looking for doesn't exist or you don't have access to it.
              </p>
              <Button onClick={() => setLocation('/')}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/')} 
              className="mb-4"
              data-testid="button-back-dashboard"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">
              {claimDetails ? 'Claim Preparation Checklist' : 'Start New Claim'}
            </h1>
            <p className="text-lg text-slate-600">
              {claimDetails 
                ? `Prepare your claim ${claimDetails.claim.claimNumber} for submission`
                : 'Create a new insurance claim and get step-by-step guidance'
              }
            </p>
          </div>

          {/* New Claim Form */}
          {showClaimForm && !claimDetails && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Plus className="w-5 h-5" />
                  <span>Create New Claim</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="policyId">Policy</Label>
                      <select
                        {...form.register("policyId")}
                        className="w-full mt-1 p-2 border border-slate-300 rounded-lg"
                        data-testid="select-policy"
                      >
                        <option value="">Select a policy</option>
                        {policies?.map((policy) => (
                          <option key={policy.id} value={policy.id}>
                            {policy.fileName}
                          </option>
                        ))}
                      </select>
                      {form.formState.errors.policyId && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.policyId.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label htmlFor="amount">Claim Amount ($)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        {...form.register("amount", { valueAsNumber: true })}
                        placeholder="0.00"
                        data-testid="input-amount"
                      />
                      {form.formState.errors.amount && (
                        <p className="text-sm text-destructive mt-1">
                          {form.formState.errors.amount.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      {...form.register("description")}
                      placeholder="Describe the circumstances of your claim..."
                      rows={4}
                      data-testid="textarea-description"
                    />
                    {form.formState.errors.description && (
                      <p className="text-sm text-destructive mt-1">
                        {form.formState.errors.description.message}
                      </p>
                    )}
                  </div>

                  <div className="flex space-x-4">
                    <Button 
                      type="submit" 
                      disabled={createClaimMutation.isPending}
                      data-testid="button-create-claim"
                    >
                      {createClaimMutation.isPending ? "Creating..." : "Create Claim"}
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setShowClaimForm(false)}
                      data-testid="button-cancel-claim"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Existing Claims List */}
          {!showClaimForm && !claimDetails && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-heading font-semibold text-slate-900">
                  Your Claims
                </h2>
                <Button 
                  onClick={() => setShowClaimForm(true)}
                  data-testid="button-new-claim"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  New Claim
                </Button>
              </div>

              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600 mb-4">No claims yet</p>
                <Button 
                  onClick={() => setShowClaimForm(true)}
                  data-testid="button-start-first-claim"
                >
                  Start Your First Claim
                </Button>
              </div>
            </div>
          )}

          {/* Claim Checklist */}
          {claimDetails && (
            <div className="space-y-8">
              {/* Progress Overview */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Progress Overview</h3>
                    <span className="text-sm text-slate-600">
                      {claimDetails.checklistItems.filter(item => item.isCompleted).length} of {claimDetails.checklistItems.length} completed
                    </span>
                  </div>
                  <div className="bg-slate-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300" 
                      style={{ 
                        width: `${(claimDetails.checklistItems.filter(item => item.isCompleted).length / claimDetails.checklistItems.length) * 100}%` 
                      }}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Checklist Timeline */}
              <ChecklistTimeline 
                items={claimDetails.checklistItems}
                claimId={claimDetails.claim.id}
              />

              {/* Continue to Tracker */}
              <Card>
                <CardContent className="p-6 text-center">
                  <h3 className="font-semibold text-slate-900 mb-2">Ready to Submit?</h3>
                  <p className="text-slate-600 mb-6">
                    Once you've completed all the required steps, you can track your claim progress.
                  </p>
                  <Button 
                    onClick={() => setLocation(`/claim-tracker/${claimDetails.claim.id}`)}
                    data-testid="button-track-claim"
                  >
                    Continue to Claim Tracker
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
