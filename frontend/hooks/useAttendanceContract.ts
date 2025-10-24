import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const ATTENDANCE_CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_ATTENDANCE_VERIFIER_ADDRESS || '';

// Minimal ABI for attendance contract
const ATTENDANCE_ABI = [
  "function getAttendeeEvents(address) view returns (uint256[])",
  "function eventAttendance(uint256, address) view returns (tuple(address attendee, uint256 eventId, uint256 checkedInAt, uint256 nftTokenId, bool hasNFT))",
];

export interface AttendanceRecord {
  eventId: number;
  attendee: string;
  checkedInAt: number;
  nftTokenId: number;
  hasNFT: boolean;
  transactionHash?: string;
}

export const useAttendanceContract = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string>('');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const init = async () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);

        try {
          const accounts = await web3Provider.listAccounts();
          if (accounts.length > 0) {
            const signer = await web3Provider.getSigner();
            setAccount(accounts[0].address);
            setIsConnected(true);

            const attendanceContract = new ethers.Contract(
              ATTENDANCE_CONTRACT_ADDRESS,
              ATTENDANCE_ABI,
              signer
            );
            setContract(attendanceContract);
          }
        } catch (error) {
          console.error('Error initializing:', error);
        }
      }
    };

    init();

    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          init();
        } else {
          setIsConnected(false);
          setAccount('');
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error('MetaMask is not installed');
    }

    try {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      await web3Provider.send('eth_requestAccounts', []);
      const signer = await web3Provider.getSigner();
      const address = await signer.getAddress();

      setProvider(web3Provider);
      setAccount(address);
      setIsConnected(true);

      const attendanceContract = new ethers.Contract(
        ATTENDANCE_CONTRACT_ADDRESS,
        ATTENDANCE_ABI,
        signer
      );
      setContract(attendanceContract);

      return address;
    } catch (error) {
      console.error('Error connecting wallet:', error);
      throw error;
    }
  };

  const getMyAttendance = async (): Promise<AttendanceRecord[]> => {
    if (!contract || !account) {
      console.error('Contract or account not available');
      return [];
    }

    try {
      console.log('Fetching attendance for:', account);
      
      // Get event IDs user attended
      const eventIds = await contract.getAttendeeEvents(account);
      console.log('Event IDs attended:', eventIds);

      if (eventIds.length === 0) {
        return [];
      }

      // Get attendance records for each event
      const records = await Promise.all(
        eventIds.map(async (id: bigint) => {
          try {
            const eventId = Number(id);
            const record = await contract.eventAttendance(eventId, account);
            
            return {
              eventId,
              attendee: record.attendee,
              checkedInAt: Number(record.checkedInAt),
              nftTokenId: Number(record.nftTokenId),
              hasNFT: record.hasNFT,
            };
          } catch (err) {
            console.error(`Error fetching attendance for event ${id}:`, err);
            return null;
          }
        })
      );

      return records.filter((r) => r !== null) as AttendanceRecord[];
    } catch (error) {
      console.error('Error getting attendance:', error);
      return [];
    }
  };

  return {
    provider,
    contract,
    account,
    isConnected,
    connectWallet,
    getMyAttendance,
  };
};