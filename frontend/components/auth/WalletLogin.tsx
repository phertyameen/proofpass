'use client';

import React, { useState } from 'react';
import { useAccount, useSignMessage } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { authApi } from '@/lib/api/auth';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/app/contexts/AuthContext';

export function WalletLogin() {
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const { login } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    if (!address) {
      setError('Please connect your wallet first');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      console.log('🔐 Starting authentication for:', address);

      // Step 1: Get nonce from backend
      console.log('📝 Requesting nonce from backend...');
      const { nonce } = await authApi.getNonce(address);
      console.log('✅ Nonce received:', nonce);

      // Step 2: Create message to sign
      const message = `Sign this message to authenticate with ProofPass.

Wallet: ${address}
Nonce: ${nonce}

This request will not trigger a blockchain transaction or cost any gas fees.`;

      console.log('📝 Message to sign:', message);

      // Step 3: Request signature from wallet
      console.log('🖊️ Requesting signature from wallet...');
      const signature = await signMessageAsync({ message });
      console.log('✅ Signature received:', signature);

      // Step 4: Verify signature with backend
      console.log('🔍 Verifying signature with backend...');
      const { accessToken, user } = await authApi.verify({
        walletAddress: address,
        signature,
        nonce,
      });
      console.log('✅ Authentication successful!', user);

      // Step 5: Store token and user in context
      login(accessToken, user);

      // Step 6: Redirect to dashboard
      console.log('🚀 Redirecting to dashboard...');
      router.push('/dashboard');
    } catch (err: any) {
      console.error('❌ Authentication failed:', err);

      // Handle different error types
      if (err.code === 'ACTION_REJECTED' || err.code === 4001) {
        setError('Signature request was rejected. Please try again.');
      } else if (err.response?.status === 401) {
        setError('Authentication failed. Invalid signature.');
      } else if (err.response?.status === 400) {
        setError('Invalid wallet address format.');
      } else if (err.code === 'NETWORK_ERROR' || !err.response) {
        setError('Cannot connect to server. Please check if backend is running.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isConnected) {
    return (
      <div>
        <p>
          Please connect your wallet using the button above to sign in.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div>
          <p>{error}</p>
        </div>
      )}

      <div className="bg-gray-50 p-4 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">Connected Wallet:</p>
        <p className="font-mono text-sm font-semibold break-all">{address}</p>
      </div>

      <Button
        onClick={handleLogin}
        disabled={isLoading}
        className="w-full bg-proofpass-gradient hover:opacity-90"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing message...
          </>
        ) : (
          'Sign Message to Login'
        )}
      </Button>

      <p className="text-xs text-gray-500 text-center">
        By signing, you agree to our Terms of Service. This is a free action and won't cost any gas.
      </p>
    </div>
  );
}