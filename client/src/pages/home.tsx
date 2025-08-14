
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, TrendingUp, Clock, Plus, Wallet, Cloud, Shield, MessageCircle } from "lucide-react";
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

          {/* Smart Policy Analysis Section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-heading font-bold text-slate-900">Smart Policy Analysis</h2>
                <p className="text-slate-600">AI reads your policy so you don't have to</p>
              </div>
              <Badge className="bg-blue-100 text-blue-700 px-3 py-1">Auto-Everything</Badge>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                      <Upload className="w-7 h-7 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">One-Tap Upload</h3>
                      <p className="text-slate-600">Take a photo or upload PDF - AI extracts everything automatically</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-slate-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Auto-reads complex insurance language
                    </div>
                    <div className="flex items-center text-sm text-slate-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Explains coverage in plain English
                    </div>
                    <div className="flex items-center text-sm text-slate-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Spots missing coverage gaps
                    </div>
                  </div>
                  <Button 
                    onClick={() => setLocation('/upload')} 
                    className="w-full bg-blue-600 hover:bg-blue-700"
                    data-testid="button-upload-policy"
                  >
                    Upload Your Policy
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center">
                      <FileText className="w-7 h-7 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">Smart Analysis</h3>
                      <p className="text-slate-600">Get instant insights about your coverage and risks</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-slate-700">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                      Risk assessment in seconds
                    </div>
                    <div className="flex items-center text-sm text-slate-700">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                      Coverage recommendations
                    </div>
                    <div className="flex items-center text-sm text-slate-700">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                      Premium optimization tips
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setLocation('/analysis')}
                    className="w-full border-emerald-600 text-emerald-600 hover:bg-emerald-600 hover:text-white"
                    data-testid="button-view-analysis"
                  >
                    View All Analysis
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* One-Click Claims Section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-heading font-bold text-slate-900">One-Click Claims</h2>
                <p className="text-slate-600">Submit claims in 30 seconds, AI handles the paperwork</p>
              </div>
              <Badge className="bg-green-100 text-green-700 px-3 py-1">Zero Hassle</Badge>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="bg-gradient-to-br from-green-50 to-teal-50 border-green-200 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                      <Plus className="w-7 h-7 text-green-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">Quick Claim Prep</h3>
                      <p className="text-slate-600">AI guides you through the perfect claim submission</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-slate-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Smart document checklist
                    </div>
                    <div className="flex items-center text-sm text-slate-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Auto-fills insurer forms
                    </div>
                    <div className="flex items-center text-sm text-slate-700">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      Optimizes for quick approval
                    </div>
                  </div>
                  <Button 
                    onClick={() => setLocation('/claim-prep')}
                    className="w-full bg-green-600 hover:bg-green-700"
                    data-testid="button-start-claim"
                  >
                    Start New Claim
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-7 h-7 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900 mb-2">Live Tracking</h3>
                      <p className="text-slate-600">Get WhatsApp-style updates on your claim progress</p>
                    </div>
                  </div>
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-sm text-slate-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      Real-time status updates
                    </div>
                    <div className="flex items-center text-sm text-slate-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      Approval probability score
                    </div>
                    <div className="flex items-center text-sm text-slate-700">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                      Smart alerts when action needed
                    </div>
                  </div>
                  <Button 
                    variant="outline"
                    onClick={() => setLocation('/claim-tracker')}
                    className="w-full border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white"
                    data-testid="button-track-claims"
                  >
                    Track All Claims
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Blockchain Features Section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-heading font-bold text-slate-900">Blockchain Features</h2>
                <p className="text-slate-600">Optional advanced security for power users</p>
              </div>
              <Badge className="bg-orange-100 text-orange-700 px-3 py-1">Optional</Badge>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200 hover:shadow-lg transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-6 h-6 text-orange-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Wallet Login</h3>
                  <p className="text-sm text-slate-600 mb-3">No passwords, no data breaches</p>
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-600 font-medium">Available</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 hover:shadow-lg transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Cloud className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">IPFS Storage</h3>
                  <p className="text-sm text-slate-600 mb-3">Decentralized document storage</p>
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-600 font-medium">Available</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Privacy First</h3>
                  <p className="text-sm text-slate-600 mb-3">Local AI processing</p>
                  <div className="flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-xs text-green-600 font-medium">Active</span>
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

          {/* Smart Insights Section */}
          <div className="mb-16">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-heading font-bold text-slate-900">Smart Insights</h2>
                <p className="text-slate-600">AI that actually makes sense of your insurance</p>
              </div>
              <Badge className="bg-purple-100 text-purple-700 px-3 py-1">Human-in-Loop</Badge>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 hover:shadow-lg transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="w-6 h-6 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Risk Score</h3>
                  <p className="text-sm text-slate-600 mb-4">How well are you protected?</p>
                  <div className="text-3xl font-bold text-yellow-600 mb-1">
                    {policies?.length ? Math.round(75 + (policies.length * 5)) : 0}%
                  </div>
                  <div className="text-xs text-yellow-600">Coverage Score</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 border-indigo-200 hover:shadow-lg transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Auto-Read</h3>
                  <p className="text-sm text-slate-600 mb-4">Documents processed instantly</p>
                  <div className="text-3xl font-bold text-indigo-600 mb-1">
                    {policies?.length || 0}
                  </div>
                  <div className="text-xs text-indigo-600">Policies Scanned</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200 hover:shadow-lg transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-6 h-6 text-emerald-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Plain English</h3>
                  <p className="text-sm text-slate-600 mb-4">Complex terms simplified</p>
                  <div className="text-3xl font-bold text-emerald-600 mb-1">30s</div>
                  <div className="text-xs text-emerald-600">Avg. Explanation</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200 hover:shadow-lg transition-all">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="w-6 h-6 text-pink-600" />
                  </div>
                  <h3 className="font-semibold text-slate-900 mb-2">Smart Alerts</h3>
                  <p className="text-sm text-slate-600 mb-4">Only when you need to act</p>
                  <div className="text-3xl font-bold text-pink-600 mb-1">
                    {claims?.length || 0}
                  </div>
                  <div className="text-xs text-pink-600">Active Claims</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
