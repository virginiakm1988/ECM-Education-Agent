import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowPathIcon, DocumentArrowUpIcon, CodeBracketIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

function ScriptReorganization() {
  const [uploadedScripts, setUploadedScripts] = useState([]);
  const [workflowDescription, setWorkflowDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [reorganizationPlan, setReorganizationPlan] = useState('');

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedScripts(files);
  };

  const handleReorganization = async (e) => {
    e.preventDefault();
    
    if (uploadedScripts.length === 0) {
      toast.error('Please upload script files');
      return;
    }

    if (!workflowDescription.trim()) {
      toast.error('Please describe your workflow');
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      const response = await fetch('/api/reorganize-scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script_files: uploadedScripts.map(f => f.name),
          workflow_description: workflowDescription
        })
      });

      if (!response.ok) throw new Error('Reorganization failed');
      
      const data = await response.json();
      setReorganizationPlan(data.reorganization_plan);
      toast.success('Reorganization plan generated!');

    } catch (error) {
      // Fallback demo response
      setReorganizationPlan(`
# Script Reorganization Plan

## Current Script Analysis

### Identified Scripts:
${uploadedScripts.map(f => `- **${f.name}** (${(f.size / 1024).toFixed(1)} KB)`).join('\n')}

### Inferred Dependencies:
Based on file names and common patterns:
1. **Data Processing Chain**: 
   - data_preprocessing.py → feature_extraction.py → model_training.py
2. **Analysis Pipeline**: 
   - load_data.py → statistical_analysis.py → visualization.py
3. **Utility Functions**: 
   - utils.py (shared across multiple scripts)

## Recommended ECM-Compliant Structure

\`\`\`
research_project/
├── README.md
├── requirements.txt
├── run_pipeline.sh
├── config/
│   ├── data_config.yml
│   ├── model_config.yml
│   └── analysis_config.yml
├── data/
│   ├── raw/
│   ├── processed/
│   └── README.md
├── src/
│   ├── __init__.py
│   ├── data/
│   │   ├── __init__.py
│   │   ├── preprocessing.py
│   │   └── feature_extraction.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── training.py
│   │   └── evaluation.py
│   ├── analysis/
│   │   ├── __init__.py
│   │   ├── statistical_analysis.py
│   │   └── visualization.py
│   └── utils/
│       ├── __init__.py
│       └── helpers.py
├── results/
│   ├── figures/
│   ├── tables/
│   ├── models/
│   └── README.md
├── tests/
│   ├── test_data_processing.py
│   ├── test_models.py
│   └── test_analysis.py
└── docs/
    ├── methodology.md
    ├── data_dictionary.md
    └── api_reference.md
\`\`\`

## File Reorganization Plan

### Phase 1: Core Structure Setup
1. **Create main directories**: src/, data/, results/, config/, tests/, docs/
2. **Move scripts to appropriate modules**:
   - Data processing scripts → src/data/
   - Model-related scripts → src/models/
   - Analysis scripts → src/analysis/
   - Utility functions → src/utils/

### Phase 2: Configuration Extraction
1. **Extract hardcoded parameters** from scripts
2. **Create configuration files**:
   - data_config.yml: file paths, preprocessing parameters
   - model_config.yml: model hyperparameters, training settings
   - analysis_config.yml: analysis parameters, visualization settings

### Phase 3: Execution Workflow
1. **Create master execution script** (run_pipeline.sh):
\`\`\`bash
#!/bin/bash
# Complete research pipeline execution

echo "Starting ECM-compliant research pipeline..."

# Step 1: Data preprocessing
python src/data/preprocessing.py --config config/data_config.yml

# Step 2: Feature extraction
python src/data/feature_extraction.py --config config/data_config.yml

# Step 3: Model training
python src/models/training.py --config config/model_config.yml

# Step 4: Model evaluation
python src/models/evaluation.py --config config/model_config.yml

# Step 5: Statistical analysis
python src/analysis/statistical_analysis.py --config config/analysis_config.yml

# Step 6: Generate visualizations
python src/analysis/visualization.py --config config/analysis_config.yml

echo "Pipeline completed successfully!"
\`\`\`

### Phase 4: Documentation Enhancement
1. **Update README.md** with:
   - Project overview and objectives
   - Installation and setup instructions
   - Usage examples and workflow description
   - Expected inputs and outputs

2. **Create data documentation**:
   - Data sources and collection methods
   - Variable definitions and units
   - Processing steps and transformations

3. **Add methodology documentation**:
   - Statistical methods used
   - Model architectures and rationale
   - Validation procedures

## Evidence Chain Mapping

### Data Flow Documentation:
1. **Raw Data** (data/raw/) → **Preprocessing** (src/data/preprocessing.py) → **Processed Data** (data/processed/)
2. **Processed Data** → **Feature Extraction** (src/data/feature_extraction.py) → **Features** (data/processed/features/)
3. **Features** → **Model Training** (src/models/training.py) → **Trained Models** (results/models/)
4. **Models** → **Evaluation** (src/models/evaluation.py) → **Performance Metrics** (results/tables/)
5. **Results** → **Analysis** (src/analysis/) → **Final Outputs** (results/figures/, results/tables/)

## Implementation Steps

### Week 1: Structure Setup
- [ ] Create directory structure
- [ ] Move files to appropriate locations
- [ ] Update import statements
- [ ] Test basic functionality

### Week 2: Configuration Management
- [ ] Extract parameters to config files
- [ ] Update scripts to use config files
- [ ] Create parameter validation
- [ ] Test with different configurations

### Week 3: Documentation & Testing
- [ ] Write comprehensive README
- [ ] Add inline documentation
- [ ] Create unit tests
- [ ] Validate end-to-end pipeline

### Week 4: Validation & Refinement
- [ ] Independent reproducibility test
- [ ] Performance optimization
- [ ] Error handling improvement
- [ ] Final documentation review

## Benefits of This Reorganization

1. **Improved Maintainability**: Clear separation of concerns
2. **Enhanced Reproducibility**: Standardized execution workflow
3. **Better Collaboration**: Intuitive project structure
4. **Easier Testing**: Modular components enable unit testing
5. **ECM Compliance**: Complete evidence chain documentation
6. **Scalability**: Structure supports project growth

## Next Steps
1. **Review the proposed structure** and adjust based on your specific needs
2. **Start with Phase 1** to establish the basic organization
3. **Gradually implement** configuration management and documentation
4. **Test thoroughly** at each phase to ensure functionality is preserved
5. **Seek feedback** from collaborators on the new structure

This reorganization will transform your scattered scripts into a professional, ECM-compliant research repository that supports transparency, reproducibility, and collaboration.
      `);
      toast.success('Demo reorganization plan generated!');
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
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full">
          <ArrowPathIcon className="w-8 h-8 text-purple-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Script Reorganization</h1>
        <p className="text-lg text-gray-600">
          Transform fragmented scripts into ECM-compliant, organized repositories
        </p>
      </motion.div>

      {/* Upload Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="card"
      >
        <form onSubmit={handleReorganization} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <DocumentArrowUpIcon className="w-5 h-5 inline mr-2" />
              Upload Script Files
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="input-field"
              accept=".py,.r,.m,.sh,.sql,.js,.scala,.java,.ipynb"
            />
            <p className="text-sm text-gray-500 mt-1">
              Upload your script files for reorganization analysis
            </p>
            
            {uploadedScripts.length > 0 && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Uploaded Scripts ({uploadedScripts.length} files):
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {uploadedScripts.map((file, index) => (
                    <div key={index} className="flex items-center text-sm text-gray-600">
                      <CodeBracketIcon className="w-4 h-4 mr-2 text-primary-500" />
                      <span className="truncate">{file.name}</span>
                      <span className="ml-auto text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Workflow Description
            </label>
            <textarea
              value={workflowDescription}
              onChange={(e) => setWorkflowDescription(e.target.value)}
              placeholder="Describe your research workflow, data processing steps, and how the scripts relate to each other..."
              className="textarea-field"
              rows={6}
              required
            />
            <p className="text-sm text-gray-500 mt-1">
              Provide context about your workflow for better reorganization suggestions
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading || uploadedScripts.length === 0}
            className="btn-primary w-full flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <div className="loading-spinner mr-2"></div>
                Analyzing Scripts...
              </>
            ) : (
              'Generate Reorganization Plan'
            )}
          </button>
        </form>
      </motion.div>

      {/* Results */}
      {reorganizationPlan && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Reorganization Plan</h2>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap">{reorganizationPlan}</div>
          </div>
        </motion.div>
      )}

      {/* Example Workflows */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Example Workflow Descriptions</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-2">Machine Learning Project</h4>
            <p className="text-blue-800 text-sm">
              "I have scripts for data preprocessing, feature engineering, model training with different algorithms, 
              hyperparameter tuning, and result visualization. The workflow starts with raw CSV data, 
              processes it through several cleaning steps, extracts features, trains multiple models, 
              and generates performance comparison plots."
            </p>
          </div>
          
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-medium text-green-900 mb-2">Bioinformatics Analysis</h4>
            <p className="text-green-800 text-sm">
              "My scripts process genomic data starting from FASTQ files, perform quality control, 
              alignment to reference genome, variant calling, annotation, and statistical analysis. 
              I also have visualization scripts for generating plots and summary reports."
            </p>
          </div>
          
          <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
            <h4 className="font-medium text-purple-900 mb-2">Social Science Research</h4>
            <p className="text-purple-800 text-sm">
              "I have survey data processing scripts, statistical analysis for hypothesis testing, 
              demographic analysis, correlation studies, and report generation. The workflow involves 
              data cleaning, coding of responses, statistical modeling, and visualization of results."
            </p>
          </div>
        </div>
      </motion.div>

      {/* Info Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Reorganization Benefits</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Clear project structure and organization
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Improved code maintainability
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Enhanced reproducibility
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Better collaboration support
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              ECM compliance achievement
            </li>
          </ul>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Supported File Types</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Python (.py), R (.r), MATLAB (.m)
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Shell scripts (.sh), SQL (.sql)
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              JavaScript (.js), Scala (.scala)
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Java (.java), Jupyter notebooks (.ipynb)
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

export default ScriptReorganization;
