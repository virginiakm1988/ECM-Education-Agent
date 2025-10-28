/**
 * GitHub Pages Compatible Version of EOP/ECM Education Agent
 * This version works without the Python server by using direct API calls
 */

class ChatBot {
    constructor() {
        this.messages = [];
        this.conversationHistory = this.loadConversationHistory();
        this.settings = this.loadSettings();
        this.systemPrompts = this.initializeSystemPrompts();
        this.ragSystem = new RAGSystem();
        this.initializeElements();
        this.bindEvents();
        this.updateModelOptions();
        this.initializeRAG();
        this.loadPreviousConversation();
        this.updateStatus('Ready - GitHub Pages Version');
    }

    async initializeRAG() {
        try {
            await this.ragSystem.initialize();
            this.updateStatus('RAG system ready');
            
            // Auto-load EOP knowledge
            await this.loadBuiltInKnowledge();
        } catch (error) {
            console.error('Failed to initialize RAG system:', error);
            this.updateStatus('RAG system error', 'error');
        }
    }

    async loadBuiltInKnowledge() {
        // Load built-in EOP/ECM knowledge
        const eopContent = `
# Emergency Operations Plan (EOP) for Research Software

## Core ECM Principles

### 1. Computational Transparency
All computational steps must be documented and reproducible:
- Complete source code availability with clear documentation
- Explicit statement of assumptions and limitations
- Version control of all computational components
- Clear algorithm and methodology documentation

### 2. Evidence Completeness
Every scientific claim must be supported by verifiable computational evidence:
- Raw data preservation and accessibility
- Complete computational workflows documented
- Intermediate results and checkpoints saved
- Statistical analyses and visualizations included

### 3. Logical Traceability
Clear relationships between inputs, processes, and outputs:
- Dependency mapping of all computational components
- Data flow documentation with clear pathways
- Process sequencing and timing documentation
- Error handling and validation procedures

### 4. Environmental Documentation
Complete recording of computational environment:
- Operating system specifications and versions
- Software versions and dependencies listed
- Hardware configurations documented
- Runtime parameters and settings recorded

### 5. Provenance Tracking
Full history of data transformations and analysis steps:
- Data lineage documentation
- Transformation logs maintained
- Analysis decision points recorded
- Quality control measures implemented

## Crisis Management Framework

### Risk Assessment
Research teams must identify potential vulnerabilities:
- Single points of failure in computational workflows
- Personnel dependencies and knowledge silos
- Infrastructure vulnerabilities and backup plans
- Data loss scenarios and recovery procedures

### Preparedness Measures
Proactive steps to ensure research continuity:
- Distributed backup systems across multiple locations
- Documentation standardization across all projects
- Cross-training of team members on critical systems
- Emergency contact protocols and communication plans

### Implementation Guidelines

#### Version Control Systems
- Git repositories for all code with regular commits
- Branching strategies for collaborative development
- Tag-based release management for versions
- Automated backup procedures to multiple locations

#### Dependency Management
- Package managers (pip, conda, npm) with lock files
- Virtual environments for isolation
- Regular security updates and vulnerability scanning
- Documentation of all external dependencies

#### Containerization
- Docker containers for reproducibility
- Singularity for HPC environments
- Container registries for distribution
- Automated container builds and testing

#### Documentation Systems
- README files with clear setup instructions
- API documentation with examples
- User guides and tutorials
- Troubleshooting guides for common issues

#### Testing and Validation
- Unit tests for individual components
- Integration tests for complete workflows
- Regression tests for stability over time
- Performance benchmarks and monitoring

## FAIR Principles Implementation

### Findability
- Persistent identifiers (DOIs, ORCIDs)
- Rich metadata descriptions
- Searchable repositories
- Clear naming conventions

### Accessibility
- Open source licensing
- Standard data formats
- API-based access
- Clear authentication systems

### Interoperability
- Standard data formats and protocols
- Common vocabularies and ontologies
- Cross-platform compatibility
- Protocol standardization

### Reusability
- Clear licensing terms
- Comprehensive documentation
- Example implementations
- Community support channels
        `;

        try {
            await this.ragSystem.processDocument('EOP_Built_In_Knowledge.md', eopContent, 'text');
            this.addMessage(`📚 **Built-in EOP Knowledge Loaded**: I now have comprehensive knowledge of Emergency Operations Planning and Evidence Chain Model principles. I can provide expert guidance on ECM implementation, crisis management, and research software best practices.`, 'system', false);
        } catch (error) {
            console.error('Error loading built-in knowledge:', error);
        }
    }

