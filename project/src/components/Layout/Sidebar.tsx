import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Home, 
  Upload, 
  FileText, 
  Users, 
  BarChart3, 
  Settings,
  Video,
  FileEdit,
  Mic
} from 'lucide-react';

export function Sidebar() {
  const { user } = useAuth();

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'video_editor': return <Video className="h-5 w-5" />;
      case 'script_writer': return <FileEdit className="h-5 w-5" />;
      case 'voice_artist': return <Mic className="h-5 w-5" />;
      default: return <Home className="h-5 w-5" />;
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, roles: ['admin', 'video_editor', 'script_writer', 'voice_artist'] },
    { name: 'Upload Files', href: '/upload', icon: Upload, roles: ['video_editor', 'script_writer', 'voice_artist'] },
    { name: 'All Files', href: '/files', icon: FileText, roles: ['admin'] },
    { name: 'Manage Users', href: '/users', icon: Users, roles: ['admin'] },
    { name: 'Monthly Reports', href: '/reports', icon: BarChart3, roles: ['admin'] },
  ];

  const filteredNavigation = navigation.filter(item => 
    item.roles.includes(user?.role || '')
  );

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-gray-900">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4 mb-6">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              {getRoleIcon()}
            </div>
            <div className="ml-3">
              <p className="text-white text-sm font-medium">{user?.name}</p>
              <p className="text-gray-300 text-xs capitalize">
                {user?.role?.replace('_', ' ')}
              </p>
            </div>
          </div>
          
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {filteredNavigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                <item.icon className="mr-3 flex-shrink-0 h-6 w-6" />
                {item.name}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}