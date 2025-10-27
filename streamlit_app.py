"""
Streamlit Web Interface for EOP/ECM Education Agent
"""
import streamlit as st
import json
import os
from pathlib import Path
import tempfile
import zipfile
from typing import Dict, Any

from ecm_education_agent import ECMEducationAgent
from nvidia_nim_config import NVIDIA_MODELS, DEFAULT_MODELS

# Page configuration
st.set_page_config(
    page_title="EOP/ECM Education Agent",
    page_icon="🔬",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS
st.markdown("""
<style>
    .main-header {
        font-size: 2.5rem;
        color: #1f77b4;
        text-align: center;
        margin-bottom: 2rem;
    }
    .feature-card {
        background-color: #f0f2f6;
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 1rem 0;
    }
    .success-message {
        background-color: #d4edda;
        color: #155724;
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 1rem 0;
    }
    .error-message {
        background-color: #f8d7da;
        color: #721c24;
        padding: 1rem;
        border-radius: 0.5rem;
        margin: 1rem 0;
    }
</style>
""", unsafe_allow_html=True)

# Initialize session state
if 'agent' not in st.session_state:
    st.session_state.agent = None
if 'conversation_history' not in st.session_state:
    st.session_state.conversation_history = []
if 'analysis_results' not in st.session_state:
    st.session_state.analysis_results = {}

def initialize_agent():
    """Initialize the ECM Education Agent"""
    try:
        if st.session_state.agent is None:
            with st.spinner("Initializing ECM Education Agent..."):
                st.session_state.agent = ECMEducationAgent()
        return True
    except Exception as e:
        st.error(f"Failed to initialize agent: {str(e)}")
        return False

def main():
    """Main application"""
    
    # Header
    st.markdown('<h1 class="main-header">🔬 EOP/ECM Education Agent</h1>', unsafe_allow_html=True)
    st.markdown("**Evidence Chain Model (ECM) Assistant for Research Software Transparency**")
    
    # Sidebar
    with st.sidebar:
        st.header("🛠️ Configuration")
        
        # API Key configuration
        nvidia_api_key = st.text_input(
            "NVIDIA API Key", 
            value=os.getenv("NVIDIA_API_KEY", ""), 
            type="password",
            help="Enter your NVIDIA NIM API key"
        )
        
        if nvidia_api_key:
            os.environ["NVIDIA_API_KEY"] = nvidia_api_key
        
        # Model selection
        st.subheader("Model Selection")
        selected_model_type = st.selectbox(
            "Task Type",
            ["education", "reasoning", "code_analysis", "general"],
            help="Select the type of task for optimal model selection"
        )
        
        # Initialize agent
        if st.button("Initialize Agent", type="primary"):
            if initialize_agent():
                st.success("Agent initialized successfully!")
            else:
                st.error("Failed to initialize agent")
        
        # Agent status
        if st.session_state.agent:
            st.success("✅ Agent Ready")
            stats = st.session_state.agent.get_agent_stats()
            st.json(stats)
        else:
            st.warning("⚠️ Agent Not Initialized")
    
    # Main content tabs
    tab1, tab2, tab3, tab4, tab5, tab6 = st.tabs([
        "💡 ECM Explanation", 
        "🚀 Development Guide", 
        "📊 Repository Analysis", 
        "🔄 Script Reorganization",
        "📝 Templates",
        "💬 Chat"
    ])
    
    with tab1:
        ecm_explanation_interface()
    
    with tab2:
        development_guide_interface()
    
    with tab3:
        repository_analysis_interface()
    
    with tab4:
        script_reorganization_interface()
    
    with tab5:
        template_generation_interface()
    
    with tab6:
        chat_interface()

def ecm_explanation_interface():
    """ECM Significance Explanation Interface"""
    st.header("💡 ECM Significance Explanation")
    st.markdown("Get tailored explanations of the Evidence Chain Model based on your research background.")
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        user_background = st.text_input(
            "Your Research Field/Background",
            placeholder="e.g., molecular biology, machine learning, social sciences",
            help="Describe your research field for tailored explanations"
        )
        
        specific_question = st.text_area(
            "Specific Question (Optional)",
            placeholder="e.g., How does ECM help with reproducibility in my field?",
            help="Ask a specific question about ECM relevance to your work"
        )
    
    with col2:
        st.markdown("### 📚 Example Questions")
        st.markdown("""
        - How is ECM relevant to bioinformatics?
        - What are the benefits for machine learning research?
        - How does ECM support regulatory compliance?
        - Why should I adopt ECM in my lab?
        """)
    
    if st.button("Get ECM Explanation", type="primary"):
        if not st.session_state.agent:
            st.error("Please initialize the agent first")
            return
        
        if not user_background:
            st.warning("Please enter your research background")
            return
        
        with st.spinner("Generating tailored ECM explanation..."):
            result = st.session_state.agent.explain_ecm_significance(
                user_background=user_background,
                specific_question=specific_question
            )
        
        if "error" in result:
            st.error(f"Error: {result['error']}")
        else:
            st.success("✅ ECM Explanation Generated")
            
            # Display explanation
            st.markdown("### 📖 Explanation")
            st.markdown(result["explanation"])
            
            # Show reasoning if available
            if result.get("reasoning"):
                with st.expander("🧠 AI Reasoning Process"):
                    st.text(result["reasoning"])
            
            # Show sources
            if result.get("relevant_sources"):
                with st.expander("📚 Knowledge Sources"):
                    st.json(result["relevant_sources"])

def development_guide_interface():
    """ECM-Guided Development Interface"""
    st.header("🚀 ECM-Guided Development")
    st.markdown("Get suggestions for making your research software ECM-compliant.")
    
    # Repository state input
    st.subheader("Current Repository State")
    
    col1, col2 = st.columns(2)
    
    with col1:
        scripts = st.text_area(
            "Scripts/Code Files",
            placeholder="analysis.py\npreprocess.R\nvisualize.m",
            help="List your script files (one per line)"
        )
        
        data_files = st.text_area(
            "Data Files",
            placeholder="dataset.csv\nresults.json\nconfig.yml",
            help="List your data files (one per line)"
        )
    
    with col2:
        documentation = st.text_area(
            "Documentation",
            placeholder="README.md\nmethodology.pdf",
            help="List your documentation files (one per line)"
        )
        
        other_files = st.text_area(
            "Other Files",
            placeholder="requirements.txt\nDockerfile\nMakefile",
            help="List other relevant files (one per line)"
        )
    
    user_description = st.text_area(
        "Project Description",
        placeholder="Describe your research project, goals, and current challenges...",
        help="Provide context about your project for better suggestions"
    )
    
    if st.button("Get Development Suggestions", type="primary"):
        if not st.session_state.agent:
            st.error("Please initialize the agent first")
            return
        
        # Prepare current state
        current_state = {
            "scripts": [f.strip() for f in scripts.split('\n') if f.strip()],
            "data_files": [f.strip() for f in data_files.split('\n') if f.strip()],
            "documentation": [f.strip() for f in documentation.split('\n') if f.strip()],
            "other_files": [f.strip() for f in other_files.split('\n') if f.strip()]
        }
        
        with st.spinner("Analyzing repository and generating suggestions..."):
            result = st.session_state.agent.ecm_guided_development(
                current_state=current_state,
                user_description=user_description
            )
        
        if "error" in result:
            st.error(f"Error: {result['error']}")
        else:
            st.success("✅ Development Suggestions Generated")
            
            st.markdown("### 📋 ECM-Guided Suggestions")
            st.markdown(result["suggestions"])
            
            if result.get("reasoning"):
                with st.expander("🧠 Analysis Reasoning"):
                    st.text(result["reasoning"])

def repository_analysis_interface():
    """Repository Analysis Interface"""
    st.header("📊 Repository ECM Analysis")
    st.markdown("Analyze existing repositories for ECM compliance and get improvement recommendations.")
    
    # Repository input methods
    analysis_method = st.radio(
        "Analysis Method",
        ["Local Directory Path", "Upload Repository ZIP"],
        help="Choose how to provide your repository for analysis"
    )
    
    repo_path = None
    
    if analysis_method == "Local Directory Path":
        repo_path = st.text_input(
            "Repository Path",
            placeholder="/path/to/your/repository",
            help="Enter the full path to your local repository"
        )
        
        if repo_path and not os.path.exists(repo_path):
            st.warning("⚠️ Path does not exist")
    
    elif analysis_method == "Upload Repository ZIP":
        uploaded_file = st.file_uploader(
            "Upload Repository ZIP",
            type=['zip'],
            help="Upload a ZIP file containing your repository"
        )
        
        if uploaded_file:
            # Extract ZIP to temporary directory
            with tempfile.TemporaryDirectory() as temp_dir:
                zip_path = os.path.join(temp_dir, "repo.zip")
                with open(zip_path, "wb") as f:
                    f.write(uploaded_file.getbuffer())
                
                extract_path = os.path.join(temp_dir, "extracted")
                with zipfile.ZipFile(zip_path, 'r') as zip_ref:
                    zip_ref.extractall(extract_path)
                
                repo_path = extract_path
                st.success(f"✅ Repository extracted to temporary location")
    
    if st.button("Analyze Repository", type="primary"):
        if not st.session_state.agent:
            st.error("Please initialize the agent first")
            return
        
        if not repo_path:
            st.warning("Please provide a repository path or upload a ZIP file")
            return
        
        with st.spinner("Analyzing repository for ECM compliance..."):
            result = st.session_state.agent.ecmize_repository(repo_path)
        
        if "error" in result:
            st.error(f"Error: {result['error']}")
        else:
            st.success("✅ Repository Analysis Complete")
            
            # Store results
            st.session_state.analysis_results = result
            
            # Display analysis
            st.markdown("### 📊 ECM Compliance Analysis")
            st.markdown(result["analysis"])
            
            # Show artifacts found
            if result.get("artifacts"):
                with st.expander("📁 Repository Artifacts"):
                    st.json(result["artifacts"])
            
            if result.get("reasoning"):
                with st.expander("🧠 Analysis Reasoning"):
                    st.text(result["reasoning"])

def script_reorganization_interface():
    """Script Reorganization Interface"""
    st.header("🔄 Script Reorganization")
    st.markdown("Reorganize fragmented scripts into ECM-compliant structure.")
    
    # File upload for scripts
    uploaded_scripts = st.file_uploader(
        "Upload Script Files",
        type=['py', 'r', 'm', 'sh', 'sql', 'js', 'scala', 'java'],
        accept_multiple_files=True,
        help="Upload your script files for reorganization analysis"
    )
    
    workflow_description = st.text_area(
        "Workflow Description",
        placeholder="Describe your research workflow, data processing steps, and how the scripts relate to each other...",
        help="Provide context about your workflow for better reorganization suggestions"
    )
    
    if st.button("Reorganize Scripts", type="primary"):
        if not st.session_state.agent:
            st.error("Please initialize the agent first")
            return
        
        if not uploaded_scripts:
            st.warning("Please upload script files")
            return
        
        # Save uploaded files temporarily
        script_files = []
        with tempfile.TemporaryDirectory() as temp_dir:
            for uploaded_file in uploaded_scripts:
                file_path = os.path.join(temp_dir, uploaded_file.name)
                with open(file_path, "wb") as f:
                    f.write(uploaded_file.getbuffer())
                script_files.append(file_path)
            
            with st.spinner("Analyzing scripts and generating reorganization plan..."):
                result = st.session_state.agent.reorganize_scripts(
                    script_files=script_files,
                    workflow_description=workflow_description
                )
        
        if "error" in result:
            st.error(f"Error: {result['error']}")
        else:
            st.success("✅ Reorganization Plan Generated")
            
            st.markdown("### 🗂️ Reorganization Plan")
            st.markdown(result["reorganization_plan"])
            
            if result.get("script_analysis"):
                with st.expander("📊 Script Analysis"):
                    st.json(result["script_analysis"])
            
            if result.get("reasoning"):
                with st.expander("🧠 Reorganization Reasoning"):
                    st.text(result["reasoning"])

def template_generation_interface():
    """Template Generation Interface"""
    st.header("📝 ECM Template Generation")
    st.markdown("Generate ECM-compliant project templates for your research field.")
    
    col1, col2 = st.columns(2)
    
    with col1:
        project_type = st.selectbox(
            "Project Type",
            [
                "Data Analysis",
                "Machine Learning",
                "Bioinformatics",
                "Simulation Study",
                "Statistical Analysis",
                "Image Processing",
                "Text Mining",
                "Web Scraping",
                "Database Study",
                "Custom"
            ]
        )
        
        if project_type == "Custom":
            project_type = st.text_input("Custom Project Type")
    
    with col2:
        research_field = st.selectbox(
            "Research Field",
            [
                "Biology/Life Sciences",
                "Computer Science",
                "Physics",
                "Chemistry",
                "Social Sciences",
                "Engineering",
                "Medicine",
                "Psychology",
                "Economics",
                "Custom"
            ]
        )
        
        if research_field == "Custom":
            research_field = st.text_input("Custom Research Field")
    
    if st.button("Generate Template", type="primary"):
        if not st.session_state.agent:
            st.error("Please initialize the agent first")
            return
        
        with st.spinner("Generating ECM-compliant project template..."):
            result = st.session_state.agent.generate_ecm_template(
                project_type=project_type,
                research_field=research_field
            )
        
        if "error" in result:
            st.error(f"Error: {result['error']}")
        else:
            st.success("✅ Template Generated")
            
            st.markdown("### 📋 ECM Project Template")
            st.markdown(result["template"])
            
            if result.get("reasoning"):
                with st.expander("🧠 Template Reasoning"):
                    st.text(result["reasoning"])

def chat_interface():
    """Chat Interface"""
    st.header("💬 Chat with ECM Agent")
    st.markdown("Ask questions about ECM, research software transparency, or get general guidance.")
    
    # Display conversation history
    if st.session_state.conversation_history:
        st.subheader("Conversation History")
        for i, msg in enumerate(st.session_state.conversation_history[-10:]):  # Show last 10 messages
            if msg["role"] == "user":
                st.markdown(f"**You:** {msg['content']}")
            else:
                st.markdown(f"**Agent:** {msg['content']}")
            st.markdown("---")
    
    # Chat input
    user_message = st.text_area(
        "Your Message",
        placeholder="Ask me anything about ECM, research software transparency, or related topics...",
        help="Type your question or message here"
    )
    
    context = st.text_input(
        "Additional Context (Optional)",
        placeholder="Provide any additional context for your question...",
        help="Optional context to help the agent provide better responses"
    )
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        if st.button("Send Message", type="primary"):
            if not st.session_state.agent:
                st.error("Please initialize the agent first")
                return
            
            if not user_message:
                st.warning("Please enter a message")
                return
            
            with st.spinner("Agent is thinking..."):
                result = st.session_state.agent.chat_with_agent(
                    message=user_message,
                    context=context
                )
            
            if "error" in result:
                st.error(f"Error: {result['error']}")
            else:
                # Add to conversation history
                st.session_state.conversation_history.extend([
                    {"role": "user", "content": user_message},
                    {"role": "assistant", "content": result["response"]}
                ])
                
                st.success("✅ Response Generated")
                st.markdown("### 🤖 Agent Response")
                st.markdown(result["response"])
                
                if result.get("reasoning"):
                    with st.expander("🧠 Response Reasoning"):
                        st.text(result["reasoning"])
                
                if result.get("relevant_sources"):
                    with st.expander("📚 Knowledge Sources"):
                        st.json(result["relevant_sources"])
    
    with col2:
        if st.button("Clear Conversation"):
            st.session_state.conversation_history = []
            if st.session_state.agent:
                st.session_state.agent.clear_conversation()
            st.success("Conversation cleared")

if __name__ == "__main__":
    main()
