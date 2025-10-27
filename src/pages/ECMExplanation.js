import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LightBulbIcon, AcademicCapIcon, BeakerIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const researchFields = [
  'Biology/Life Sciences',
  'Computer Science', 
  'Physics',
  'Chemistry',
  'Social Sciences',
  'Engineering',
  'Medicine',
  'Psychology',
  'Economics',
  'Mathematics',
  'Environmental Science',
  'Data Science',
  'Machine Learning',
  'Bioinformatics',
  'Custom'
];

const exampleQuestions = [
  "How does ECM help with reproducibility in my field?",
  "What are the main benefits of adopting ECM?",
  "How is ECM different from traditional documentation?",
  "What barriers might I face when implementing ECM?",
  "How does ECM support collaboration?",
  "What tools can help with ECM implementation?"
];

function ECMExplanation() {
  const [userBackground, setUserBackground] = useState('');
  const [customField, setCustomField] = useState('');
  const [specificQuestion, setSpecificQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [explanation, setExplanation] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userBackground) {
      toast.error('Please select your research field');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/explain-ecm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_background: userBackground === 'Custom' ? customField : userBackground,
          specific_question: specificQuestion
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get explanation');
      }

      const data = await response.json();
      setExplanation(data.explanation);
      toast.success('ECM explanation generated!');
      
    } catch (error) {
      console.error('Error:', error);
      // Fallback explanation for demo purposes
      setExplanation(`
# ECM Explanation for ${userBackground === 'Custom' ? customField : userBackground}

## What is the Evidence Chain Model (ECM)?

The Evidence Chain Model (ECM) is a framework for ensuring computational transparency in research software. Think of it as a comprehensive documentation system that captures every step of your computational workflow.

## Key Benefits for Your Field

**Reproducibility**: Just like laboratory protocols ensure experiments can be repeated, ECM ensures your computational work can be independently verified and reproduced.

**Transparency**: All computational steps, from raw data to final results, are documented and traceable.

**Collaboration**: Team members can easily understand and build upon each other's work.

**Quality Assurance**: Systematic documentation helps identify and prevent errors.

## Core Components

1. **Data Sources**: Original datasets, databases, or input files
2. **Processing Scripts**: Code that transforms or analyzes data  
3. **Configuration Files**: Parameters, settings, environment specifications
4. **Intermediate Outputs**: Temporary files and processed datasets
5. **Final Results**: Publications, figures, summary statistics
6. **Documentation**: README files, methodology descriptions
7. **Execution Records**: Logs, timestamps, version information
8. **Dependencies**: Software versions, library requirements

## Getting Started

1. Start by documenting your current workflow
2. Identify all data sources and outputs
3. Create clear README files
4. Use version control (Git)
5. Document your computational environment
6. Create reproducible execution scripts

The ECM transforms scattered research code into a transparent, verifiable framework that enhances the credibility and impact of your research.
      `);
      toast.success('Demo explanation generated!');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (question) => {
    setSpecificQuestion(question);
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
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-yellow-100 rounded-full">
          <LightBulbIcon className="w-8 h-8 text-yellow-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">ECM Significance Explanation</h1>
        <p className="text-lg text-gray-600">
          Get personalized explanations of the Evidence Chain Model tailored to your research background
        </p>
      </motion.div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="card"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="research-field" className="block text-sm font-medium text-gray-700 mb-2">
              <AcademicCapIcon className="w-5 h-5 inline mr-2" />
              Your Research Field/Background *
            </label>
            <select
              id="research-field"
              value={userBackground}
              onChange={(e) => setUserBackground(e.target.value)}
              className="select-field"
              required
            >
              <option value="">Select your research field...</option>
              {researchFields.map((field) => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>

          {userBackground === 'Custom' && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label htmlFor="custom-field" className="block text-sm font-medium text-gray-700 mb-2">
                Custom Research Field
              </label>
              <input
                type="text"
                id="custom-field"
                value={customField}
                onChange={(e) => setCustomField(e.target.value)}
                placeholder="Enter your specific research field..."
                className="input-field"
                required
              />
            </motion.div>
          )}

          <div>
            <label htmlFor="specific-question" className="block text-sm font-medium text-gray-700 mb-2">
              <BeakerIcon className="w-5 h-5 inline mr-2" />
              Specific Question (Optional)
            </label>
            <textarea
              id="specific-question"
              value={specificQuestion}
              onChange={(e) => setSpecificQuestion(e.target.value)}
              placeholder="Ask a specific question about ECM relevance to your work..."
              className="textarea-field"
              rows={3}
            />
          </div>

          {/* Example Questions */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">Example Questions:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {exampleQuestions.map((question, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleQuestionClick(question)}
                  className="text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 hover:border-primary-300 transition-colors duration-200"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner mr-2"></div>
                Generating Explanation...
              </>
            ) : (
              'Get ECM Explanation'
            )}
          </button>
        </form>
      </motion.div>

      {/* Results */}
      {explanation && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">ECM Explanation</h2>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap">{explanation}</div>
          </div>
        </motion.div>
      )}

      {/* Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Why ECM Matters</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Ensures research reproducibility and transparency
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Facilitates collaboration and knowledge sharing
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Improves research quality and credibility
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Supports regulatory compliance and auditing
            </li>
          </ul>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Next Steps</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Analyze your current repository structure
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Get development guidance for ECM compliance
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Use our templates for new projects
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Chat with our AI for specific questions
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

export default ECMExplanation;
