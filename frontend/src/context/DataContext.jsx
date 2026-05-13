import { createContext, useContext, useState, useCallback } from 'react';
import api from '../utils/axiosConfig';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Cache state for all data
  const [cache, setCache] = useState({
    dashboard: null,
    clusters: null,
    recommendations: null,
    countryAnalysis: null,
  });

  // Loading state for each data type
  const [loading, setLoading] = useState({
    dashboard: false,
    clusters: false,
    recommendations: false,
    countryAnalysis: false,
  });

  // Error state
  const [errors, setErrors] = useState({
    dashboard: null,
    clusters: null,
    recommendations: null,
    countryAnalysis: null,
  });

  // Last fetch time (to prevent unnecessary refetches within 5 minutes)
  const [lastFetch, setLastFetch] = useState({
    dashboard: null,
    clusters: null,
    recommendations: null,
    countryAnalysis: null,
  });

  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

  const isCacheValid = useCallback((dataType) => {
    const lastTime = lastFetch[dataType];
    if (!lastTime) return false;
    return Date.now() - lastTime < CACHE_DURATION;
  }, [lastFetch]);

  const fetchDashboard = useCallback(async (forceRefresh = false) => {
    // Return cached data if valid
    if (!forceRefresh && cache.dashboard && isCacheValid('dashboard')) {
      return cache.dashboard;
    }

    setLoading(prev => ({ ...prev, dashboard: true }));
    setErrors(prev => ({ ...prev, dashboard: null }));

    try {
      const [rfmRes, clusterRes, countryRes] = await Promise.all([
        api.get('/api/rfm'),
        api.get('/api/clusters'),
        api.get('/api/country-analysis')
      ]);

      const dashboardData = {
        summary: { totalCustomers: rfmRes.data.length },
        clusters: clusterRes.data,
        countryData: countryRes.data,
      };

      setCache(prev => ({ ...prev, dashboard: dashboardData }));
      setLastFetch(prev => ({ ...prev, dashboard: Date.now() }));
      return dashboardData;
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setErrors(prev => ({ ...prev, dashboard: error.message }));
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, dashboard: false }));
    }
  }, [cache.dashboard, isCacheValid]);

  const fetchClusters = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && cache.clusters && isCacheValid('clusters')) {
      return cache.clusters;
    }

    setLoading(prev => ({ ...prev, clusters: true }));
    setErrors(prev => ({ ...prev, clusters: null }));

    try {
      const res = await api.get('/api/clusters');
      setCache(prev => ({ ...prev, clusters: res.data }));
      setLastFetch(prev => ({ ...prev, clusters: Date.now() }));
      return res.data;
    } catch (error) {
      console.error('Error fetching clusters:', error);
      setErrors(prev => ({ ...prev, clusters: error.message }));
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, clusters: false }));
    }
  }, [cache.clusters, isCacheValid]);

  const fetchRecommendations = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && cache.recommendations && isCacheValid('recommendations')) {
      return cache.recommendations;
    }

    setLoading(prev => ({ ...prev, recommendations: true }));
    setErrors(prev => ({ ...prev, recommendations: null }));

    try {
      const res = await api.get('/api/recommendations');
      setCache(prev => ({ ...prev, recommendations: res.data }));
      setLastFetch(prev => ({ ...prev, recommendations: Date.now() }));
      return res.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      setErrors(prev => ({ ...prev, recommendations: error.message }));
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, recommendations: false }));
    }
  }, [cache.recommendations, isCacheValid]);

  const fetchCountryAnalysis = useCallback(async (forceRefresh = false) => {
    if (!forceRefresh && cache.countryAnalysis && isCacheValid('countryAnalysis')) {
      return cache.countryAnalysis;
    }

    setLoading(prev => ({ ...prev, countryAnalysis: true }));
    setErrors(prev => ({ ...prev, countryAnalysis: null }));

    try {
      const res = await api.get('/api/country-analysis');
      setCache(prev => ({ ...prev, countryAnalysis: res.data }));
      setLastFetch(prev => ({ ...prev, countryAnalysis: Date.now() }));
      return res.data;
    } catch (error) {
      console.error('Error fetching country analysis:', error);
      setErrors(prev => ({ ...prev, countryAnalysis: error.message }));
      throw error;
    } finally {
      setLoading(prev => ({ ...prev, countryAnalysis: false }));
    }
  }, [cache.countryAnalysis, isCacheValid]);

  const clearCache = useCallback(() => {
    setCache({
      dashboard: null,
      clusters: null,
      recommendations: null,
      countryAnalysis: null,
    });
    setLastFetch({
      dashboard: null,
      clusters: null,
      recommendations: null,
      countryAnalysis: null,
    });
  }, []);

  const prefetchAllData = useCallback(async () => {
    try {
      await Promise.all([
        fetchDashboard(false),
        fetchClusters(false),
        fetchRecommendations(false),
        fetchCountryAnalysis(false),
      ]);
    } catch (error) {
      console.error('Error prefetching data:', error);
    }
  }, [fetchDashboard, fetchClusters, fetchRecommendations, fetchCountryAnalysis]);

  const value = {
    // Cache data
    cache,
    loading,
    errors,

    // Fetch functions
    fetchDashboard,
    fetchClusters,
    fetchRecommendations,
    fetchCountryAnalysis,

    // Utility functions
    clearCache,
    prefetchAllData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
};
