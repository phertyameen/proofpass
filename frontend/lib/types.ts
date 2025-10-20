export interface Event {
  id: string;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  startTime: Date;
  endTime: Date;
  maxAttendees: number;
  attendanceFee: string;
  imageUrl?: string;
  organizerAddress: string;
  isActive: boolean;
  checkInCount: number;
  revenue: string;
  qrCode: string;
  createdAt: Date;
}

export interface Attendee {
  address: string;
  checkedInAt: Date;
  transactionHash: string;
}

export interface AttendanceRecord {
  eventId: string;
  eventTitle: string;
  eventDate: Date;
  organizerAddress: string;
  checkedInAt: Date;
  transactionHash: string;
  nftTokenId?: string;
}

export interface Window {
  ethereum?: {
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on?: (event: string, handler: (...args: any[]) => void) => void;
    removeListener?: (event: string, handler: (...args: any[]) => void) => void;
    isMetaMask?: boolean;
    isCoinbaseWallet?: boolean;
  };
}
