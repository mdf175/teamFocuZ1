import React, { useState } from 'react';
import { Layout } from '../components/Layout/Layout';
import { MonthlyChart } from '../components/Reports/MonthlyChart';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { 
  BarChart3, 
  Download, 
  Calendar,
  TrendingUp,
  FileText,
  Users
} from 'lucide-react';

export function ReportsPage() {
  const { files, getMonthlyStats } = useData();
  const { users } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState('');
  
  const monthlyStats = getMonthlyStats();
  const currentMonth = new Date().toISOString().substring(0, 7);
  
  const getCurrentMonthStats = () => {
    const currentStats = monthlyStats.find(stat => stat.month === currentMonth);
    return currentStats || { videos: 0, scripts: 0, voices: 0, total: 0 };
  };

  const currentStats = getCurrentMonthStats();
  
  const getTotalByType = () => {
    return {
      videos: files.filter(f => f.type === 'video').length,
      scripts: files.filter(f => f.type === 'script').length,
      voices: files.filter(f => f.type === 'voice').length
    };
  };

  const totalStats = getTotalByType();

  const getTopContributors = () => {
    const contributors: { [key: string]: { name: string; count: number; } } = {};
    
    files.forEach(file => {
      if (!contributors[file.uploadedBy]) {
        contributors[file.uploadedBy] = {
          name: file.uploadedByName,
          count: 0
        };
      }
      contributors[file.uploadedBy].count++;
    });
    
    return Object.values(contributors)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  };

  const topContributors = getTopContributors();

  const handleExportReport = () => {
    const reportData = {
      generated: new Date().toISOString(),
      totalFiles: files.length,
      totalUsers: users.length,
      monthlyStats,
      totalByType: totalStats,
      topContributors
    };
    
    const blob = new Blob([JSON.stringify(reportData, null, 2)], {
      type: 'application/json'
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `teamfocuz-report-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Layout>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Monthly Reports</h1>
            <p className="text-gray-600 mt-2">
              Analyze team productivity and file upload trends
            </p>
          </div>
          <button
            onClick={handleExportReport}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg font-medium hover:from-green-700 hover:to-blue-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all"
          >
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{currentStats.total}</p>
              <p className="text-sm text-blue-600 mt-2">Total Files</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Videos</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalStats.videos}</p>
              <p className="text-sm text-blue-600 mt-2">All Time</p>
            </div>
            <div className="p-3 bg-blue-500 rounded-full">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Scripts</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalStats.scripts}</p>
              <p className="text-sm text-green-600 mt-2">All Time</p>
            </div>
            <div className="p-3 bg-green-500 rounded-full">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Voice Files</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{totalStats.voices}</p>
              <p className="text-sm text-purple-600 mt-2">All Time</p>
            </div>
            <div className="p-3 bg-purple-500 rounded-full">
              <FileText className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="lg:col-span-2">
          <MonthlyChart />
        </div>

        {/* Top Contributors */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center mb-6">
            <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900">Top Contributors</h3>
          </div>
          
          <div className="space-y-4">
            {topContributors.map((contributor, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-medium text-gray-900">{contributor.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">{contributor.count}</span>
                  <span className="text-xs text-gray-500">files</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Monthly Breakdown</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Month
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Videos
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Scripts
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Voice Files
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {monthlyStats.map((stat) => (
                <tr key={stat.month} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {new Date(stat.month + '-01').toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-medium">
                    {stat.videos}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                    {stat.scripts}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600 font-medium">
                    {stat.voices}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {stat.total}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}