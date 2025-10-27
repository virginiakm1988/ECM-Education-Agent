import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cog6ToothIcon, KeyIcon, ServerIcon, BellIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

function Settings() {
  const [settings, setSettings] = useState({
    nvidiaApiKey: '',
    openaiApiKey: '',
    apiEndpoint: 'http://localhost:8000',
    modelType: 'education',
    notifications: true,
    autoSave: true,
    theme: 'light'
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('ecm-agent-settings');
    if (savedSettings) {
      setSettings({ ...settings, ...JSON.parse(savedSettings) });
    }
  }, []);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Save to localStorage
      localStorage.setItem('ecm-agent-settings', JSON.stringify(settings));
      
      // Test API connection
      const response = await fetch(`${settings.apiEndpoint}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        toast.success('Settings saved successfully!');
      } else {
        toast.success('Settings saved (API connection could not be verified)');
      }
    } catch (error) {
      toast.success('Settings saved locally');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const testConnection = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${settings.apiEndpoint}/health`);
      if (response.ok) {
        toast.success('Connection successful!');
      } else {
        toast.error('Connection failed');
      }
    } catch (error) {
      toast.error('Connection failed: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
          <Cog6ToothIcon className="w-8 h-8 text-gray-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Settings</h1>
        <p className="text-lg text-gray-600">
          Configure your ECM Education Agent preferences and API connections
        </p>
      </motion.div>

      {/* API Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="card"
      >
        <div className="flex items-center mb-6">
          <KeyIcon className="w-6 h-6 text-primary-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">API Configuration</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              NVIDIA API Key
            </label>
            <input
              type="password"
              value={settings.nvidiaApiKey}
              onChange={(e) => handleInputChange('nvidiaApiKey', e.target.value)}
              placeholder="Enter your NVIDIA NIM API key"
              className="input-field"
            />
            <p className="mt-1 text-sm text-gray-500">
              Required for NVIDIA NIM model access. Get your key from NVIDIA NGC.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              value={settings.openaiApiKey}
              onChange={(e) => handleInputChange('openaiApiKey', e.target.value)}
              placeholder="Enter your OpenAI API key"
              className="input-field"
            />
            <p className="mt-1 text-sm text-gray-500">
              Required for embeddings and fallback models.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              API Endpoint
            </label>
            <div className="flex space-x-2">
              <input
                type="url"
                value={settings.apiEndpoint}
                onChange={(e) => handleInputChange('apiEndpoint', e.target.value)}
                placeholder="http://localhost:8000"
                className="input-field flex-1"
              />
              <button
                onClick={testConnection}
                disabled={isLoading}
                className="btn-secondary"
              >
                Test
              </button>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              Backend API endpoint for ECM agent functionality.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Model Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="card"
      >
        <div className="flex items-center mb-6">
          <ServerIcon className="w-6 h-6 text-primary-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Model Configuration</h2>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Model Type
            </label>
            <select
              value={settings.modelType}
              onChange={(e) => handleInputChange('modelType', e.target.value)}
              className="select-field"
            >
              <option value="education">Education (Optimized for explanations)</option>
              <option value="reasoning">Reasoning (Complex problem solving)</option>
              <option value="code_analysis">Code Analysis (Programming tasks)</option>
              <option value="general">General (Balanced performance)</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
              Choose the default model type for ECM agent interactions.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="card"
      >
        <div className="flex items-center mb-6">
          <BellIcon className="w-6 h-6 text-primary-600 mr-3" />
          <h2 className="text-xl font-semibold text-gray-900">Preferences</h2>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
              <p className="text-sm text-gray-500">Receive notifications for completed tasks</p>
            </div>
            <button
              onClick={() => handleInputChange('notifications', !settings.notifications)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                settings.notifications ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.notifications ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Auto-save</h3>
              <p className="text-sm text-gray-500">Automatically save your work</p>
            </div>
            <button
              onClick={() => handleInputChange('autoSave', !settings.autoSave)}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                settings.autoSave ? 'bg-primary-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                  settings.autoSave ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={settings.theme}
              onChange={(e) => handleInputChange('theme', e.target.value)}
              className="select-field"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto (System)</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="flex justify-end"
      >
        <button
          onClick={handleSave}
          disabled={isLoading}
          className="btn-primary flex items-center"
        >
          {isLoading ? (
            <>
              <div className="loading-spinner mr-2"></div>
              Saving...
            </>
          ) : (
            'Save Settings'
          )}
        </button>
      </motion.div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="card bg-blue-50 border-blue-200"
      >
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Getting API Keys</h3>
        <div className="space-y-2 text-blue-800">
          <p>
            <strong>NVIDIA API Key:</strong> Visit{' '}
            <a href="https://ngc.nvidia.com/" target="_blank" rel="noopener noreferrer" className="underline">
              NVIDIA NGC
            </a>{' '}
            to get your NIM API key.
          </p>
          <p>
            <strong>OpenAI API Key:</strong> Get your key from{' '}
            <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="underline">
              OpenAI Platform
            </a>.
          </p>
          <p>
            <strong>Backend Setup:</strong> Make sure your Python backend is running on the specified endpoint.
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Settings;
