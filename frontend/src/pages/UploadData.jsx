import { useState, useContext } from 'react';
import api from '../utils/axiosConfig';
import { Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { DataContext } from '../context/DataContext';

const UploadData = () => {
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const { clearCache } = useContext(DataContext);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await api.post('/api/upload', formData, {
        headers: { 
          'Content-Type': 'multipart/form-data'
        }
      });
      setSummary(res.data);
      setSuccess(true);
      // Clear the data cache so pages fetch fresh data
      clearCache();
    } catch (error) {
      setError('Failed to upload file. Please check the format and try again.');
      console.error(error);
    }
    setLoading(false);
  };

  const sampleFiles = [
    'indian_retail_electronics.csv',
    'indian_retail_fashion.csv',
    'indian_retail_groceries.csv',
    'indian_retail_home_kitchen.csv',
    'indian_retail_books_media.csv',
    'indian_retail_mumbai.csv',
    'indian_retail_delhi.csv',
    'indian_retail_bangalore.csv',
    'indian_retail_recent.csv',
    'indian_retail_large.csv'
  ];

  return (
    <div className="p-8 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen w-full">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Upload Retail Data</h1>
          <p className="text-gray-600">Upload your CSV file or choose from sample Indian retail datasets</p>
        </div>

        {/* Upload Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="border-2 border-dashed border-orange-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors">
            <Upload className="w-12 h-12 text-orange-500 mx-auto mb-4" />
            <input
              type="file"
              accept=".csv"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <p className="text-lg font-medium text-gray-700 mb-2">Click to upload or drag and drop</p>
              <p className="text-sm text-gray-500">CSV files only</p>
            </label>
            {file && (
              <div className="mt-4 flex items-center justify-center">
                <FileText className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-sm font-medium text-gray-700">{file.name}</span>
              </div>
            )}
          </div>

          <button
            onClick={handleUpload}
            disabled={!file || loading}
            className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Upload Data
              </>
            )}
          </button>
        </div>

        {/* Sample Files */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Sample Indian Retail Datasets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sampleFiles.map((filename) => (
              <div key={filename} className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-300 transition-colors">
                <FileText className="w-5 h-5 text-orange-500 mr-3" />
                <span className="text-sm font-medium text-gray-700">{filename}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-500 mt-4">
            These sample files are located in the <code className="bg-gray-100 px-2 py-1 rounded">data/</code> directory
          </p>
        </div>

        {/* Results */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {success && summary && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
              <span className="text-lg font-medium text-green-800">Upload Successful!</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{summary.total_transactions.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Transactions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{summary.total_customers.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Customers</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{summary.total_countries}</p>
                <p className="text-sm text-gray-600">Countries</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{summary.date_range}</p>
                <p className="text-sm text-gray-600">Date Range</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadData;