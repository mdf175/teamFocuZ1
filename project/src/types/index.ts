export interface User {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'video_editor' | 'script_writer' | 'voice_artist';
  name: string;
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface UploadedFile {
  id: string;
  filename: string;
  originalName: string;
  type: 'video' | 'script' | 'voice';
  size: number;
  uploadedBy: string;
  uploadedByName: string;
  uploadDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  mimeType: string;
  notes?: string;
}

export interface MonthlyStats {
  month: string;
  videos: number;
  scripts: number;
  voices: number;
  total: number;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
}