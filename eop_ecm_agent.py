"""
Core EOP/ECM LLM Agent Implementation
"""
import os
import json
from typing import List, Dict, Any, Optional
from datetime import datetime
import logging

from langchain.llms import OpenAI
from langchain.chat_models import ChatOpenAI
from langchain.embeddings import OpenAIEmbeddings
from langchain.vectorstores import Chroma
from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationalRetrievalChain
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter

from config import (
    OPENAI_API_KEY, DEFAULT_MODEL, EMBEDDING_MODEL, 
    CHROMA_PERSIST_DIRECTORY, COLLECTION_NAME, 
    EMERGENCY_CATEGORIES, COMMUNICATION_CHANNELS, 
    PRIORITY_LEVELS, SYSTEM_PROMPT
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class EOPECMAgent:
    """
    Emergency Operations Plan and Emergency Communications Management AI Agent
    """
    
    def __init__(self):
        """Initialize the EOP/ECM Agent"""
        self.llm = ChatOpenAI(
            model_name=DEFAULT_MODEL,
            temperature=0.1,
            openai_api_key=OPENAI_API_KEY
        )
        
        self.embeddings = OpenAIEmbeddings(
            model=EMBEDDING_MODEL,
            openai_api_key=OPENAI_API_KEY
        )
        
        self.memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True
        )
        
        self.vectorstore = None
        self.qa_chain = None
        self.emergency_log = []
        
        self._initialize_vectorstore()
        self._setup_qa_chain()
        
    def _initialize_vectorstore(self):
        """Initialize or load the vector database"""
        try:
            # Try to load existing vectorstore
            self.vectorstore = Chroma(
                persist_directory=CHROMA_PERSIST_DIRECTORY,
                embedding_function=self.embeddings,
                collection_name=COLLECTION_NAME
            )
            logger.info("Loaded existing vector database")
        except Exception as e:
            logger.warning(f"Could not load existing vectorstore: {e}")
            # Create new vectorstore with default knowledge
            self._create_default_knowledge_base()
    
    def _create_default_knowledge_base(self):
        """Create default emergency management knowledge base"""
        default_knowledge = [
            {
                "content": """
                Emergency Response Priorities:
                1. Life Safety - Protect human life above all else
                2. Incident Stabilization - Control and contain the emergency
                3. Property Conservation - Minimize damage to property and environment
                4. Environmental Protection - Prevent environmental contamination
                5. Business Continuity - Restore normal operations
                """,
                "category": "General Emergency Response"
            },
            {
                "content": """
                Crisis Communication Principles:
                1. Be First - Provide initial information quickly
                2. Be Right - Ensure accuracy of information
                3. Be Credible - Maintain trust and transparency
                4. Express Empathy - Show concern for those affected
                5. Promote Action - Provide clear guidance on what to do
                6. Show Accountability - Take responsibility when appropriate
                """,
                "category": "Crisis Communication"
            },
            {
                "content": """
                Incident Command System (ICS) Structure:
                - Incident Commander: Overall responsibility for incident management
                - Operations Section: Tactical operations to carry out the plan
                - Planning Section: Collection and evaluation of information
                - Logistics Section: Support requirements for the incident
                - Finance/Administration Section: Cost tracking and administrative support
                """,
                "category": "Incident Management"
            },
            {
                "content": """
                Emergency Notification Procedures:
                1. Assess the situation and determine threat level
                2. Activate emergency notification system
                3. Send initial alert to key personnel
                4. Provide situation updates every 15-30 minutes
                5. Issue all-clear when situation is resolved
                6. Conduct post-incident debrief and documentation
                """,
                "category": "Emergency Communications"
            },
            {
                "content": """
                Business Continuity Planning Elements:
                1. Risk Assessment and Business Impact Analysis
                2. Recovery Strategies and Procedures
                3. Emergency Response Team Structure
                4. Communication Plans and Contact Lists
                5. Alternate Site Locations and Resources
                6. Testing, Training, and Maintenance Programs
                """,
                "category": "Business Continuity"
            }
        ]
        
        documents = []
        for item in default_knowledge:
            doc = Document(
                page_content=item["content"],
                metadata={"category": item["category"], "source": "default_knowledge"}
            )
            documents.append(doc)
        
        # Create vectorstore with default documents
        self.vectorstore = Chroma.from_documents(
            documents=documents,
            embedding=self.embeddings,
            persist_directory=CHROMA_PERSIST_DIRECTORY,
            collection_name=COLLECTION_NAME
        )
        
        self.vectorstore.persist()
        logger.info("Created new vector database with default knowledge")
    
    def _setup_qa_chain(self):
        """Setup the conversational retrieval chain"""
        if self.vectorstore:
            self.qa_chain = ConversationalRetrievalChain.from_llm(
                llm=self.llm,
                retriever=self.vectorstore.as_retriever(search_kwargs={"k": 5}),
                memory=self.memory,
                return_source_documents=True
            )
    
    def add_knowledge(self, content: str, category: str, source: str = "user_input"):
        """Add new knowledge to the vector database"""
        try:
            text_splitter = RecursiveCharacterTextSplitter(
                chunk_size=1000,
                chunk_overlap=200
            )
            
            chunks = text_splitter.split_text(content)
            documents = []
            
            for chunk in chunks:
                doc = Document(
                    page_content=chunk,
                    metadata={
                        "category": category,
                        "source": source,
                        "timestamp": datetime.now().isoformat()
                    }
                )
                documents.append(doc)
            
            # Add documents to existing vectorstore
            self.vectorstore.add_documents(documents)
            self.vectorstore.persist()
            
            logger.info(f"Added {len(documents)} knowledge chunks to database")
            return True
            
        except Exception as e:
            logger.error(f"Error adding knowledge: {e}")
            return False
    
    def assess_emergency(self, situation_description: str) -> Dict[str, Any]:
        """Assess an emergency situation and provide recommendations"""
        try:
            assessment_prompt = f"""
            Based on the following emergency situation, provide a comprehensive assessment:
            
            Situation: {situation_description}
            
            Please provide:
            1. Emergency Category Classification
            2. Priority Level (Critical/High/Medium/Low)
            3. Immediate Actions Required
            4. Resources Needed
            5. Communication Strategy
            6. Potential Risks and Complications
            7. Estimated Response Timeline
            
            Format your response as a structured analysis.
            """
            
            # Get response from the QA chain
            result = self.qa_chain({
                "question": assessment_prompt,
                "chat_history": []
            })
            
            # Log the emergency
            emergency_record = {
                "timestamp": datetime.now().isoformat(),
                "situation": situation_description,
                "assessment": result["answer"],
                "sources": [doc.metadata for doc in result.get("source_documents", [])]
            }
            
            self.emergency_log.append(emergency_record)
            
            return {
                "assessment": result["answer"],
                "sources": result.get("source_documents", []),
                "confidence": "high" if len(result.get("source_documents", [])) > 2 else "medium"
            }
            
        except Exception as e:
            logger.error(f"Error assessing emergency: {e}")
            return {"error": str(e)}
    
    def generate_communication(self, 
                             message_type: str, 
                             audience: str, 
                             situation: str, 
                             urgency: str = "high") -> Dict[str, Any]:
        """Generate emergency communication messages"""
        try:
            communication_prompt = f"""
            Generate an emergency communication message with the following parameters:
            
            Message Type: {message_type}
            Target Audience: {audience}
            Situation: {situation}
            Urgency Level: {urgency}
            
            Please create:
            1. Subject Line (if applicable)
            2. Main Message Content
            3. Call to Action
            4. Contact Information Section
            5. Recommended Distribution Channels
            
            Ensure the message follows crisis communication best practices:
            - Clear and concise language
            - Specific actionable instructions
            - Appropriate tone for the situation
            - Accurate and verified information only
            """
            
            result = self.qa_chain({
                "question": communication_prompt,
                "chat_history": []
            })
            
            return {
                "message": result["answer"],
                "generated_at": datetime.now().isoformat(),
                "parameters": {
                    "type": message_type,
                    "audience": audience,
                    "urgency": urgency
                }
            }
            
        except Exception as e:
            logger.error(f"Error generating communication: {e}")
            return {"error": str(e)}
    
    def get_response_procedures(self, emergency_type: str) -> Dict[str, Any]:
        """Get specific response procedures for an emergency type"""
        try:
            procedure_prompt = f"""
            Provide detailed response procedures for: {emergency_type}
            
            Include:
            1. Initial Response Steps (first 15 minutes)
            2. Short-term Actions (first hour)
            3. Long-term Recovery Steps
            4. Key Personnel to Contact
            5. Resources and Equipment Needed
            6. Safety Considerations
            7. Documentation Requirements
            
            Present as a step-by-step action plan.
            """
            
            result = self.qa_chain({
                "question": procedure_prompt,
                "chat_history": []
            })
            
            return {
                "procedures": result["answer"],
                "emergency_type": emergency_type,
                "sources": result.get("source_documents", [])
            }
            
        except Exception as e:
            logger.error(f"Error getting response procedures: {e}")
            return {"error": str(e)}
    
    def chat(self, question: str) -> Dict[str, Any]:
        """General chat interface for emergency management questions"""
        try:
            # Add system context to the question
            contextualized_question = f"""
            {SYSTEM_PROMPT}
            
            User Question: {question}
            
            Please provide a comprehensive response based on emergency management best practices.
            """
            
            result = self.qa_chain({
                "question": contextualized_question,
                "chat_history": self.memory.chat_memory.messages
            })
            
            return {
                "response": result["answer"],
                "sources": result.get("source_documents", []),
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error in chat: {e}")
            return {"error": str(e)}
    
    def get_emergency_log(self) -> List[Dict[str, Any]]:
        """Get the emergency assessment log"""
        return self.emergency_log
    
    def clear_memory(self):
        """Clear conversation memory"""
        self.memory.clear()
        logger.info("Conversation memory cleared")
    
    def get_knowledge_stats(self) -> Dict[str, Any]:
        """Get statistics about the knowledge base"""
        try:
            collection = self.vectorstore._collection
            count = collection.count()
            
            return {
                "total_documents": count,
                "categories": EMERGENCY_CATEGORIES,
                "last_updated": datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Error getting knowledge stats: {e}")
            return {"error": str(e)}

# Example usage
if __name__ == "__main__":
    # Initialize the agent
    agent = EOPECMAgent()
    
    # Example emergency assessment
    situation = "Fire alarm activated in Building A, employees reporting smoke on 3rd floor"
    assessment = agent.assess_emergency(situation)
    print("Emergency Assessment:")
    print(assessment["assessment"])
    
    # Example communication generation
    communication = agent.generate_communication(
        message_type="Emergency Alert",
        audience="All Employees",
        situation="Building evacuation due to fire alarm",
        urgency="critical"
    )
    print("\nEmergency Communication:")
    print(communication["message"])
