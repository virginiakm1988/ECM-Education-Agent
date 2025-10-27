"""
EOP/ECM Education Agent with NVIDIA NIM Integration
"""
import os
import json
import ast
import re
from typing import List, Dict, Any, Optional, Tuple
from datetime import datetime
import logging
from pathlib import Path

from openai import OpenAI
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter

from nvidia_nim_config import (
    get_nvidia_client, get_model_for_task, get_system_prompt,
    MODEL_PARAMS, NVIDIA_API_KEY
)
from knowledge_base import EmergencyKnowledgeBase

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class ECMEducationAgent:
    """
    EOP/ECM Education Agent with NVIDIA NIM support for research software transparency
    """
    
    def __init__(self):
        """Initialize the ECM Education Agent"""
        self.nvidia_client = get_nvidia_client()
        self.knowledge_base = EmergencyKnowledgeBase()
        
        # Initialize embeddings for knowledge retrieval
        self.embeddings = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
        
        # ECM knowledge base
        self.ecm_vectorstore = None
        self._initialize_ecm_knowledge()
        
        # Conversation history
        self.conversation_history = []
        
        # Repository analysis cache
        self.analysis_cache = {}
        
    def _initialize_ecm_knowledge(self):
        """Initialize ECM-specific knowledge base"""
        ecm_knowledge = [
            {
                "content": """
                Evidence Chain Model (ECM) Core Principles:
                
                1. Computational Transparency: All computational steps must be documented and reproducible
                2. Evidence Completeness: Every claim must be supported by verifiable computational evidence
                3. Logical Traceability: Clear relationships between inputs, processes, and outputs
                4. Environmental Documentation: Complete recording of computational environment
                5. Provenance Tracking: Full history of data transformations and analysis steps
                
                The ECM ensures that research software can be independently verified, reproduced, 
                and built upon by other researchers.
                """,
                "category": "ECM Fundamentals"
            },
            {
                "content": """
                ECM Evidence Chain Components:
                
                1. Data Sources: Original datasets, databases, APIs
                2. Processing Scripts: Code that transforms or analyzes data
                3. Configuration Files: Parameters, settings, environment specifications
                4. Intermediate Outputs: Temporary files, processed datasets
                5. Final Results: Publications, figures, summary statistics
                6. Documentation: README files, methodology descriptions
                7. Execution Records: Logs, timestamps, version information
                8. Dependencies: Software versions, library requirements
                
                Each component must be linked to show the complete evidence chain.
                """,
                "category": "ECM Components"
            },
            {
                "content": """
                ECM Benefits by Research Field:
                
                Biology/Life Sciences:
                - Ensures experimental protocols are computationally reproducible
                - Enables validation of bioinformatics pipelines
                - Supports regulatory compliance for clinical research
                
                Physics/Engineering:
                - Validates simulation parameters and models
                - Enables replication of computational experiments
                - Supports peer review of theoretical work
                
                Social Sciences:
                - Ensures statistical analysis transparency
                - Enables replication studies
                - Supports open science initiatives
                
                Computer Science:
                - Validates algorithmic implementations
                - Enables benchmark comparisons
                - Supports reproducible machine learning
                """,
                "category": "Field-Specific Benefits"
            }
        ]
        
        # Create documents for vector store
        documents = []
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        
        for item in ecm_knowledge:
            chunks = text_splitter.split_text(item["content"])
            for i, chunk in enumerate(chunks):
                doc = Document(
                    page_content=chunk,
                    metadata={
                        "category": item["category"],
                        "source": "ecm_knowledge_base",
                        "chunk_id": f"{item['category']}_{i}"
                    }
                )
                documents.append(doc)
        
        # Create vector store
        self.ecm_vectorstore = Chroma.from_documents(
            documents=documents,
            embedding=self.embeddings,
            persist_directory="./ecm_chroma_db",
            collection_name="ecm_knowledge"
        )
        
    def _call_nvidia_nim(self, 
                        messages: List[Dict[str, str]], 
                        model_type: str = "general",
                        stream: bool = True) -> str:
        """Call NVIDIA NIM API with specified model"""
        try:
            model = get_model_for_task(model_type)
            
            completion = self.nvidia_client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=MODEL_PARAMS["temperature"],
                top_p=MODEL_PARAMS["top_p"],
                max_tokens=MODEL_PARAMS["max_tokens"],
                stream=stream
            )
            
            if stream:
                response_text = ""
                reasoning_text = ""
                
                for chunk in completion:
                    # Handle reasoning content (for thinking models)
                    reasoning = getattr(chunk.choices[0].delta, "reasoning_content", None)
                    if reasoning:
                        reasoning_text += reasoning
                    
                    # Handle regular content
                    if chunk.choices[0].delta.content is not None:
                        response_text += chunk.choices[0].delta.content
                
                return response_text, reasoning_text
            else:
                return completion.choices[0].message.content, ""
                
        except Exception as e:
            logger.error(f"Error calling NVIDIA NIM: {e}")
            return f"Error: {str(e)}", ""
    
    def explain_ecm_significance(self, 
                               user_background: str, 
                               specific_question: str = "") -> Dict[str, Any]:
        """
        Explain ECM significance tailored to user's disciplinary background
        """
        try:
            # Retrieve relevant knowledge
            query = f"ECM benefits for {user_background} {specific_question}"
            relevant_docs = self.ecm_vectorstore.similarity_search(query, k=3)
            
            context = "\n".join([doc.page_content for doc in relevant_docs])
            
            system_prompt = get_system_prompt("significance_explainer")
            
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"""
                User Background: {user_background}
                Question: {specific_question if specific_question else "How is ECM relevant to my field?"}
                
                Context from knowledge base:
                {context}
                
                Please provide a tailored explanation of ECM's significance using analogies 
                and examples relevant to this user's field. Focus on practical benefits 
                and address potential concerns.
                """}
            ]
            
            response, reasoning = self._call_nvidia_nim(messages, "education")
            
            return {
                "explanation": response,
                "reasoning": reasoning,
                "user_background": user_background,
                "relevant_sources": [doc.metadata for doc in relevant_docs],
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error explaining ECM significance: {e}")
            return {"error": str(e)}
    
    def analyze_repository_structure(self, repo_path: str) -> Dict[str, Any]:
        """
        Analyze repository structure and identify computational artifacts
        """
        try:
            repo_path = Path(repo_path)
            if not repo_path.exists():
                return {"error": "Repository path does not exist"}
            
            artifacts = {
                "scripts": [],
                "data_files": [],
                "config_files": [],
                "documentation": [],
                "outputs": [],
                "dependencies": []
            }
            
            # File type mappings
            script_extensions = {'.py', '.r', '.m', '.sh', '.bat', '.sql', '.js', '.scala', '.java'}
            data_extensions = {'.csv', '.json', '.xml', '.xlsx', '.tsv', '.parquet', '.h5', '.mat'}
            config_extensions = {'.yml', '.yaml', '.ini', '.cfg', '.conf', '.toml'}
            doc_extensions = {'.md', '.txt', '.rst', '.tex', '.pdf', '.docx'}
            output_extensions = {'.png', '.jpg', '.svg', '.pdf', '.html', '.log'}
            
            # Scan repository
            for file_path in repo_path.rglob('*'):
                if file_path.is_file():
                    suffix = file_path.suffix.lower()
                    relative_path = file_path.relative_to(repo_path)
                    
                    if suffix in script_extensions:
                        artifacts["scripts"].append(str(relative_path))
                    elif suffix in data_extensions:
                        artifacts["data_files"].append(str(relative_path))
                    elif suffix in config_extensions:
                        artifacts["config_files"].append(str(relative_path))
                    elif suffix in doc_extensions:
                        artifacts["documentation"].append(str(relative_path))
                    elif suffix in output_extensions:
                        artifacts["outputs"].append(str(relative_path))
                    elif file_path.name in ['requirements.txt', 'environment.yml', 'Pipfile', 'setup.py']:
                        artifacts["dependencies"].append(str(relative_path))
            
            return artifacts
            
        except Exception as e:
            logger.error(f"Error analyzing repository: {e}")
            return {"error": str(e)}
    
    def ecm_guided_development(self, 
                              current_state: Dict[str, Any], 
                              user_description: str = "") -> Dict[str, Any]:
        """
        Provide ECM-guided development suggestions for research software
        """
        try:
            system_prompt = get_system_prompt("development_guide")
            
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"""
                Current Repository State:
                {json.dumps(current_state, indent=2)}
                
                User Description: {user_description}
                
                Based on the ECM framework, analyze what's missing and provide 3 specific 
                suggestions for the next evidentiary elements to include. For each suggestion, 
                provide:
                1. What to add (be specific)
                2. Why it's important for ECM compliance
                3. A template or code snippet if applicable
                
                Format as: Option A, Option B, Option C with clear explanations.
                """}
            ]
            
            response, reasoning = self._call_nvidia_nim(messages, "code_analysis")
            
            return {
                "suggestions": response,
                "reasoning": reasoning,
                "current_state": current_state,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error in ECM-guided development: {e}")
            return {"error": str(e)}
    
    def ecmize_repository(self, repo_path: str) -> Dict[str, Any]:
        """
        Evaluate repository for ECM compliance and provide structured feedback
        """
        try:
            # Analyze repository structure
            artifacts = self.analyze_repository_structure(repo_path)
            if "error" in artifacts:
                return artifacts
            
            system_prompt = get_system_prompt("repository_analyzer")
            
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"""
                Repository Analysis Results:
                {json.dumps(artifacts, indent=2)}
                
                Please evaluate this repository for ECM compliance and provide:
                
                1. Strengths: What evidence chain elements are present and well-implemented
                2. Gaps: What's missing for full ECM compliance
                3. Broken Chains: Where logical connections are incomplete
                4. Priority Actions: Top 3 most important improvements
                5. Compliance Score: Rate 1-10 with justification
                
                Provide specific, actionable recommendations for each gap identified.
                """}
            ]
            
            response, reasoning = self._call_nvidia_nim(messages, "reasoning")
            
            return {
                "analysis": response,
                "reasoning": reasoning,
                "artifacts": artifacts,
                "repository_path": repo_path,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error in ECM-ization: {e}")
            return {"error": str(e)}
    
    def reorganize_scripts(self, 
                          script_files: List[str], 
                          workflow_description: str) -> Dict[str, Any]:
        """
        Reorganize fragmented scripts based on ECM principles
        """
        try:
            # Analyze script dependencies
            script_analysis = {}
            
            for script_file in script_files:
                if os.path.exists(script_file):
                    with open(script_file, 'r', encoding='utf-8') as f:
                        content = f.read()
                        
                    # Basic dependency analysis
                    imports = re.findall(r'(?:import|from)\s+(\w+)', content)
                    file_refs = re.findall(r'["\']([^"\']*\.(csv|json|txt|xlsx|py|r))["\']', content)
                    
                    script_analysis[script_file] = {
                        "imports": imports,
                        "file_references": file_refs,
                        "size": len(content.split('\n'))
                    }
            
            system_prompt = get_system_prompt("script_organizer")
            
            messages = [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"""
                Script Analysis:
                {json.dumps(script_analysis, indent=2)}
                
                Workflow Description: {workflow_description}
                
                Please reorganize these scripts into an ECM-compliant structure:
                
                1. Infer dependencies and execution order
                2. Group related scripts by evidence chain stage
                3. Suggest new directory structure
                4. Identify missing components for complete evidence chain
                5. Provide reorganization plan with specific file movements
                
                Focus on creating a transparent, reproducible framework.
                """}
            ]
            
            response, reasoning = self._call_nvidia_nim(messages, "reasoning")
            
            return {
                "reorganization_plan": response,
                "reasoning": reasoning,
                "script_analysis": script_analysis,
                "workflow_description": workflow_description,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error reorganizing scripts: {e}")
            return {"error": str(e)}
    
    def generate_ecm_template(self, project_type: str, research_field: str) -> Dict[str, Any]:
        """
        Generate ECM-compliant project template
        """
        try:
            messages = [
                {"role": "system", "content": get_system_prompt("development_guide")},
                {"role": "user", "content": f"""
                Generate an ECM-compliant project template for:
                Project Type: {project_type}
                Research Field: {research_field}
                
                Provide:
                1. Directory structure
                2. Essential files and their purposes
                3. README template
                4. Example configuration files
                5. Documentation requirements
                
                Make it practical and field-specific.
                """}
            ]
            
            response, reasoning = self._call_nvidia_nim(messages, "code_analysis")
            
            return {
                "template": response,
                "reasoning": reasoning,
                "project_type": project_type,
                "research_field": research_field,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error generating template: {e}")
            return {"error": str(e)}
    
    def chat_with_agent(self, message: str, context: str = "") -> Dict[str, Any]:
        """
        General chat interface for ECM-related questions
        """
        try:
            # Add to conversation history
            self.conversation_history.append({"role": "user", "content": message})
            
            # Retrieve relevant knowledge
            relevant_docs = self.ecm_vectorstore.similarity_search(message, k=3)
            knowledge_context = "\n".join([doc.page_content for doc in relevant_docs])
            
            # Prepare messages
            messages = [
                {"role": "system", "content": get_system_prompt("significance_explainer")},
                {"role": "user", "content": f"""
                User Message: {message}
                Additional Context: {context}
                
                Relevant Knowledge:
                {knowledge_context}
                
                Please provide a helpful response about ECM, research software transparency, 
                or related topics. Use the knowledge context to inform your response.
                """}
            ]
            
            # Add conversation history (last 4 exchanges)
            for msg in self.conversation_history[-8:]:
                messages.append(msg)
            
            response, reasoning = self._call_nvidia_nim(messages, "education")
            
            # Add to conversation history
            self.conversation_history.append({"role": "assistant", "content": response})
            
            return {
                "response": response,
                "reasoning": reasoning,
                "relevant_sources": [doc.metadata for doc in relevant_docs],
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error in chat: {e}")
            return {"error": str(e)}
    
    def clear_conversation(self):
        """Clear conversation history"""
        self.conversation_history = []
        logger.info("Conversation history cleared")
    
    def get_agent_stats(self) -> Dict[str, Any]:
        """Get agent statistics and status"""
        return {
            "conversation_length": len(self.conversation_history),
            "knowledge_base_size": self.ecm_vectorstore._collection.count() if self.ecm_vectorstore else 0,
            "nvidia_api_configured": bool(NVIDIA_API_KEY and NVIDIA_API_KEY != "$API_KEY_REQUIRED_IF_EXECUTING_OUTSIDE_NGC"),
            "available_models": list(get_model_for_task("general")),
            "last_activity": datetime.now().isoformat()
        }

# Example usage and testing
if __name__ == "__main__":
    # Initialize agent
    agent = ECMEducationAgent()
    
    # Test ECM significance explanation
    print("=== ECM Significance Explanation ===")
    result = agent.explain_ecm_significance(
        user_background="molecular biology",
        specific_question="How does ECM help with reproducibility in bioinformatics?"
    )
    print(result.get("explanation", result.get("error")))
    
    # Test repository analysis (using current directory as example)
    print("\n=== Repository Analysis ===")
    analysis = agent.ecmize_repository(".")
    print(analysis.get("analysis", analysis.get("error")))
    
    # Test chat interface
    print("\n=== Chat Interface ===")
    chat_result = agent.chat_with_agent("What are the key components of an evidence chain?")
    print(chat_result.get("response", chat_result.get("error")))