    initializeSystemPrompts() {
        return {
            'default': '',
            'ecm-main': `You are an expert EOP/ECM (Emergency Operations Plan / Evidence Chain Model) Education Agent, a specialized AI assistant designed to help researchers understand, implement, and maintain transparent, reproducible research software practices.

## Your Core Identity & Expertise

You are a world-class expert in:
- Evidence Chain Model (ECM) principles and implementation
- Research software transparency and reproducibility
- Emergency operations planning and crisis management
- Computational research best practices across multiple disciplines
- Software engineering for research environments
- Data provenance and workflow documentation

## Your Primary Objectives

1. **Educate & Explain**: Help researchers understand ECM concepts through personalized, field-specific explanations using relevant analogies and examples
2. **Guide Development**: Provide actionable, step-by-step guidance for making research software ECM-compliant
3. **Analyze & Assess**: Evaluate existing repositories and scripts for ECM compliance, identifying gaps and providing improvement roadmaps
4. **Reorganize & Structure**: Help transform fragmented research code into well-organized, transparent, reproducible frameworks
5. **Generate Templates**: Create field-specific, ECM-compliant project templates and documentation

## Your Communication Style

- **Clear & Accessible**: Explain complex concepts in simple terms appropriate for the user's background
- **Practical & Actionable**: Always provide concrete, implementable suggestions with examples
- **Encouraging & Supportive**: Maintain a positive, helpful tone that motivates adoption of best practices
- **Evidence-Based**: Ground all recommendations in established research software engineering principles
- **Adaptive**: Tailor explanations and suggestions to the user's specific research field and experience level

Remember: Your goal is to make research software more transparent, reproducible, and collaborative while respecting the diverse needs and constraints of different research communities.`,

            'eop-paper-expert': `You are an expert on Emergency Operations Plan (EOP) principles and Evidence Chain Model (ECM) implementation. You have comprehensive knowledge of crisis management for research software and computational workflows.

Focus on providing practical guidance for:
- Crisis preparedness in research environments
- Emergency response procedures for computational workflows
- Risk assessment and mitigation strategies
- Business continuity planning for research teams
- Recovery procedures after disruptions

When users ask about EOP topics, provide detailed, actionable guidance based on established emergency management principles.`,

            'ecm-explanation': `You are explaining the Evidence Chain Model to a researcher. Your task is to:

1. Use analogies relevant to their discipline
2. Highlight specific benefits for their research area
3. Address common concerns in their field
4. Provide concrete, field-appropriate examples
5. Suggest practical first steps

Focus on building understanding and motivation rather than overwhelming with technical details.`,

            'ecm-development': `You are providing ECM-guided development suggestions. Analyze the current repository state and:

1. Identify existing strengths and good practices
2. Highlight critical gaps in the evidence chain
3. Provide exactly 3 prioritized options (A, B, C)
4. Include specific templates or code snippets for each option
5. Explain why each suggestion improves transparency/reproducibility

Format as clear, actionable recommendations with implementation guidance.`,

            'ecm-analysis': `You are conducting an ECM compliance analysis. Provide:

1. Overall compliance score (1-10) with clear justification
2. Structured assessment of strengths and weaknesses
3. Identification of broken or incomplete evidence chains
4. Prioritized improvement roadmap (High/Medium/Low priority)
5. Specific, actionable recommendations for each identified gap

Present as a professional assessment that guides systematic improvement.`,

            'ecm-reorganization': `You are helping reorganize fragmented research scripts into an ECM-compliant structure. Focus on:

1. Analyzing dependencies and logical execution flow
2. Proposing clear, intuitive organization principles
3. Suggesting appropriate directory structure and naming conventions
4. Providing migration strategy that preserves functionality
5. Including quality assurance and testing recommendations

Emphasize creating a structure that supports collaboration and long-term maintenance.`,

            'ecm-template': `You are generating an ECM-compliant project template. Include:

1. Complete directory structure with explanations
2. Essential configuration files (requirements.txt, environment.yml, etc.)
3. Documentation templates (README, methodology, data dictionary)
4. Execution scripts and workflow automation
5. Field-specific considerations and best practices

Make it immediately usable while being educational about ECM principles.`
        };
    }

