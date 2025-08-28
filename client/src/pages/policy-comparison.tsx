import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { 
  ArrowLeftRight, 
  TrendingUp, 
  TrendingDown, 
  Shield, 
  Star, 
  Clock, 
  IndianRupee,
  ExternalLink,
  CheckCircle,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import { useLocation } from "wouter";
import type { PolicyProduct } from "@shared/schema";

interface ComparisonData {
  current: {
    id: string;
    fileName: string;
    estimatedCoverage: number;
    category: string;
  };
  alternatives: PolicyProduct[];
  comparisonDate: string;
}

export default function PolicyComparisonPage() {
  const [location] = useLocation();
  const [, setLocation] = useLocation();
  
  // Extract policy ID from URL path like /compare/:id
  const policyId = location.split('/')[2];
  const [selectedPolicies, setSelectedPolicies] = useState<string[]>([]);

  const { data: comparisonData, isLoading } = useQuery<ComparisonData>({
    queryKey: ['/api/policies', policyId, 'compare'],
    enabled: !!policyId,
  });

  const handlePolicySelect = (policyId: string) => {
    setSelectedPolicies(prev => {
      if (prev.includes(policyId)) {
        return prev.filter(id => id !== policyId);
      } else if (prev.length < 3) { // Limit to 3 policies for comparison
        return [...prev, policyId];
      }
      return prev;
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatCoverage = (lakhs: number) => {
    return `₹${lakhs} Lakh${lakhs !== 1 ? 's' : ''}`;
  };

  const getComparisonIcon = (current: number, alternative: number, lowerIsBetter: boolean = false) => {
    if (current === alternative) return null;
    
    const isBetter = lowerIsBetter ? alternative < current : alternative > current;
    
    return isBetter ? (
      <TrendingUp className="w-4 h-4 text-green-600" />
    ) : (
      <TrendingDown className="w-4 h-4 text-red-600" />
    );
  };

  const getBadgeVariant = (current: number, alternative: number, lowerIsBetter: boolean = false) => {
    if (current === alternative) return "secondary";
    
    const isBetter = lowerIsBetter ? alternative < current : alternative > current;
    return isBetter ? "default" : "destructive";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-bg-light">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
            <div className="grid md:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-96 bg-slate-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!comparisonData) {
    return (
      <div className="min-h-screen bg-bg-light">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <AlertTriangle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-900 mb-4">Policy Not Found</h1>
          <p className="text-slate-600 mb-8">The policy you're trying to compare doesn't exist or couldn't be loaded.</p>
          <Button onClick={() => setLocation('/analysis')} data-testid="button-back-analysis">
            Back to Analysis
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-light">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-heading font-bold text-slate-900 mb-2">
              Policy Comparison
            </h1>
            <p className="text-slate-600">
              Compare your policy with better alternatives from top Indian insurers
            </p>
          </div>

          {/* Current Policy Info */}
          <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2">Your Current Policy</h3>
                  <p className="text-slate-600">{comparisonData.current.fileName}</p>
                  <div className="flex items-center space-x-4 mt-2">
                    <Badge variant="secondary">
                      {formatCoverage(comparisonData.current.estimatedCoverage)}
                    </Badge>
                    <Badge variant="outline" className="capitalize">
                      {comparisonData.current.category} Insurance
                    </Badge>
                  </div>
                </div>
                <ArrowLeftRight className="w-12 h-12 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          {/* Alternatives Grid */}
          <div className="mb-8">
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-6">
              Better Alternatives ({comparisonData.alternatives.length} found)
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {comparisonData.alternatives.map((policy) => (
                <Card 
                  key={policy.id} 
                  className={`hover:shadow-lg transition-all cursor-pointer group ${
                    selectedPolicies.includes(policy.id) ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handlePolicySelect(policy.id)}
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <CardTitle className="text-lg font-semibold text-slate-900">
                          {policy.policyName}
                        </CardTitle>
                        <p className="text-sm text-slate-600 mt-1">{policy.insurer}</p>
                      </div>
                      {selectedPolicies.includes(policy.id) && (
                        <CheckCircle className="w-6 h-6 text-primary" />
                      )}
                    </div>
                    
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="text-center p-2 bg-slate-50 rounded">
                        <div className="font-semibold text-slate-900">
                          {formatCoverage(policy.coverage)}
                        </div>
                        <div className="text-xs text-slate-600">Coverage</div>
                      </div>
                      <div className="text-center p-2 bg-slate-50 rounded">
                        <div className="font-semibold text-slate-900">
                          {formatCurrency(policy.premium)}
                        </div>
                        <div className="text-xs text-slate-600">Premium</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    {/* Comparison Highlights */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Claim Ratio</span>
                        <div className="flex items-center space-x-2">
                          <Badge variant="default" className="bg-green-100 text-green-700">
                            {policy.claimSettlementRatio || 0}%
                          </Badge>
                          {getComparisonIcon(85, policy.claimSettlementRatio || 0)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Waiting Period</span>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={getBadgeVariant(3, policy.waitingPeriod || 0, true)}
                          >
                            {policy.waitingPeriod || 0} years
                          </Badge>
                          {getComparisonIcon(3, policy.waitingPeriod || 0, true)}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">Co-pay</span>
                        <div className="flex items-center space-x-2">
                          <Badge 
                            variant={getBadgeVariant(20, policy.copay || 0, true)}
                          >
                            {policy.copay || 0}%
                          </Badge>
                          {getComparisonIcon(20, policy.copay || 0, true)}
                        </div>
                      </div>
                    </div>

                    {/* Key Features */}
                    <div className="mb-4">
                      <h4 className="font-medium text-slate-900 mb-2">Key Features</h4>
                      <div className="flex flex-wrap gap-1">
                        {(policy.keyFeatures as string[] || []).slice(0, 3).map((feature: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          // In real app, link to insurer's page
                          window.open('#', '_blank');
                        }}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Learn More
                      </Button>
                      <Button 
                        size="sm" 
                        className="flex-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePolicySelect(policy.id);
                        }}
                      >
                        {selectedPolicies.includes(policy.id) ? 'Selected' : 'Select'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Compare Selected Button */}
          {selectedPolicies.length > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50"
            >
              <Card className="shadow-lg">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-slate-600">
                      {selectedPolicies.length} policies selected
                    </div>
                    <Button 
                      onClick={() => setLocation(`/compare/detailed?ids=${selectedPolicies.join(',')}`)}
                      data-testid="button-compare-detailed"
                    >
                      <ArrowLeftRight className="w-4 h-4 mr-2" />
                      Compare Side by Side
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Back to Analysis */}
          <div className="mt-12 text-center">
            <Button 
              variant="outline" 
              onClick={() => setLocation('/analysis')}
              data-testid="button-back-analysis"
            >
              Back to Analysis
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}