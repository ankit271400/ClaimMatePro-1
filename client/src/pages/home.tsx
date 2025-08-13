import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Upload, FileText, TrendingUp, Clock, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import { useLocation } from "wouter";
import type { Policy, Claim } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();

  const { data: policies, isLoading: policiesLoading } = useQuery<Policy[]>({
    queryKey: ["/api/policies"],
  });

  const { data: claims, isLoading: claimsLoading } = useQuery<Claim[]>({
    queryKey: ["/api/claims"],
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'processing': return 'bg-warning text-warning-foreground';
      case 'failed': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getClaimStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success text-success-foreground';
      case 'processing': 
      case 'under_review': return 'bg-warning text-warning-foreground';
      case 'decision':
      case 'payment': return 'bg-secondary text-secondary-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-bg-light">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-600">Manage your policies and claims in one place</p>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Upload className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">Upload New Policy</h3>
                    <p className="text-sm text-slate-600">Get AI-powered analysis of your insurance policy</p>
                  </div>
                  <Button onClick={() => setLocation('/upload')} data-testid="button-upload-policy">
                    Upload
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                    <Plus className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">Start New Claim</h3>
                    <p className="text-sm text-slate-600">Begin the claim preparation process</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setLocation('/claim-prep')}
                    data-testid="button-start-claim"
                  >
                    Start Claim
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Policies */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Recent Policies</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {policiesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : policies && policies.length > 0 ? (
                  <div className="space-y-4">
                    {policies.slice(0, 5).map((policy) => (
                      <div key={policy.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900" data-testid={`text-policy-name-${policy.id}`}>
                            {policy.fileName}
                          </h4>
                          <p className="text-sm text-slate-600">
                            Uploaded {new Date(policy.uploadedAt!).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getStatusColor(policy.analysisStatus!)}>
                            {policy.analysisStatus === 'completed' ? 'Analyzed' : policy.analysisStatus}
                          </Badge>
                          {policy.analysisStatus === 'completed' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setLocation(`/analysis/${policy.id}`)}
                              data-testid={`button-view-analysis-${policy.id}`}
                            >
                              View Analysis
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">No policies uploaded yet</p>
                    <Button onClick={() => setLocation('/upload')} data-testid="button-upload-first-policy">
                      Upload Your First Policy
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Active Claims */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>Active Claims</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {claimsLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : claims && claims.length > 0 ? (
                  <div className="space-y-4">
                    {claims.slice(0, 5).map((claim) => (
                      <div key={claim.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors">
                        <div className="flex-1">
                          <h4 className="font-medium text-slate-900" data-testid={`text-claim-number-${claim.id}`}>
                            {claim.claimNumber}
                          </h4>
                          <p className="text-sm text-slate-600">
                            ${(claim.amount! / 100).toFixed(2)} • 
                            Submitted {new Date(claim.submittedAt!).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getClaimStatusColor(claim.status!)}>
                            {claim.status?.replace('_', ' ')}
                          </Badge>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setLocation(`/claim-tracker/${claim.id}`)}
                            data-testid={`button-track-claim-${claim.id}`}
                          >
                            Track
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Clock className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                    <p className="text-slate-600 mb-4">No active claims</p>
                    <Button 
                      variant="outline" 
                      onClick={() => setLocation('/claim-prep')}
                      data-testid="button-start-first-claim"
                    >
                      Start Your First Claim
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
