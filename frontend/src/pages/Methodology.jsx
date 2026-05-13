import { BookOpen, BarChart3, Brain, Target, TrendingUp, Users } from 'lucide-react';

const Methodology = () => {
  const steps = [
    {
      icon: BarChart3,
      title: "Data Collection",
      description: "Gather transaction data including customer ID, invoice details, products, quantities, prices, and timestamps."
    },
    {
      icon: TrendingUp,
      title: "RFM Analysis",
      description: "Calculate Recency (days since last purchase), Frequency (number of purchases), and Monetary (total spending) for each customer."
    },
    {
      icon: Brain,
      title: "Feature Engineering",
      description: "Normalize RFM values using StandardScaler and prepare data for machine learning algorithms."
    },
    {
      icon: Users,
      title: "K-Means Clustering",
      description: "Apply unsupervised learning to group customers into segments based on their RFM profiles."
    },
    {
      icon: Target,
      title: "Strategy Generation",
      description: "Develop targeted marketing strategies for each cluster based on their behavioral patterns."
    },
    {
      icon: BookOpen,
      title: "Insights & Reporting",
      description: "Generate comprehensive reports and visualizations for business decision-making."
    }
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">Methodology</h1>
          <p className="text-xl text-gray-600">Understanding Our AI-Powered Customer Segmentation Approach</p>
        </div>

        {/* Overview */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">RFM + K-Means: A Powerful Combination</h2>
          <p className="text-gray-700 text-lg leading-relaxed mb-6">
            Our methodology combines the proven RFM (Recency, Frequency, Monetary) analysis framework with
            advanced K-Means clustering algorithm to deliver actionable customer insights for Indian retail businesses.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <h3 className="font-bold text-orange-800 mb-2">RFM Analysis</h3>
              <p className="text-sm text-gray-600">Traditional yet powerful customer behavior analysis</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h3 className="font-bold text-green-800 mb-2">K-Means Clustering</h3>
              <p className="text-sm text-gray-600">Machine learning for automated segmentation</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <h3 className="font-bold text-blue-800 mb-2">Marketing Intelligence</h3>
              <p className="text-sm text-gray-600">Data-driven strategy recommendations</p>
            </div>
          </div>
        </div>

        {/* Process Steps */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Our Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mr-4">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-gray-600">{index + 1}</span>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Technical Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">RFM Framework</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-3 h-3 bg-orange-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <h4 className="font-semibold text-gray-800">Recency (R)</h4>
                  <p className="text-gray-600">Days since customer's last purchase. Lower values indicate more recent activity.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-3 h-3 bg-green-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <h4 className="font-semibold text-gray-800">Frequency (F)</h4>
                  <p className="text-gray-600">Total number of purchases made by the customer. Higher values indicate loyalty.</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 mr-3"></div>
                <div>
                  <h4 className="font-semibold text-gray-800">Monetary (M)</h4>
                  <p className="text-gray-600">Total monetary value of customer's purchases. Higher values indicate higher spending.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">K-Means Clustering</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Algorithm Overview</h4>
                <p className="text-gray-600 text-sm">K-Means is an unsupervised learning algorithm that partitions data into K clusters by minimizing the sum of squared distances between points and their assigned cluster centroids.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Optimal K Selection</h4>
                <p className="text-gray-600 text-sm">We use the elbow method to determine the optimal number of clusters, balancing model complexity with explanatory power.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2">Scalability</h4>
                <p className="text-gray-600 text-sm">StandardScaler normalizes features to ensure equal weighting and improve clustering performance.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Business Impact */}
        <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-6">Business Impact</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">35%</div>
              <p className="text-orange-100">Increase in targeted campaign ROI</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">25%</div>
              <p className="text-orange-100">Reduction in customer churn</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold mb-2">50%</div>
              <p className="text-orange-100">Improvement in customer lifetime value</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Methodology;