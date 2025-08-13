import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, ExternalLink, Copy, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@/hooks/useWallet';

interface WalletConnectProps {
  onConnected?: (account: string) => void;
  showDisconnect?: boolean;
}

export default function WalletConnect({ onConnected, showDisconnect = true }: WalletConnectProps) {
  const { 
    account, 
    balance, 
    isConnected, 
    isLoading, 
    error, 
    connectWallet, 
    disconnectWallet, 
    hasMetaMask 
  } = useWallet();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleConnect = async () => {
    await connectWallet();
    if (account && onConnected) {
      onConnected(account);
    }
  };

  const copyAddress = async () => {
    if (account) {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (!hasMetaMask) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wallet className="w-5 h-5" />
            <span>MetaMask Required</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-slate-600">
            MetaMask wallet is required to use ClaimMate's blockchain features.
          </p>
          <Button 
            onClick={() => window.open('https://metamask.io/download/', '_blank')}
            className="w-full"
            data-testid="button-install-metamask"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            Install MetaMask
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {!isConnected ? (
        <motion.div
          key="connect"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Wallet className="w-5 h-5" />
                <span>Connect Wallet</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-600">
                Connect your MetaMask wallet to access secure document storage and claim management on the blockchain.
              </p>
              
              {error && (
                <div className="flex items-center space-x-2 text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}
              
              <Button 
                onClick={handleConnect}
                disabled={isLoading}
                className="w-full"
                data-testid="button-connect-wallet"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 mr-2"
                  >
                    <Wallet className="w-4 h-4" />
                  </motion.div>
                ) : (
                  <Wallet className="w-4 h-4 mr-2" />
                )}
                {isLoading ? 'Connecting...' : 'Connect MetaMask'}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div
          key="connected"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Wallet className="w-5 h-5" />
                  <span>Wallet Connected</span>
                </div>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Address</span>
                  <div className="flex items-center space-x-2">
                    <code className="text-sm font-mono bg-slate-100 px-2 py-1 rounded">
                      {formatAddress(account!)}
                    </code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyAddress}
                      className="h-6 w-6 p-0"
                      data-testid="button-copy-address"
                    >
                      {copied ? (
                        <CheckCircle className="w-3 h-3 text-green-600" />
                      ) : (
                        <Copy className="w-3 h-3" />
                      )}
                    </Button>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Balance</span>
                  <span className="text-sm font-semibold">
                    {balance ? `${parseFloat(balance).toFixed(4)} ETH` : '0.0000 ETH'}
                  </span>
                </div>
              </div>
              
              {showDisconnect && (
                <Button 
                  variant="outline" 
                  onClick={disconnectWallet}
                  className="w-full"
                  data-testid="button-disconnect-wallet"
                >
                  Disconnect Wallet
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}