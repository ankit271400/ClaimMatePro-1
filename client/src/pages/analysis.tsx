import { useParams } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowLeft, FileText, TrendingUp, ArrowLeftRight, Shield, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import RiskScoreGauge from "@/components/risk-score-gauge";
import ClauseCard from "@/components/clause-card";
import { useLocation } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";
import type { Policy, Analysis } from "@shared/schema";

interface AnalysisResponse {
  policy: Policy;
  analysis: Analysis;
}

export default function AnalysisPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();

  const { data, isLoading, error } = useQuery<AnalysisResponse>({
    queryKey: [`/api/policies/${id}/analysis`],
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-light">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Button variant="ghost" onClick={() => setLocation('/')} className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-8">
                  <Skeleton className="h-48 w-full mb-6" />
                  <Skeleton className="h-8 w-16 mx-auto mb-2" />
                  <Skeleton className="h-4 w-24 mx-auto" />
                </CardContent>
              </Card>
            </div>
            <div className="lg:col-span-2 space-y-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
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
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Analysis Not Ready</h3>
              <p className="text-slate-600 mb-6">
                Your policy analysis is still being processed. Please check back in a few minutes.
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={() => setLocation('/')}>
                  Back to Dashboard
                </Button>
                <Button onClick={() => window.location.reload()}>
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const { policy, analysis } = data;
  const flaggedClauses = (analysis.flaggedClauses as any[]) || [];

  const getRiskLevelColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-slate-600';
    }
  };

  // Check if policy has been blockchain verified
  const isBlockchainVerified = analysis.recommendations?.includes('🔒 Blockchain Verification') || 
                               analysis.recommendations?.includes('Yellow Network');

  // Split recommendations to separate blockchain section
  const getRecommendationsData = () => {
    if (!analysis.recommendations) return { main: '', blockchain: '' };
    
    const parts = analysis.recommendations.split('\n\n🔒 Blockchain Verification:');
    return {
      main: parts[0],
      blockchain: parts.length > 1 ? parts[1] : ''
    };
  };

  const { main: mainRecommendations, blockchain: blockchainInfo } = getRecommendationsData();

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
              Policy Analysis Results
            </h1>
            <p className="text-lg text-slate-600">
              AI-powered analysis of {policy.fileName}
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 mb-8">
            {/* Risk Score */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center">Risk Score</CardTitle>
                </CardHeader>
                <CardContent className="p-8">
                  <RiskScoreGauge 
                    score={analysis.riskScore || 0} 
                    level={analysis.riskLevel || 'low'} 
                  />
                  <div className="text-center mt-6">
                    <div className={`text-3xl font-bold ${getRiskLevelColor(analysis.riskLevel || 'low')}`}>
                      {(analysis.riskScore! / 10).toFixed(1)}
                    </div>
                    <div className="text-sm text-slate-600 mb-4">Out of 10</div>
                    <div className="px-4 py-2 bg-slate-100 rounded-lg">
                      <span className={`font-medium capitalize ${getRiskLevelColor(analysis.riskLevel || 'low')}`}>
                        {analysis.riskLevel} Risk
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Summary */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Executive Summary</CardTitle>
                    {isBlockchainVerified && (
                      <Badge 
                        className="bg-blue-100 text-blue-700 border-blue-200"
                        data-testid="badge-blockchain-verified"
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        Blockchain Verified
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 leading-relaxed mb-6" data-testid="text-summary">
                    {analysis.summary}
                  </p>
                  
                  {analysis.recommendations && (
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Recommendations</h4>
                      <p className="text-slate-700 leading-relaxed mb-4" data-testid="text-recommendations">
                        {mainRecommendations}
                      </p>
                      
                      {/* Blockchain Security Section */}
                      {isBlockchainVerified && blockchainInfo && (
                        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                          <div className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <Shield className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <h5 className="font-semibold text-blue-900 mb-2 flex items-center">
                                <Check className="w-4 h-4 mr-2" />
                                Yellow Network Security
                              </h5>
                              <p className="text-blue-800 text-sm leading-relaxed" data-testid="text-blockchain-info">
                                {blockchainInfo.trim()}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Flagged Clauses */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-heading font-bold text-slate-900">
                Flagged Clauses ({flaggedClauses.length})
              </h2>
              <div className="flex space-x-3">
                <Button 
                  variant="outline"
                  onClick={() => setLocation(`/compare/${policy.id}`)}
                  data-testid="button-compare-policies"
                >
                  <ArrowLeftRight className="w-4 h-4 mr-2" />
                  Compare Policies
                </Button>
                <Button 
                  onClick={() => setLocation(`/claim-prep?policyId=${policy.id}`)}
                  data-testid="button-start-claim-prep"
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Start Claim Preparation
                </Button>
              </div>
            </div>

            {flaggedClauses.length > 0 ? (
              <div className="space-y-6">
                {flaggedClauses.map((clause: any, index: number) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <ClauseCard clause={clause} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">No Issues Found</h3>
                  <p className="text-slate-600">
                    Great news! Our analysis didn't identify any major concerns with your policy.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Actions */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  variant="outline"
                  onClick={() => setLocation('/upload')}
                  data-testid="button-upload-another"
                >
                  Upload Another Policy
                </Button>
                <Button 
                  onClick={() => setLocation(`/claim-prep?policyId=${policy.id}`)}
                  data-testid="button-prepare-claim"
                >
                  Prepare a Claim
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
