"""
Configuration settings for EOP/ECM LLM Agent
"""
import os
from dotenv import load_dotenv

load_dotenv()

# API Keys
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Model Configuration
DEFAULT_MODEL = "gpt-4-turbo-preview"
EMBEDDING_MODEL = "text-embedding-ada-002"

# Vector Database Configuration
CHROMA_PERSIST_DIRECTORY = "./chroma_db"
COLLECTION_NAME = "eop_ecm_knowledge"

# Emergency Response Categories
EMERGENCY_CATEGORIES = [
    "Natural Disasters",
    "Medical Emergencies", 
    "Security Incidents",
    "Infrastructure Failures",
    "Communication Outages",
    "Evacuation Procedures",
    "Business Continuity",
    "Crisis Communication"
]

# Communication Channels
COMMUNICATION_CHANNELS = {
    "email": "Email Notifications",
    "sms": "SMS Alerts", 
    "phone": "Phone Calls",
    "radio": "Radio Communications",
    "social_media": "Social Media Updates",
    "website": "Website Announcements",
    "mobile_app": "Mobile App Push Notifications"
}

# Response Priority Levels
PRIORITY_LEVELS = {
    "critical": {"level": 1, "response_time": "immediate"},
    "high": {"level": 2, "response_time": "15 minutes"},
    "medium": {"level": 3, "response_time": "1 hour"},
    "low": {"level": 4, "response_time": "4 hours"}
}

# Default System Prompt
SYSTEM_PROMPT = """
You are an Emergency Operations Plan (EOP) and Emergency Communications Management (ECM) specialist AI agent. 
Your role is to:

1. Provide expert guidance on emergency response procedures
2. Help develop and maintain emergency operations plans
3. Assist with crisis communication strategies
4. Offer real-time emergency response recommendations
5. Support business continuity planning
6. Analyze emergency scenarios and suggest appropriate responses

You have access to comprehensive emergency management knowledge and can:
- Interpret emergency situations and recommend appropriate response protocols
- Draft emergency communications for various stakeholders
- Provide step-by-step emergency response procedures
- Suggest resource allocation during emergencies
- Help coordinate multi-agency emergency responses
- Assist with post-incident analysis and improvement planning

Always prioritize safety, clear communication, and evidence-based emergency management practices.
"""
