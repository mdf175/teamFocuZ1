import React, { createContext, useContext, useState } from 'react';
import { UploadedFile, MonthlyStats, Notification } from '../types';

interface DataContextType {
  files: UploadedFile[];
  notifications: Notification[];
  addFile: (file: Omit<UploadedFile, 'id' | 'uploadDate'>) => void;
  updateFileStatus: (id: string, status: UploadedFile['status']) => void;
  deleteFile: (id: string) => void;
  getMonthlyStats: () => MonthlyStats[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock files data
const initialFiles: UploadedFile[] = [
  {
    id: '1',
    filename: 'project_intro.mp4',
    originalName: 'Project Introduction Video.mp4',
    type: 'video',
    size: 157286400,
    uploadedBy: '2',
    uploadedByName: 'Alex Johnson',
    uploadDate: new Date('2024-12-01'),
    status: 'approved',
    mimeType: 'video/mp4'
  },
  {
    id: '2',
    filename: 'episode_1_script.pdf',
    originalName: 'Episode 1 Script - Final Draft.pdf',
    type: 'script',
    size: 2048000,
    uploadedBy: '3',
    uploadedByName: 'Sarah Chen',
    uploadDate: new Date('2024-12-02'),
    status: 'approved',
    mimeType: 'application/pdf'
  },
  {
    id: '3',
    filename: 'narration_sample.mp3',
    originalName: 'Narration Sample - Take 1.mp3',
    type: 'voice',
    size: 5242880,
    uploadedBy: '4',
    uploadedByName: 'Michael Rodriguez',
    uploadDate: new Date('2024-12-03'),
    status: 'pending',
    mimeType: 'audio/mp3'
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<UploadedFile[]>(initialFiles);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      message: 'New voice file uploaded by Michael Rodriguez',
      type: 'info',
      timestamp: new Date(),
      read: false
    }
  ]);

  const addFile = (fileData: Omit<UploadedFile, 'id' | 'uploadDate'>) => {
    const newFile: UploadedFile = {
      ...fileData,
      id: Date.now().toString(),
      uploadDate: new Date()
    };
    setFiles(prev => [...prev, newFile]);
    
    // Add notification
    addNotification({
      message: `New ${fileData.type} file uploaded by ${fileData.uploadedByName}`,
      type: 'info',
      read: false
    });
  };

  const updateFileStatus = (id: string, status: UploadedFile['status']) => {
    setFiles(prev => prev.map(file => 
      file.id === id ? { ...file, status } : file
    ));
  };

  const deleteFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };

  const getMonthlyStats = (): MonthlyStats[] => {
    const stats: { [key: string]: MonthlyStats } = {};
    
    files.forEach(file => {
      const month = file.uploadDate.toISOString().substring(0, 7);
      if (!stats[month]) {
        stats[month] = {
          month,
          videos: 0,
          scripts: 0,
          voices: 0,
          total: 0
        };
      }
      
      stats[month][file.type === 'video' ? 'videos' : file.type === 'script' ? 'scripts' : 'voices']++;
      stats[month].total++;
    });
    
    return Object.values(stats).sort((a, b) => a.month.localeCompare(b.month));
  };

  const addNotification = (notificationData: Omit<Notification, 'id' | 'timestamp'>) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date()
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  return (
    <DataContext.Provider value={{
      files,
      notifications,
      addFile,
      updateFileStatus,
      deleteFile,
      getMonthlyStats,
      addNotification,
      markNotificationRead
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}