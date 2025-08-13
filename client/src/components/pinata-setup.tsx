import { useState } from 'react';
import { motion } from 'framer-motion';
import { Cloud, Key, CheckCircle, AlertCircle, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { pinataService } from '@/services/pinata';

interface PinataSetupProps {
  onSetupComplete?: (isSetup: boolean) => void;
}

export default function PinataSetup({ onSetupComplete }: PinataSetupProps) {
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [isSetup, setIsSetup] = useState(false);
  const { toast } = useToast();

  const testConnection = async () => {
    if (!apiKey || !secretKey) {
      toast({
        title: "Missing Credentials",
        description: "Please enter both API key and secret key",
        variant: "destructive",
      });
      return;
    }

    setIsTestingConnection(true);
    setConnectionStatus('idle');

    try {
      pinataService.setCredentials(apiKey, secretKey);
      const isAuthenticated = await pinataService.testAuthentication();
      
      if (isAuthenticated) {
        setConnectionStatus('success');
        setIsSetup(true);
        toast({
          title: "Connection Successful",
          description: "Pinata IPFS storage is ready to use",
        });
        onSetupComplete?.(true);
      } else {
        setConnectionStatus('error');
        toast({
          title: "Connection Failed",
          description: "Invalid API credentials. Please check your keys.",
          variant: "destructive",
        });
      }
    } catch (error) {
      setConnectionStatus('error');
      toast({
        title: "Connection Error",
        description: "Failed to connect to Pinata. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Cloud className="w-5 h-5 text-blue-600" />;
    }
  };

  const getStatusText = () => {
    switch (connectionStatus) {
      case 'success':
        return 'Connected to Pinata IPFS';
      case 'error':
        return 'Connection Failed';
      default:
        return 'Ready to Connect';
    }
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'success':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'error':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  if (isSetup && connectionStatus === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto"
      >
        <Card className="border-green-200 bg-green-50">
          <CardHeader className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Upload className="w-6 h-6 text-green-600" />
            </div>
            <CardTitle className="text-green-800">IPFS Storage Ready</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-green-600 mb-4">
              Your documents will be securely stored on IPFS through Pinata.
            </p>
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <CheckCircle className="w-3 h-3 mr-1" />
              Connected
            </Badge>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cloud className="w-5 h-5" />
            <span>Setup IPFS Storage</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className={`flex items-center space-x-2 text-sm p-2 rounded-lg border ${getStatusColor()}`}>
            {getStatusIcon()}
            <span>{getStatusText()}</span>
          </div>

          <div className="space-y-3">
            <div>
              <Label htmlFor="api-key" className="text-sm font-medium">
                Pinata API Key
              </Label>
              <Input
                id="api-key"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Pinata API key"
                className="mt-1"
                data-testid="input-api-key"
              />
            </div>
            
            <div>
              <Label htmlFor="secret-key" className="text-sm font-medium">
                Pinata Secret Key
              </Label>
              <Input
                id="secret-key"
                type="password"
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                placeholder="Enter your Pinata secret key"
                className="mt-1"
                data-testid="input-secret-key"
              />
            </div>
          </div>

          <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-lg">
            <div className="flex items-center space-x-1 mb-2">
              <Key className="w-3 h-3" />
              <span className="font-medium">How to get Pinata keys:</span>
            </div>
            <ol className="space-y-1 ml-4 list-decimal">
              <li>Visit <a href="https://pinata.cloud" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">pinata.cloud</a></li>
              <li>Create a free account</li>
              <li>Go to API Keys section</li>
              <li>Generate new API key pair</li>
            </ol>
          </div>

          <Button
            onClick={testConnection}
            disabled={isTestingConnection || !apiKey || !secretKey}
            className="w-full"
            data-testid="button-test-connection"
          >
            {isTestingConnection ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 mr-2"
              >
                <Cloud className="w-4 h-4" />
              </motion.div>
            ) : (
              <Cloud className="w-4 h-4 mr-2" />
            )}
            {isTestingConnection ? 'Testing Connection...' : 'Test Connection'}
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}