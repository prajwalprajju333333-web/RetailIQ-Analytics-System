import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Users, TrendingUp, Clock, DollarSign, RefreshCw } from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/currency';
import { useData } from '../context/DataContext';
import { SkeletonCard, SkeletonChart, SkeletonTable } from '../components/Skeleton';

const Segmentation = () => {
  const { cache, loading, fetchClusters } = useData();
  const [clusters, setClusters] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchClusters(false);
        setClusters(data);
      } catch (error) {
        console.error('Error loading clusters:', error);
      }
    };

    // Use cached data if available
    if (cache.clusters) {
      setClusters(cache.clusters);
    } else {
      loadData();
    }
  }, [cache.clusters, fetchClusters]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchClusters(true);
      setClusters(data);
    } catch (error) {
      console.error('Error refreshing clusters:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const radarData = clusters.map(c => ({
    cluster: `Cluster ${c.cluster}`,
    recency: c.avg_recency,
    frequency: c.avg_frequency,
    monetary: c.avg_monetary
  }));

  if (loading.clusters && !cache.clusters) {
    return (
      <div className="p-8 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Customer Segmentation</h1>
          <p className="text-gray-600">AI-powered clustering based on RFM analysis</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {[...Array(2)].map((_, i) => <SkeletonChart key={i} />)}
        </div>
        <SkeletonTable />
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen w-full">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Customer Segmentation</h1>
          <p className="text-gray-600">AI-powered clustering based on RFM analysis</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 text-white rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-fade-in">
        {clusters.map((cluster, idx) => (
          <div key={cluster.cluster} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 transform hover:scale-105" style={{ animationDelay: `${idx * 50}ms` }}>
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-100 rounded-full">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full">Cluster {cluster.cluster}</span>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Customers:</span>
                <span className="font-semibold text-gray-800">{formatNumber(cluster.customer_count)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Spend:</span>
                <span className="font-semibold text-orange-600">{formatCurrency(cluster.avg_monetary)}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-orange-400 to-orange-600 h-2 rounded-full"
                  style={{ width: `${(cluster.avg_monetary / clusters.reduce((max, c) => Math.max(max, c.avg_monetary), 0)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 animate-fade-in">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
            Cluster Comparison
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={clusters} margin={{ left: 50, right: 20, top: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="cluster" />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Avg Spend']} />
              <Bar dataKey="avg_monetary" fill="#FF6B35" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
            RFM Analysis Radar
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#f0f0f0" />
              <PolarAngleAxis dataKey="cluster" />
              <PolarRadiusAxis />
              <Radar name="Recency" dataKey="recency" stroke="#FF6B35" fill="#FF6B35" fillOpacity={0.25} />
              <Radar name="Frequency" dataKey="frequency" stroke="#F7931E" fill="#F7931E" fillOpacity={0.25} />
              <Radar name="Monetary" dataKey="monetary" stroke="#06FFA5" fill="#06FFA5" fillOpacity={0.25} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Detailed Cluster Analysis</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Cluster</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2 text-orange-500" />
                    Avg Recency
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-green-500" />
                    Avg Frequency
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-blue-500" />
                    Avg Monetary
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-purple-500" />
                    Total Customers
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {clusters.map((c) => (
                <tr key={c.cluster} className="hover:bg-orange-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mr-3 text-white font-bold">
                        {c.cluster}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">Cluster {c.cluster}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.avg_recency.toFixed(1)} days</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.avg_frequency.toFixed(1)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-orange-600">{formatCurrency(c.avg_monetary)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(c.customer_count)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Segmentation;