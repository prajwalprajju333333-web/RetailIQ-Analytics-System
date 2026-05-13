import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, MapPin, Activity, RefreshCw } from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/currency';
import { useData } from '../context/DataContext';
import { SkeletonCard, SkeletonChart } from '../components/Skeleton';

const Dashboard = () => {
  const { cache, loading, fetchDashboard } = useData();
  const [summary, setSummary] = useState({});
  const [clusters, setClusters] = useState([]);
  const [countryData, setCountryData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDashboard(false);
        setSummary(data.summary);
        setClusters(data.clusters);
        setCountryData(data.countryData);
      } catch (error) {
        console.error('Error loading dashboard:', error);
      }
    };
    
    // Use cached data if available, otherwise load
    if (cache.dashboard) {
      setSummary(cache.dashboard.summary);
      setClusters(cache.dashboard.clusters);
      setCountryData(cache.dashboard.countryData);
    } else {
      loadData();
    }
  }, [cache.dashboard, fetchDashboard]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchDashboard(true);
      setSummary(data.summary);
      setClusters(data.clusters);
      setCountryData(data.countryData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const pieData = clusters.map(c => ({ name: `Cluster ${c.cluster}`, value: c.customer_count }));
  const COLORS = ['#FF6B35', '#F7931E', '#FFD23F', '#06FFA5'];

  if (loading.dashboard && !cache.dashboard) {
    return (
      <div className="p-8 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Indian Retail Analytics & Customer Insights</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {[...Array(2)].map((_, i) => <SkeletonChart key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen w-full">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Dashboard</h1>
          <p className="text-gray-600">Indian Retail Analytics & Customer Insights</p>
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
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-orange-500 transform hover:scale-105">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-full flex-shrink-0">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800 break-words">{formatNumber(summary.totalCustomers)}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-green-500 transform hover:scale-105">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full flex-shrink-0">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600">Clusters</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800 break-words">{clusters.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 transform hover:scale-105">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full flex-shrink-0">
              <MapPin className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600">Countries</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800 break-words">{countryData.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-purple-500 transform hover:scale-105">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-full flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600">Avg Revenue</p>
              <p className="text-xl md:text-2xl font-bold text-gray-800 break-words">
                {formatCurrency(countryData.length > 0 ? Math.round(countryData.reduce((sum, c) => sum + c.total_spending, 0) / countryData.length) : 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 text-orange-500" />
            Customer Segments
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-green-500" />
            Revenue by Country
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={countryData} margin={{ left: 50, right: 20, top: 10, bottom: 50 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="country" angle={-30} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
              <Bar dataKey="total_spending" fill="#FF6B35" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key Insights */}
      <div className="mt-8 bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Key Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-orange-50 rounded-lg border-l-4 border-orange-500">
            <h3 className="font-semibold text-orange-800">Top Performing Segment</h3>
            <p className="text-sm text-gray-600 mt-1">
              {clusters.length > 0 ? `Cluster ${clusters.reduce((prev, current) => (prev.avg_monetary > current.avg_monetary) ? prev : current).cluster} with highest average spending` : 'No data available'}
            </p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <h3 className="font-semibold text-green-800">Growth Opportunity</h3>
            <p className="text-sm text-gray-600 mt-1">
              Focus on re-engagement campaigns for inactive customers in major cities
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;