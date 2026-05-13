import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin, DollarSign, Users, TrendingUp, Globe, RefreshCw } from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/currency';
import { useData } from '../context/DataContext';
import { SkeletonCard, SkeletonChart, SkeletonTable } from '../components/Skeleton';

const CountryAnalysis = () => {
  const { cache, loading, fetchCountryAnalysis } = useData();
  const [data, setData] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const countryData = await fetchCountryAnalysis(false);
        setData(countryData);
      } catch (error) {
        console.error('Error loading country analysis:', error);
      }
    };

    if (cache.countryAnalysis) {
      setData(cache.countryAnalysis);
    } else {
      loadData();
    }
  }, [cache.countryAnalysis, fetchCountryAnalysis]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const countryData = await fetchCountryAnalysis(true);
      setData(countryData);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  if (loading.countryAnalysis && !cache.countryAnalysis) {
    return (
      <div className="p-8 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Country Analysis</h1>
          <p className="text-gray-600">Multinational retail performance insights</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Country Analysis</h1>
          <p className="text-gray-600">Multinational retail performance insights</p>
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 animate-fade-in">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-orange-500 transform hover:scale-105">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-100 rounded-full flex-shrink-0">
              <Globe className="w-6 h-6 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-lg md:text-2xl font-bold text-gray-800 break-words">
                {formatCurrency(data.reduce((sum, c) => sum + c.total_spending, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-green-500 transform hover:scale-105">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-full flex-shrink-0">
              <Users className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-lg md:text-2xl font-bold text-gray-800 break-words">
                {formatNumber(data.reduce((sum, c) => sum + c.customer_count, 0))}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 border-l-4 border-blue-500 transform hover:scale-105">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-full flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600">Avg Frequency</p>
              <p className="text-lg md:text-2xl font-bold text-gray-800 break-words">
                {(data.reduce((sum, c) => sum + c.avg_frequency, 0) / (data.length || 1)).toFixed(1)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 animate-fade-in">
        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <DollarSign className="w-5 h-5 mr-2 text-orange-500" />
            Revenue by Country
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ left: 50, right: 20, top: 10, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="country" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => [formatCurrency(value), 'Revenue']} />
              <Bar dataKey="total_spending" fill="#FF6B35" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <Users className="w-5 h-5 mr-2 text-green-500" />
            Customer Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ left: 50, right: 20, top: 10, bottom: 80 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="country" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => [formatNumber(value), 'Customers']} />
              <Bar dataKey="customer_count" fill="#06FFA5" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 mb-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h2 className="text-xl font-bold text-gray-800">Detailed Country Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-2 text-orange-500" />
                    Country
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-2 text-green-500" />
                    Total Revenue
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <TrendingUp className="w-4 h-4 mr-2 text-blue-500" />
                    Avg Frequency
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-2 text-purple-500" />
                    Customers
                  </div>
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Rev/Customer</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((c, idx) => (
                <tr key={c.country} className="hover:bg-orange-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center mr-3 text-white font-bold text-sm">
                        {c.country.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{c.country}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-orange-600">{formatCurrency(c.total_spending)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{c.avg_frequency.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{formatNumber(c.customer_count)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{formatCurrency(c.total_spending / c.customer_count)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-8 text-white hover:shadow-2xl transition-shadow duration-300">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <Globe className="w-7 h-7 mr-3" />
          Key Market Insights
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
            <h3 className="font-semibold mb-2 text-lg">🏆 Top Performing Market</h3>
            <p className="text-white/90">
              {data.length > 0 
                ? `${data.reduce((prev, current) => (prev.total_spending > current.total_spending) ? prev : current).country} leads in revenue with ${formatCurrency(data.reduce((prev, current) => (prev.total_spending > current.total_spending) ? prev : current).total_spending)}`
                : 'No data available'}
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur rounded-lg p-4 border border-white/20">
            <h3 className="font-semibold mb-2 text-lg">📈 Growth Opportunity</h3>
            <p className="text-white/90">
              Focus on markets with high customer count but lower average spending per customer
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryAnalysis;