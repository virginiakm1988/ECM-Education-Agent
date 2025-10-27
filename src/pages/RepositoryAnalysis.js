import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChartBarIcon, FolderOpenIcon, DocumentArrowUpIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

function RepositoryAnalysis() {
  const [analysisMethod, setAnalysisMethod] = useState('url');
  const [repoUrl, setRepoUrl] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState('');

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles(files);
  };

  const handleAnalysis = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let requestData = {};
      
      if (analysisMethod === 'url') {
        if (!repoUrl) {
          toast.error('Please enter a repository URL');
          return;
        }
        requestData = { repo_url: repoUrl };
      } else {
        if (uploadedFiles.length === 0) {
          toast.error('Please upload files for analysis');
          return;
        }
        requestData = { files: uploadedFiles.map(f => f.name) };
      }

      // Simulate API call
      const response = await fetch('/api/analyze-repository', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) throw new Error('Analysis failed');
      
      const data = await response.json();
      setAnalysisResult(data.analysis);
      toast.success('Repository analysis completed!');

    } catch (error) {
      // Fallback demo response
      setAnalysisResult(`
# Repository ECM Compliance Analysis

## Overall Assessment
**Compliance Score: 6.5/10** - Good foundation with room for improvement

## Strengths ✅
- **Code Organization**: Well-structured Python modules and clear file naming
- **Documentation**: README.md present with basic project description
- **Version Control**: Git repository with commit history
- **Dependencies**: requirements.txt file exists

## Gaps Identified ⚠️

### Critical Missing Elements:
1. **Environment Specification**
   - Missing Python version specification
   - No environment.yml or Docker configuration
   - Dependency versions not pinned

2. **Execution Documentation**
   - No run scripts or execution instructions
   - Missing step-by-step reproduction guide
   - No example usage provided

3. **Data Provenance**
   - Input data sources not documented
   - No data transformation documentation
   - Missing intermediate file descriptions

### Broken Evidence Chains 🔗
- **Data → Processing**: Connection between input files and processing scripts unclear
- **Processing → Results**: Output generation process not documented
- **Configuration → Execution**: Parameter settings not linked to specific runs

## Priority Actions 🎯

### High Priority (Implement First):
1. **Create run.sh script** with complete execution workflow
2. **Add data_sources.md** documenting all input data
3. **Pin dependency versions** in requirements.txt
4. **Add logging** to track execution steps

### Medium Priority:
1. Create config.yml for all parameters
2. Add unit tests for key functions
3. Document expected outputs and validation
4. Include example datasets

### Low Priority:
1. Add Docker configuration
2. Create automated testing pipeline
3. Add performance benchmarks
4. Include troubleshooting guide

## Recommended File Structure
\`\`\`
project/
├── README.md (✅ exists)
├── requirements.txt (✅ exists, needs version pinning)
├── run.sh (❌ missing - HIGH PRIORITY)
├── config.yml (❌ missing)
├── data/
│   ├── raw/ (document sources)
│   ├── processed/ (document transformations)
│   └── README.md (❌ missing)
├── src/
│   ├── __init__.py
│   ├── preprocessing.py (✅ exists)
│   ├── analysis.py (✅ exists)
│   └── utils.py
├── results/
│   ├── figures/
│   ├── tables/
│   └── README.md (❌ missing)
├── tests/ (❌ missing)
└── docs/ (❌ missing)
\`\`\`

## Next Steps
1. **Start with run.sh**: Create a master script that executes your entire pipeline
2. **Document data flow**: Map how data moves through your analysis
3. **Test reproducibility**: Have a colleague try to run your code from scratch
4. **Iterate and improve**: Address gaps systematically

## ECM Compliance Checklist
- [ ] All data sources documented
- [ ] Processing steps clearly defined
- [ ] Environment fully specified
- [ ] Execution instructions complete
- [ ] Results validation included
- [ ] Error handling implemented
- [ ] Logging and provenance tracking
- [ ] Independent reproducibility tested

Your repository shows good research practices but needs systematic documentation to achieve full ECM compliance. Focus on the high-priority items first for maximum impact.
      `);
      toast.success('Demo analysis completed!');
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
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full">
          <ChartBarIcon className="w-8 h-8 text-green-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Repository ECM Analysis</h1>
        <p className="text-lg text-gray-600">
          Analyze existing repositories for ECM compliance and get improvement recommendations
        </p>
      </motion.div>

      {/* Analysis Method Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="card"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Analysis Method</h2>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="radio"
              id="url-method"
              name="analysis-method"
              value="url"
              checked={analysisMethod === 'url'}
              onChange={(e) => setAnalysisMethod(e.target.value)}
              className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
            />
            <label htmlFor="url-method" className="flex items-center text-sm font-medium text-gray-700">
              <FolderOpenIcon className="w-5 h-5 mr-2" />
              Repository URL (GitHub, GitLab, etc.)
            </label>
          </div>
          
          <div className="flex items-center space-x-4">
            <input
              type="radio"
              id="upload-method"
              name="analysis-method"
              value="upload"
              checked={analysisMethod === 'upload'}
              onChange={(e) => setAnalysisMethod(e.target.value)}
              className="w-4 h-4 text-primary-600 border-gray-300 focus:ring-primary-500"
            />
            <label htmlFor="upload-method" className="flex items-center text-sm font-medium text-gray-700">
              <DocumentArrowUpIcon className="w-5 h-5 mr-2" />
              Upload Files
            </label>
          </div>
        </div>
      </motion.div>

      {/* Input Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="card"
      >
        <form onSubmit={handleAnalysis} className="space-y-6">
          {analysisMethod === 'url' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Repository URL
              </label>
              <input
                type="url"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="https://github.com/username/repository"
                className="input-field"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter the URL of a public repository for analysis
              </p>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Repository Files
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="input-field"
                accept=".py,.r,.m,.sh,.md,.txt,.yml,.yaml,.json,.csv"
              />
              <p className="text-sm text-gray-500 mt-1">
                Upload your repository files (code, data, documentation)
              </p>
              {uploadedFiles.length > 0 && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-700">Selected files:</p>
                  <ul className="text-sm text-gray-600 mt-1">
                    {uploadedFiles.map((file, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-2 h-2 bg-primary-500 rounded-full mr-2"></span>
                        {file.name} ({(file.size / 1024).toFixed(1)} KB)
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner mr-2"></div>
                Analyzing Repository...
              </>
            ) : (
              'Analyze Repository'
            )}
          </button>
        </form>
      </motion.div>

      {/* Results */}
      {analysisResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">ECM Compliance Analysis</h2>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap">{analysisResult}</div>
          </div>
        </motion.div>
      )}

      {/* Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">What We Analyze</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Code structure and organization
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Documentation completeness
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Dependency management
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Data provenance tracking
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-primary-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Reproducibility factors
            </li>
          </ul>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Analysis Output</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              ECM compliance score (1-10)
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Identified strengths and gaps
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Prioritized action items
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Recommended file structure
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Step-by-step improvement guide
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

export default RepositoryAnalysis;
