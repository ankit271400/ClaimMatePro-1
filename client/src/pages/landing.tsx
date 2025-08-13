import { motion } from "framer-motion";
import { 
  Shield, 
  Brain, 
  FileText, 
  TrendingUp, 
  CheckCircle, 
  ArrowRight, 
  Wallet,
  Cloud,
  Lock,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocation } from "wouter";

export default function Landing() {
  const [, setLocation] = useLocation();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Analysis",
      description: "Advanced AI analyzes your insurance policies to identify risks, coverage gaps, and opportunities for better protection.",
    },
    {
      icon: FileText,
      title: "Smart Document Processing",
      description: "Upload any insurance document and get instant OCR text extraction with intelligent clause identification.",
    },
    {
      icon: TrendingUp,
      title: "Risk Assessment",
      description: "Get personalized risk scores and actionable recommendations to optimize your insurance coverage.",
    },
    {
      icon: Wallet,
      title: "Blockchain Security",
      description: "Secure document storage on IPFS with MetaMask integration for complete ownership and control.",
    },
    {
      icon: Cloud,
      title: "Decentralized Storage",
      description: "Your documents are stored securely on IPFS through Pinata, ensuring permanent accessibility.",
    },
    {
      icon: Lock,
      title: "Privacy First",
      description: "End-to-end encryption with blockchain-based authentication. Your data remains completely private.",
    },
  ];

  const benefits = [
    "Understand complex policy language in plain English",
    "Identify coverage gaps before you need to file claims", 
    "Get personalized recommendations for better protection",
    "Streamline claim preparation with intelligent checklists",
    "Track claim status with real-time updates",
    "Secure blockchain-based document management"
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-bg-light via-white to-bg-light">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center"
          >
            <motion.div variants={itemVariants} className="mb-8">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-r from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
                    <Shield className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-success rounded-full flex items-center justify-center">
                    <Zap className="w-3 h-3 text-white" />
                  </div>
                </div>
              </div>
              <Badge variant="secondary" className="mb-4 px-4 py-1 text-sm font-medium">
                AI-Powered Insurance Management
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-7xl font-heading font-bold text-slate-900 mb-6 leading-tight"
            >
              Meet{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                ClaimMate
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed"
            >
              The intelligent platform that transforms how you understand, manage, and claim your insurance policies using AI and blockchain technology.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button 
                size="lg" 
                onClick={() => setLocation('/dashboard')}
                className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                data-testid="button-get-started"
              >
                Get Started with ClaimMate
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 text-lg font-semibold"
                data-testid="button-learn-more"
              >
                Learn More
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-slate-600">Secure & Private</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">AI</div>
                <div className="text-slate-600">Powered Analysis</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">Web3</div>
                <div className="text-slate-600">Blockchain Ready</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-heading font-bold text-slate-900 mb-4">
              Powerful Features for Modern Insurance Management
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              ClaimMate combines cutting-edge AI with blockchain security to revolutionize how you interact with insurance policies.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 shadow-md">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
                      <feature.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-r from-bg-light to-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-heading font-bold text-slate-900 mb-6">
                Why Choose ClaimMate?
              </h2>
              <p className="text-lg text-slate-600 mb-8">
                Experience the future of insurance management with our comprehensive platform that puts you in control.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="p-8 shadow-2xl border-0">
                <div className="space-y-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-slate-900 mb-2">
                      Ready to Get Started?
                    </h3>
                    <p className="text-slate-600 mb-6">
                      Join thousands of users who trust ClaimMate for their insurance management needs.
                    </p>
                  </div>
                  
                  <Button 
                    size="lg" 
                    onClick={() => setLocation('/dashboard')}
                    className="w-full py-4 text-lg font-semibold"
                    data-testid="button-start-now"
                  >
                    Start Managing Your Claims
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  
                  <p className="text-sm text-slate-500 text-center">
                    No signup required • Connect with MetaMask • Start in seconds
                  </p>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-heading font-bold text-white mb-4">
              Transform Your Insurance Experience Today
            </h2>
            <p className="text-xl text-white/90 mb-8">
              Connect your wallet and experience the power of AI-driven insurance management.
            </p>
            <Button 
              size="lg" 
              variant="secondary"
              onClick={() => setLocation('/dashboard')}
              className="px-8 py-4 text-lg font-semibold bg-white text-primary hover:bg-white/90"
              data-testid="button-get-started-cta"
            >
              Get Started with ClaimMate
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}