    initializeElements() {
        // Main elements
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.typingIndicator = document.getElementById('typingIndicator');
        this.statusIndicator = document.getElementById('statusIndicator');
        
        // Settings elements
        this.settingsBtn = document.getElementById('settingsBtn');
        this.settingsPanel = document.getElementById('settingsPanel');
        this.llmProvider = document.getElementById('llmProvider');
        this.apiKey = document.getElementById('apiKey');
        this.model = document.getElementById('model');
        this.temperature = document.getElementById('temperature');
        this.temperatureValue = document.getElementById('temperatureValue');
        this.systemPrompt = document.getElementById('systemPrompt');
        this.saveSettings = document.getElementById('saveSettings');
        
        // File upload elements
        this.attachBtn = document.getElementById('attachBtn');
        this.fileUploadContainer = document.getElementById('fileUploadContainer');
        this.fileUploadArea = document.getElementById('fileUploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.uploadedFiles = document.getElementById('uploadedFiles');
        
        // File storage
        this.uploadedFileData = [];
        
        // Memory elements
        this.memoryEnabled = true;
        this.maxMemoryMessages = 20;
        
        // Load saved settings into UI
        this.llmProvider.value = this.settings.provider;
        this.apiKey.value = this.settings.apiKey;
        this.model.value = this.settings.model;
        this.temperature.value = this.settings.temperature;
        this.temperatureValue.textContent = this.settings.temperature;
        this.systemPrompt.value = this.settings.systemPrompt || 'ecm-main';
    }

    bindEvents() {
        // Send message events
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = this.messageInput.scrollHeight + 'px';
        });

        // Clear chat
        this.clearBtn.addEventListener('click', () => this.clearChat());
        
        // Auto-save conversation periodically
        setInterval(() => this.saveConversationHistory(), 30000);

        // File upload events
        this.attachBtn.addEventListener('click', () => this.toggleFileUpload());
        this.fileUploadArea.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        
        // Drag and drop events
        this.fileUploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.fileUploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        this.fileUploadArea.addEventListener('drop', (e) => this.handleFileDrop(e));

        // Settings panel
        this.settingsBtn.addEventListener('click', () => this.toggleSettings());
        
