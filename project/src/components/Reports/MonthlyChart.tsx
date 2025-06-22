import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '../../context/DataContext';

export function MonthlyChart() {
  const { getMonthlyStats } = useData();
  const stats = getMonthlyStats();

  const formatMonth = (month: string) => {
    const date = new Date(month + '-01');
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const chartData = stats.map(stat => ({
    ...stat,
    month: formatMonth(stat.month)
  }));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Monthly Upload Statistics</h3>
        <p className="text-gray-600">Track file uploads by type over time</p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="videos" fill="#3B82F6" name="Videos" />
            <Bar dataKey="scripts" fill="#10B981" name="Scripts" />
            <Bar dataKey="voices" fill="#8B5CF6" name="Voice Files" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}