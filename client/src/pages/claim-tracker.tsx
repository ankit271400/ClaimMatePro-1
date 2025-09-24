import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, Check, Eye, Gavel, CreditCard, MessageCircle, Phone, Shield, Star, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import StatusTracker from "@/components/status-tracker";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

import type { Claim, ClaimUpdate } from "@shared/schema";

interface ClaimDetailsResponse {
  claim: Claim;
  checklistItems: any[];
  updates: ClaimUpdate[];
}

export default function ClaimTrackerPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();


  const { data, isLoading, error } = useQuery<ClaimDetailsResponse>({
    queryKey: [`/api/claims/${id}`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-light">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-8 w-64 mb-8" />
          
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-bg-light">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
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

  const { claim, updates } = data;

  // Check if claim is blockchain secured
  const isBlockchainSecured = updates.some(update => 
    update.title?.includes('Blockchain') || 
    update.title?.includes('Yellow Network') ||
    update.description?.includes('🔒') ||
    update.description?.includes('Yellow Network')
  );

  // Get blockchain-related updates
  const blockchainUpdates = updates.filter(update => 
    update.title?.includes('Blockchain') || 
    update.title?.includes('Yellow Network') ||
    update.description?.includes('🔒')
  );

  const getStatusSteps = () => {
    return [
      {
        id: 'submitted',
        title: 'Submitted',
        icon: Check,
        completed: true,
        date: claim.submittedAt ? new Date(claim.submittedAt).toLocaleDateString() : '',
      },
      {
        id: 'under_review',
        title: 'Under Review',
        icon: Eye,
        completed: ['under_review', 'processing', 'decision', 'payment', 'completed'].includes(claim.status!),
        date: claim.status === 'under_review' ? 'In Progress' : '',
      },
      {
        id: 'processing',
        title: 'Processing',
        icon: Gavel,
        completed: ['processing', 'decision', 'payment', 'completed'].includes(claim.status!),
        current: claim.status === 'processing',
        date: claim.status === 'processing' ? 'In Progress' : '',
      },
      {
        id: 'decision',
        title: 'Decision',
        icon: Gavel,
        completed: ['decision', 'payment', 'completed'].includes(claim.status!),
        current: claim.status === 'decision',
        date: claim.status === 'decision' ? 'In Progress' : '',
      },
      {
        id: 'payment',
        title: 'Payment',
        icon: CreditCard,
        completed: ['payment', 'completed'].includes(claim.status!),
        current: claim.status === 'payment',
        date: claim.status === 'completed' ? 'Completed' : claim.status === 'payment' ? 'In Progress' : '',
      },
    ];
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount / 100);
  };

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
              Claim Status Tracker
            </h1>
            <p className="text-lg text-slate-600">
              Track your claim progress in real-time
            </p>
          </div>

          {/* Claim Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Claim Overview</CardTitle>
                  {isBlockchainSecured && (
                    <Badge 
                      className="bg-blue-100 text-blue-700 border-blue-200"
                      data-testid="badge-blockchain-secured"
                    >
                      <Shield className="w-3 h-3 mr-1" />
                      Yellow Network Secured
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-8 pt-0">
                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-slate-900" data-testid="text-claim-number">
                      {claim.claimNumber}
                    </div>
                    <div className="text-sm text-slate-600">Claim Number</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-secondary" data-testid="text-estimated-time">
                      {claim.estimatedProcessingDays} days
                    </div>
                    <div className="text-sm text-slate-600">
                      {isBlockchainSecured ? 'Accelerated Processing' : 'Estimated Processing Time'}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-success" data-testid="text-claim-amount">
                      {formatAmount(claim.amount!)}
                    </div>
                    <div className="text-sm text-slate-600">Claim Amount</div>
                  </div>
                </div>

                {/* Blockchain Security Features */}
                {isBlockchainSecured && (
                  <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Lock className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-blue-900 mb-2">Enhanced Security Features</h4>
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="flex items-center text-blue-800">
                            <Check className="w-3 h-3 mr-2" />
                            Decentralized verification
                          </div>
                          <div className="flex items-center text-blue-800">
                            <Check className="w-3 h-3 mr-2" />
                            Tamper-proof tracking
                          </div>
                          <div className="flex items-center text-blue-800">
                            <Check className="w-3 h-3 mr-2" />
                            Instant settlement
                          </div>
                          <div className="flex items-center text-blue-800">
                            <Check className="w-3 h-3 mr-2" />
                            Cross-chain payments
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <StatusTracker steps={getStatusSteps()} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Recent Updates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Recent Updates</CardTitle>
              </CardHeader>
              <CardContent>
                {updates.length > 0 ? (
                  <div className="space-y-4">
                    {updates.map((update) => {
                      const isBlockchainUpdate = update.title?.includes('Blockchain') || 
                                                update.title?.includes('Yellow Network') ||
                                                update.description?.includes('🔒');
                      
                      return (
                        <div 
                          key={update.id} 
                          className={`flex items-start space-x-4 p-4 rounded-lg border ${
                            isBlockchainUpdate 
                              ? 'border-blue-200 bg-blue-50' 
                              : 'border-slate-100'
                          }`}
                          data-testid={`update-${update.id}`}
                        >
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${
                            isBlockchainUpdate 
                              ? 'bg-blue-100' 
                              : 'bg-slate-100'
                          }`}>
                            {isBlockchainUpdate ? (
                              <Shield className="w-3 h-3 text-blue-600" />
                            ) : (
                              <div className="w-2 h-2 bg-secondary rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center space-x-2">
                                <h4 className={`text-sm font-medium ${
                                  isBlockchainUpdate ? 'text-blue-900' : 'text-slate-900'
                                }`}>
                                  {update.title}
                                </h4>
                                {isBlockchainUpdate && (
                                  <Badge 
                                    className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5"
                                    data-testid="badge-yellow-network"
                                  >
                                    <Star className="w-2 h-2 mr-1" />
                                    Secured
                                  </Badge>
                                )}
                              </div>
                              <span className="text-xs text-slate-500">
                                {new Date(update.createdAt!).toLocaleDateString()}
                              </span>
                            </div>
                            <p className={`text-sm ${
                              isBlockchainUpdate ? 'text-blue-800' : 'text-slate-600'
                            }`}>
                              {update.description}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="w-6 h-6 text-slate-400" />
                    </div>
                    <p className="text-slate-600">No updates yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Support */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardContent className="p-8">
                <div className="bg-gradient-to-r from-primary to-primary/80 rounded-2xl p-8 text-white text-center">
                  <h2 className="text-2xl font-heading font-bold mb-4">Need Help with Your Claim?</h2>
                  <p className="text-primary-100 mb-6">
                    Connect with our expert advisors for personalized guidance on your insurance claim process.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      className="bg-white text-primary hover:bg-slate-50"
                      data-testid="button-chat-advisor"
                    >
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Chat with Advisor
                    </Button>
                    <Button 
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10"
                      data-testid="button-schedule-call"
                    >
                      <Phone className="w-5 h-5 mr-2" />
                      Schedule Call
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
