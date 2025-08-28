import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, CheckCircle, AlertCircle, Wallet, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/navigation";
import FileUpload from "@/components/file-upload";
import WalletConnect from "@/components/wallet-connect";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { useWallet } from "@/hooks/useWallet";
import { pinataService } from "@/services/pinata";
import { apiRequest } from "@/lib/queryClient";

export default function UploadPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState<string | null>(null);
  const { isConnected, account } = useWallet();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      let pinataHash = null;
      
      // First upload to IPFS via Pinata if credentials are available
      try {
        const ipfsResult = await pinataService.uploadFile(file, {
          name: `user_${file.name}`,
          description: `Insurance policy document uploaded`,
        });
        pinataHash = ipfsResult.hash;
        setIpfsHash(pinataHash);
        
        toast({
          title: "IPFS Upload Successful",
          description: "Document stored securely on blockchain",
        });
      } catch (error) {
        console.warn("IPFS upload failed, continuing with regular upload:", error);
      }

      const formData = new FormData();
      formData.append('policy', file);
      if (pinataHash) {
        formData.append('ipfsHash', pinataHash);
      }
      // Note: Wallet address optional since authentication is removed
      
      const response = await apiRequest('POST', '/api/policies/upload', formData);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Upload Successful",
        description: "Your policy is being analyzed. This may take a few minutes.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/policies"] });
      // Redirect to analysis page after a short delay
      setTimeout(() => {
        setLocation(`/analysis/${data.policyId}`);
      }, 2000);
    },
    onError: (error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
      setIsUploading(false);
      setUploadProgress(0);
      setIpfsHash(null);
    },
  });

  const handleFileSelect = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + 10;
      });
    }, 200);

    uploadMutation.mutate(file);
  };

  // Note: Authentication removed - all users can access upload functionality

  return (
    <div className="min-h-screen bg-bg-light">
      <Navigation />
      
      {/* Service Status Banner */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200 mb-6">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium text-green-700">Upload Service Ready</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="font-medium text-blue-700">AI Analysis Available</span>
                </div>
              </div>
              <Badge variant="secondary" className="bg-white">
                All Features Enabled
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl font-heading font-bold text-slate-900 mb-4">
              Upload Your Policy Document
            </h1>
            <p className="text-lg text-slate-600">
              Drag and drop your PDF or image file, or click to browse
            </p>
          </div>

          {!isUploading && !uploadMutation.isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
            >
              <FileUpload 
                onFileSelect={handleFileSelect}
                accept=".pdf,.jpg,.jpeg,.png"
                maxSize={10 * 1024 * 1024} // 10MB
              />
            </motion.div>
          )}

          {isUploading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-8 h-8 text-primary animate-pulse" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Uploading and Processing...
              </h3>
              <div className="mb-4">
                <Progress value={uploadProgress} className="w-full" />
              </div>
              <p className="text-slate-600" data-testid="text-upload-progress">
                {uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : "Processing document..."}
              </p>
            </motion.div>
          )}

          {uploadMutation.isSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Upload Successful!
              </h3>
              <p className="text-slate-600 mb-6">
                Your policy is being analyzed. You'll be redirected to view the results shortly.
              </p>
              {ipfsHash && (
                <div className="mt-4 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-center space-x-2 text-sm text-blue-700">
                    <Cloud className="w-4 h-4" />
                    <span>Document stored on IPFS</span>
                  </div>
                  <p className="text-xs text-blue-600 mt-2 font-mono bg-white px-2 py-1 rounded">
                    Hash: {ipfsHash.substring(0, 16)}...{ipfsHash.substring(ipfsHash.length - 8)}
                  </p>
                </div>
              )}
              <div className="flex justify-center space-x-4">
                <Button 
                  variant="outline"
                  onClick={() => setLocation('/')}
                  data-testid="button-back-dashboard"
                >
                  Back to Dashboard
                </Button>
                <Button 
                  onClick={() => setLocation('/upload')}
                  data-testid="button-upload-another"
                >
                  Upload Another Policy
                </Button>
              </div>
            </motion.div>
          )}

          {uploadMutation.isError && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="bg-white rounded-2xl p-8 shadow-lg text-center"
            >
              <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">
                Upload Failed
              </h3>
              <p className="text-slate-600 mb-6">
                There was an error uploading your policy. Please try again.
              </p>
              <Button 
                onClick={() => {
                  uploadMutation.reset();
                  setIsUploading(false);
                  setUploadProgress(0);
                }}
                data-testid="button-try-again"
              >
                Try Again
              </Button>
            </motion.div>
          )}

          {/* Upload Guidelines */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-12 bg-white rounded-xl p-6 shadow-sm"
          >
            <h3 className="font-semibold text-slate-900 mb-4">Upload Guidelines</h3>
            <div className="grid md:grid-cols-2 gap-6 text-sm text-slate-600">
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Supported Formats</h4>
                <ul className="space-y-1">
                  <li>• PDF documents</li>
                  <li>• JPEG/JPG images</li>
                  <li>• PNG images</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-slate-900 mb-2">Requirements</h4>
                <ul className="space-y-1">
                  <li>• Maximum file size: 10MB</li>
                  <li>• Clear, readable text</li>
                  <li>• Complete policy document</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
