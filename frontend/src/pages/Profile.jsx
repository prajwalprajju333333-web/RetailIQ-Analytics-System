import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, LogOut, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="p-8 bg-gradient-to-br from-orange-50 to-red-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account information</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 h-32"></div>

          {/* Profile Content */}
          <div className="px-8 pb-8">
            {/* Avatar */}
            <div className="flex items-center mb-8 -mt-16">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-white">
                <div className="w-28 h-28 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                  <User className="w-16 h-16 text-white" />
                </div>
              </div>
              <div className="ml-6">
                <h2 className="text-3xl font-bold text-gray-800">{user?.name}</h2>
                <p className="text-gray-500">Account active</p>
              </div>
            </div>

            {/* User Information */}
            <div className="space-y-6">
              {/* Name */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-orange-100 rounded-full mr-4">
                      <User className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Full Name</p>
                      <p className="text-lg font-semibold text-gray-800">{user?.name}</p>
                    </div>
                  </div>
                  {/* <button className="text-orange-500 hover:text-orange-600">
                    <Edit2 className="w-5 h-5" />
                  </button> */}
                </div>
              </div>

              {/* Email */}
              <div className="border-b border-gray-200 pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-full mr-4">
                      <Mail className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email Address</p>
                      <p className="text-lg font-semibold text-gray-800">{user?.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phone */}
              <div className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-full mr-4">
                      <Phone className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Phone Number</p>
                      <p className="text-lg font-semibold text-gray-800">{user?.phone_number}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              {/* <button className="flex-1 flex items-center justify-center gap-2 bg-orange-100 text-orange-600 py-3 px-4 rounded-lg font-medium hover:bg-orange-200 transition-colors">
                <Edit2 className="w-5 h-5" />
                Edit Profile
              </button> */}
              <button
                onClick={handleLogout}
                className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-600 py-3 px-4 rounded-lg font-medium hover:bg-red-200 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Account Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <p className="text-gray-500 text-sm mb-2">Member Since</p>
            <p className="text-2xl font-bold text-gray-800">2026</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <p className="text-gray-500 text-sm mb-2">Account Status</p>
            <p className="text-2xl font-bold text-green-600">Active</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-lg text-center">
            <p className="text-gray-500 text-sm mb-2">Security</p>
            <p className="text-2xl font-bold text-blue-600">Secure</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;