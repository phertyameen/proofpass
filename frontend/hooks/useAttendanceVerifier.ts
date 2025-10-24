// lib/hooks/useAttendanceVerifier.ts
import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther } from "viem";

// Your deployed contract addresses
const ATTENDANCE_VERIFIER_ADDRESS = process.env.NEXT_PUBLIC_ATTENDANCE_VERIFIER_ADDRESS as `0x${string}`;
const EVENT_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_EVENT_REGISTRY_ADDRESS as `0x${string}`;

// AttendanceVerifier ABI
const ATTENDANCE_VERIFIER_ABI = [
  {
    inputs: [{ name: "_eventId", type: "uint256" }],
    name: "checkIn",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      { name: "_eventId", type: "uint256" },
      { name: "_attendee", type: "address" },
    ],
    name: "verifyAttendance",
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_eventId", type: "uint256" }],
    name: "getEventAttendees",
    outputs: [{ name: "", type: "address[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_attendee", type: "address" }],
    name: "getAttendeeHistory",
    outputs: [{ name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ name: "_eventId", type: "uint256" }],
    name: "getAttendanceCount",
    outputs: [{ name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: "eventId", type: "uint256" },
      { indexed: true, name: "attendee", type: "address" },
      { indexed: false, name: "timestamp", type: "uint256" },
      { indexed: false, name: "feePaid", type: "uint256" },
    ],
    name: "CheckIn",
    type: "event",
  },
] as const;

// EventRegistry ABI (minimal for getting event details)
const EVENT_REGISTRY_ABI = [
  {
    inputs: [{ name: "_eventId", type: "uint256" }],
    name: "getEvent",
    outputs: [
      {
        components: [
          { name: "eventId", type: "uint256" },
          { name: "organizer", type: "address" },
          { name: "metadataHash", type: "string" },
          { name: "createdAt", type: "uint256" },
          { name: "attendanceFee", type: "uint256" },
          { name: "isActive", type: "bool" },
          { name: "maxAttendees", type: "uint256" },
          { name: "currentAttendees", type: "uint256" },
        ],
        name: "",
        type: "tuple",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function useAttendanceVerifier() {
  const { writeContract, data: txHash, isPending, error } = useWriteContract();

  // Check-in to event
  const checkIn = (eventId: string, attendanceFee: string) => {
    const feeInWei = parseEther(attendanceFee);
    
    writeContract({
      address: ATTENDANCE_VERIFIER_ADDRESS,
      abi: ATTENDANCE_VERIFIER_ABI,
      functionName: "checkIn",
      args: [BigInt(eventId)],
      value: feeInWei,
    });

    return { txHash, isPending, error };
  };

  // Verify if attendee has checked in
  const useVerifyAttendance = (eventId: string, attendeeAddress: string) => {
    const { data, isLoading, error } = useReadContract({
      address: ATTENDANCE_VERIFIER_ADDRESS,
      abi: ATTENDANCE_VERIFIER_ABI,
      functionName: "verifyAttendance",
      args: [BigInt(eventId), attendeeAddress as `0x${string}`],
    });

    return {
      isVerified: data as boolean,
      isLoading,
      error,
    };
  };

  // Get all attendees for an event
  const useEventAttendees = (eventId: string) => {
    const { data, isLoading, error } = useReadContract({
      address: ATTENDANCE_VERIFIER_ADDRESS,
      abi: ATTENDANCE_VERIFIER_ABI,
      functionName: "getEventAttendees",
      args: [BigInt(eventId)],
    });

    return {
      attendees: (data as string[]) || [],
      isLoading,
      error,
    };
  };

  // Get attendance history for an attendee
  const useAttendeeHistory = (attendeeAddress: string) => {
    const { data, isLoading, error } = useReadContract({
      address: ATTENDANCE_VERIFIER_ADDRESS,
      abi: ATTENDANCE_VERIFIER_ABI,
      functionName: "getAttendeeHistory",
      args: [attendeeAddress as `0x${string}`],
    });

    return {
      eventIds: (data as bigint[]) || [],
      isLoading,
      error,
    };
  };

  // Get attendance count for an event
  const useAttendanceCount = (eventId: string) => {
    const { data, isLoading, error } = useReadContract({
      address: ATTENDANCE_VERIFIER_ADDRESS,
      abi: ATTENDANCE_VERIFIER_ABI,
      functionName: "getAttendanceCount",
      args: [BigInt(eventId)],
    });

    return {
      count: data ? Number(data) : 0,
      isLoading,
      error,
    };
  };

  // Get event details from EventRegistry
  const useEvent = (eventId: string) => {
    const { data, isLoading, error } = useReadContract({
      address: EVENT_REGISTRY_ADDRESS,
      abi: EVENT_REGISTRY_ABI,
      functionName: "getEvent",
      args: [BigInt(eventId)],
    });

    return {
      event: data,
      isLoading,
      error,
    };
  };

  return {
    checkIn,
    useVerifyAttendance,
    useEventAttendees,
    useAttendeeHistory,
    useAttendanceCount,
    useEvent,
  };
}