import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import { Layout } from '../components/Layout/Layout';
import { StatsCard } from '../components/Dashboard/StatsCard';
import { RecentFiles } from '../components/Dashboard/RecentFiles';
import { Video, FileText, Volume2, Users, TrendingUp, Clock } from 'lucide-react';

export function DashboardPage() {
  const { user, users } = useAuth();
  const { files } = useData();

  const getUserFiles = () => {
    if (user?.role === 'admin') {
      return files;
    }
    return files.filter(file => file.uploadedBy === user?.id);
  };

  const userFiles = getUserFiles();
  const videoFiles = userFiles.filter(f => f.type === 'video');
  const scriptFiles = userFiles.filter(f => f.type === 'script');
  const voiceFiles = userFiles.filter(f => f.type === 'voice');
  const pendingFiles = userFiles.filter(f => f.status === 'pending');

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const getRoleSpecificStats = () => {
    switch (user?.role) {
      case 'admin':
        return [
          {
            title: 'Total Users',
            value: users.length,
            change: '+2 this month',
            changeType: 'increase' as const,
            icon: Users,
            color: 'bg-blue-500'
          },
          {
            title: 'Total Files',
            value: files.length,
            change: '+12 this week',
            changeType: 'increase' as const,
            icon: FileText,
            color: 'bg-green-500'
          },
          {
            title: 'Pending Reviews',
            value: pendingFiles.length,
            change: '3 need attention',
            changeType: 'neutral' as const,
            icon: Clock,
            color: 'bg-yellow-500'
          },
          {
            title: 'Monthly Growth',
            value: '24%',
            change: '+5% from last month',
            changeType: 'increase' as const,
            icon: TrendingUp,
            color: 'bg-purple-500'
          }
        ];
      case 'video_editor':
        return [
          {
            title: 'Videos Uploaded',
            value: videoFiles.length,
            change: '+3 this week',
            changeType: 'increase' as const,
            icon: Video,
            color: 'bg-blue-500'
          },
          {
            title: 'Pending Review',
            value: pendingFiles.length,
            icon: Clock,
            color: 'bg-yellow-500'
          }
        ];
      case 'script_writer':
        return [
          {
            title: 'Scripts Uploaded',
            value: scriptFiles.length,
            change: '+2 this week',
            changeType: 'increase' as const,
            icon: FileText,
            color: 'bg-green-500'
          },
          {
            title: 'Pending Review',
            value: pendingFiles.length,
            icon: Clock,
            color: 'bg-yellow-500'
          }
        ];
      case 'voice_artist':
        return [
          {
            title: 'Voice Files Uploaded',
            value: voiceFiles.length,
            change: '+1 this week',
            changeType: 'increase' as const,
            icon: Volume2,
            color: 'bg-purple-500'
          },
          {
            title: 'Pending Review',
            value: pendingFiles.length,
            icon: Clock,
            color: 'bg-yellow-500'
          }
        ];
      default:
        return [];
    }
  };

  const stats = getRoleSpecificStats();

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {getGreeting()}, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Welcome to your TeamFocuz dashboard. Here's what's happening today.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentFiles />
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            {user?.role !== 'admin' && (
              <a
                href="/upload"
                className="block p-4 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg hover:from-blue-100 hover:to-purple-100 transition-colors"
              >
                <div className="flex items-center">
                  {user?.role === 'video_editor' && <Video className="h-5 w-5 text-blue-600 mr-3" />}
                  {user?.role === 'script_writer' && <FileText className="h-5 w-5 text-green-600 mr-3" />}
                  {user?.role === 'voice_artist' && <Volume2 className="h-5 w-5 text-purple-600 mr-3" />}
                  <div>
                    <p className="font-medium text-gray-900">Upload New File</p>
                    <p className="text-sm text-gray-600">
                      Upload your latest {user?.role?.replace('_', ' ')} work
                    </p>
                  </div>
                </div>
              </a>
            )}
            
            {user?.role === 'admin' && (
              <>
                <a
                  href="/users"
                  className="block p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg hover:from-green-100 hover:to-blue-100 transition-colors"
                >
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Manage Users</p>
                      <p className="text-sm text-gray-600">Add, edit, or remove team members</p>
                    </div>
                  </div>
                </a>
                
                <a
                  href="/reports"
                  className="block p-4 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-lg hover:from-purple-100 hover:to-pink-100 transition-colors"
                >
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 text-purple-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">View Reports</p>
                      <p className="text-sm text-gray-600">Analyze team productivity and trends</p>
                    </div>
                  </div>
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}