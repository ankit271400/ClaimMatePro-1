import { useState, useEffect, useCallback } from 'react';
import { ethers } from 'ethers';

interface WalletState {
  account: string | null;
  balance: string | null;
  isConnected: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useWallet() {
  const [walletState, setWalletState] = useState<WalletState>({
    account: null,
    balance: null,
    isConnected: false,
    isLoading: false,
    error: null,
  });

  const checkIfWalletExists = useCallback(() => {
    return typeof window !== 'undefined' && window.ethereum;
  }, []);

  const connectWallet = useCallback(async () => {
    if (!checkIfWalletExists()) {
      setWalletState(prev => ({ 
        ...prev, 
        error: 'MetaMask is not installed. Please install MetaMask to continue.' 
      }));
      return;
    }

    setWalletState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      
      if (accounts.length > 0) {
        const signer = await provider.getSigner();
        const balance = await provider.getBalance(accounts[0]);
        
        setWalletState({
          account: accounts[0],
          balance: ethers.formatEther(balance),
          isConnected: true,
          isLoading: false,
          error: null,
        });
        
        // Store connection state
        localStorage.setItem('walletConnected', 'true');
        localStorage.setItem('walletAccount', accounts[0]);
      }
    } catch (error: any) {
      setWalletState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to connect wallet',
      }));
    }
  }, [checkIfWalletExists]);

  const disconnectWallet = useCallback(() => {
    setWalletState({
      account: null,
      balance: null,
      isConnected: false,
      isLoading: false,
      error: null,
    });
    
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletAccount');
  }, []);

  const checkConnection = useCallback(async () => {
    if (!checkIfWalletExists()) return;

    const wasConnected = localStorage.getItem('walletConnected');
    const savedAccount = localStorage.getItem('walletAccount');

    if (wasConnected === 'true' && savedAccount) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        
        const currentAccount = accounts.find(
          account => account.address.toLowerCase() === savedAccount.toLowerCase()
        );

        if (currentAccount) {
          const balance = await provider.getBalance(currentAccount.address);
          setWalletState({
            account: currentAccount.address,
            balance: ethers.formatEther(balance),
            isConnected: true,
            isLoading: false,
            error: null,
          });
        } else {
          disconnectWallet();
        }
      } catch (error) {
        disconnectWallet();
      }
    }
  }, [checkIfWalletExists, disconnectWallet]);

  useEffect(() => {
    checkConnection();
    
    if (checkIfWalletExists()) {
      const handleAccountsChanged = (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== walletState.account) {
          connectWallet();
        }
      };

      const handleChainChanged = () => {
        window.location.reload();
      };

      window.ethereum?.on('accountsChanged', handleAccountsChanged);
      window.ethereum?.on('chainChanged', handleChainChanged);

      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum?.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [checkConnection, connectWallet, disconnectWallet, walletState.account]);

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
    hasMetaMask: checkIfWalletExists(),
  };
}