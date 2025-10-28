# Deploying EOP/ECM Education Agent to GitHub Pages

## Overview
This guide will help you deploy your chatbot to GitHub Pages, making it accessible at `https://yourusername.github.io/repository-name`

## Prerequisites
- GitHub account
- Git installed on your computer
- Your chatbot files ready

## Step 1: Prepare Your Repository

### 1.1 Create GitHub Repository
1. Go to [GitHub.com](https://github.com)
2. Click "New repository" (green button)
3. Name it something like `ecm-education-agent` or `eop-chatbot`
4. Make it **Public** (required for free GitHub Pages)
5. Check "Add a README file"
6. Click "Create repository"

### 1.2 Clone Repository Locally
```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

## Step 2: Prepare Files for GitHub Pages

Since GitHub Pages only serves static files (no Python server), we need to modify the chatbot to work without the server component.

### 2.1 Create GitHub Pages Compatible Version

Create a new file `index-github.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>EOP/ECM Education Agent</title>
    <link rel="stylesheet" href="styles.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <script src="rag_system.js"></script>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <header class="header">
            <div class="header-content">
                <h1><i class="fas fa-robot"></i> EOP/ECM Education Agent</h1>
                <button class="settings-btn" id="settingsBtn">
                    <i class="fas fa-cog"></i>
                </button>
            </div>
        </header>

        <!-- GitHub Pages Notice -->
        <div class="github-notice">
            <p><i class="fas fa-info-circle"></i> <strong>GitHub Pages Version:</strong> This version works with client-side APIs only. For full server functionality, run locally with Python server.</p>
        </div>

        <!-- Settings Panel -->
        <div class="settings-panel" id="settingsPanel">
            <div class="settings-content">
                <h3>Settings</h3>
                <div class="setting-group">
                    <label for="llmProvider">LLM Provider:</label>
                    <select id="llmProvider">
                        <option value="gemini">Google Gemini</option>
                        <option value="openai">OpenAI GPT</option>
                        <!-- Note: NVIDIA NIM and Anthropic require server proxy -->
                    </select>
                </div>
                <div class="setting-group">
                    <label for="apiKey">API Key:</label>
                    <input type="password" id="apiKey" placeholder="Enter your API key">
                    <small>Your API key is stored locally and never sent to our servers</small>
                </div>
                <div class="setting-group">
                    <label for="model">Model:</label>
                    <select id="model">
                        <option value="gemini-1.5-flash-latest">Gemini 1.5 Flash Latest</option>
                    </select>
                </div>
                <div class="setting-group">
                    <label for="temperature">Temperature:</label>
                    <input type="range" id="temperature" min="0" max="1" step="0.1" value="0.7">
                    <span id="temperatureValue">0.7</span>
                </div>
                <div class="setting-group">
                    <label for="systemPrompt">System Prompt:</label>
                    <select id="systemPrompt">
                        <option value="ecm-main">EOP/ECM Education Agent</option>
                        <option value="eop-paper-expert">EOP Paper Expert</option>
                        <option value="ecm-explanation">ECM Significance Explanation</option>
                        <option value="ecm-development">Development Guidance</option>
                        <option value="ecm-analysis">Repository Analysis</option>
                        <option value="ecm-reorganization">Script Reorganization</option>
                        <option value="ecm-template">Template Generation</option>
                    </select>
                    <small>Choose a specialized prompt for your research needs</small>
                </div>
                <button class="save-btn" id="saveSettings">Save Settings</button>
            </div>
        </div>

        <!-- Chat Container -->
        <div class="chat-container">
            <div class="chat-messages" id="chatMessages">
                <div class="message bot-message">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <p>Hello! I'm your <strong>EOP/ECM Education Agent</strong>, specialized in helping researchers implement transparent, reproducible research software practices. I have built-in knowledge of Emergency Operations Plan principles and Evidence Chain Model frameworks. How can I assist with your research today?</p>
                    </div>
                </div>
            </div>

            <!-- Typing Indicator -->
            <div class="typing-indicator" id="typingIndicator">
                <div class="message-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>

            <!-- File Upload Area -->
            <div class="file-upload-container" id="fileUploadContainer">
                <div class="file-upload-area" id="fileUploadArea">
                    <div class="upload-content">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <p>Drop files here or click to upload</p>
                        <small>Supports: PDF, TXT, MD, Images, Code files</small>
                    </div>
                    <input type="file" id="fileInput" multiple accept=".pdf,.txt,.md,.py,.js,.html,.css,.json,.yml,.yaml,.csv,.zip,.jpg,.jpeg,.png,.gif,.bmp">
                </div>
                <div class="uploaded-files" id="uploadedFiles"></div>
            </div>

            <!-- Input Area -->
            <div class="input-container">
                <div class="input-wrapper">
                    <button id="attachBtn" class="attach-btn" title="Attach files">
                        <i class="fas fa-paperclip"></i>
                    </button>
                    <textarea 
                        id="messageInput" 
                        placeholder="Type your message here..." 
                        rows="1"
                    ></textarea>
                    <button id="sendBtn" class="send-btn">
                        <i class="fas fa-paper-plane"></i>
                    </button>
                </div>
                <div class="input-actions">
                    <button id="clearBtn" class="action-btn">
                        <i class="fas fa-trash"></i> Clear Chat
                    </button>
                    <div class="status-indicator" id="statusIndicator">
                        <span class="status-dot"></span>
                        <span class="status-text">Ready</span>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="script-github.js"></script>
</body>
</html>
```

### 2.2 Create GitHub-Compatible JavaScript

Create `script-github.js` (modified version without server dependencies):

```javascript
// This is a simplified version for GitHub Pages
// Copy your script.js content but modify the callLLM function to only use direct API calls
// Remove server proxy functionality and NVIDIA NIM (requires server)

// Example modification:
class ChatBot {
    // ... (copy most of your existing ChatBot class)
    
    async callLLM(message) {
        const { provider, apiKey, model, temperature } = this.settings;
        
        // Only support direct API calls (no server proxy)
        switch (provider) {
            case 'gemini':
                return await this.callGemini(message, apiKey, model, temperature);
            case 'openai':
                return await this.callOpenAI(message, apiKey, model, temperature);
            default:
                throw new Error('This provider requires the Python server. Please use Gemini or OpenAI for GitHub Pages deployment.');
        }
    }
    
    // ... rest of your methods
}
```

## Step 3: Add GitHub Pages Styling

Add this CSS to your `styles.css`:

```css
/* GitHub Pages specific styles */
.github-notice {
    background: #e3f2fd;
    border: 1px solid #2196f3;
    border-radius: 8px;
    padding: 15px;
    margin: 20px;
    color: #1565c0;
    font-size: 0.9rem;
}

.github-notice i {
    margin-right: 8px;
    color: #2196f3;
}
```

## Step 4: Deploy to GitHub

### 4.1 Add Files to Repository
```bash
# Copy all your files to the repository directory
cp index-github.html /path/to/your/repo/index.html
cp styles.css /path/to/your/repo/
cp script-github.js /path/to/your/repo/script.js
cp rag_system.js /path/to/your/repo/
# Add any other necessary files

# Navigate to repository
cd /path/to/your/repo

# Add files
git add .
git commit -m "Initial deployment of EOP/ECM Education Agent"
git push origin main
```

### 4.2 Enable GitHub Pages
1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"

## Step 5: Configure Your Site

### 5.1 Create _config.yml (optional)
```yaml
title: EOP/ECM Education Agent
description: AI-powered assistant for Emergency Operations Planning and Evidence Chain Model implementation
theme: jekyll-theme-minimal
```

### 5.2 Create README.md
```markdown
# EOP/ECM Education Agent

An AI-powered chatbot specialized in Emergency Operations Planning (EOP) and Evidence Chain Model (ECM) principles for research software.

## Features
- Expert guidance on ECM implementation
- Research software best practices
- Crisis management for computational research
- File upload and analysis capabilities
- Memory of previous conversations

## Live Demo
Visit: https://yourusername.github.io/repository-name

## Local Development
For full functionality including NVIDIA NIM support, run locally:
```bash
python server.py
```

## API Keys Required
- Google Gemini API key (free tier available)
- OpenAI API key (for GPT models)
```

## Step 6: Access Your Deployed Site

After deployment (takes 5-10 minutes):
- Your site will be available at: `https://yourusername.github.io/repository-name`
- GitHub will show the URL in the Pages settings

## Limitations of GitHub Pages Version

### What Works:
✅ Full UI and chat interface
✅ Google Gemini API (direct)
✅ OpenAI API (direct) 
✅ File upload and processing
✅ RAG system with built-in knowledge
✅ Conversation memory
✅ All ECM system prompts

### What Requires Local Server:
❌ NVIDIA NIM API (CORS restrictions)
❌ Anthropic Claude API (CORS restrictions)
❌ Advanced PDF processing
❌ Server-side file processing

## Tips for Success

1. **API Keys**: Users need to provide their own API keys
2. **CORS**: Some APIs don't work directly from browsers
3. **File Size**: Keep uploaded files reasonable for browser processing
4. **Mobile**: Test on mobile devices for responsive design
5. **Updates**: Push changes to update the live site

## Alternative: Full-Featured Deployment

For complete functionality, consider:
- **Heroku**: Deploy the Python server
- **Vercel**: Serverless deployment
- **Netlify**: Static site with serverless functions
- **Railway**: Full-stack deployment

Would you like me to help you with any of these deployment options?
