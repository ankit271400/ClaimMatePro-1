import { motion } from "framer-motion";
import { Shield, Eye, Clock, ArrowRight, Upload, Info, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Landing() {
  const scrollToUpload = () => {
    document.getElementById('upload')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSignIn = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-heading font-bold text-slate-900">ClaimMate</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-600 hover:text-primary transition-colors">Features</a>
              <a href="#how-it-works" className="text-slate-600 hover:text-primary transition-colors">How it Works</a>
              <a href="#security" className="text-slate-600 hover:text-primary transition-colors">Security</a>
              <Button onClick={handleSignIn} data-testid="button-signin">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/5 to-secondary/5 pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div 
              className="max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl lg:text-6xl font-heading font-bold text-slate-900 leading-tight">
                Understand Your 
                <span className="text-primary"> Insurance Policy</span> 
                in Plain English
              </h1>
              <p className="mt-6 text-lg text-slate-600 leading-relaxed">
                Upload your policy document and get an AI-powered risk analysis, plain language summaries, and personalized claim preparation guidance in minutes.
              </p>
              
              {/* Trust Badges */}
              <div className="mt-8 flex flex-wrap items-center gap-6">
                <div className="flex items-center space-x-2">
                  <Shield className="w-5 h-5 text-success" />
                  <span className="text-sm text-slate-600">Secure & Private</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Eye className="w-5 h-5 text-success" />
                  <span className="text-sm text-slate-600">100% Confidential</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-success" />
                  <span className="text-sm text-slate-600">Results in Minutes</span>
                </div>
              </div>

              <div className="mt-10">
                <Button 
                  onClick={scrollToUpload}
                  size="lg"
                  className="transform hover:scale-105 transition-transform duration-200"
                  data-testid="button-analyze-policy"
                >
                  Analyze My Policy Now
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </div>
            </motion.div>

            <motion.div 
              className="mt-12 lg:mt-0"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <img 
                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                alt="Modern document analysis dashboard" 
                className="rounded-2xl shadow-2xl w-full" 
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section id="upload" className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-heading font-bold text-slate-900">Upload Your Policy Document</h2>
            <p className="mt-4 text-lg text-slate-600">Drag and drop your PDF or image file, or click to browse</p>
          </motion.div>

          <motion.div 
            className="border-2 border-dashed border-primary/20 rounded-2xl p-12 text-center hover:border-primary/40 transition-all duration-300 hover:bg-primary/5 cursor-pointer"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            data-testid="upload-zone"
          >
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <Upload className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Drop your policy document here</h3>
            <p className="text-slate-600 mb-4">PDF, JPG, PNG up to 10MB</p>
            <Button onClick={handleSignIn} data-testid="button-choose-file">
              Sign In to Upload
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Demo Analysis Results Section */}
      <section className="py-16 bg-bg-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-heading font-bold text-slate-900">See What You'll Get</h2>
            <p className="mt-4 text-lg text-slate-600">AI-powered analysis of your insurance policy</p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Demo Risk Score */}
            <motion.div 
              className="lg:col-span-1"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-heading font-semibold text-slate-900 mb-6 text-center">Risk Score</h3>
                <div className="w-32 h-32 mx-auto mb-6 relative">
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#f1f5f9" strokeWidth="8"/>
                    <circle cx="60" cy="60" r="50" fill="none" stroke="#f59e0b" strokeWidth="8" 
                            strokeDasharray={`${72 * 3.14} ${(100-72) * 3.14}`} strokeLinecap="round"/>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-warning">7.2</span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-slate-600">Out of 10</div>
                  <div className="mt-4 px-4 py-2 bg-warning/10 rounded-lg">
                    <span className="text-warning font-medium">Moderate Risk</span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Demo Flagged Clauses */}
            <motion.div 
              className="lg:col-span-2"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="space-y-6">
                <h3 className="text-xl font-heading font-semibold text-slate-900">Example Analysis</h3>
                
                <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-destructive">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-destructive/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Info className="w-4 h-4 text-destructive" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-slate-900">Pre-existing Condition Exclusion</h4>
                        <span className="bg-destructive/10 text-destructive text-xs font-medium px-2 py-1 rounded-full">High Risk</span>
                      </div>
                      <p className="text-slate-600">
                        Your policy may not cover medical conditions that existed before your coverage started, even if undiagnosed.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-warning">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-warning/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <Info className="w-4 h-4 text-warning" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-slate-900">Waiting Period Restrictions</h4>
                        <span className="bg-warning/10 text-warning text-xs font-medium px-2 py-1 rounded-full">Medium Risk</span>
                      </div>
                      <p className="text-slate-600">
                        Certain benefits have a 6-month waiting period before you can file claims.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border-l-4 border-success">
                  <div className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-success/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-4 h-4 text-success" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-semibold text-slate-900">Comprehensive Coverage</h4>
                        <span className="bg-success/10 text-success text-xs font-medium px-2 py-1 rounded-full">Favorable</span>
                      </div>
                      <p className="text-slate-600">
                        Your policy includes broad coverage for emergency care and specialist visits.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-heading font-bold text-slate-900 mb-6">
              Ready to Understand Your Policy?
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Join thousands of customers who have simplified their insurance experience with ClaimMate.
            </p>
            <Button 
              onClick={handleSignIn}
              size="lg"
              className="transform hover:scale-105 transition-transform duration-200"
              data-testid="button-get-started"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-heading font-bold">ClaimMate</span>
              </div>
              <p className="text-slate-300 mb-4">
                Empowering insurance customers with AI-powered policy analysis and claim guidance.
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
            <p>&copy; 2024 ClaimMate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
