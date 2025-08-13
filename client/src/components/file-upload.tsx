import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: string;
  maxSize?: number;
  className?: string;
}

export default function FileUpload({ 
  onFileSelect, 
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSize = 10 * 1024 * 1024, // 10MB
  className = ""
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      console.error("File rejected:", error);
      return;
    }

    if (acceptedFiles.length > 0) {
      onFileSelect(acceptedFiles[0]);
    }
  }, [onFileSelect]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
    },
    maxSize,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`
        border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300
        ${isDragActive 
          ? 'border-primary/60 bg-primary/10' 
          : 'border-primary/20 hover:border-primary/40 hover:bg-primary/5'
        }
        ${className}
      `}
      data-testid="file-upload-zone"
    >
      <input {...getInputProps()} />
      
      <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
        {isDragActive ? (
          <FileText className="w-8 h-8 text-primary animate-pulse" />
        ) : (
          <Upload className="w-8 h-8 text-primary" />
        )}
      </div>
      
      <h3 className="text-xl font-semibold text-slate-900 mb-2">
        {isDragActive ? "Drop your file here" : "Drop your policy document here"}
      </h3>
      
      <p className="text-slate-600 mb-4">
        PDF, JPG, PNG up to {Math.round(maxSize / (1024 * 1024))}MB
      </p>
      
      <Button 
        type="button"
        onClick={(e) => e.stopPropagation()}
        data-testid="button-choose-file"
      >
        Choose File
      </Button>
      
      <div className="mt-6 text-xs text-slate-500">
        <div className="flex items-center justify-center space-x-4">
          <span>✓ Secure upload</span>
          <span>✓ Private processing</span>
          <span>✓ Instant analysis</span>
        </div>
      </div>
    </div>
  );
}
