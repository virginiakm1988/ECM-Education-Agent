import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChatBubbleLeftRightIcon, 
  PaperAirplaneIcon,
  TrashIcon,
  UserIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const exampleQuestions = [
  "What are the key components of an evidence chain?",
  "How do I make my Python scripts more transparent?",
  "What's the difference between ECM and traditional documentation?",
  "How can ECM help with regulatory compliance?",
  "What tools can help implement ECM in my workflow?",
  "How do I handle sensitive data in ECM?"
];

function Chat() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "Hello! I'm your ECM Education Agent. I can help you understand the Evidence Chain Model, provide guidance on research software transparency, and answer questions about implementing ECM in your projects. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message = inputMessage) => {
    if (!message.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: message,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulate API call - replace with actual API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: message,
          context: ''
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: data.response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      
    } catch (error) {
      console.error('Error:', error);
      
      // Fallback response for demo purposes
      const fallbackResponse = generateFallbackResponse(message);
      
      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: fallbackResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      toast.success('Demo response generated!');
    } finally {
      setIsLoading(false);
    }
  };

  const generateFallbackResponse = (message) => {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('evidence chain') || lowerMessage.includes('ecm')) {
      return `Great question about the Evidence Chain Model! The ECM consists of several key components:

1. **Data Sources** - Original datasets, databases, or input files
2. **Processing Scripts** - Code that transforms or analyzes data
3. **Configuration Files** - Parameters, settings, environment specifications
4. **Intermediate Outputs** - Temporary files and processed datasets
5. **Final Results** - Publications, figures, summary statistics
6. **Documentation** - README files, methodology descriptions
7. **Execution Records** - Logs, timestamps, version information
8. **Dependencies** - Software versions, library requirements

Each component should be clearly documented and linked to show the complete evidence chain from raw data to final results. This ensures your research is transparent, reproducible, and verifiable.

Would you like me to explain any specific component in more detail?`;
    }
    
    if (lowerMessage.includes('python') || lowerMessage.includes('script')) {
      return `To make your Python scripts more transparent and ECM-compliant, consider these practices:

**1. Documentation**
- Add clear docstrings to all functions
- Include inline comments for complex logic
- Create a comprehensive README file

**2. Environment Management**
- Use requirements.txt or environment.yml
- Pin specific package versions
- Document Python version requirements

**3. Configuration**
- Separate configuration from code
- Use config files (JSON, YAML) for parameters
- Make paths and settings configurable

**4. Logging and Provenance**
- Add logging statements for key operations
- Record input/output file relationships
- Log processing timestamps and parameters

**5. Reproducibility**
- Set random seeds for reproducible results
- Create run scripts that execute the full pipeline
- Include example data and expected outputs

Would you like specific examples of any of these practices?`;
    }
    
    if (lowerMessage.includes('compliance') || lowerMessage.includes('regulatory')) {
      return `ECM can significantly help with regulatory compliance in several ways:

**Audit Trail**
- Complete documentation of all computational steps
- Timestamped execution records
- Version control history

**Data Integrity**
- Clear provenance tracking from source to results
- Validation checkpoints throughout the pipeline
- Immutable record of data transformations

**Reproducibility Requirements**
- Standardized documentation formats
- Environment specifications for exact replication
- Automated testing and validation procedures

**Quality Assurance**
- Systematic review processes
- Error detection and handling documentation
- Peer review facilitation through transparency

**Specific Regulatory Benefits:**
- FDA 21 CFR Part 11 compliance for pharmaceutical research
- GxP compliance in clinical trials
- FAIR data principles adherence
- Open science mandate compliance

The key is that ECM provides the systematic framework that regulators expect to see in modern computational research.

Are you working in a specific regulatory environment?`;
    }
    
    return `Thank you for your question about "${message}". 

The Evidence Chain Model (ECM) is designed to address exactly these types of concerns in research software transparency. Here are some key points that might help:

- **Systematic Documentation**: ECM provides a framework for documenting every step of your computational workflow
- **Reproducibility**: By following ECM principles, others can independently verify and build upon your work
- **Collaboration**: Clear documentation makes it easier for team members to understand and contribute
- **Quality Assurance**: Systematic approaches help identify and prevent errors

For more specific guidance, I'd recommend:
1. Starting with our ECM explanation tailored to your field
2. Analyzing your current repository structure
3. Using our development guide for step-by-step improvements

Would you like me to elaborate on any of these aspects, or do you have a more specific question about implementing ECM in your work?`;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'assistant',
        content: "Hello! I'm your ECM Education Agent. How can I assist you today?",
        timestamp: new Date()
      }
    ]);
    toast.success('Chat cleared');
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex items-center justify-between mb-6"
      >
        <div className="flex items-center">
          <div className="flex items-center justify-center w-12 h-12 bg-pink-100 rounded-full mr-4">
            <ChatBubbleLeftRightIcon className="w-6 h-6 text-pink-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chat with ECM Agent</h1>
            <p className="text-gray-600">Ask questions about ECM and research software transparency</p>
          </div>
        </div>
        <button
          onClick={clearChat}
          className="btn-secondary flex items-center"
        >
          <TrashIcon className="w-4 h-4 mr-2" />
          Clear Chat
        </button>
      </motion.div>

      {/* Example Questions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-6"
      >
        <p className="text-sm font-medium text-gray-700 mb-3">Example Questions:</p>
        <div className="flex flex-wrap gap-2">
          {exampleQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSendMessage(question)}
              className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1 rounded-full transition-colors duration-200"
            >
              {question}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Chat Messages */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex-1 bg-white rounded-lg border border-gray-200 overflow-hidden flex flex-col"
      >
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-3xl ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 ${message.type === 'user' ? 'ml-3' : 'mr-3'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' 
                        ? 'bg-primary-500 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {message.type === 'user' ? (
                        <UserIcon className="w-5 h-5" />
                      ) : (
                        <CpuChipIcon className="w-5 h-5" />
                      )}
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-primary-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className={`text-xs mt-1 ${
                      message.type === 'user' ? 'text-primary-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-start"
            >
              <div className="flex mr-3">
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <CpuChipIcon className="w-5 h-5 text-gray-600" />
                </div>
              </div>
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 p-4">
          <div className="flex space-x-3">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about ECM, research software transparency, or related topics..."
              className="flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              rows={1}
              disabled={isLoading}
            />
            <button
              onClick={() => handleSendMessage()}
              disabled={isLoading || !inputMessage.trim()}
              className="btn-primary flex items-center justify-center w-10 h-10 p-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Press Enter to send, Shift+Enter for new line
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Chat;
