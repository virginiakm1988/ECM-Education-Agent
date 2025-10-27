import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DocumentTextIcon, AcademicCapIcon, BeakerIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const projectTypes = [
  'Data Analysis',
  'Machine Learning',
  'Bioinformatics',
  'Statistical Analysis',
  'Image Processing',
  'Text Mining',
  'Web Scraping',
  'Database Study',
  'Simulation Study',
  'Custom'
];

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
  'Custom'
];

function Templates() {
  const [projectType, setProjectType] = useState('');
  const [customProjectType, setCustomProjectType] = useState('');
  const [researchField, setResearchField] = useState('');
  const [customResearchField, setCustomResearchField] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedTemplate, setGeneratedTemplate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!projectType || !researchField) {
      toast.error('Please select both project type and research field');
      return;
    }

    setIsLoading(true);

    try {
      const finalProjectType = projectType === 'Custom' ? customProjectType : projectType;
      const finalResearchField = researchField === 'Custom' ? customResearchField : researchField;

      // Simulate API call
      const response = await fetch('/api/generate-template', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_type: finalProjectType,
          research_field: finalResearchField
        })
      });

      if (!response.ok) throw new Error('Template generation failed');
      
      const data = await response.json();
      setGeneratedTemplate(data.template);
      toast.success('ECM template generated!');

    } catch (error) {
      // Fallback demo response
      const finalProjectType = projectType === 'Custom' ? customProjectType : projectType;
      const finalResearchField = researchField === 'Custom' ? customResearchField : researchField;
      
      setGeneratedTemplate(`
# ECM-Compliant ${finalProjectType} Template
## Research Field: ${finalResearchField}

## Project Directory Structure

\`\`\`
${finalProjectType.toLowerCase().replace(/\s+/g, '_')}_project/
├── README.md
├── requirements.txt
├── environment.yml
├── run_pipeline.sh
├── config/
│   ├── data_config.yml
│   ├── analysis_config.yml
│   └── model_config.yml
├── data/
│   ├── raw/
│   │   ├── README.md
│   │   └── .gitkeep
│   ├── processed/
│   │   ├── README.md
│   │   └── .gitkeep
│   └── external/
│       ├── README.md
│       └── .gitkeep
├── src/
│   ├── __init__.py
│   ├── data/
│   │   ├── __init__.py
│   │   ├── make_dataset.py
│   │   └── preprocessing.py
│   ├── features/
│   │   ├── __init__.py
│   │   └── build_features.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── train_model.py
│   │   └── predict_model.py
│   ├── visualization/
│   │   ├── __init__.py
│   │   └── visualize.py
│   └── utils/
│       ├── __init__.py
│       └── helpers.py
├── models/
│   ├── README.md
│   └── .gitkeep
├── notebooks/
│   ├── exploratory/
│   │   └── 01_initial_data_exploration.ipynb
│   ├── reports/
│   │   └── 01_final_report.ipynb
│   └── README.md
├── results/
│   ├── figures/
│   │   ├── README.md
│   │   └── .gitkeep
│   ├── tables/
│   │   ├── README.md
│   │   └── .gitkeep
│   └── reports/
│       ├── README.md
│       └── .gitkeep
├── tests/
│   ├── __init__.py
│   ├── test_data_processing.py
│   ├── test_models.py
│   └── test_utils.py
└── docs/
    ├── methodology.md
    ├── data_dictionary.md
    └── api_reference.md
\`\`\`

## Essential Files

### 1. README.md
\`\`\`markdown
# ${finalProjectType} Project

## Overview
Brief description of your ${finalResearchField.toLowerCase()} research project.

## Installation
\`\`\`bash
# Clone the repository
git clone <repository-url>
cd ${finalProjectType.toLowerCase().replace(/\s+/g, '_')}_project

# Create conda environment
conda env create -f environment.yml
conda activate ${finalProjectType.toLowerCase().replace(/\s+/g, '_')}_env

# Or use pip
pip install -r requirements.txt
\`\`\`

## Usage
\`\`\`bash
# Run the complete pipeline
bash run_pipeline.sh

# Or run individual steps
python src/data/make_dataset.py
python src/features/build_features.py
python src/models/train_model.py
\`\`\`

## Project Structure
- \`data/\`: Raw and processed data
- \`src/\`: Source code for the project
- \`models/\`: Trained models and model predictions
- \`results/\`: Generated analysis results
- \`notebooks/\`: Jupyter notebooks for exploration and reporting

## Data
Describe your data sources, collection methods, and any preprocessing steps.

## Methods
Explain the analytical methods and models used in your research.

## Results
Summarize key findings and link to detailed results in the results/ directory.

## Citation
If you use this code, please cite: [Your citation information]
\`\`\`

### 2. requirements.txt
\`\`\`
# Core data science libraries
pandas>=1.3.0
numpy>=1.20.0
scipy>=1.7.0
matplotlib>=3.4.0
seaborn>=0.11.0
plotly>=5.0.0

# Machine learning (if applicable)
scikit-learn>=1.0.0
xgboost>=1.5.0
lightgbm>=3.3.0

# Jupyter and development
jupyter>=1.0.0
ipykernel>=6.0.0
black>=21.0.0
flake8>=4.0.0
pytest>=6.0.0

# Field-specific libraries for ${finalResearchField}
${getFieldSpecificLibraries(finalResearchField)}

# Reproducibility
python-dotenv>=0.19.0
pyyaml>=6.0
\`\`\`

### 3. environment.yml
\`\`\`yaml
name: ${finalProjectType.toLowerCase().replace(/\s+/g, '_')}_env
channels:
  - conda-forge
  - defaults
dependencies:
  - python=3.9
  - pandas
  - numpy
  - scipy
  - matplotlib
  - seaborn
  - jupyter
  - scikit-learn
  - pip
  - pip:
    - -r requirements.txt
\`\`\`

### 4. run_pipeline.sh
\`\`\`bash
#!/bin/bash
# ECM-Compliant ${finalProjectType} Pipeline

set -e  # Exit on any error

echo "Starting ${finalProjectType} pipeline..."
echo "Timestamp: $(date)"

# Step 1: Data preparation
echo "Step 1: Preparing data..."
python src/data/make_dataset.py --config config/data_config.yml

# Step 2: Feature engineering
echo "Step 2: Building features..."
python src/features/build_features.py --config config/analysis_config.yml

# Step 3: Model training (if applicable)
echo "Step 3: Training models..."
python src/models/train_model.py --config config/model_config.yml

# Step 4: Generate predictions/results
echo "Step 4: Generating results..."
python src/models/predict_model.py --config config/model_config.yml

# Step 5: Create visualizations
echo "Step 5: Creating visualizations..."
python src/visualization/visualize.py --config config/analysis_config.yml

echo "Pipeline completed successfully!"
echo "Results saved to results/ directory"
\`\`\`

### 5. Configuration Files

#### config/data_config.yml
\`\`\`yaml
# Data configuration for ${finalProjectType}
data:
  raw_data_path: "data/raw/"
  processed_data_path: "data/processed/"
  external_data_path: "data/external/"
  
preprocessing:
  remove_duplicates: true
  handle_missing_values: "drop"  # or "impute"
  normalize_features: false
  
validation:
  test_size: 0.2
  random_state: 42
  stratify: true
\`\`\`

#### config/analysis_config.yml
\`\`\`yaml
# Analysis configuration
analysis:
  significance_level: 0.05
  confidence_interval: 0.95
  
visualization:
  figure_size: [10, 6]
  dpi: 300
  style: "seaborn"
  color_palette: "viridis"
  
output:
  save_figures: true
  figure_format: "png"
  results_path: "results/"
\`\`\`

## Field-Specific Considerations for ${finalResearchField}

${getFieldSpecificGuidance(finalResearchField)}

## ECM Compliance Checklist

- [ ] **Data Sources**: All data sources documented with provenance
- [ ] **Processing Steps**: Each transformation step clearly documented
- [ ] **Environment**: Complete environment specification (requirements.txt/environment.yml)
- [ ] **Execution**: Master script that runs entire pipeline
- [ ] **Configuration**: Parameters separated from code
- [ ] **Results**: All outputs properly organized and documented
- [ ] **Testing**: Unit tests for critical functions
- [ ] **Documentation**: Comprehensive README and methodology docs
- [ ] **Reproducibility**: Independent verification possible
- [ ] **Version Control**: Git repository with meaningful commits

## Getting Started

1. **Copy this template** to your project directory
2. **Customize configuration files** with your specific parameters
3. **Add your data** to the appropriate data/ subdirectories
4. **Implement your analysis** in the src/ modules
5. **Test the pipeline** by running run_pipeline.sh
6. **Document your methods** in docs/methodology.md
7. **Validate reproducibility** by having a colleague run your code

This template provides a solid foundation for ECM-compliant ${finalResearchField.toLowerCase()} research that ensures transparency, reproducibility, and collaboration.
      `);
      toast.success('Demo template generated!');
    } finally {
      setIsLoading(false);
    }
  };

  const getFieldSpecificLibraries = (field) => {
    const libraries = {
      'Biology/Life Sciences': '# Bioinformatics\nbiopython>=1.79\npandas>=1.3.0\n# Add field-specific libraries',
      'Computer Science': '# Computer Science\ntensorflow>=2.7.0\ntorch>=1.10.0\n# Add field-specific libraries',
      'Physics': '# Physics\nsympy>=1.9\nastropy>=4.3\n# Add field-specific libraries',
      'Social Sciences': '# Social Sciences\nstatsmodels>=0.13.0\npsycopg2>=2.9.0\n# Add field-specific libraries',
      'Medicine': '# Medical Research\nlifelines>=0.26.0\nstatsmodels>=0.13.0\n# Add field-specific libraries'
    };
    return libraries[field] || '# Add field-specific libraries here';
  };

  const getFieldSpecificGuidance = (field) => {
    const guidance = {
      'Biology/Life Sciences': `
### Bioinformatics Considerations:
- Document all sequence databases and versions used
- Include genome assembly versions and coordinates
- Specify all bioinformatics tools with exact versions
- Document quality control thresholds and filtering criteria
- Include sample metadata and experimental conditions`,
      
      'Computer Science': `
### Computer Science Considerations:
- Document all algorithms and their implementations
- Include computational complexity analysis
- Specify hardware requirements and performance benchmarks
- Document all datasets with licensing information
- Include baseline comparisons and evaluation metrics`,
      
      'Social Sciences': `
### Social Science Considerations:
- Document survey instruments and data collection procedures
- Include IRB approval and ethical considerations
- Specify sampling methodology and population characteristics
- Document all statistical assumptions and model diagnostics
- Include sensitivity analyses and robustness checks`
    };
    return guidance[field] || `
### ${field} Considerations:
- Document field-specific methodologies and standards
- Include relevant quality control measures
- Specify domain-specific tools and their versions
- Document any field-specific ethical considerations
- Include appropriate validation procedures`;
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
        <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-indigo-100 rounded-full">
          <DocumentTextIcon className="w-8 h-8 text-indigo-600" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">ECM Project Templates</h1>
        <p className="text-lg text-gray-600">
          Generate ECM-compliant project templates tailored to your research field
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <BeakerIcon className="w-5 h-5 inline mr-2" />
                Project Type *
              </label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className="select-field"
                required
              >
                <option value="">Select project type...</option>
                {projectTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              
              {projectType === 'Custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3"
                >
                  <input
                    type="text"
                    value={customProjectType}
                    onChange={(e) => setCustomProjectType(e.target.value)}
                    placeholder="Enter custom project type..."
                    className="input-field"
                    required
                  />
                </motion.div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <AcademicCapIcon className="w-5 h-5 inline mr-2" />
                Research Field *
              </label>
              <select
                value={researchField}
                onChange={(e) => setResearchField(e.target.value)}
                className="select-field"
                required
              >
                <option value="">Select research field...</option>
                {researchFields.map((field) => (
                  <option key={field} value={field}>{field}</option>
                ))}
              </select>
              
              {researchField === 'Custom' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-3"
                >
                  <input
                    type="text"
                    value={customResearchField}
                    onChange={(e) => setCustomResearchField(e.target.value)}
                    placeholder="Enter custom research field..."
                    className="input-field"
                    required
                  />
                </motion.div>
              )}
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
                Generating Template...
              </>
            ) : (
              'Generate ECM Template'
            )}
          </button>
        </form>
      </motion.div>

      {/* Results */}
      {generatedTemplate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Generated ECM Template</h2>
            <button
              onClick={() => {
                navigator.clipboard.writeText(generatedTemplate);
                toast.success('Template copied to clipboard!');
              }}
              className="btn-secondary text-sm"
            >
              Copy Template
            </button>
          </div>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-sm bg-gray-50 p-4 rounded-lg overflow-x-auto">
              {generatedTemplate}
            </div>
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
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Template Features</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Complete directory structure
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Configuration management
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Execution scripts
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Documentation templates
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Testing framework
            </li>
          </ul>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">ECM Compliance</h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Data provenance tracking
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Environment specification
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Reproducible execution
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Complete documentation
            </li>
            <li className="flex items-start">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Quality assurance
            </li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}

export default Templates;
