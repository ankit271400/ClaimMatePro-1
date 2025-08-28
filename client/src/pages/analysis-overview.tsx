import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { FileText, TrendingUp, ArrowRight, Shield, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import { useLocation } from "wouter";
import { useWallet } from "@/hooks/useWallet";
import WalletConnect from "@/components/wallet-connect";
import type { Policy, Analysis } from "@shared/schema";

interface PolicyWithAnalysis extends Policy {
  analysis?: Analysis;
}

export default function AnalysisOverviewPage() {
  const [, setLocation] = useLocation();
  const { isConnected } = useWallet();

  const { data: policies, isLoading } = useQuery<PolicyWithAnalysis[]>({
    queryKey: ["/api/policies"],
  });

  const completedAnalyses = policies?.filter(p => p.analysisStatus === 'completed') || [];
  const processingAnalyses = policies?.filter(p => p.analysisStatus === 'processing') || [];
  const pendingAnalyses = policies?.filter(p => p.analysisStatus === 'pending') || [];

  // Note: Authentication removed - all users can access analysis features

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
            <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Policy Analysis Center</h1>
            <p className="text-slate-600">AI-powered insights and risk assessment for your insurance policies</p>
          </div>

          {/* Analysis Statistics */}
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {completedAnalyses.length}
                </div>
                <div className="text-sm text-green-700">Completed</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">
                  {processingAnalyses.length}
                </div>
                <div className="text-sm text-blue-700">Processing</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-6 h-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-orange-600 mb-1">
                  {pendingAnalyses.length}
                </div>
                <div className="text-sm text-orange-700">Pending</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {policies?.length || 0}
                </div>
                <div className="text-sm text-purple-700">Total Policies</div>
              </CardContent>
            </Card>
          </div>

          {/* Completed Analyses Section */}
          {completedAnalyses.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">Completed Analyses</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedAnalyses.map((policy) => (
                  <Card key={policy.id} className="hover:shadow-lg transition-shadow group">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-green-600" />
                        </div>
                        <Badge className="bg-green-100 text-green-700">
                          Analyzed
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2 truncate" title={policy.fileName}>
                        {policy.fileName}
                      </h3>
                      <p className="text-sm text-slate-600 mb-4">
                        Uploaded {new Date(policy.uploadedAt!).toLocaleDateString()}
                      </p>
                      <Button 
                        onClick={() => setLocation(`/analysis/${policy.id}`)}
                        className="w-full group-hover:bg-primary/90"
                        data-testid={`button-view-analysis-${policy.id}`}
                      >
                        View Analysis
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Processing Analyses Section */}
          {processingAnalyses.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">Processing</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {processingAnalyses.map((policy) => (
                  <Card key={policy.id} className="border-blue-200 bg-blue-50/30">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                          <TrendingUp className="w-6 h-6 text-blue-600 animate-pulse" />
                        </div>
                        <Badge className="bg-blue-100 text-blue-700">
                          Processing
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2 truncate" title={policy.fileName}>
                        {policy.fileName}
                      </h3>
                      <p className="text-sm text-slate-600 mb-4">
                        Analysis in progress...
                      </p>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{ width: '65%' }}></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Pending Analyses Section */}
          {pendingAnalyses.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">Pending Analysis</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pendingAnalyses.map((policy) => (
                  <Card key={policy.id} className="border-orange-200 bg-orange-50/30">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center">
                          <AlertTriangle className="w-6 h-6 text-orange-600" />
                        </div>
                        <Badge className="bg-orange-100 text-orange-700">
                          Pending
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-slate-900 mb-2 truncate" title={policy.fileName}>
                        {policy.fileName}
                      </h3>
                      <p className="text-sm text-slate-600 mb-4">
                        Waiting for analysis to begin
                      </p>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && (!policies || policies.length === 0) && (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FileText className="w-12 h-12 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">No Policies Found</h3>
              <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Upload your first insurance policy to get started with AI-powered analysis and insights.
              </p>
              <Button onClick={() => setLocation('/upload')} data-testid="button-upload-first-policy">
                Upload Your First Policy
              </Button>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}