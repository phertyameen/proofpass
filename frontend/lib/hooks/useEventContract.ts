/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import EventRegistryABI from "@/lib/api/EventRegistryABI.json";
import { toast } from "sonner";
import { any, unknown } from "zod";
// import { string } from "zod";

const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_EVENT_REGISTRY_ADDRESS ||
  "0x716c9b4973a08Cb6340C048e52fdbA6893F2DA25";

if (!CONTRACT_ADDRESS) {
  throw new Error("contract address not found");
}

export interface EventData {
  eventId: string;
  organizer: string;
  metadataHash: string;
  createdAt: number;
  attendanceFee: string;
  isActive: boolean;
  maxAttendees: number;
  currentAttendees: number;
}

export interface EventMetadata {
  title: string;
  description: string;
  location: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  latitude?: number;
  longitude?: number;
  // eventId: number;
  // organizer: string;
  // metadataHash: string;
  // createdAt: number;
  // attendanceFee: string;
  // isActive: boolean;
  // maxAttendees: number;
  // currentAttendees: number;
  // title: string;
  // description: string;
  // location: string;
  // startDate: string;
  // startTime: string;
  // endDate: string;
  // endTime: string;
}

export const useEventContract = () => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string>("");
  const [isConnected, setIsConnected] = useState(false);

  // Add this NEW useEffect to listen for Farcaster wallet ready event
  useEffect(() => {
    const handleFarcasterReady = async (event: any) => {
      const { wallet, fid } = event.detail;
      console.log("Farcaster wallet ready event received:", wallet);

      if (window.ethereum && !contract) {
        try {
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(web3Provider);
          setAccount(wallet);

          const readOnlyContract = new ethers.Contract(
            CONTRACT_ADDRESS,
            EventRegistryABI.abi,
            web3Provider
          );
          setContract(readOnlyContract);
          console.log("Contract initialized from Farcaster event");
        } catch (error) {
          console.error("Error initializing from Farcaster event:", error);
        }
      }
    };

    window.addEventListener("farcasterWalletReady", handleFarcasterReady);

    return () => {
      window.removeEventListener("farcasterWalletReady", handleFarcasterReady);
    };
  }, [contract]);

  useEffect(() => {
    const handleFarcasterWallet = (event: any) => {
      const wallet = event.detail.wallet;
      setAccount(wallet);
      console.log("Farcaster wallet connected:", wallet);
    };

    window.addEventListener("farcasterWalletConnected", handleFarcasterWallet);

    return () => {
      window.removeEventListener(
        "farcasterWalletConnected",
        handleFarcasterWallet
      );
    };
  }, []);

  // Initialize provider and contract
  useEffect(() => {
    const init = async () => {
      // Check for Farcaster wallet first
      const farcasterWallet = localStorage.getItem("farcasterWallet");
      const fid = localStorage.getItem("fid");

      if (farcasterWallet && fid) {
        // User has Farcaster wallet - connect to it
        try {
          if (window.ethereum) {
            const web3Provider = new ethers.BrowserProvider(window.ethereum);

            // Request to connect to the Farcaster wallet address
            await web3Provider.send("eth_requestAccounts", []);
            const web3Signer = await web3Provider.getSigner();
            const signerAddress = await web3Signer.getAddress();

            // Verify it matches the Farcaster wallet
            if (signerAddress.toLowerCase() === farcasterWallet.toLowerCase()) {
              setProvider(web3Provider);
              setSigner(web3Signer);
              setAccount(farcasterWallet);
              setIsConnected(true);
              localStorage.setItem("walletAddress", farcasterWallet);

              const eventContract = new ethers.Contract(
                CONTRACT_ADDRESS,
                EventRegistryABI.abi,
                web3Signer
              );
              setContract(eventContract);
              console.log("Farcaster contract initialized");
              return;
            }
          }
        } catch (error) {
          toast("Error connecting Farcaster wallet:");
          console.log("Error connecting Farcaster wallet:", error);
        }
        // If Farcaster wallet exists but couldn't connect, still initialize read-only contract
        if (window.ethereum) {
          try {
            const web3Provider = new ethers.BrowserProvider(window.ethereum);
            setProvider(web3Provider);
            setAccount(farcasterWallet);

            const readOnlyContract = new ethers.Contract(
              CONTRACT_ADDRESS,
              EventRegistryABI.abi,
              web3Provider
            );
            setContract(readOnlyContract);
            console.log("Farcaster read-only contract initialized");
            return;
          } catch (error) {
            console.error("Error initializing read-only contract:", error);
          }
        }
      }

      if (typeof window !== "undefined" && window.ethereum) {
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);

        // Initialize contract with provider for read-only operations
        const readOnlyContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          EventRegistryABI.abi,
          web3Provider
        );
        setContract(readOnlyContract);
        console.log(
          "Read-only contract initialized at:",
          readOnlyContract.target
        );

        try {
          const accounts = await web3Provider.listAccounts();
          if (accounts.length > 0) {
            const web3Signer = await web3Provider.getSigner();
            setSigner(web3Signer);
            setAccount(accounts[0].address);
            setIsConnected(true);

            // Update contract with signer for write operations
            const eventContract = new ethers.Contract(
              CONTRACT_ADDRESS,
              EventRegistryABI.abi,
              web3Signer
            );
            console.log(
              "Contract with signer initialized at:",
              eventContract.target
            );
            setContract(eventContract);
          }
        } catch (error) {
          console.error("Error initializing:", error);
        }
      }
    };

    init();

    // Listen for account changes
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          init();
        } else {
          setIsConnected(false);
          setAccount("");
        }
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeAllListeners("accountsChanged");
      }
    };
  }, []);

  useEffect(() => {
    const reinitForFarcaster = async () => {
      const farcasterWallet = localStorage.getItem("farcasterWallet");

      if (farcasterWallet && !contract && window.ethereum) {
        console.log("Re-initializing contract for Farcaster wallet");
        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);
        setAccount(farcasterWallet);

        const readOnlyContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          EventRegistryABI.abi,
          web3Provider
        );
        setContract(readOnlyContract);
        console.log("Contract initialized for Farcaster wallet");
      }
    };

    // Run immediately
    reinitForFarcaster();

    // Also check periodically for a few seconds (in case localStorage is set after mount)
    const interval = setInterval(reinitForFarcaster, 500);
    const timeout = setTimeout(() => clearInterval(interval), 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [contract]);

  // Connect wallet
  const connectWallet = async () => {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    try {
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      await web3Provider.send("eth_requestAccounts", []);
      const web3Signer = await web3Provider.getSigner();
      const address = await web3Signer.getAddress();

      setProvider(web3Provider);
      setSigner(web3Signer);
      setAccount(address);
      setIsConnected(true);

      const eventContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        EventRegistryABI.abi,
        web3Signer
      );
      setContract(eventContract);

      return address;
    } catch (error) {
      console.error("Error connecting wallet:", error);
      throw error;
    }
  };

  // Upload metadata to IPFS (you'll need to implement your IPFS upload)
  const uploadToIPFS = async (metadata: EventMetadata): Promise<string> => {
    const mockHash = `QmTest${Date.now()}${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    console.log("Mock IPFS hash:", mockHash);
    return mockHash;

    //     const response = await fetch('/api/ipfs/upload', {
    //       method: 'POST',
    //       headers: { 'Content-Type': 'application/json' },
    //       body: JSON.stringify(metadata),
    //     });
    //     const data = await response.json();
    //     return data.hash;
  };

  // Create event
  const createEvent = async (
    metadata: EventMetadata,
    attendanceFee: string,
    maxAttendees: number
  ) => {
    if (!contract) throw new Error("Contract not initialized");

    const farcasterWallet = localStorage.getItem("farcasterWallet");

    // If we have a Farcaster wallet but no signer, try to connect
    if (farcasterWallet && !signer) {
      try {
        console.log("Farcaster wallet detected, requesting connection...");

        if (!window.ethereum) {
          throw new Error(
            "Please install MetaMask or another Web3 wallet to create events"
          );
        }

        const web3Provider = new ethers.BrowserProvider(window.ethereum);

        // Switch to Base Sepolia
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x14a34" }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x14a34",
                  chainName: "Base Sepolia",
                  rpcUrls: ["https://sepolia.base.org"],
                  nativeCurrency: {
                    name: "Ethereum",
                    symbol: "ETH",
                    decimals: 18,
                  },
                  blockExplorerUrls: ["https://sepolia.basescan.org"],
                },
              ],
            });
          }
        }

        // Request account access
        await web3Provider.send("eth_requestAccounts", []);
        const web3Signer = await web3Provider.getSigner();
        const signerAddress = await web3Signer.getAddress();

        // Verify it matches the Farcaster wallet
        if (signerAddress.toLowerCase() !== farcasterWallet.toLowerCase()) {
          throw new Error(
            `Please switch to your Farcaster wallet: ${farcasterWallet}`
          );
        }

        // Update contract with signer
        const contractWithSigner = new ethers.Contract(
          CONTRACT_ADDRESS,
          EventRegistryABI.abi,
          web3Signer
        );

        setSigner(web3Signer);
        setContract(contractWithSigner);

        // Now proceed with the updated contract
        return createEventWithSigner(
          contractWithSigner,
          metadata,
          attendanceFee,
          maxAttendees
        );
      } catch (error) {
        console.error("Error connecting wallet:", error);
        throw new Error(
          "Please connect your wallet to create events. " +
            (error as Error).message
        );
      }
    }

    if (!signer) {
      throw new Error(
        "Wallet required to create events. Please connect your wallet."
      );
    }

    return createEventWithSigner(
      contract,
      metadata,
      attendanceFee,
      maxAttendees
    );
  };

  // Helper function to actually create the event
  const createEventWithSigner = async (
    contractInstance: ethers.Contract,
    metadata: EventMetadata,
    attendanceFee: string,
    maxAttendees: number
  ) => {
    try {
      // Upload metadata to IPFS
      const metadataHash = await uploadToIPFS(metadata);

      // Get creation fee
      const creationFee = await contractInstance.eventCreationFee();

      // Convert attendance fee to wei
      const attendanceFeeWei = ethers.parseEther(attendanceFee);

      // Create event
      const tx = await contractInstance.createEvent(
        metadataHash,
        attendanceFeeWei,
        maxAttendees,
        { value: creationFee }
      );

      const receipt = await tx.wait();

      // Extract event ID from logs
      const eventCreatedLog = receipt.logs.find(
        (log: any) => log.fragment?.name === "EventCreated"
      );
      const eventId = eventCreatedLog?.args?.[0];

      return { eventId: eventId, txHash: receipt.hash };
    } catch (error) {
      console.error("Error creating event:", error);
      throw error;
    }
  };

  // Get event details
  const getEvent = async (eventId: string): Promise<EventData> => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      // Use getFunction with staticCall
      const result = await contract.getFunction("getEvent").staticCall(eventId);

      console.log(result);
      return {
        eventId: result.eventId.toString(),
        organizer: result.organizer,
        metadataHash: result.metadataHash,
        createdAt: Number(result.createdAt),
        attendanceFee: ethers.formatEther(result.attendanceFee),
        isActive: result.isActive,
        maxAttendees: Number(result.maxAttendees),
        currentAttendees: Number(result.currentAttendees),
      };
    } catch (error) {
      console.error("Error getting event:", error);
      throw error;
    }
  };

  // Get metadata from IPFS
  // Get metadata from IPFS
  const getMetadata = async (metadataHash: string): Promise<EventMetadata> => {
    try {
      const response = await fetch(`/api/ipfs/get?hash=${metadataHash}`);

      if (!response.ok) {
        console.warn(
          `Failed to fetch metadata for ${metadataHash}, using fallback`
        );
        // Return fallback data
        return {
          title: `Event ${metadataHash.slice(-8)}`,
          description: "Metadata not available",
          location: "Location not available",
          startDate: new Date().toISOString().split("T")[0],
          startTime: "00:00",
          endDate: new Date().toISOString().split("T")[0],
          endTime: "23:59",
        };
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Error fetching metadata for ${metadataHash}:`, error);
      // Return fallback data
      return {
        title: `Event ${metadataHash.slice(-8)}`,
        description: "Metadata not available",
        location: "Location not available",
        startDate: new Date().toISOString().split("T")[0],
        startTime: "00:00",
        endDate: new Date().toISOString().split("T")[0],
        endTime: "23:59",
      };
    }
  };

  // Get organizer events
  const getOrganizerEvents = async (organizer: string): Promise<string[]> => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      const eventIds = await contract.getOrganizerEvents(organizer);
      console.log("Raw eventIds from contract:", eventIds);
      return eventIds.map((id: bigint) => id.toString());
    } catch (error) {
      console.error("Error getting organizer events:", error);
      throw error;
    }
  };

  // Toggle event status
  const toggleEventStatus = async (eventId: string) => {
    if (!contract) throw new Error("Contract not initialized");

    try {
      const tx = await contract.toggleEventStatus(eventId);
      const receipt = await tx.wait();
      return receipt.hash;
    } catch (error) {
      console.error("Error toggling event status:", error);
      throw error;
    }
  };

  // Get all events with metadata
  const getAllEventsWithMetadata = async (organizerAddress?: string) => {
    const farcasterWallet = localStorage.getItem("farcasterWallet");
    const targetAddress = organizerAddress || farcasterWallet || account;

    if (!contract) {
      console.error("Contract not available");
      throw new Error("Contract not initialized");
    }

    if (!targetAddress) {
      console.error("No wallet address available");
      throw new Error("No wallet address available");
    }

    try {
      console.log("Fetching events for account:", targetAddress);
      const eventIds = await getOrganizerEvents(targetAddress);
      console.log("Event IDs:", eventIds);

      if (eventIds.length === 0) {
        console.log("No events found for this organizer");
        return [];
      }

      const events = await Promise.all(
        eventIds.map(async (id) => {
          try {
            console.log("Fetching event:", id);
            const eventData = await getEvent(id);
            console.log("Event data:", eventData);

            const metadata = await getMetadata(eventData.metadataHash);
            console.log("Metadata:", metadata);

            return { ...eventData, ...metadata };
          } catch (err) {
            console.error(`Error fetching event ${id}:`, err);
            return null;
          }
        })
      );

      // Filter out any null events that failed to load
      const validEvents = events.filter((e) => e !== null);
      console.log("Valid events:", validEvents);

      return validEvents;
    } catch (error) {
      console.error("Error getting all events:", error);
      throw error;
    }
  };

  return {
    provider,
    signer,
    contract,
    account,
    isConnected,
    connectWallet,
    createEvent,
    getEvent,
    getMetadata,
    getOrganizerEvents,
    toggleEventStatus,
    getAllEventsWithMetadata,
  };
};