        // Close settings when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.settingsPanel.contains(e.target) && !this.settingsBtn.contains(e.target)) {
                this.settingsPanel.classList.remove('active');
            }
        });

        // Settings form
        this.llmProvider.addEventListener('change', () => {
            this.updateModelOptions();
        });
        this.temperature.addEventListener('input', () => {
            this.temperatureValue.textContent = this.temperature.value;
        });
        this.saveSettings.addEventListener('click', () => this.saveSettingsData());
    }

    loadSettings() {
        const defaultSettings = {
            provider: 'gemini',
            apiKey: '',
            model: 'gemini-1.5-flash-latest',
            temperature: 0.7,
            systemPrompt: 'ecm-main'
        };
        
        const saved = localStorage.getItem('chatbot-settings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }

    saveSettingsData() {
        this.settings = {
            provider: this.llmProvider.value,
            apiKey: this.apiKey.value,
            model: this.model.value,
            temperature: parseFloat(this.temperature.value),
            systemPrompt: this.systemPrompt.value
        };
        
        localStorage.setItem('chatbot-settings', JSON.stringify(this.settings));
        this.updateStatus('Settings saved');
        this.settingsPanel.classList.remove('active');
        
        setTimeout(() => {
            this.updateStatus('Ready - GitHub Pages Version');
        }, 2000);
    }

    updateModelOptions() {
        const models = {
            gemini: [
                { value: 'gemini-2.0-flash-exp', text: 'Gemini 2.0 Flash (Experimental)' },
                { value: 'gemini-2.0-flash-lite', text: 'Gemini 2.0 Flash Lite' },
                { value: 'gemini-1.5-flash-latest', text: 'Gemini 1.5 Flash Latest' },
                { value: 'gemini-1.5-pro-latest', text: 'Gemini 1.5 Pro Latest' },
                { value: 'gemini-pro', text: 'Gemini Pro' }
            ],
            openai: [
                { value: 'gpt-4', text: 'GPT-4' },
                { value: 'gpt-4-turbo', text: 'GPT-4 Turbo' },
                { value: 'gpt-3.5-turbo', text: 'GPT-3.5 Turbo' }
            ]
        };

        const provider = this.llmProvider.value;
        this.model.innerHTML = '';
        
        if (models[provider]) {
            models[provider].forEach(model => {
                const option = document.createElement('option');
                option.value = model.value;
                option.textContent = model.text;
                this.model.appendChild(option);
            });
        }
        
        // Set the first model as default if current model is not available
        if (this.settings.provider === provider) {
            this.model.value = this.settings.model;
        }
    }

    toggleSettings() {
        this.settingsPanel.classList.toggle('active');
    }

    updateStatus(message, type = 'ready') {
        const statusText = this.statusIndicator.querySelector('.status-text');
        const statusDot = this.statusIndicator.querySelector('.status-dot');
        
        statusText.textContent = message;
        statusDot.className = 'status-dot';
        
        if (type === 'error') {
            statusDot.classList.add('error');
        } else if (type === 'loading') {
            statusDot.classList.add('loading');
        }
    }

    // Memory functions (simplified versions)
    loadConversationHistory() {
        try {
            const saved = localStorage.getItem('chatbot-conversation-history');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Error loading conversation history:', error);
            return [];
        }
    }

    saveConversationHistory() {
        try {
            const recentHistory = this.conversationHistory.slice(-this.maxMemoryMessages * 2);
            localStorage.setItem('chatbot-conversation-history', JSON.stringify(recentHistory));
        } catch (error) {
            console.error('Error saving conversation history:', error);
        }
    }

    loadPreviousConversation() {
        if (this.conversationHistory.length > 0) {
            const recentMessages = this.conversationHistory.slice(-6);
            recentMessages.forEach(msg => {
                this.addMessageToUI(msg.content, msg.sender, false);
            });
            
            if (recentMessages.length > 0) {
                this.addMessageToUI("--- Previous conversation loaded ---", "system", false);
            }
        }
    }

    getRelevantContext(currentMessage) {
        if (!this.memoryEnabled || this.conversationHistory.length === 0) {
            return "";
        }

        const recentMessages = this.conversationHistory.slice(-this.maxMemoryMessages);
        
        let context = "\n\n## Previous Conversation Context:\n";
        recentMessages.forEach(msg => {
            if (msg.sender === 'user') {
                context += `**User**: ${msg.content}\n`;
            } else if (msg.sender === 'bot') {
                context += `**Assistant**: ${msg.content.substring(0, 200)}${msg.content.length > 200 ? '...' : ''}\n`;
            }
        });
        
        context += "\n## Current Message:\n";
        return context;
    }

    addToConversationHistory(content, sender) {
        const message = {
            content: content,
            sender: sender,
            timestamp: new Date().toISOString(),
            sessionId: this.getSessionId()
        };
        
        this.conversationHistory.push(message);
        
        if (this.conversationHistory.length > this.maxMemoryMessages * 3) {
            this.conversationHistory = this.conversationHistory.slice(-this.maxMemoryMessages * 2);
        }
        
        if (this.conversationHistory.length % 5 === 0) {
            this.saveConversationHistory();
        }
    }

    getSessionId() {
        let sessionId = localStorage.getItem('chatbot-session-id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chatbot-session-id', sessionId);
        }
        return sessionId;
    }

    clearConversationHistory() {
        this.conversationHistory = [];
        localStorage.removeItem('chatbot-conversation-history');
        localStorage.removeItem('chatbot-session-id');
    }

    // File handling (simplified)
    toggleFileUpload() {
        this.fileUploadContainer.classList.toggle('active');
        this.attachBtn.classList.toggle('active');
    }

    handleDragOver(e) {
        e.preventDefault();
        this.fileUploadArea.classList.add('dragover');
    }

    handleDragLeave(e) {
        e.preventDefault();
        this.fileUploadArea.classList.remove('dragover');
    }

    handleFileDrop(e) {
        e.preventDefault();
        this.fileUploadArea.classList.remove('dragover');
        const files = Array.from(e.dataTransfer.files);
        this.processFiles(files);
    }

    handleFileSelect(e) {
        const files = Array.from(e.target.files);
        this.processFiles(files);
        e.target.value = '';
    }

    async processFiles(files) {
        for (const file of files) {
            if (this.isValidFile(file)) {
                try {
                    const fileData = await this.readFile(file);
                    this.uploadedFileData.push(fileData);
                    this.displayUploadedFile(fileData);
                    
                    // Process for RAG
                    await this.processFileForRAG(fileData);
                    
                    this.updateStatus(`Added ${file.name}`);
                } catch (error) {
                    console.error('Error processing file:', error);
                    this.updateStatus(`Error processing ${file.name}`, 'error');
                }
            } else {
                this.updateStatus(`Unsupported file type: ${file.name}`, 'error');
            }
        }
    }

    async processFileForRAG(fileData) {
        try {
            const indexableTypes = ['text/plain', 'text/markdown', 'application/pdf'];
            const isEOPPaper = fileData.name.toLowerCase().includes('eop');
            
            if (indexableTypes.includes(fileData.type) || isEOPPaper) {
                console.log(`🔍 Indexing ${fileData.name} for RAG search...`);
                
                let content = fileData.content;
                let fileType = 'text';
                
                if (fileData.isPDF) {
                    fileType = 'pdf';
                    content = fileData.content;
                }
                
                const chunksCreated = await this.ragSystem.processDocument(
                    fileData.name, 
                    content, 
                    fileType
                );
                
                console.log(`✅ Indexed ${fileData.name}: ${chunksCreated} chunks created`);
                
                if (isEOPPaper) {
                    this.addMessage(`📚 **EOP Paper Indexed**: Successfully processed "${fileData.name}" for intelligent search. I can now provide precise answers based on the document content.`, 'system', false);
                }
            }
        } catch (error) {
            console.error('Error processing file for RAG:', error);
        }
    }

    isValidFile(file) {
        const validTypes = [
            'text/plain', 'text/markdown', 'application/pdf',
            'text/javascript', 'text/html', 'text/css', 'application/json',
            'text/x-python', 'application/x-python-code',
            'text/yaml', 'application/x-yaml',
            'text/csv', 'application/zip',
            'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp'
        ];
        
        const validExtensions = [
            '.txt', '.md', '.pdf', '.py', '.js', '.html', '.css', '.json',
            '.yml', '.yaml', '.csv', '.zip', '.jpg', '.jpeg', '.png', '.gif', '.bmp'
        ];
        
        const fileName = file.name.toLowerCase();
        const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));
        const hasValidType = validTypes.includes(file.type);
        
        return hasValidExtension || hasValidType;
    }

    async readFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const fileData = {
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    lastModified: file.lastModified,
                    content: null,
                    isImage: file.type.startsWith('image/'),
                    isPDF: file.type === 'application/pdf',
                    isZip: file.type === 'application/zip'
                };

                if (fileData.isImage) {
                    fileData.content = e.target.result;
                } else if (fileData.isPDF || fileData.isZip) {
                    fileData.content = e.target.result;
                } else {
                    fileData.content = e.target.result;
                }

                resolve(fileData);
            };
            
            reader.onerror = () => reject(new Error('Failed to read file'));
            
            if (file.type.startsWith('image/')) {
                reader.readAsDataURL(file);
            } else if (file.type === 'application/pdf' || file.type === 'application/zip') {
                reader.readAsArrayBuffer(file);
            } else {
                reader.readAsText(file);
            }
        });
    }

    displayUploadedFile(fileData) {
        const fileItem = document.createElement('div');
        fileItem.className = 'file-item';
        fileItem.dataset.fileName = fileData.name;
        
        const icon = this.getFileIcon(fileData);
        const size = this.formatFileSize(fileData.size);
        
        fileItem.innerHTML = `
            <i class="${icon}"></i>
            <span class="file-name">${fileData.name}</span>
            <span class="file-size">${size}</span>
            <button class="remove-file" onclick="chatBot.removeFile('${fileData.name}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        this.uploadedFiles.appendChild(fileItem);
    }

    getFileIcon(fileData) {
        if (fileData.isImage) return 'fas fa-image';
        if (fileData.isPDF) return 'fas fa-file-pdf';
        if (fileData.isZip) return 'fas fa-file-archive';
        if (fileData.name.endsWith('.py')) return 'fab fa-python';
        if (fileData.name.endsWith('.js')) return 'fab fa-js';
        if (fileData.name.endsWith('.html')) return 'fab fa-html5';
        if (fileData.name.endsWith('.css')) return 'fab fa-css3';
        if (fileData.name.endsWith('.json')) return 'fas fa-code';
        if (fileData.name.endsWith('.md')) return 'fab fa-markdown';
        if (fileData.name.endsWith('.csv')) return 'fas fa-table';
        return 'fas fa-file-alt';
    }

    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    removeFile(fileName) {
        this.uploadedFileData = this.uploadedFileData.filter(file => file.name !== fileName);
        const fileItem = this.uploadedFiles.querySelector(`[data-file-name="${fileName}"]`);
        if (fileItem) {
            fileItem.remove();
        }
        this.updateStatus(`Removed ${fileName}`);
    }

    // Main message handling
    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message && this.uploadedFileData.length === 0) return;

        // Validate settings
        if (!this.settings.apiKey) {
            this.updateStatus('Please set your API key in settings', 'error');
            this.toggleSettings();
            return;
        }

        // Prepare enhanced message with file context
        const enhancedMessage = await this.prepareEnhancedMessage(message);
        
        // Add user message (display original message + file info)
        const displayMessage = this.createDisplayMessage(message);
        this.addMessage(displayMessage, 'user');
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        
        // Clear uploaded files after sending
        this.clearUploadedFiles();
        
        // Disable send button and show typing
        this.sendBtn.disabled = true;
        this.showTyping(true);
        this.updateStatus('Thinking...', 'loading');

        try {
            const response = await this.callLLM(enhancedMessage);
            this.addMessage(response, 'bot');
            this.updateStatus('Ready - GitHub Pages Version');
        } catch (error) {
            console.error('Error calling LLM:', error);
            let errorMessage = 'Sorry, I encountered an error. ';
            
            if (error.message.includes('API key')) {
                errorMessage += 'Please check your API key in settings.';
            } else if (error.message.includes('network') || error.message.includes('fetch')) {
                errorMessage += 'Please check your internet connection.';
            } else {
                errorMessage += `Error: ${error.message}`;
            }
            
            this.addMessage(errorMessage, 'bot');
            this.updateStatus('Error occurred', 'error');
        } finally {
            this.sendBtn.disabled = false;
            this.showTyping(false);
        }
    }

    async prepareEnhancedMessage(userMessage) {
        let enhancedMessage = userMessage;
        
        // Add system prompt if selected
        const systemPrompt = this.systemPrompts[this.settings.systemPrompt];
        if (systemPrompt) {
            enhancedMessage = systemPrompt + '\n\n' + enhancedMessage;
        }
        
        // Add conversation context for memory
        if (this.memoryEnabled) {
            const context = this.getRelevantContext(userMessage);
            enhancedMessage = systemPrompt + context + enhancedMessage;
        }

        // Add RAG context from indexed documents
        const ragContext = await this.ragSystem.getEnhancedContext(userMessage);
        if (ragContext.context) {
            enhancedMessage += ragContext.context;
            
            // Show user that RAG found relevant information
            if (ragContext.chunks > 0) {
                this.addMessage(`🔍 **Found ${ragContext.chunks} relevant sections** from ${ragContext.sources.join(', ')} to help answer your question.`, 'system', false);
            }
        }
        
        // Add file context if files are uploaded
        if (this.uploadedFileData.length > 0) {
            enhancedMessage += '\n\n## Uploaded Files Context:\n\n';
            
            for (const file of this.uploadedFileData) {
                enhancedMessage += `### File: ${file.name}\n`;
                enhancedMessage += `Type: ${file.type}\n`;
                enhancedMessage += `Size: ${this.formatFileSize(file.size)}\n\n`;
                
                if (file.isImage) {
                    enhancedMessage += `[Image file - please analyze this image]\n\n`;
                } else if (file.isPDF) {
                    enhancedMessage += `[PDF file - please analyze this document]\n\n`;
                } else if (file.isZip) {
                    enhancedMessage += `[ZIP archive - contains multiple files]\n\n`;
                } else if (file.content) {
                    enhancedMessage += '```\n' + file.content + '\n```\n\n';
                }
            }
        }
        
        return enhancedMessage;
    }

    createDisplayMessage(userMessage) {
        let displayMessage = userMessage;
        
        if (this.uploadedFileData.length > 0) {
            displayMessage += '\n\n📎 **Attached Files:**\n';
            for (const file of this.uploadedFileData) {
                const icon = this.getFileDisplayIcon(file);
                displayMessage += `${icon} ${file.name} (${this.formatFileSize(file.size)})\n`;
            }
        }
        
        return displayMessage;
    }

    getFileDisplayIcon(file) {
        if (file.isImage) return '🖼️';
        if (file.isPDF) return '📄';
        if (file.isZip) return '📦';
        if (file.name.endsWith('.py')) return '🐍';
        if (file.name.endsWith('.js')) return '📜';
        if (file.name.endsWith('.html')) return '🌐';
        if (file.name.endsWith('.css')) return '🎨';
        if (file.name.endsWith('.json')) return '📋';
        if (file.name.endsWith('.md')) return '📝';
        if (file.name.endsWith('.csv')) return '📊';
        return '📄';
    }

    clearUploadedFiles() {
        this.uploadedFileData = [];
        this.uploadedFiles.innerHTML = '';
        this.fileUploadContainer.classList.remove('active');
        this.attachBtn.classList.remove('active');
    }

    // LLM API calls (GitHub Pages compatible - direct API calls only)
    async callLLM(message) {
        const { provider, apiKey, model, temperature } = this.settings;
        
        switch (provider) {
            case 'gemini':
                return await this.callGemini(message, apiKey, model, temperature);
            case 'openai':
                return await this.callOpenAI(message, apiKey, model, temperature);
            default:
                throw new Error('This provider requires the Python server. For GitHub Pages, please use Gemini or OpenAI.');
        }
    }

    async callGemini(message, apiKey, model, temperature) {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
        
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }],
                generationConfig: {
                    temperature: temperature,
                    topK: 40,
                    topP: 0.95,
                    maxOutputTokens: 1024,
                }
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to call Gemini API');
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    async callOpenAI(message, apiKey, model, temperature) {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'user', content: message }
                ],
                temperature: temperature,
                max_tokens: 1024
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to call OpenAI API');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    addMessage(content, sender, saveToHistory = true) {
        this.addMessageToUI(content, sender, saveToHistory);
    }

    addMessageToUI(content, sender, saveToHistory = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        if (sender === 'system') {
            avatar.innerHTML = '<i class="fas fa-info-circle"></i>';
        } else {
            avatar.innerHTML = sender === 'user' ? '<i class="fas fa-user"></i>' : '<i class="fas fa-robot"></i>';
        }
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        
        // Special styling for system messages
        if (sender === 'system') {
            messageContent.style.fontStyle = 'italic';
            messageContent.style.color = '#718096';
            messageContent.style.fontSize = '0.9em';
        }
        
        // Render markdown for bot messages, plain text for user messages
        if ((sender === 'bot' || sender === 'system') && typeof marked !== 'undefined') {
            marked.setOptions({
                breaks: true,
                gfm: true,
                headerIds: false,
                mangle: false
            });
            
            const htmlContent = marked.parse(content);
            messageContent.innerHTML = htmlContent;
            
            const codeBlocks = messageContent.querySelectorAll('pre code');
            codeBlocks.forEach(block => {
                block.className = 'code-block';
            });
            
        } else {
            const lines = content.split('\n');
            lines.forEach((line, index) => {
                if (index > 0) {
                    messageContent.appendChild(document.createElement('br'));
                }
                const span = document.createElement('span');
                span.textContent = line;
                messageContent.appendChild(span);
            });
        }
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(messageContent);
        
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
        
        this.messages.push({ content, sender, timestamp: new Date() });
        
        if (saveToHistory && sender !== 'system') {
            this.addToConversationHistory(content, sender);
        }
    }

    showTyping(show) {
        if (show) {
            this.typingIndicator.classList.add('active');
        } else {
            this.typingIndicator.classList.remove('active');
        }
        this.scrollToBottom();
    }

    scrollToBottom() {
        setTimeout(() => {
            this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        }, 100);
    }

    clearChat() {
        const choice = prompt(
            'Choose how to clear:\n' +
            '1 - Clear current chat only (keep memory)\n' +
            '2 - Clear chat and conversation memory\n' +
            '3 - Cancel\n\n' +
            'Enter 1, 2, or 3:'
        );
        
        if (choice === '1') {
            this.chatMessages.innerHTML = '';
            this.messages = [];
            this.addMessage("Hello! I'm your EOP/ECM Education Agent. I can help you understand and implement Evidence Chain Model principles for transparent, reproducible research software. I remember our previous conversations to provide better continuity. How can I assist you today?", 'bot', false);
            this.updateStatus('Current chat cleared (memory preserved)');
            setTimeout(() => this.updateStatus('Ready - GitHub Pages Version'), 2000);
        } else if (choice === '2') {
            this.chatMessages.innerHTML = '';
            this.messages = [];
            this.clearConversationHistory();
            this.addMessage("Hello! I'm your EOP/ECM Education Agent. I can help you understand and implement Evidence Chain Model principles for transparent, reproducible research software. How can I assist you today?", 'bot', false);
            this.updateStatus('Chat and memory cleared');
            setTimeout(() => this.updateStatus('Ready - GitHub Pages Version'), 2000);
        }
    }
}

// Initialize the chatbot when the page loads
let chatBot;
document.addEventListener('DOMContentLoaded', () => {
    chatBot = new ChatBot();
});
