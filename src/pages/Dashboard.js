import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LightBulbIcon,
  RocketLaunchIcon,
  ChartBarIcon,
  ArrowPathIcon,
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  AcademicCapIcon,
  BeakerIcon,
  CodeBracketIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

const features = [
  {
    name: 'ECM Explanation',
    description: 'Get tailored explanations of the Evidence Chain Model based on your research background.',
    href: '/explanation',
    icon: LightBulbIcon,
    color: 'bg-yellow-500',
  },
  {
    name: 'Development Guide',
    description: 'Receive real-time suggestions for making your research software ECM-compliant.',
    href: '/development',
    icon: RocketLaunchIcon,
    color: 'bg-blue-500',
  },
  {
    name: 'Repository Analysis',
    description: 'Analyze existing repositories for ECM compliance and get improvement recommendations.',
    href: '/analysis',
    icon: ChartBarIcon,
    color: 'bg-green-500',
  },
  {
    name: 'Script Reorganization',
    description: 'Transform fragmented scripts into ECM-compliant, organized repositories.',
    href: '/reorganization',
    icon: ArrowPathIcon,
    color: 'bg-purple-500',
  },
  {
    name: 'Templates',
    description: 'Generate ECM-compliant project templates for your specific research field.',
    href: '/templates',
    icon: DocumentTextIcon,
    color: 'bg-indigo-500',
  },
  {
    name: 'Chat Assistant',
    description: 'Ask questions about ECM, research software transparency, or get general guidance.',
    href: '/chat',
    icon: ChatBubbleLeftRightIcon,
    color: 'bg-pink-500',
  },
];

const stats = [
  { name: 'Research Fields Supported', value: '15+', icon: AcademicCapIcon },
  { name: 'ECM Components', value: '8', icon: BeakerIcon },
  { name: 'Code Languages', value: '10+', icon: CodeBracketIcon },
  { name: 'Compliance Checks', value: '25+', icon: ShieldCheckIcon },
];

function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl font-bold text-gradient mb-4">
            Welcome to ECM Education Agent
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your AI-powered assistant for implementing the Evidence Chain Model in research software. 
            Enhance transparency, reproducibility, and collaboration in your research projects.
          </p>
        </motion.div>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 px-6 py-16 text-center shadow-2xl sm:px-16"
      >
        <div className="relative z-10">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Evidence Chain Model (ECM)
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-blue-100">
            The ECM ensures computational transparency by documenting all steps from data sources 
            to final results, making research software verifiable and reproducible.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              to="/explanation"
              className="rounded-md bg-white px-6 py-3 text-sm font-semibold text-blue-600 shadow-sm hover:bg-blue-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-colors duration-200"
            >
              Learn About ECM
            </Link>
            <Link
              to="/chat"
              className="text-sm font-semibold leading-6 text-white hover:text-blue-100 transition-colors duration-200"
            >
              Ask Questions <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-indigo-700/90" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-20" />
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 + index * 0.1 }}
            className="card text-center hover:shadow-lg transition-shadow duration-200"
          >
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-primary-100 rounded-lg">
              <stat.icon className="w-6 h-6 text-primary-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
            <div className="text-sm text-gray-600">{stat.name}</div>
          </motion.div>
        ))}
      </motion.div>

      {/* Features Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {features.map((feature, index) => (
          <motion.div
            key={feature.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 + index * 0.1 }}
            whileHover={{ y: -5 }}
            className="group"
          >
            <Link
              to={feature.href}
              className="block card hover:shadow-xl transition-all duration-300 group-hover:border-primary-200"
            >
              <div className="flex items-center mb-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${feature.color}`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors duration-200">
                  {feature.name}
                </h3>
              </div>
              <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-200">
                {feature.description}
              </p>
              <div className="mt-4 flex items-center text-primary-600 group-hover:text-primary-700 transition-colors duration-200">
                <span className="text-sm font-medium">Get started</span>
                <svg className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Start Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.0 }}
        className="card"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Start Guide</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-blue-100 rounded-full">
              <span className="text-lg font-bold text-blue-600">1</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Learn ECM Basics</h3>
            <p className="text-gray-600">Start with our ECM explanation tailored to your research field.</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-green-100 rounded-full">
              <span className="text-lg font-bold text-green-600">2</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyze Your Code</h3>
            <p className="text-gray-600">Upload your repository for ECM compliance analysis.</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-purple-100 rounded-full">
              <span className="text-lg font-bold text-purple-600">3</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Implement Changes</h3>
            <p className="text-gray-600">Follow our guided suggestions to improve transparency.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Dashboard;
