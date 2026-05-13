import { useState, useEffect } from 'react';
import { Target, Gift, Star, Zap, TrendingUp, RefreshCw } from 'lucide-react';
import { formatCurrency, formatNumber } from '../utils/currency';
import { useData } from '../context/DataContext';
import { SkeletonCard } from '../components/Skeleton';

const Recommendations = () => {
  const { cache, loading, fetchRecommendations } = useData();
  const [recommendations, setRecommendations] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchRecommendations(false);
        setRecommendations(data);
      } catch (error) {
        console.error('Error loading recommendations:', error);
      }
    };

    if (cache.recommendations) {
      setRecommendations(cache.recommendations);
    } else {
      loadData();
    }
  }, [cache.recommendations, fetchRecommendations]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchRecommendations(true);
      setRecommendations(data);
    } catch (error) {
      console.error('Error refreshing recommendations:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getIcon = (strategy) => {
    if (strategy.includes('premium') || strategy.includes('personalized')) return Gift;
    if (strategy.includes('loyalty') || strategy.includes('memberships')) return Star;
    if (strategy.includes('re-engagement') || strategy.includes('discounts')) return Zap;
    if (strategy.includes('price-sensitive') || strategy.includes('bundle')) return TrendingUp;
    return Target;
  };

  const getColor = (strategy) => {
    if (strategy.includes('premium') || strategy.includes('personalized')) return 'from-purple-500 to-pink-500';
    if (strategy.includes('loyalty') || strategy.includes('memberships')) return 'from-yellow-500 to-orange-500';
    if (strategy.includes('re-engagement') || strategy.includes('discounts')) return 'from-blue-500 to-cyan-500';
    if (strategy.includes('price-sensitive') || strategy.includes('bundle')) return 'from-green-500 to-teal-500';
    return 'from-gray-500 to-gray-600';
  };

  if (loading.recommendations && !cache.recommendations) {
    return (
      <div className="p-8 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen w-full">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Marketing Recommendations</h1>
          <p className="text-gray-600">AI-generated strategies for each customer segment</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen w-full">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Marketing Recommendations</h1>
          <p className="text-gray-600">AI-generated strategies for each customer segment</p>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 animate-fade-in">
        {recommendations.map((rec, idx) => {
          const Icon = getIcon(rec.strategy);
          const colorClass = getColor(rec.strategy);

          return (
            <div
              key={rec.cluster}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 transform"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <div className={`w-14 h-14 bg-gradient-to-r ${colorClass} rounded-full flex items-center justify-center mb-4 shadow-lg`}>
                <Icon className="w-7 h-7 text-white" />
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-3">Cluster {rec.cluster}</h3>

              <p className="text-gray-600 mb-5 leading-relaxed text-sm">{rec.strategy}</p>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs font-medium text-gray-500 uppercase">Strategy Type</span>
                <span className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                  rec.strategy.includes('premium') ? 'bg-purple-100 text-purple-800 hover:bg-purple-200' :
                  rec.strategy.includes('loyalty') ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' :
                  rec.strategy.includes('re-engagement') ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' :
                  'bg-green-100 text-green-800 hover:bg-green-200'
                }`}>
                  {rec.strategy.includes('premium') ? 'Premium' :
                   rec.strategy.includes('loyalty') ? 'Loyalty' :
                   rec.strategy.includes('re-engagement') ? 'Re-engagement' :
                   'Value'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Implementation Guide */}
      <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-8">Implementation Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border-l-4 border-purple-500">
            <div className="flex items-center mb-4">
              <Gift className="w-6 h-6 text-purple-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Premium Customers</h3>
            </div>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                Exclusive product launches
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                Personalized shopping experiences
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                VIP customer service
              </li>
              <li className="flex items-start">
                <span className="text-purple-600 mr-2">✓</span>
                Early access to sales
              </li>
            </ul>
          </div>

          <div className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg border-l-4 border-yellow-500">
            <div className="flex items-center mb-4">
              <Star className="w-6 h-6 text-yellow-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Loyal Customers</h3>
            </div>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">✓</span>
                Points-based reward system
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">✓</span>
                Birthday/anniversary offers
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">✓</span>
                Exclusive member events
              </li>
              <li className="flex items-start">
                <span className="text-yellow-600 mr-2">✓</span>
                Free shipping thresholds
              </li>
            </ul>
          </div>

          <div className="p-6 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-center mb-4">
              <Zap className="w-6 h-6 text-blue-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Re-engagement</h3>
            </div>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                Win-back email campaigns
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                Special discount codes
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                Product recommendations
              </li>
              <li className="flex items-start">
                <span className="text-blue-600 mr-2">✓</span>
                Survey for feedback
              </li>
            </ul>
          </div>

          <div className="p-6 bg-gradient-to-br from-green-50 to-teal-50 rounded-lg border-l-4 border-green-500">
            <div className="flex items-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-600 mr-2" />
              <h3 className="text-lg font-semibold text-gray-800">Value Customers</h3>
            </div>
            <ul className="space-y-2 text-gray-700 text-sm">
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                Bundle offers
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                Volume discounts
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                Cashback programs
              </li>
              <li className="flex items-start">
                <span className="text-green-600 mr-2">✓</span>
                Referral incentives
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;