# EOP/ECM Education Agent

An AI-powered educational agent for the Evidence Chain Model (ECM) in research software transparency, built with NVIDIA NIM integration.

## Overview

The EOP/ECM Education Agent helps researchers understand and implement the Evidence Chain Model (ECM) for transparent, reproducible research software. The agent provides personalized guidance, analyzes repositories for ECM compliance, and assists in reorganizing research code according to ECM principles.

## Features

### 🎯 Core Functionalities

1. **ECM Significance Explanation**
   - Tailored explanations based on research field
   - Context-aware analogies and examples
   - Interactive engagement to foster consensus

2. **ECM-Guided Development**
   - Real-time development suggestions
   - Evidence-oriented prompting
   - Template and code snippet generation

3. **Repository ECM-ization**
   - Automated compliance analysis
   - Evidence chain mapping
   - Gap identification and recommendations

4. **Script Reorganization**
   - Dependency analysis and inference
   - Logical execution order reconstruction
   - ECM-compliant structure suggestions

5. **Template Generation**
   - Field-specific project templates
   - ECM-compliant directory structures
   - Documentation and configuration templates

### 🚀 Technical Features

- **NVIDIA NIM Integration**: Leverages state-of-the-art language models
- **Multi-Model Support**: Different models for different tasks (reasoning, code analysis, education)
- **Vector Knowledge Base**: Semantic search over ECM knowledge
- **Interactive Web Interface**: Streamlit-based user interface
- **Conversation Memory**: Maintains context across interactions

## Installation

### Prerequisites

- Python 3.8+
- NVIDIA API Key (for NIM access)
- OpenAI API Key (for embeddings)

### Setup

1. **Clone the repository:**
```bash
git clone <repository-url>
cd ecm-agent
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Set up environment variables:**
```bash
# Create .env file
echo "NVIDIA_API_KEY=your_nvidia_api_key" >> .env
echo "OPENAI_API_KEY=your_openai_api_key" >> .env
```

4. **Run the application:**
```bash
streamlit run streamlit_app.py
```

## Usage

### Web Interface

1. **Start the Streamlit app:**
```bash
streamlit run streamlit_app.py
```

2. **Configure API keys** in the sidebar

3. **Initialize the agent** by clicking "Initialize Agent"

4. **Use the different tabs** for various functionalities:
   - **ECM Explanation**: Get tailored explanations
   - **Development Guide**: Receive development suggestions
   - **Repository Analysis**: Analyze existing repositories
   - **Script Reorganization**: Reorganize fragmented scripts
   - **Templates**: Generate project templates
   - **Chat**: General conversation interface

### Python API

```python
from ecm_education_agent import ECMEducationAgent

# Initialize agent
agent = ECMEducationAgent()

# Explain ECM significance
result = agent.explain_ecm_significance(
    user_background="molecular biology",
    specific_question="How does ECM help with reproducibility?"
)
print(result["explanation"])

# Analyze repository
analysis = agent.ecmize_repository("/path/to/repository")
print(analysis["analysis"])

# Get development suggestions
suggestions = agent.ecm_guided_development(
    current_state={"scripts": ["analysis.py"], "data_files": ["data.csv"]},
    user_description="Machine learning project for image classification"
)
print(suggestions["suggestions"])
```

## Configuration

### NVIDIA NIM Models

The agent supports multiple NVIDIA NIM models optimized for different tasks:

- **Reasoning**: `qwen/qwen3-next-80b-a3b-thinking`
- **Code Analysis**: `meta/codellama-34b-instruct`
- **General**: `meta/llama-3.1-70b-instruct`
- **Education**: `nvidia/nemotron-4-340b-instruct`

### Model Parameters

```python
MODEL_PARAMS = {
    "temperature": 0.6,
    "top_p": 0.7,
    "max_tokens": 4096,
    "stream": True
}
```

## Example Prompts

### ECM Significance Explanation
```
"Explain the Evidence Chain Model to a molecular biologist, focusing on its relevance to experimental reproducibility."
```

### Development Guidance
```
"I've uploaded my analysis script and results.csv. What else do I need to include for transparency according to the ECM?"
```

### Repository Analysis
```
"Evaluate the evidentiary completeness of my software repository. What are its strengths and weaknesses regarding the ECM?"
```

### Script Reorganization
```
"I have a collection of scattered R scripts and a description of my experimental pipeline. Can you help me reorganize them into an ECM-oriented code repository?"
```

## Architecture

### Core Components

1. **ECMEducationAgent**: Main agent class with NVIDIA NIM integration
2. **Knowledge Base**: Vector database with ECM knowledge
3. **NVIDIA NIM Client**: Interface to NVIDIA's language models
4. **Streamlit Interface**: Web-based user interface
5. **Repository Analyzer**: Code analysis and structure detection

### Data Flow

```
User Input → Agent → NVIDIA NIM → Knowledge Retrieval → Response Generation → User Interface
```

## Development

### Adding New Functionality

1. **Extend the agent class:**
```python
def new_functionality(self, params):
    # Implementation
    pass
```

2. **Add to web interface:**
```python
def new_interface():
    # Streamlit interface code
    pass
```

3. **Update configuration:**
```python
# Add new prompts or models
NEW_PROMPTS = {...}
```

### Testing

```bash
# Run the example usage
python ecm_education_agent.py

# Test specific functionality
python -c "from ecm_education_agent import ECMEducationAgent; agent = ECMEducationAgent(); print(agent.get_agent_stats())"
```

## Troubleshooting

### Common Issues

1. **API Key Issues**
   - Ensure NVIDIA_API_KEY is set correctly
   - Check API key permissions and quotas

2. **Model Access**
   - Verify access to NVIDIA NIM models
   - Check model availability in your region

3. **Memory Issues**
   - Large repositories may require more memory
   - Consider processing in chunks for large codebases

### Error Messages

- `"Error calling NVIDIA NIM"`: Check API key and network connection
- `"Repository path does not exist"`: Verify the path is correct
- `"Agent not initialized"`: Click "Initialize Agent" in the web interface

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

[Add your license information here]

## Citation

If you use this agent in your research, please cite:

```bibtex
@software{ecm_education_agent,
  title={EOP/ECM Education Agent},
  author={[Your Name]},
  year={2024},
  url={[Repository URL]}
}
```

## Support

For questions and support:
- Create an issue in the repository
- Contact: [your-email@domain.com]

## Acknowledgments

- NVIDIA for NIM platform access
- OpenAI for embedding models
- Streamlit for the web interface framework
