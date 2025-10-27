"""
Demo Example for EOP/ECM Education Agent
"""
import os
from ecm_education_agent import ECMEducationAgent

def demo_ecm_explanation():
    """Demo ECM significance explanation"""
    print("=" * 60)
    print("DEMO: ECM Significance Explanation")
    print("=" * 60)
    
    agent = ECMEducationAgent()
    
    # Example 1: Molecular Biology
    print("\n1. Molecular Biology Researcher:")
    result = agent.explain_ecm_significance(
        user_background="molecular biology",
        specific_question="How does ECM help with reproducibility in bioinformatics pipelines?"
    )
    
    if "error" not in result:
        print("Response:")
        print(result["explanation"][:500] + "..." if len(result["explanation"]) > 500 else result["explanation"])
    else:
        print(f"Error: {result['error']}")
    
    # Example 2: Machine Learning
    print("\n2. Machine Learning Researcher:")
    result = agent.explain_ecm_significance(
        user_background="machine learning",
        specific_question="What are the benefits of ECM for ML model development?"
    )
    
    if "error" not in result:
        print("Response:")
        print(result["explanation"][:500] + "..." if len(result["explanation"]) > 500 else result["explanation"])
    else:
        print(f"Error: {result['error']}")

def demo_development_guidance():
    """Demo ECM-guided development"""
    print("\n" + "=" * 60)
    print("DEMO: ECM-Guided Development")
    print("=" * 60)
    
    agent = ECMEducationAgent()
    
    # Example repository state
    current_state = {
        "scripts": ["analysis.py", "preprocess.py"],
        "data_files": ["dataset.csv", "results.json"],
        "documentation": ["README.md"],
        "other_files": []
    }
    
    user_description = """
    I'm working on a machine learning project for image classification. 
    I have my main analysis script and preprocessing code, along with my dataset 
    and some results, but I'm not sure what else I need for full transparency.
    """
    
    print("Repository State:")
    for key, files in current_state.items():
        print(f"  {key}: {files}")
    
    print(f"\nUser Description: {user_description}")
    
    result = agent.ecm_guided_development(
        current_state=current_state,
        user_description=user_description
    )
    
    if "error" not in result:
        print("\nECM Development Suggestions:")
        print(result["suggestions"])
    else:
        print(f"Error: {result['error']}")

def demo_repository_analysis():
    """Demo repository ECM analysis"""
    print("\n" + "=" * 60)
    print("DEMO: Repository ECM Analysis")
    print("=" * 60)
    
    agent = ECMEducationAgent()
    
    # Analyze current directory as example
    current_dir = "."
    print(f"Analyzing repository: {current_dir}")
    
    result = agent.ecmize_repository(current_dir)
    
    if "error" not in result:
        print("\nRepository Analysis:")
        print(result["analysis"][:1000] + "..." if len(result["analysis"]) > 1000 else result["analysis"])
        
        print("\nArtifacts Found:")
        artifacts = result.get("artifacts", {})
        for category, files in artifacts.items():
            if files:
                print(f"  {category}: {len(files)} files")
    else:
        print(f"Error: {result['error']}")

def demo_script_reorganization():
    """Demo script reorganization"""
    print("\n" + "=" * 60)
    print("DEMO: Script Reorganization")
    print("=" * 60)
    
    agent = ECMEducationAgent()
    
    # Example script files (using current Python files)
    script_files = [
        "ecm_education_agent.py",
        "nvidia_nim_config.py",
        "knowledge_base.py"
    ]
    
    workflow_description = """
    This is an AI agent project with multiple components:
    1. Main agent implementation with NVIDIA NIM integration
    2. Configuration management for different models
    3. Knowledge base management for ECM concepts
    
    The workflow involves initializing the agent, loading knowledge, 
    and providing various ECM-related functionalities.
    """
    
    print("Script Files:")
    for script in script_files:
        print(f"  - {script}")
    
    print(f"\nWorkflow Description: {workflow_description}")
    
    result = agent.reorganize_scripts(
        script_files=script_files,
        workflow_description=workflow_description
    )
    
    if "error" not in result:
        print("\nReorganization Plan:")
        print(result["reorganization_plan"][:1000] + "..." if len(result["reorganization_plan"]) > 1000 else result["reorganization_plan"])
    else:
        print(f"Error: {result['error']}")

def demo_template_generation():
    """Demo template generation"""
    print("\n" + "=" * 60)
    print("DEMO: ECM Template Generation")
    print("=" * 60)
    
    agent = ECMEducationAgent()
    
    # Example template request
    project_type = "Machine Learning"
    research_field = "Computer Science"
    
    print(f"Generating template for:")
    print(f"  Project Type: {project_type}")
    print(f"  Research Field: {research_field}")
    
    result = agent.generate_ecm_template(
        project_type=project_type,
        research_field=research_field
    )
    
    if "error" not in result:
        print("\nGenerated Template:")
        print(result["template"][:1000] + "..." if len(result["template"]) > 1000 else result["template"])
    else:
        print(f"Error: {result['error']}")

def demo_chat_interface():
    """Demo chat interface"""
    print("\n" + "=" * 60)
    print("DEMO: Chat Interface")
    print("=" * 60)
    
    agent = ECMEducationAgent()
    
    # Example questions
    questions = [
        "What are the key components of an evidence chain?",
        "How do I make my Python scripts more transparent?",
        "What's the difference between ECM and traditional documentation?"
    ]
    
    for i, question in enumerate(questions, 1):
        print(f"\n{i}. Question: {question}")
        
        result = agent.chat_with_agent(question)
        
        if "error" not in result:
            print("Response:")
            response = result["response"]
            print(response[:400] + "..." if len(response) > 400 else response)
        else:
            print(f"Error: {result['error']}")

def main():
    """Run all demos"""
    print("EOP/ECM Education Agent - Demo Examples")
    print("=" * 60)
    
    # Check if API keys are configured
    nvidia_key = os.getenv("NVIDIA_API_KEY")
    openai_key = os.getenv("OPENAI_API_KEY")
    
    if not nvidia_key or nvidia_key == "$API_KEY_REQUIRED_IF_EXECUTING_OUTSIDE_NGC":
        print("⚠️  NVIDIA API key not configured. Some features may not work.")
        print("   Set NVIDIA_API_KEY environment variable.")
    
    if not openai_key:
        print("⚠️  OpenAI API key not configured. Embeddings may not work.")
        print("   Set OPENAI_API_KEY environment variable.")
    
    print("\nRunning demo examples...")
    
    try:
        # Run demos
        demo_ecm_explanation()
        demo_development_guidance()
        demo_repository_analysis()
        demo_script_reorganization()
        demo_template_generation()
        demo_chat_interface()
        
        print("\n" + "=" * 60)
        print("Demo completed successfully!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\nDemo failed with error: {e}")
        print("Please check your API keys and network connection.")

if __name__ == "__main__":
    main()
