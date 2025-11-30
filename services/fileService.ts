import { supabase } from './supabaseClient';
import { TransferStatus, FileTransfer } from '../types';

// Mock data for fallback with Vietnamese context
const MOCK_HISTORY: FileTransfer[] = [
  {
    id: '1',
    name: 'báo-cáo-tài-chính.pdf',
    size: 15938355, // ~15.2 MB
    type: 'application/pdf',
    status: TransferStatus.COMPLETED,
    progress: 100,
    source: 'iPhone của An',
    destination: 'My MacBook Pro',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    name: 'vacation-photo-01.jpg',
    size: 4800000,
    type: 'image/jpeg',
    status: TransferStatus.FAILED,
    progress: 30,
    speed: '1.1 MB/s',
    source: 'My MacBook Pro',
    destination: 'Galaxy S23',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    error: 'Mất kết nối',
  },
  {
    id: '3',
    name: 'presentation-final.pptx',
    size: 32100000,
    type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    status: TransferStatus.COMPLETED,
    progress: 100,
    source: 'Pixel 7 Pro',
    destination: 'My MacBook Pro',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: '4',
    name: 'project-assets.zip',
    size: 128500000,
    type: 'application/zip',
    status: TransferStatus.TRANSFERRING,
    progress: 75,
    speed: '2.5 MB/s',
    source: 'My MacBook Pro',
    destination: 'iPhone của An',
    createdAt: new Date().toISOString(),
  },
];

export const FileService = {
  /**
   * Fetches transfer history.
   * Tries Supabase first, falls back to mock data.
   */
  getTransfers: async (): Promise<FileTransfer[]> => {
    if (supabase) {
      const { data, error } = await supabase
        .from('transfers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (!error && data) {
        return data as unknown as FileTransfer[];
      }
      console.warn("Supabase error or empty data, using mock data:", error);
    }
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    return MOCK_HISTORY;
  },

  /**
   * Mock function to upload file
   */
  uploadFile: async (file: File): Promise<FileTransfer> => {
    // In a real app, this would upload to Supabase Storage and create a DB record
    const newTransfer: FileTransfer = {
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: TransferStatus.QUEUED,
      progress: 0,
      source: 'Thiết bị này',
      destination: 'Cloud/Thiết bị liên kết',
      createdAt: new Date().toISOString(),
    };
    
    return newTransfer;
  }
};