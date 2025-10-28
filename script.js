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
        this.toggleNimEndpoint();
        this.initializeRAG();
        this.loadPreviousConversation();
        this.updateStatus('Ready');
    }

    async initializeRAG() {
        try {
            await this.ragSystem.initialize();
            this.updateStatus('RAG system ready');
            
            // Auto-process EOP paper if it exists
            await this.autoProcessEOPPaper();
        } catch (error) {
            console.error('Failed to initialize RAG system:', error);
            this.updateStatus('RAG system error', 'error');
        }
    }

    async autoProcessEOPPaper() {
        // Check if EOP paper is available and process it
        try {
            console.log('📄 Checking for EOP paper to auto-process...');
            
            // Add the complete EOP paper content
            const eopFullContent = `
# Evidence-Oriented Programming and the Evidence Chain Method for Research Software

## Introduction

Research software is pivotal in scientific research, generating, processing, and analyzing results intended for publications. Its increasing integration into academic activities is a testament to its significance across the scientific community, prompting a greater focus on its development practices. Many efforts have emerged to strengthen accessibility, replicability, transparency, and reusability in research software by establishing guidelines, recommending good practices, developing verification platforms, and offering educational resources. Yet these efforts tend to emphasize the software aspect, without clarifying what additional role is implied by the research aspect.

We refer to this additional role as the **evidentiary role** — the idea that research software should serve as part of the evidence that supports scientific claims, beyond its technical function. This evidentiary role shifts the focus away from how to develop research software toward the question of how it should be disclosed and under what specifications, specifically what constitutes evidentiary sufficiency in the context of a given scientific claim. However, no shared specifications currently exist within the stakeholder community (including authors, editors, and reviewers) on how research software should be disclosed to support the evidentiary role.

This lack of consensus has produced concrete consequences, with a notable case being Nature's decision to publish the AlphaFold3 paper without its code. As required in Nature Portfolio Editorial Policies, code supporting central claims is to be made available to reviewers upon request. Despite the stated policies, Science reported that one reviewer had only temporary access to an early web server and described repeated, unanswered requests for code. Later, Nature cited the biosecurity risks and the inclusion of pseudocode to justify the editorial decision, while DeepMind attributed the restriction to commercial considerations. This case illustrates how each stakeholder operates from a distinct position and how the absence of shared expectations can lead to tensions in disclosure decisions.

Beyond tensions, the more serious concern is the gray zone created by this lack of consensus. In this zone, disclosure practices are inconsistently interpreted and selectively applied. Researchers acting in good faith may believe that, as long as they have subjectively avoided data fabrication and result concealment, there is no need to consider what constitutes sufficient disclosure. Meanwhile, mounting evidence shows how others have exploited this lack of consensus to justify withholding critical software components or data elements. In both situations, evidentiary insufficiency can persist without shared disclosure specifications. This goes beyond what case-by-case discretion can fully resolve.

Why, then, is there still no clear consensus on disclosure specifications? One reason lies in the wide variability of disclosure norms across scientific fields. In some fields, community standards guide software sharing and verification, while disclosure remains informal or absent in others. A second complicating factor is the influence of external disclosure barriers such as proprietary licensing, commercial interests, and biosecurity concerns, all of which introduce competing priorities that shape what can or should be disclosed. Together, these factors constrain the broader establishment of shared disclosure specifications, making it increasingly difficult to keep pace with the growing interdisciplinarity and complexity of contemporary research practice.

Herein, we report the outcome of preliminary discussions involving representatives from the stakeholder community that helped initiate the preliminary development of shared disclosure specifications. Building on insights from these discussions, we propose a new conceptual model called **Evidence-Oriented Programming**. Rather than focusing on how research software is efficiently implemented, this model reorients software development and evaluation around the relationship between published scientific claims and computational artifacts (i.e., software components and data elements) that substantiate them. To operationalize this model, we introduce the **Evidence Chain Method** — a strategy for identifying and linking the evidentiary computational artifacts. We discuss its applicability across different fields and propose how it may help resolve trust gaps when external disclosure barriers arise. Overall, these efforts seek to support a shift from case-by-case disclosure decisions toward evidence-oriented specifications across the scientific ecosystem.

## From Replicability to Evidentiary Sufficiency

Replication has long been central to how scientists establish confidence in the scientific merit of results, supported by a shared body of community positions and guidance frameworks, such as the FAIR4RS Principles, the TOP Guidelines, the OpenAIRE Guidelines, and the COAR Framework. Thus, it is worth asking why evidentiary sufficiency, rather than replicability, is our primary concern.

### Key Limitations of Replicability Focus:

1. **Replicability is not universally attainable.** It is substantively undermined by external disclosure barriers and reliance on proprietary software or hardware environments, which are common realities in contemporary research ecosystems.

2. **The mere success or failure of replication is an inadequate indicator of the health of science.** A successful replication may simply reproduce unrecognized systematic errors. Conversely, a failed replication does not necessarily refute the original claims, as such outcomes might arise from undocumented parameters, uncontrolled variables, or even stochastic effects.

3. **Providing research software does not guarantee reproducibility.** A recent reproducibility analysis of over 2,000 R code repositories found that only 26% of scripts could be successfully executed on the first attempt, and even after code cleaning, the success rate reached only 44%.

These realities highlight the need to assess scientific validity in the context of the full evidentiary structure, rather than focusing on isolated acts of replication, and they motivate our exploration of how research software can help construct and support such a context.

## Evidence-Oriented Programming (EOP)

While evidentiary sufficiency can, in principle, be assessed at any stage of research, the peer review stage represents the most critical juncture. Only during peer review, when publication decisions are still pending, does sufficient leverage exist to address potential evidentiary insufficiency. Once publication has occurred, it becomes significantly more challenging to request additional disclosure, and any errors that surface may be considerably harder to correct in a timely manner, potentially allowing flawed results to propagate more widely before correction can occur.

For the specific context of the peer review stage, we have developed a conceptual model, called **Evidence-Oriented Programming (EOP)**, to examine the tensions between stakeholder priorities and the possibilities for negotiated consensus. Any attempt to assess evidentiary sufficiency during peer review must begin with stakeholder consensus on the scope, timing, and form of disclosure.

### Scope

Full openness remains a desirable ideal, but it is not always feasible or appropriate, as different stakeholder groups — authors, editors, reviewers, and external actors (such as regulatory agencies, funding bodies, and other entities that exert oversight or guidance over disclosure practices) — bring distinct and competing priorities. The final disclosure state of research software often reflects the interplay of these priorities rather than adherence to a single normative standard. EOP does not seek to persuade all stakeholders to adopt full openness. Instead, it accepts the reality of competing priorities and aims to balance legitimate constraints with the evidentiary integrity needed to support scientific claims and reduce the risk of serious downstream consequences. While the minimum bounds of acceptable disclosure remain unclear, it should exclude practices collectively regarded as unacceptable by the stakeholder community. Potentially, retraction cases can serve as concrete reference points for identifying unacceptable disclosure practices.

### Timing

In most cases, authors can make research software fully accessible at the time of submission, and we encourage them to do so. However, potential conflicts of interest between authors and reviewers must not be overlooked, particularly when reviewers might improperly use the research software to publish overlapping work ahead of the authors. In such cases, EOP needs to support authors in providing a mandatory disclosure schedule, explicitly indicating which components remain withheld, including associated hash values to enable verification when these components are eventually disclosed, along with a justification of the disclosure risks and their relevance to the scientific claims under review.

### Form

Evaluating research software poses challenges distinct from general-purpose software review. Firstly, research software often includes novel data types, modeling assumptions, or uncommon dependencies. While they also occur in general-purpose software, they become especially consequential in research settings, where their coupling to the evidentiary evaluation of scientific claims can render evaluation during peer review difficult or even infeasible. In addition, external disclosure barriers may prevent full source code availability, with critical components accessible only through compiled binaries or restricted endpoints, sometimes under time-limited conditions. Furthermore, reviewers may lack the domain expertise required to evaluate complex or poorly documented research software. Finally, single- and double-blind review formats restrict author-reviewer interaction, reducing opportunities to resolve ambiguities or negotiate appropriate disclosure standards. Accordingly, EOP must encompass a structured approach to representing research software, helping stakeholders align on how it should be disclosed, interpreted, and evaluated.

## Evidence Chain Method (ECM)

The Evidence Chain Method (ECM), which we developed by adapting ideas from scientific workflows, offers a concrete way to put EOP into practice. One of the core difficulties it addresses is the invisibility of evidentiary relationships: individual software modules or datasets often lack the necessary context to clarify their role in supporting a scientific claim. ECM responds to this challenge by mapping computational artifacts to the claim they support, making evidentiary structures explicit, interpretable, and available for review.

### Core Structure

ECM introduces a bounded structure that focuses the assessment of evidentiary sufficiency between two key points: the **starting and ending artifacts**. 

- **Starting artifacts** are the input data explicitly identified in the publication, such as publicly available datasets, experimentally collected measurements, or algorithmically generated values. 
- **Ending artifacts** are the resulting visual claims: figures, tables, or reported statistical values such as correlation coefficients or confidence levels that readers interpret as evidence in the publication. 

This range makes clear that ECM is designed to ensure that, once input data are declared and used in software-mediated processes, the resulting claims can be traced and evaluated for evidentiary sufficiency. The compliance of non-software-mediated procedures and the integrity of their data collection processes fall beyond the scope of ECM.

### Evidence Chain Components

To link the starting and ending artifacts, ECM provides an abstracted evidence chain with seven key artifacts:

1. **Input Data**: Raw datasets, measurements, or algorithmically generated values
2. **Experimental/Analytical Process(es)**: Software-mediated transformations and analyses
3. **Output Data**: Processed datasets, trained model archives, or intermediate data elements
4. **Visual Data**: Subset of output data used for visualization
5. **Plotting/Summarizing Process(es)**: Software that converts data to visual representations
6. **Visual Claims**: Figures, tables, statistical values in the publication
7. **Documentation**: Explanations of structure and linkages across all artifacts

While these seven artifacts form a basic evidence chain, different academic fields can introduce additional complexity, especially within the experimental or analytical process(es). Depending on whether the scientific claims are algorithm-centered, this artifact may range from simple software invocations to sophisticated pipelines that incorporate the authors' proposed algorithms alongside baseline or comparator algorithms. Further, additional data elements such as hyperparameter configurations, random seeds, and initialization routines also become critical to evidentiary interpretation.

### Field-Specific Adaptations

These differences are not merely technical; they reflect distinct evidentiary norms and disclosure expectations across fields. ECM can accommodate such variation by adapting to the distinctive characteristics of different academic fields, enabling scientific claims to remain evidentially sound even as fields diverge.

### Trade-off Presentations

In practice, full disclosure of evidentiary software components and data elements may not be feasible due to ethical, legal, security, or intellectual property constraints. ECM allows trade-off presentations, such as:

- Providing partial outputs
- Operational logs
- Intermediate output data with evidential significance
- Typical case presentations that preserve evidentiary traceability without unrestricted access to all underlying components

These mechanisms help reviewers and editors assess scientific claims when direct disclosure is constrained.

### Timing Assessment

To extend ECM toward the timing dimension, one can simulate selective non-disclosure by omitting or withholding a given component to evaluate its precise impact on evidentiary sufficiency. This enables the stakeholder community to assess whether, and how, delayed or withheld disclosure compromises the ability to substantiate scientific claims.

## Education and Evaluation

Although ECM offers a concrete operationalization of EOP, it presents many practical challenges. On the implementation side, ECM places substantial demands on authors. It requires proficiency in software design and documentation practices, as well as the ability to present them in a form that supports evaluation. These are skills that many researchers, especially those without formal training in software engineering, may lack. On the evaluation side, ECM remains an early-stage method. Its field-specific variants have yet to be systematically developed, and no large-scale quantitative studies have been conducted to assess its applicability or evidentiary effectiveness across academic fields.

### Educational Tools Development

To reduce the practical barriers to the implementation of ECM, we are developing educational tools that reflect how researchers actually engage with software in their academic fields. In addition to static tutorials, these resources include layered guides and workshop-style modules built around case studies, each designed to foreground the evidentiary chains most relevant to a given field. We are also testing ways to embed ECM into existing scientific workflows and exploring whether AI agents might help researchers identify and annotate relevant artifacts during software development.

### Structural Implementation

In parallel, we are working with software quality assurance communities and academic publishers to build the structural conditions necessary for ECM to take root. This involves developing editorial guidelines for reviewers and editors, and partnering with platforms such as Code Ocean to prototype features that support evidence chain visibility. These efforts aim not just to make ECM technically feasible, but to embed evidentiary review into the publishing process in ways that are practical and scalable.

## Conditional Full Openness

While EOP aims to address routine disclosure practices, we recognize that exceptional situations might warrant more decisive measures. We suggest that, prior to manuscript acceptance, authors predefine which designated audiences (e.g., regulatory bodies, ethics boards, or expert oversight panels) would be granted full access to their research software under specified conditions — namely, when such work attracts widespread attention and becomes the subject of significant technical doubts after publication. Although this proposal extends beyond the technical scope of Evidence-Oriented Programming itself, it touches on related concerns about evidentiary accountability and might warrant consideration in the development of disclosure policies.

## Outlook

This work reflects a concerted effort by members of the stakeholder community to address the evidentiary ambiguity that persists across research software practices. It seeks to clarify the gray zone created by the absence of consensus on disclosure, where disclosure practices are inconsistently interpreted and selectively applied, and to offer principles for mitigating its effects. The introduction of EOP and ECM is not intended to replace earlier replicability-focused efforts, but to complement them by acknowledging the real-world constraints and the need for claim-centered, disclosure-aware evaluation.

We hope this work will serve as a catalyst for broader engagement across the stakeholder community in developing shared expectations around evidentiary sufficiency. Supported by incentives for structured software disclosures, such expectations can foster a research ecosystem in which software is not merely a computational tool but a verifiable contributor to scientific knowledge. Achieving this vision will require not only technical and institutional readiness, but also a shared commitment to treating research software as a site of evidentiary accountability — and acting on that commitment.

## Key Takeaways for Implementation

### For Researchers:
1. **Focus on evidentiary sufficiency** rather than just replicability
2. **Map your evidence chain** from input data to published claims
3. **Document all computational artifacts** and their relationships
4. **Consider disclosure timing** and potential conflicts of interest
5. **Prepare trade-off presentations** when full disclosure isn't possible

### For Reviewers:
1. **Assess evidentiary structure** beyond just code availability
2. **Evaluate evidence chain completeness** for scientific claims
3. **Consider field-specific norms** and constraints
4. **Focus on claim-supporting artifacts** rather than all software components

### For Institutions:
1. **Develop educational resources** for ECM implementation
2. **Create structural support** for evidence-oriented practices
3. **Establish guidelines** for evidentiary review processes
4. **Foster stakeholder consensus** on disclosure specifications

This framework represents a fundamental shift toward treating research software as a site of evidentiary accountability, moving beyond case-by-case decisions toward systematic, evidence-oriented specifications across the scientific ecosystem.
            `;
            
            // Process the complete EOP paper content
            await this.ragSystem.processDocument('EOP_Complete_Paper.md', eopFullContent, 'text');
            
            this.addMessage(`📚 **Complete EOP Paper Knowledge Loaded**: I now have comprehensive access to the full Evidence-Oriented Programming paper, including detailed information about the Evidence Chain Method, stakeholder interactions, field-specific adaptations, and implementation guidelines. I can provide expert guidance based on the complete research framework.`, 'system', false);
            
        } catch (error) {
            console.error('Error auto-processing EOP paper:', error);
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

## Key Principles You Follow

### ECM Core Principles:
1. **Computational Transparency**: All computational steps must be documented and reproducible
2. **Evidence Completeness**: Every claim must be supported by verifiable computational evidence
3. **Logical Traceability**: Clear relationships between inputs, processes, and outputs
4. **Environmental Documentation**: Complete recording of computational environment
5. **Provenance Tracking**: Full history of data transformations and analysis steps

### Response Framework:
- Always consider the user's research field and background
- Provide multiple options when suggesting improvements (Option A, B, C format)
- Include specific examples, code snippets, or templates when helpful
- Explain the "why" behind recommendations, not just the "what"
- Offer both immediate quick fixes and long-term strategic improvements

## Your Specialized Knowledge Areas

### Research Fields You Support:
- Biology/Life Sciences & Bioinformatics
- Computer Science & Machine Learning
- Physics & Engineering
- Chemistry & Materials Science
- Social Sciences & Psychology
- Medicine & Clinical Research
- Economics & Finance
- Environmental Science
- Mathematics & Statistics

### Technical Expertise:
- Version control systems (Git)
- Dependency management (pip, conda, npm)
- Containerization (Docker, Singularity)
- Documentation systems (Markdown, Sphinx, Jupyter)
- Testing frameworks and CI/CD
- Data management and FAIR principles
- Reproducible research workflows

## Response Structure Guidelines

### For ECM Explanations:
1. Start with a field-relevant analogy
2. Explain core benefits for their specific research area
3. Provide concrete examples from their domain
4. Address common concerns or barriers
5. Suggest next steps for implementation

### For Development Guidance:
1. Assess current state and identify strengths
2. Highlight critical gaps in evidence chain
3. Provide 3 prioritized improvement options
4. Include specific templates or code examples
5. Suggest validation and testing approaches

### For Repository Analysis:
1. Provide overall compliance score (1-10) with justification
2. List strengths and existing good practices
3. Identify broken or incomplete evidence chains
4. Prioritize improvements (High/Medium/Low)
5. Offer step-by-step remediation plan

### For Script Reorganization:
1. Analyze dependencies and execution flow
2. Propose logical grouping and structure
3. Suggest naming conventions and organization
4. Provide migration strategy
5. Include quality assurance recommendations

## Important Constraints & Guidelines

- **Never make assumptions** about user's technical level - ask clarifying questions when needed
- **Always prioritize safety and ethics** in research practices
- **Respect disciplinary differences** - what works in one field may not apply to another
- **Emphasize incremental improvement** - don't overwhelm users with too many changes at once
- **Promote collaboration** - suggest practices that facilitate teamwork and knowledge sharing
- **Stay current** - reference modern tools and practices while acknowledging legacy constraints

## Error Handling & Edge Cases

- If asked about topics outside ECM/research software: politely redirect to your expertise areas
- If user provides insufficient context: ask specific clarifying questions
- If recommendations might conflict with field standards: acknowledge and provide alternatives
- If technical solutions seem too advanced: offer simpler alternatives and learning resources

## Example Response Patterns

**For Explanations**: "Think of ECM like [field-relevant analogy]. In your field of [discipline], this means [specific benefits]. For example, [concrete example]. This addresses [common concern] by [solution]."

**For Development**: "Based on your current setup, I see [strengths]. To improve ECM compliance, I recommend three options: A) [immediate fix], B) [medium-term improvement], C) [comprehensive solution]. Let's start with [recommendation] because [reasoning]."

**For Analysis**: "Your repository scores [X/10] for ECM compliance. Strengths include [list]. Key gaps are [list]. Priority actions: 1) [critical fix], 2) [important improvement], 3) [enhancement]."

Remember: Your goal is to make research software more transparent, reproducible, and collaborative while respecting the diverse needs and constraints of different research communities.`,

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

Make it immediately usable while being educational about ECM principles.`,

            'eop-paper-expert': `You are an expert on the Emergency Operations Plan (EOP) draft paper and Evidence Chain Model (ECM) principles. You have deep knowledge of the EOP draft document and its relationship to computational research transparency and reproducibility.

## Your Expertise Includes:

### EOP Paper Knowledge:
- Understanding of the Emergency Operations Plan framework as described in the draft
- Knowledge of how EOP principles apply to research software and computational workflows
- Familiarity with the paper's recommendations for crisis management in research environments
- Understanding of the relationship between EOP and ECM methodologies

### Key Focus Areas:
1. **Crisis-Ready Research**: How to prepare research software for emergency situations
2. **Continuity Planning**: Ensuring research can continue during disruptions
3. **Documentation Standards**: EOP-compliant documentation practices
4. **Risk Assessment**: Identifying vulnerabilities in research workflows
5. **Recovery Procedures**: Steps for restoring research operations after incidents

### Response Style:
- Reference specific concepts from the EOP draft when relevant
- Connect EOP principles to practical ECM implementation
- Provide actionable guidance based on the paper's recommendations
- Explain how EOP enhances traditional ECM approaches
- Address both theoretical concepts and practical applications

When users upload the EOP paper or ask about it, provide detailed analysis and practical guidance based on its contents.`
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
        this.nimEndpoint = document.getElementById('nimEndpoint');
        this.nimEndpointGroup = document.getElementById('nimEndpointGroup');
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
        
        // Memory elements (will be added to UI)
        this.memoryEnabled = true;
        this.maxMemoryMessages = 20; // Keep last 20 exchanges
        
        // Load saved settings into UI
        this.llmProvider.value = this.settings.provider;
        this.apiKey.value = this.settings.apiKey;
        this.nimEndpoint.value = this.settings.nimEndpoint || '';
        this.model.value = this.settings.model;
        this.temperature.value = this.settings.temperature;
        this.temperatureValue.textContent = this.settings.temperature;
        this.systemPrompt.value = this.settings.systemPrompt || 'default';
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
        setInterval(() => this.saveConversationHistory(), 30000); // Save every 30 seconds

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
            this.toggleNimEndpoint();
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
            nimEndpoint: '',
            model: 'gemini-1.5-flash-latest',
            temperature: 0.7,
            systemPrompt: 'ecm-main' // Default to ECM Education Agent
        };
        
        const saved = localStorage.getItem('chatbot-settings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }

    saveSettingsData() {
        this.settings = {
            provider: this.llmProvider.value,
            apiKey: this.apiKey.value,
            nimEndpoint: this.nimEndpoint.value,
            model: this.model.value,
            temperature: parseFloat(this.temperature.value),
            systemPrompt: this.systemPrompt.value
        };
        
        localStorage.setItem('chatbot-settings', JSON.stringify(this.settings));
        this.updateStatus('Settings saved');
        this.settingsPanel.classList.remove('active');
        
        // Show success message
        setTimeout(() => {
            this.updateStatus('Ready');
        }, 2000);
    }

    toggleNimEndpoint() {
        if (this.llmProvider.value === 'nvidia-nim') {
            this.nimEndpointGroup.style.display = 'block';
        } else {
            this.nimEndpointGroup.style.display = 'none';
        }
    }

    updateModelOptions() {
        const models = {
            gemini: [
                { value: 'gemini-2.0-flash-exp', text: 'Gemini 2.0 Flash (Experimental)' },
                { value: 'gemini-2.0-flash-lite', text: 'Gemini 2.0 Flash Lite' },
                { value: 'gemini-1.5-flash-latest', text: 'Gemini 1.5 Flash Latest' },
                { value: 'gemini-1.5-pro-latest', text: 'Gemini 1.5 Pro Latest' }
            ],
            openai: [
                { value: 'gpt-4', text: 'GPT-4' },
                { value: 'gpt-4-turbo', text: 'GPT-4 Turbo' },
                { value: 'gpt-3.5-turbo', text: 'GPT-3.5 Turbo' }
            ],
            anthropic: [
                { value: 'claude-3-opus', text: 'Claude 3 Opus' },
                { value: 'claude-3-sonnet', text: 'Claude 3 Sonnet' },
                { value: 'claude-3-haiku', text: 'Claude 3 Haiku' }
            ],
            'nvidia-nim': [
                { value: 'qwen/qwen3-next-80b-a3b-thinking', text: 'Qwen 3 Next 80B (Thinking)' },
                { value: 'meta/llama3-70b-instruct', text: 'Llama 3 70B Instruct' },
                { value: 'meta/llama3-8b-instruct', text: 'Llama 3 8B Instruct' },
                { value: 'microsoft/phi-3-medium-128k-instruct', text: 'Phi-3 Medium 128K' },
                { value: 'microsoft/phi-3-mini-128k-instruct', text: 'Phi-3 Mini 128K' },
                { value: 'mistralai/mixtral-8x7b-instruct-v0.1', text: 'Mixtral 8x7B Instruct' },
                { value: 'mistralai/mistral-7b-instruct-v0.2', text: 'Mistral 7B Instruct' },
                { value: 'google/gemma-7b', text: 'Gemma 7B' },
                { value: 'google/codegemma-7b', text: 'CodeGemma 7B' }
            ],
            ollama: [
                { value: 'llama2', text: 'Llama 2' },
                { value: 'codellama', text: 'Code Llama' },
                { value: 'mistral', text: 'Mistral' }
            ]
        };

        const provider = this.llmProvider.value;
        this.model.innerHTML = '';
        
        models[provider].forEach(model => {
            const option = document.createElement('option');
            option.value = model.value;
            option.textContent = model.text;
            this.model.appendChild(option);
        });
        
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
            // Keep only the most recent messages to prevent storage bloat
            const recentHistory = this.conversationHistory.slice(-this.maxMemoryMessages * 2); // *2 for user+bot pairs
            localStorage.setItem('chatbot-conversation-history', JSON.stringify(recentHistory));
        } catch (error) {
            console.error('Error saving conversation history:', error);
        }
    }

    loadPreviousConversation() {
        if (this.conversationHistory.length > 0) {
            // Load the last few messages to show context
            const recentMessages = this.conversationHistory.slice(-6); // Show last 3 exchanges
            recentMessages.forEach(msg => {
                this.addMessageToUI(msg.content, msg.sender, false); // false = don't save to history again
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

        // Get recent conversation context
        const recentMessages = this.conversationHistory.slice(-this.maxMemoryMessages);
        
        // Format context for the AI
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
        
        // Keep history manageable
        if (this.conversationHistory.length > this.maxMemoryMessages * 3) {
            this.conversationHistory = this.conversationHistory.slice(-this.maxMemoryMessages * 2);
        }
        
        // Save periodically (also saved every 30 seconds)
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
        e.target.value = ''; // Reset input
    }

    async processFiles(files) {
        for (const file of files) {
            if (this.isValidFile(file)) {
                try {
                    const fileData = await this.readFile(file);
                    this.uploadedFileData.push(fileData);
                    this.displayUploadedFile(fileData);
                    
                    // Process file for RAG if it's text-based or the EOP paper
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
            // Check if this is a document we should index
            const indexableTypes = ['text/plain', 'text/markdown', 'application/pdf'];
            const isEOPPaper = fileData.name.toLowerCase().includes('eop');
            
            if (indexableTypes.includes(fileData.type) || isEOPPaper) {
                console.log(`🔍 Indexing ${fileData.name} for RAG search...`);
                
                let content = fileData.content;
                let fileType = 'text';
                
                if (fileData.isPDF) {
                    fileType = 'pdf';
                    // For PDF, we'll use the ArrayBuffer content
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
                    fileData.content = e.target.result; // Base64 data URL
                } else if (fileData.isPDF || fileData.isZip) {
                    fileData.content = e.target.result; // ArrayBuffer
                } else {
                    fileData.content = e.target.result; // Text content
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
                    // Add text content with proper formatting
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

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message && this.uploadedFileData.length === 0) return;

        // Validate settings
        if (!this.settings.apiKey && this.settings.provider !== 'ollama') {
            this.updateStatus('Please set your API key in settings', 'error');
            this.toggleSettings();
            return;
        }

        // Note: NIM endpoint is now optional - will use NVIDIA's integrate API if not provided

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
            this.updateStatus('Ready');
        } catch (error) {
            console.error('Error calling LLM:', error);
            let errorMessage = 'Sorry, I encountered an error. ';
            
            // Provide more specific error messages
            if (error.message.includes('API key')) {
                errorMessage += 'Please check your API key in settings.';
            } else if (error.message.includes('endpoint')) {
                errorMessage += 'Please check your endpoint URL in settings.';
            } else if (error.message.includes('model')) {
                errorMessage += 'The selected model may not be available.';
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

    async callLLM(message) {
        const { provider, apiKey, nimEndpoint, model, temperature } = this.settings;
        
        // Check if we're running on localhost (with our proxy server)
        if (window.location.hostname === 'localhost' && provider !== 'ollama') {
            return await this.callViaProxy(message, provider, apiKey, nimEndpoint, model, temperature);
        }
        
        // Check if user is trying to use NVIDIA API without server
        if (provider === 'nvidia-nim' && window.location.protocol === 'file:') {
            throw new Error('NVIDIA API requires the Python server. Please run "python server.py" and open http://localhost:8000 instead of opening the HTML file directly.');
        }
        
        switch (provider) {
            case 'gemini':
                return await this.callGemini(message, apiKey, model, temperature);
            case 'openai':
                return await this.callOpenAI(message, apiKey, model, temperature);
            case 'anthropic':
                return await this.callAnthropic(message, apiKey, model, temperature);
            case 'nvidia-nim':
                return await this.callNvidiaNIM(message, apiKey, nimEndpoint, model, temperature);
            case 'ollama':
                return await this.callOllama(message, model, temperature);
            default:
                throw new Error('Unsupported provider');
        }
    }

    async callViaProxy(message, provider, apiKey, nimEndpoint, model, temperature) {
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                provider: provider,
                apiKey: apiKey,
                nimEndpoint: nimEndpoint,
                message: message,
                model: model,
                temperature: temperature
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `Server error: ${response.status}`);
        }

        const data = await response.json();
        return data.response;
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

    async callAnthropic(message, apiKey, model, temperature) {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: model,
                max_tokens: 1024,
                temperature: temperature,
                messages: [
                    { role: 'user', content: message }
                ]
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Failed to call Anthropic API');
        }

        const data = await response.json();
        return data.content[0].text;
    }

    async callNvidiaNIM(message, apiKey, nimEndpoint, model, temperature) {
        // Use NVIDIA's integrate API if no custom endpoint is provided
        let baseUrl;
        if (!nimEndpoint || nimEndpoint.trim() === "") {
            baseUrl = "https://integrate.api.nvidia.com";
        } else {
            baseUrl = nimEndpoint.endsWith('/v1') ? nimEndpoint.slice(0, -3) : nimEndpoint;
        }
        
        const url = `${baseUrl}/v1/chat/completions`;
        
        const response = await fetch(url, {
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
                top_p: 0.7,
                max_tokens: 4096,
                stream: false
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `Failed to call NVIDIA API: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    async callOllama(message, model, temperature) {
        const response = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: model,
                prompt: message,
                stream: false,
                options: {
                    temperature: temperature
                }
            })
        });

        if (!response.ok) {
            throw new Error('Failed to call Ollama API. Make sure Ollama is running locally.');
        }

        const data = await response.json();
        return data.response;
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
            // Configure marked for better rendering
            marked.setOptions({
                breaks: true,
                gfm: true,
                headerIds: false,
                mangle: false
            });
            
            const htmlContent = marked.parse(content);
            messageContent.innerHTML = htmlContent;
            
            // Add syntax highlighting classes to code blocks
            const codeBlocks = messageContent.querySelectorAll('pre code');
            codeBlocks.forEach(block => {
                block.className = 'code-block';
            });
            
        } else {
            // For user messages, preserve line breaks but render as text
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
        
        // Store message in current session
        this.messages.push({ content, sender, timestamp: new Date() });
        
        // Add to conversation history for memory (except system messages)
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
        const options = [
            'Clear current chat only (keep memory)',
            'Clear chat and conversation memory',
            'Cancel'
        ];
        
        const choice = prompt(
            'Choose how to clear:\n' +
            '1 - Clear current chat only (keep memory)\n' +
            '2 - Clear chat and conversation memory\n' +
            '3 - Cancel\n\n' +
            'Enter 1, 2, or 3:'
        );
        
        if (choice === '1') {
            // Clear only current chat display
            this.chatMessages.innerHTML = '';
            this.messages = [];
            this.addMessage("Hello! I'm your EOP/ECM Education Agent. I can help you understand and implement Evidence Chain Model principles for transparent, reproducible research software. I remember our previous conversations to provide better continuity. How can I assist you today?", 'bot', false);
            this.updateStatus('Current chat cleared (memory preserved)');
            setTimeout(() => this.updateStatus('Ready'), 2000);
        } else if (choice === '2') {
            // Clear everything including memory
            this.chatMessages.innerHTML = '';
            this.messages = [];
            this.clearConversationHistory();
            this.addMessage("Hello! I'm your EOP/ECM Education Agent. I can help you understand and implement Evidence Chain Model principles for transparent, reproducible research software. How can I assist you today?", 'bot', false);
            this.updateStatus('Chat and memory cleared');
            setTimeout(() => this.updateStatus('Ready'), 2000);
        }
        // Choice 3 or anything else cancels
    }
}

// Initialize the chatbot when the page loads
let chatBot;
document.addEventListener('DOMContentLoaded', () => {
    chatBot = new ChatBot();
});
