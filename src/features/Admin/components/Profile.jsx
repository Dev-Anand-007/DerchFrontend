import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Settings, Edit3, Camera, Badge, Building, Globe } from 'lucide-react';

export const Profile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);

  // Sample user data
  const [userData, setUserData] = useState({
    id: 'USR-001',
    name: 'Alexandra Chen',
    email: 'alexandra.chen@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    joinDate: '2023-01-15',
    lastLogin: '2024-12-15',
    role: 'Senior Product Manager',
    department: 'Product Development',
    company: 'TechCorp Inc.',
    bio: 'Passionate product manager with 8+ years of experience in building user-centric digital products. Love turning complex problems into simple, elegant solutions.',
    skills: ['Product Strategy', 'User Research', 'Agile Development', 'Data Analysis', 'Team Leadership'],
    avatar: null,
    status: 'Active',
    timezone: 'PST (UTC-8)'
  });

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save to backend
    console.log('User data saved:', userData);
  };

  const handleInputChange = (field, value) => {
    setUserData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen pt-20 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">User Profile</h1>
            <div className="flex gap-3">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 size={16} />
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
              {isEditing && (
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="text-center">
                {/* Avatar */}
                <div className="relative inline-block">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {userData.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  {isEditing && (
                    <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-white hover:bg-gray-700">
                      <Camera size={14} />
                    </button>
                  )}
                </div>

                {/* Name and Role */}
                <div className="mt-4">
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-xl font-semibold text-center w-full border rounded-lg px-3 py-1 mb-2"
                    />
                  ) : (
                    <h2 className="text-xl font-semibold text-gray-900">{userData.name}</h2>
                  )}
                  
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.role}
                      onChange={(e) => handleInputChange('role', e.target.value)}
                      className="text-gray-600 text-center w-full border rounded-lg px-3 py-1"
                    />
                  ) : (
                    <p className="text-gray-600">{userData.role}</p>
                  )}
                </div>

                {/* Status Badge */}
                <div className="mt-3">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    userData.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${userData.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    {userData.status}
                  </span>
                </div>
              </div>

              {/* Quick Info */}
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3 text-gray-600">
                  <Mail size={16} />
                  {isEditing ? (
                    <input
                      type="email"
                      value={userData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="flex-1 border rounded px-2 py-1 text-sm"
                    />
                  ) : (
                    <span className="text-sm">{userData.email}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <Phone size={16} />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={userData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="flex-1 border rounded px-2 py-1 text-sm"
                    />
                  ) : (
                    <span className="text-sm">{userData.phone}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <MapPin size={16} />
                  {isEditing ? (
                    <input
                      type="text"
                      value={userData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="flex-1 border rounded px-2 py-1 text-sm"
                    />
                  ) : (
                    <span className="text-sm">{userData.location}</span>
                  )}
                </div>
                
                <div className="flex items-center gap-3 text-gray-600">
                  <Calendar size={16} />
                  <span className="text-sm">Joined {new Date(userData.joinDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'overview', name: 'Overview', icon: User },
                    { id: 'details', name: 'Details', icon: Badge },
                    { id: 'activity', name: 'Activity', icon: Settings }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-blue-500 text-blue-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon size={16} />
                        {tab.name}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="p-6">
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    {/* Bio Section */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">About</h3>
                      {isEditing ? (
                        <textarea
                          value={userData.bio}
                          onChange={(e) => handleInputChange('bio', e.target.value)}
                          rows={4}
                          className="w-full border rounded-lg px-3 py-2 text-gray-700"
                        />
                      ) : (
                        <p className="text-gray-700 leading-relaxed">{userData.bio}</p>
                      )}
                    </div>

                    {/* Skills */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Skills</h3>
                      <div className="flex flex-wrap gap-2">
                        {userData.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {isEditing && (
                          <button className="px-3 py-1 border-2 border-dashed border-gray-300 rounded-full text-sm text-gray-500 hover:border-gray-400">
                            + Add Skill
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'details' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Company Info */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Company Information</h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={userData.company}
                              onChange={(e) => handleInputChange('company', e.target.value)}
                              className="w-full border rounded-lg px-3 py-2"
                            />
                          ) : (
                            <div className="flex items-center gap-2 text-gray-900">
                              <Building size={16} />
                              {userData.company}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                          {isEditing ? (
                            <input
                              type="text"
                              value={userData.department}
                              onChange={(e) => handleInputChange('department', e.target.value)}
                              className="w-full border rounded-lg px-3 py-2"
                            />
                          ) : (
                            <p className="text-gray-900">{userData.department}</p>
                          )}
                        </div>
                      </div>

                      {/* Personal Info */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">User ID</label>
                          <p className="text-gray-900 font-mono text-sm bg-gray-50 px-3 py-2 rounded">{userData.id}</p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Timezone</label>
                          {isEditing ? (
                            <select
                              value={userData.timezone}
                              onChange={(e) => handleInputChange('timezone', e.target.value)}
                              className="w-full border rounded-lg px-3 py-2"
                            >
                              <option value="PST (UTC-8)">PST (UTC-8)</option>
                              <option value="EST (UTC-5)">EST (UTC-5)</option>
                              <option value="GMT (UTC+0)">GMT (UTC+0)</option>
                              <option value="IST (UTC+5:30)">IST (UTC+5:30)</option>
                            </select>
                          ) : (
                            <div className="flex items-center gap-2 text-gray-900">
                              <Globe size={16} />
                              {userData.timezone}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'activity' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-gray-900 font-medium">Last login</p>
                            <p className="text-gray-600 text-sm">{new Date(userData.lastLogin).toLocaleString()}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-gray-900 font-medium">Profile updated</p>
                            <p className="text-gray-600 text-sm">2 days ago</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                          <div>
                            <p className="text-gray-900 font-medium">Password changed</p>
                            <p className="text-gray-600 text-sm">1 week ago</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};