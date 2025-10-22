"use client"

import { sdk } from '@farcaster/miniapp-sdk';
import { useEffect, useState } from 'react';

export function MiniAppProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize the MiniApp SDK
    const initializeMiniApp = async () => {
      try {
        await sdk.actions.ready();
        setIsReady(true);
        console.log('MiniApp SDK initialized successfully');
      } catch (error) {
        console.error('Failed to initialize MiniApp SDK:', error);
        setIsReady(true);
      }
    };

    initializeMiniApp();
  }, []);

  if (!isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}