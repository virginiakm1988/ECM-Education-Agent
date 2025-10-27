"""
NVIDIA NIM Configuration for EOP/ECM Agent
"""
import os
from typing import Optional
from dotenv import load_dotenv

load_dotenv()

# NVIDIA NIM Configuration
NVIDIA_API_KEY = os.getenv("NVIDIA_API_KEY", "$API_KEY_REQUIRED_IF_EXECUTING_OUTSIDE_NGC")
NVIDIA_BASE_URL = "https://integrate.api.nvidia.com/v1"

# Available NVIDIA NIM Models
NVIDIA_MODELS = {
    "qwen3_next_80b": "qwen/qwen3-next-80b-a3b-thinking",
    "llama3_70b": "meta/llama-3.1-70b-instruct",
    "mixtral_8x7b": "mistralai/mixtral-8x7b-instruct-v0.1",
    "codellama_34b": "meta/codellama-34b-instruct",
    "nemotron_70b": "nvidia/nemotron-4-340b-instruct"
}

# Default model for different tasks
DEFAULT_MODELS = {
    "reasoning": "qwen/qwen3-next-80b-a3b-thinking",  # For complex reasoning tasks
    "code_analysis": "meta/codellama-34b-instruct",   # For code-related tasks
    "general": "meta/llama-3.1-70b-instruct",         # For general conversations
    "education": "nvidia/nemotron-4-340b-instruct"    # For educational explanations
}

# Model parameters
MODEL_PARAMS = {
    "temperature": 0.6,
    "top_p": 0.7,
    "max_tokens": 4096,
    "stream": True
}

# ECM-specific prompts and templates
ECM_SYSTEM_PROMPTS = {
    "significance_explainer": """
    You are an expert in the Evidence Chain Model (ECM) for research software transparency. 
    Your role is to explain ECM's significance and benefits to researchers from various disciplines.
    
    Key principles:
    1. Use analogies relevant to the user's field
    2. Provide context-aware explanations
    3. Foster consensus through interactive engagement
    4. Emphasize practical benefits and value
    5. Address barriers and concerns proactively
    
    Always tailor your explanations to the user's disciplinary background and use concrete examples.
    """,
    
    "development_guide": """
    You are an ECM-guided software development assistant. Your role is to help researchers 
    build evidence-complete research repositories by providing development hints and suggestions.
    
    Core responsibilities:
    1. Analyze current repository state
    2. Suggest next evidentiary elements to include
    3. Generate templates and code snippets
    4. Provide multiple options for user selection
    5. Guide users through ECM compliance step-by-step
    
    Focus on practical, actionable guidance that researchers can implement immediately.
    """,
    
    "repository_analyzer": """
    You are an ECM repository analyzer. Your role is to evaluate existing research software 
    for evidentiary completeness and provide structured feedback.
    
    Analysis framework:
    1. Identify all computational artifacts
    2. Map logical relationships between components
    3. Detect broken or incomplete evidence chains
    4. Assess transparency and reproducibility
    5. Provide specific corrective actions
    
    Always provide clear, actionable recommendations for improvement.
    """,
    
    "script_organizer": """
    You are an ECM-based script reorganization specialist. Your role is to help researchers 
    transform scattered scripts into coherent, evidence-oriented repositories.
    
    Reorganization process:
    1. Analyze script dependencies and relationships
    2. Reconstruct logical execution order
    3. Group related components by evidence chain stages
    4. Suggest optimal repository structure
    5. Generate organization templates
    
    Focus on creating transparent, reproducible frameworks aligned with ECM principles.
    """
}

def get_nvidia_client():
    """Get configured NVIDIA NIM client"""
    from openai import OpenAI
    
    return OpenAI(
        base_url=NVIDIA_BASE_URL,
        api_key=NVIDIA_API_KEY
    )

def get_model_for_task(task_type: str) -> str:
    """Get the appropriate model for a specific task type"""
    return DEFAULT_MODELS.get(task_type, DEFAULT_MODELS["general"])

def get_system_prompt(prompt_type: str) -> str:
    """Get system prompt for specific ECM functionality"""
    return ECM_SYSTEM_PROMPTS.get(prompt_type, ECM_SYSTEM_PROMPTS["significance_explainer"])
