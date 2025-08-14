import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, TrendingUp, Clock, Plus, Wallet, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import WalletConnect from "@/components/wallet-connect";
import PinataSetup from "@/components/pinata-setup";
import { useLocation } from "wouter";
import { useWallet } from "@/hooks/useWallet";
import type { Policy, Claim } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const [showWalletSetup, setShowWalletSetup] = useState(true);
  const [showPinataSetup, setShowPinataSetup] = useState(false);
  const { isConnected } = useWallet();

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

  const handleWalletConnected = () => {
    setShowWalletSetup(false);
    setShowPinataSetup(true);
  };

  const handlePinataSetup = () => {
    setShowPinataSetup(false);
  };

  // Show wallet setup if not connected
  if (showWalletSetup && !isConnected) {
    return (
      <div className="min-h-screen bg-bg-light">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-heading font-bold text-slate-900 mb-4">
              Welcome to ClaimMate Dashboard
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Connect your MetaMask wallet to access secure document storage and claim management
            </p>
          </motion.div>
          
          <div className="flex justify-center">
            <WalletConnect onConnected={handleWalletConnected} showDisconnect={false} />
          </div>
        </div>
      </div>
    );
  }

  // Show Pinata setup after wallet connection
  if (showPinataSetup && isConnected) {
    return (
      <div className="min-h-screen bg-bg-light">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <Wallet className="w-4 h-4 text-green-600" />
              </div>
              <div className="text-2xl">→</div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <Cloud className="w-4 h-4 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-heading font-bold text-slate-900 mb-4">
              Setup IPFS Storage
            </h1>
            <p className="text-xl text-slate-600 mb-8">
              Configure Pinata to store your documents securely on the blockchain
            </p>
          </motion.div>
          
          <div className="flex justify-center">
            <PinataSetup onSetupComplete={handlePinataSetup} />
          </div>
          
          <div className="flex justify-center mt-6">
            <Button
              variant="outline"
              onClick={handlePinataSetup}
              data-testid="button-skip-pinata"
            >
              Skip for now
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Wallet Status Banner */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="font-medium text-green-700">Wallet Connected</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-blue-700">IPFS Ready</span>
                  </div>
                </div>
                <Badge variant="secondary" className="bg-white">
                  Blockchain Enabled
                </Badge>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">Dashboard</h1>
            <p className="text-slate-600">Manage your policies and claims in one place</p>
          </div>

          {/* Core Features Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">Core Features</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Policy Analysis */}
              <Card className="hover:shadow-lg transition-shadow group">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                      <Upload className="w-8 h-8 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Policy Analysis</h3>
                      <p className="text-sm text-slate-600 mb-4">Upload and analyze insurance policies with AI-powered insights</p>
                    </div>
                    <Button 
                      onClick={() => setLocation('/upload')} 
                      className="w-full"
                      data-testid="button-upload-policy"
                    >
                      Upload Policy
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Claim Preparation */}
              <Card className="hover:shadow-lg transition-shadow group">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-green-50 rounded-xl flex items-center justify-center group-hover:bg-green-100 transition-colors">
                      <Plus className="w-8 h-8 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Claim Preparation</h3>
                      <p className="text-sm text-slate-600 mb-4">Prepare claims with guided checklists and document management</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setLocation('/claim-prep')}
                      className="w-full"
                      data-testid="button-start-claim"
                    >
                      Start Claim
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Claim Tracking */}
              <Card className="hover:shadow-lg transition-shadow group">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-16 h-16 bg-purple-50 rounded-xl flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Claim Tracking</h3>
                      <p className="text-sm text-slate-600 mb-4">Monitor claim progress with real-time status updates</p>
                    </div>
                    <Button 
                      variant="outline" 
                      onClick={() => setLocation('/claim-tracker')}
                      className="w-full"
                      data-testid="button-track-claims"
                    >
                      Track Claims
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Blockchain Features Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">Blockchain Features</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {/* Wallet Integration */}
              <Card className="hover:shadow-lg transition-shadow border-2 border-green-100">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                      <Wallet className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">MetaMask Integration</h3>
                      <p className="text-sm text-slate-600">Secure wallet-based authentication without traditional login</p>
                      <div className="flex items-center mt-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="text-xs text-green-600 font-medium">Connected & Active</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* IPFS Storage */}
              <Card className="hover:shadow-lg transition-shadow border-2 border-blue-100">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Cloud className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900">IPFS Storage</h3>
                      <p className="text-sm text-slate-600">Decentralized document storage via Pinata gateway</p>
                      <div className="flex items-center mt-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                        <span className="text-xs text-blue-600 font-medium">Ready for Upload</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">Recent Activity</h2>
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
          </div>

          {/* AI & Analytics Section */}
          <div className="mb-12">
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">AI & Analytics</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Risk Assessment */}
              <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Risk Assessment</h3>
                  <p className="text-sm text-slate-600 mb-4">AI-powered analysis of policy terms and coverage gaps</p>
                  <div className="text-2xl font-bold text-orange-600">
                    {policies?.length || 0}
                  </div>
                  <div className="text-xs text-orange-600">Policies Analyzed</div>
                </CardContent>
              </Card>

              {/* Document Processing */}
              <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">OCR Processing</h3>
                  <p className="text-sm text-slate-600 mb-4">Extract text from documents with high accuracy</p>
                  <div className="text-2xl font-bold text-indigo-600">99%</div>
                  <div className="text-xs text-indigo-600">Accuracy Rate</div>
                </CardContent>
              </Card>

              {/* Natural Language */}
              <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Plain Language</h3>
                  <p className="text-sm text-slate-600 mb-4">Convert complex terms into understandable summaries</p>
                  <div className="text-2xl font-bold text-emerald-600">
                    {claims?.length || 0}
                  </div>
                  <div className="text-xs text-emerald-600">Claims Processed</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
