import { useState } from "react";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Navigation from "@/components/navigation";
import FileUpload from "@/components/file-upload";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";

export default function UploadPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('policy', file);
      
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

  return (
    <div className="min-h-screen bg-bg-light">
      <Navigation />
      
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
