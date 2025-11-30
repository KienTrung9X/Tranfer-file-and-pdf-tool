export enum TransferStatus {
  QUEUED = 'QUEUED',
  TRANSFERRING = 'TRANSFERRING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface FileTransfer {
  id: string;
  name: string;
  size: number;
  type: string;
  status: TransferStatus;
  progress: number;
  speed?: string; // e.g., "2.5 MB/s"
  source: string;
  destination: string;
  createdAt: string;
  error?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: string;
}