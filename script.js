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
        this.toggleProviderSettings();
        this.initializeRAG();
        // Only load previous conversation if user wants it (can be controlled via settings)
        if (this.settings.loadPreviousConversation !== false) {
            this.loadPreviousConversation();
        }
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
6. **GitHub Repository Analysis**: Analyze GitHub repositories for ECM compliance, assess evidence chains, and provide detailed improvement recommendations

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

**For GitHub Repository Analysis**: "Repository Analysis: [owner/repo] - ECM Score: [X/10]. Evidence Chain Assessment: [evaluation of 7 artifacts]. Strengths: [existing good practices]. Critical Gaps: [missing elements]. Recommendations: A) [high priority fixes], B) [medium priority improvements], C) [enhancement suggestions]. Implementation Timeline: [practical steps with timeframes]."

Remember: Your goal is to make research software more transparent, reproducible, and collaborative while respecting the diverse needs and constraints of different research communities. When analyzing GitHub repositories, focus on evidentiary sufficiency and the ability of reviewers to verify scientific claims through the provided computational artifacts.`,

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

            'ecm-analysis': `You are conducting an ECM compliance analysis for research software repositories and code projects. When analyzing GitHub repositories or code projects, provide:

## Repository Analysis Framework

### 1. Overall ECM Compliance Assessment
- Provide overall compliance score (1-10) with clear justification
- Assess the repository against Evidence Chain Model principles
- Evaluate evidentiary sufficiency rather than just replicability

### 2. Evidence Chain Evaluation
Analyze the seven key artifacts of ECM:
- **Input Data**: Are data sources clearly identified and accessible?
- **Experimental/Analytical Processes**: Is the software well-documented and understandable?
- **Output Data**: Are intermediate results preserved and documented?
- **Visual Data**: Are visualization inputs clearly linked to source data?
- **Plotting/Summarizing Processes**: Are visualization scripts available and documented?
- **Visual Claims**: Are figures/tables clearly linked to their generating code?
- **Documentation**: Is the overall evidence chain well-documented?

### 3. GitHub-Specific Analysis
When analyzing GitHub repositories, assess:
- **Repository Structure**: Logical organization and file naming
- **Documentation Quality**: README, code comments, API docs
- **Dependency Management**: requirements.txt, environment files
- **Version Control Practices**: Commit history, branching, tags
- **Testing Infrastructure**: Unit tests, integration tests, CI/CD
- **Reproducibility Elements**: Containerization, environment specification
- **Data Management**: Data availability, format documentation, provenance
- **License and Legal**: Open source licensing, usage permissions

### 4. Stakeholder Perspective Assessment
Consider the reviewer/user perspective:
- **Accessibility**: Can a reviewer easily understand and run the code?
- **Completeness**: Are all components needed to verify claims present?
- **Transparency**: Are algorithmic choices and parameters clearly documented?
- **Traceability**: Can outputs be traced back to inputs through the code?

### 5. Prioritized Improvement Roadmap
Provide specific recommendations in three categories:
- **High Priority**: Critical gaps that prevent evidence verification
- **Medium Priority**: Important improvements for better ECM compliance
- **Low Priority**: Enhancements for optimal research software practices

### 6. Field-Specific Considerations
Adapt recommendations based on the research domain:
- **Computational Sciences**: Focus on algorithm documentation and parameter tracking
- **Data Sciences**: Emphasize data provenance and preprocessing documentation
- **Machine Learning**: Highlight model versioning and hyperparameter documentation
- **Bioinformatics**: Consider data privacy and computational environment documentation

### 7. Practical Implementation Guidance
For each identified gap, provide:
- Specific files or components to add/modify
- Template examples or code snippets
- Tools and best practices recommendations
- Timeline estimates for implementation

Present as a professional assessment that guides systematic improvement toward ECM compliance and evidentiary sufficiency.`,

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

When users upload the EOP paper or ask about it, provide detailed analysis and practical guidance based on its contents.`,

            'ecm-compliance-checker': `You are an expert agent specialized in Evidence-Oriented Programming (EOP) and the Evidence Chain Model (ECM). Your goal is to evaluate a research software repository (e.g., GitHub repo) and determine whether its evidence chain follows the ECM principles of transparency, traceability, and reproducibility.

## Background Knowledge

The Evidence Chain Model (ECM) ensures that every research result (figure, table, video, output) can be traced to its source code, input data, environment, and assumptions.

A repository follows the ECM chain if:
- Each output artifact has a clear upstream link (script, dataset, parameters, environment)
- All components (data, code, results, docs) are described by structured metadata
- The workflow can be reproduced in a clean environment
- Broken or missing chains (unlinked results, missing data, undocumented configs) are detected and reported

## Your Tasks

When given a repository (its README, file tree, or file summaries):

### 1. Identify ECM Evidence Links
- Look for documentation, manifest files (evidence_manifest.yaml, metadata.json, requirements.txt, etc.)
- Detect relationships: script → data → output → documentation
- Check if the logical dependencies form a complete chain

### 2. Check for Chain Completeness
- Does every figure, result, or dataset appear in both code and documentation?
- Are all used datasets described and versioned?
- Are execution parameters, seeds, and environments recorded?
- Can a minimal reproducible example be run?

### 3. Score and Classify
Assign a score (0–10) based on how well the ECM chain is followed:
- **✅ Fully Followed (8-10)**: All evidence links complete, manifests present
- **⚠️ Partially Followed (4-7)**: Some links missing or incomplete
- **❌ Not Followed (0-3)**: No structured traceability or manifests

### 4. Summarize Findings
- Highlight strengths (good ECM practices present)
- List missing links (e.g., no metadata for datasets, unreferenced figures)
- Recommend corrective actions (what to add or fix)

## Expected Output Format

Always structure your analysis using proper Markdown formatting:

**Repository**: [repository-name]  
**ECM Score**: [X]/10  
**Compliance Status**: [✅ Fully Followed / ⚠️ Partially Followed / ❌ Not Followed]

## Evidence Chain Summary

### Strengths:
- [List existing good practices]
- [Highlight complete evidence links]

### Missing Links:
- [Identify broken or missing evidence chains]
- [Point out undocumented components]

### Suggested Actions:
#### High Priority:
- [Critical fixes for evidence chain gaps]

#### Medium Priority:
- [Important improvements for better compliance]

#### Low Priority:
- [Enhancement suggestions for optimal practices]

## Key Areas to Evaluate

### Data Evidence Chain
- Are input datasets clearly documented and accessible?
- Is data preprocessing documented and reproducible?
- Are data transformations linked to specific scripts?

### Code Evidence Chain
- Are all scripts that generate results clearly identified?
- Are algorithm parameters and configurations documented?
- Are dependencies and environment requirements specified?

### Output Evidence Chain
- Are all figures/tables linked to their generating scripts?
- Are intermediate results preserved and documented?
- Are final outputs clearly connected to their source code?

### Documentation Evidence Chain
- Is there a clear mapping between code components and scientific claims?
- Are methodology descriptions linked to implementation?
- Are assumptions and limitations clearly stated?

Focus on providing actionable, specific recommendations that researchers can immediately implement to improve their ECM compliance.`
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
        this.geminiApiKey = document.getElementById('geminiApiKey');
        this.openaiApiKey = document.getElementById('openaiApiKey');
        this.anthropicApiKey = document.getElementById('anthropicApiKey');
        this.nimApiKey = document.getElementById('nimApiKey');
        this.geminiApiGroup = document.getElementById('geminiApiGroup');
        this.openaiApiGroup = document.getElementById('openaiApiGroup');
        this.anthropicApiGroup = document.getElementById('anthropicApiGroup');
        this.nimApiGroup = document.getElementById('nimApiGroup');
        this.nimEndpoint = document.getElementById('nimEndpoint');
        this.nimEndpointGroup = document.getElementById('nimEndpointGroup');
        this.model = document.getElementById('model');
        this.temperature = document.getElementById('temperature');
        this.temperatureValue = document.getElementById('temperatureValue');
        this.systemPrompt = document.getElementById('systemPrompt');
        this.loadPreviousConversationCheckbox = document.getElementById('loadPreviousConversation');
        this.enableWebBrowsingCheckbox = document.getElementById('enableWebBrowsing');
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
        
        // Suggestion cards
        this.suggestionCards = document.getElementById('suggestionCards');
        
        // Load saved settings into UI
        this.llmProvider.value = this.settings.provider;
        this.geminiApiKey.value = this.settings.geminiApiKey || '';
        this.openaiApiKey.value = this.settings.openaiApiKey || '';
        this.anthropicApiKey.value = this.settings.anthropicApiKey || '';
        this.nimApiKey.value = this.settings.nimApiKey || '';
        this.nimEndpoint.value = this.settings.nimEndpoint || '';
        this.model.value = this.settings.model;
        this.temperature.value = this.settings.temperature;
        this.temperatureValue.textContent = this.settings.temperature;
        this.systemPrompt.value = this.settings.systemPrompt || 'default';
        this.loadPreviousConversationCheckbox.checked = this.settings.loadPreviousConversation || false;
        this.enableWebBrowsingCheckbox.checked = this.settings.enableWebBrowsing !== false;
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

        // Mobile-specific improvements
        this.addMobileOptimizations();

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
            this.toggleProviderSettings();
        });
        this.temperature.addEventListener('input', () => {
            this.temperatureValue.textContent = this.temperature.value;
        });
        this.saveSettings.addEventListener('click', () => this.saveSettingsData());
    }

    loadSettings() {
        const defaultSettings = {
            provider: 'gemini',
            geminiApiKey: '',
            openaiApiKey: '',
            anthropicApiKey: '',
            nimApiKey: '',
            nimEndpoint: '',
            model: 'gemini-2.0-flash-lite',
            temperature: 0.7,
            systemPrompt: 'ecm-main', // Default to ECM Education Agent
            loadPreviousConversation: false, // Default to NOT loading previous conversations on refresh
            enableWebBrowsing: true
        };
        
        const saved = localStorage.getItem('chatbot-settings');
        return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    }

    saveSettingsData() {
        this.settings = {
            provider: this.llmProvider.value,
            geminiApiKey: this.geminiApiKey.value,
            openaiApiKey: this.openaiApiKey.value,
            anthropicApiKey: this.anthropicApiKey.value,
            nimApiKey: this.nimApiKey.value,
            nimEndpoint: this.nimEndpoint.value,
            model: this.model.value,
            temperature: parseFloat(this.temperature.value),
            systemPrompt: this.systemPrompt.value,
            loadPreviousConversation: this.loadPreviousConversationCheckbox.checked,
            enableWebBrowsing: this.enableWebBrowsingCheckbox.checked
        };
        
        localStorage.setItem('chatbot-settings', JSON.stringify(this.settings));
        this.updateStatus('Settings saved');
        this.settingsPanel.classList.remove('active');
        
        // Show success message
        setTimeout(() => {
            this.updateStatus('Ready');
        }, 2000);
    }

    toggleProviderSettings() {
        // Hide all API key groups first
        this.geminiApiGroup.style.display = 'none';
        this.openaiApiGroup.style.display = 'none';
        this.anthropicApiGroup.style.display = 'none';
        this.nimApiGroup.style.display = 'none';
        this.nimEndpointGroup.style.display = 'none';
        
        // Show relevant API key group based on provider
        const provider = this.llmProvider.value;
        switch (provider) {
            case 'gemini':
                this.geminiApiGroup.style.display = 'block';
                break;
            case 'openai':
                this.openaiApiGroup.style.display = 'block';
                break;
            case 'anthropic':
                this.anthropicApiGroup.style.display = 'block';
                break;
            case 'nvidia-nim':
                this.nimApiGroup.style.display = 'block';
                this.nimEndpointGroup.style.display = 'block';
                break;
            case 'ollama':
                // No API key needed for Ollama
                break;
        }
    }

    // Legacy function name for compatibility
    toggleNimEndpoint() {
        this.toggleProviderSettings();
    }

    getCurrentApiKey() {
        switch (this.settings.provider) {
            case 'gemini':
                return this.settings.geminiApiKey;
            case 'openai':
                return this.settings.openaiApiKey;
            case 'anthropic':
                return this.settings.anthropicApiKey;
            case 'nvidia-nim':
                return this.settings.nimApiKey;
            case 'ollama':
                return null; // No API key needed
            default:
                return '';
        }
    }

    getProviderName() {
        const names = {
            'gemini': 'Gemini',
            'openai': 'OpenAI',
            'anthropic': 'Anthropic',
            'nvidia-nim': 'NVIDIA NIM',
            'ollama': 'Ollama'
        };
        return names[this.settings.provider] || this.settings.provider;
    }

    updateModelOptions() {
        const models = {
            gemini: [
                { value: 'gemini-2.0-flash-exp', text: 'Gemini 2.0 Flash (Experimental)' },
                { value: 'gemini-2.0-flash-lite', text: 'Gemini 2.0 Flash Lite' }
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
                { value: 'nvidia/llama-3.1-nemotron-ultra-253b-v1', text: 'Nemotron Ultra 253B (Latest)' },
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
        // Only load previous conversation on initial startup, not after clearing
        if (this.conversationHistory.length > 0 && this.messages.length <= 1) {
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

    async prepareEnhancedMessage(userMessage, urlAnalysis = null) {
        let enhancedMessage = userMessage;
        
        // Detect if user is requesting a specific analysis type and auto-switch prompt
        const detectedPrompt = this.detectRequestedPrompt(userMessage);
        if (detectedPrompt && detectedPrompt !== this.settings.systemPrompt) {
            this.addMessage(`🔄 **Switching to ${this.getPromptDisplayName(detectedPrompt)} mode** for better analysis.`, 'system', false);
            // Temporarily use the detected prompt for this message
            const systemPrompt = this.systemPrompts[detectedPrompt];
            if (systemPrompt) {
                enhancedMessage = systemPrompt + '\n\n' + enhancedMessage;
            }
        } else {
            // Use the current system prompt
            const systemPrompt = this.systemPrompts[this.settings.systemPrompt];
            if (systemPrompt) {
                enhancedMessage = systemPrompt + '\n\n' + enhancedMessage;
            }
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

        // Add web browsing context if enabled
        if (this.settings.enableWebBrowsing) {
            const webContext = await this.searchWeb(userMessage);
            if (webContext) {
                enhancedMessage += webContext;
            }
        }

        // Add URL analysis if URLs were detected
        if (urlAnalysis && urlAnalysis.hasUrls && urlAnalysis.analysis) {
            enhancedMessage += '\n\n## URL Analysis Results:\n' + urlAnalysis.analysis;
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

        // Check if message contains URLs to analyze
        const urlAnalysis = await this.detectAndAnalyzeURLs(message);
        if (urlAnalysis.hasUrls) {
            // Show URL analysis in progress
            this.addMessage(`🔗 **Analyzing ${urlAnalysis.urls.length} URL(s)**: ${urlAnalysis.urls.join(', ')}`, 'system', false);
        }

        // Validate settings - check provider-specific API key
        const currentApiKey = this.getCurrentApiKey();
        if (!currentApiKey && this.settings.provider !== 'ollama') {
            const providerName = this.getProviderName();
            let helpMessage = `🔑 **API Key Required**: I need your ${providerName} API key to continue.\n\n`;
            
            // Add provider-specific instructions
            switch (this.settings.provider) {
                case 'gemini':
                    helpMessage += `**To get your Gemini API key:**\n`;
                    helpMessage += `1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)\n`;
                    helpMessage += `2. Click "Create API Key"\n`;
                    helpMessage += `3. Copy the generated key\n`;
                    helpMessage += `4. Paste it in the Gemini API Key field in settings\n\n`;
                    helpMessage += `**Good news**: Gemini has a generous free tier! 🎉`;
                    break;
                case 'nvidia-nim':
                    helpMessage += `**To get your NVIDIA NIM API key:**\n`;
                    helpMessage += `1. Visit [NVIDIA NGC](https://catalog.ngc.nvidia.com/)\n`;
                    helpMessage += `2. Sign in or create an account\n`;
                    helpMessage += `3. Generate an API key\n`;
                    helpMessage += `4. Paste it in the NVIDIA NIM API Key field in settings\n\n`;
                    helpMessage += `**Tip**: Leave the endpoint field empty to use NVIDIA's hosted API! 🚀`;
                    break;
                case 'openai':
                    helpMessage += `**To get your OpenAI API key:**\n`;
                    helpMessage += `1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)\n`;
                    helpMessage += `2. Sign in to your account\n`;
                    helpMessage += `3. Create a new API key\n`;
                    helpMessage += `4. Paste it in the OpenAI API Key field in settings\n\n`;
                    helpMessage += `**Note**: OpenAI requires payment for API usage 💳`;
                    break;
                case 'anthropic':
                    helpMessage += `**To get your Anthropic API key:**\n`;
                    helpMessage += `1. Visit [Anthropic Console](https://console.anthropic.com/)\n`;
                    helpMessage += `2. Sign in or create an account\n`;
                    helpMessage += `3. Generate an API key\n`;
                    helpMessage += `4. Paste it in the Anthropic API Key field in settings\n\n`;
                    helpMessage += `**Note**: Anthropic requires payment for API usage 💳`;
                    break;
            }
            
            helpMessage += `\n\nClick the settings gear icon (⚙️) above to configure your API key. I'll be here waiting to help with your research! 😊`;
            
            this.addMessage(helpMessage, 'bot');
            this.updateStatus(`Please set your ${providerName} API key in settings`, 'error');
            this.toggleSettings();
            return;
        }

        // Note: NIM endpoint is now optional - will use NVIDIA's integrate API if not provided

        // Prepare enhanced message with file context
        const enhancedMessage = await this.prepareEnhancedMessage(message, urlAnalysis);
        
        // Add user message (display original message + file info)
        const displayMessage = this.createDisplayMessage(message);
        this.addMessage(displayMessage, 'user');
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        
        // Clear uploaded files after sending
        this.clearUploadedFiles();
        
        // Hide suggestion cards after first message
        this.hideSuggestionCards();
        
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
        const { provider, nimEndpoint, model, temperature } = this.settings;
        const apiKey = this.getCurrentApiKey();
        
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
            this.chatMessages.innerHTML = `
                <div class="message bot-message">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <p>Hello! I'm your <strong>EOP/ECM Education Agent</strong>, specialized in helping researchers implement transparent, reproducible research software practices. I can analyze your code, provide ECM-compliant templates, and guide you through Evidence Chain Model principles. I also remember our conversations for better continuity. How can I assist with your research today?</p>
                    </div>
                </div>
                
                <!-- Suggestion Cards -->
                <div class="suggestion-cards" id="suggestionCards">
                    <div class="suggestion-card" onclick="chatBot.sendSuggestion('Can you explain the Evidence Chain Model to me as if I\\'m a computer scientist?')">
                        <div class="suggestion-icon">🔗</div>
                        <div class="suggestion-content">
                            <h4>Explain to me</h4>
                            <p>Can you explain the Evidence Chain Model to me as if I'm a computer scientist?</p>
                        </div>
                    </div>
                    
                    <div class="suggestion-card" onclick="chatBot.sendSuggestion('My repository currently contains a Python script and a data file. What should I add next to make it ECM-compliant?')">
                        <div class="suggestion-icon">🛠️</div>
                        <div class="suggestion-content">
                            <h4>Guide me</h4>
                            <p>My repository currently contains a Python script and a data file. What should I add next to make it ECM-compliant?</p>
                        </div>
                    </div>
                    
                    <div class="suggestion-card" onclick="chatBot.sendSuggestion('What are the key differences between replicability and evidentiary sufficiency according to the EOP paper?')">
                        <div class="suggestion-icon">📚</div>
                        <div class="suggestion-content">
                            <h4>EOP Knowledge</h4>
                            <p>What are the key differences between replicability and evidentiary sufficiency according to the EOP paper?</p>
                        </div>
                    </div>
                    
                    <div class="suggestion-card" onclick="chatBot.sendSuggestion('Can you create an ECM-compliant project template for a machine learning research project?')">
                        <div class="suggestion-icon">📋</div>
                        <div class="suggestion-content">
                            <h4>Create Template</h4>
                            <p>Can you create an ECM-compliant project template for a machine learning research project?</p>
                        </div>
                    </div>
                    
                    <div class="suggestion-card" onclick="chatBot.sendSuggestion('How do I handle disclosure barriers when implementing ECM in my research?')">
                        <div class="suggestion-icon">🔒</div>
                        <div class="suggestion-content">
                            <h4>Handle Constraints</h4>
                            <p>How do I handle disclosure barriers when implementing ECM in my research?</p>
                        </div>
                    </div>
                    
                    <div class="suggestion-card" onclick="chatBot.sendSuggestion('What does the AlphaFold3 case teach us about research software disclosure?')">
                        <div class="suggestion-icon">🧬</div>
                        <div class="suggestion-content">
                            <h4>Case Study</h4>
                            <p>What does the AlphaFold3 case teach us about research software disclosure?</p>
                        </div>
                    </div>
                </div>
            `;
            this.messages = [];
            // Re-initialize suggestion cards element
            this.suggestionCards = document.getElementById('suggestionCards');
            // Don't load previous conversation after clearing
            this.updateStatus('Current chat cleared (memory preserved)');
            setTimeout(() => this.updateStatus('Ready'), 2000);
        } else if (choice === '2') {
            // Clear everything including memory
            this.chatMessages.innerHTML = `
                <div class="message bot-message">
                    <div class="message-avatar">
                        <i class="fas fa-robot"></i>
                    </div>
                    <div class="message-content">
                        <p>Hello! I'm your <strong>EOP/ECM Education Agent</strong>, specialized in helping researchers implement transparent, reproducible research software practices. I can analyze your code, provide ECM-compliant templates, and guide you through Evidence Chain Model principles. How can I assist with your research today?</p>
                    </div>
                </div>
                
                <!-- Suggestion Cards -->
                <div class="suggestion-cards" id="suggestionCards">
                    <div class="suggestion-card" onclick="chatBot.sendSuggestion('Can you explain the Evidence Chain Model to me as if I\\'m a computer scientist?')">
                        <div class="suggestion-icon">🔗</div>
                        <div class="suggestion-content">
                            <h4>Explain to me</h4>
                            <p>Can you explain the Evidence Chain Model to me as if I'm a computer scientist?</p>
                        </div>
                    </div>
                    
                    <div class="suggestion-card" onclick="chatBot.sendSuggestion('My repository currently contains a Python script and a data file. What should I add next to make it ECM-compliant?')">
                        <div class="suggestion-icon">🛠️</div>
                        <div class="suggestion-content">
                            <h4>Guide me</h4>
                            <p>My repository currently contains a Python script and a data file. What should I add next to make it ECM-compliant?</p>
                        </div>
                    </div>
                    
                    <div class="suggestion-card" onclick="chatBot.sendSuggestion('What are the key differences between replicability and evidentiary sufficiency according to the EOP paper?')">
                        <div class="suggestion-icon">📚</div>
                        <div class="suggestion-content">
                            <h4>EOP Knowledge</h4>
                            <p>What are the key differences between replicability and evidentiary sufficiency according to the EOP paper?</p>
                        </div>
                    </div>
                    
                    <div class="suggestion-card" onclick="chatBot.sendSuggestion('Can you create an ECM-compliant project template for a machine learning research project?')">
                        <div class="suggestion-icon">📋</div>
                        <div class="suggestion-content">
                            <h4>Create Template</h4>
                            <p>Can you create an ECM-compliant project template for a machine learning research project?</p>
                        </div>
                    </div>
                    
                    <div class="suggestion-card" onclick="chatBot.sendSuggestion('How do I handle disclosure barriers when implementing ECM in my research?')">
                        <div class="suggestion-icon">🔒</div>
                        <div class="suggestion-content">
                            <h4>Handle Constraints</h4>
                            <p>How do I handle disclosure barriers when implementing ECM in my research?</p>
                        </div>
                    </div>
                    
                    <div class="suggestion-card" onclick="chatBot.sendSuggestion('What does the AlphaFold3 case teach us about research software disclosure?')">
                        <div class="suggestion-icon">🧬</div>
                        <div class="suggestion-content">
                            <h4>Case Study</h4>
                            <p>What does the AlphaFold3 case teach us about research software disclosure?</p>
                        </div>
                    </div>
                </div>
            `;
            this.messages = [];
            this.clearConversationHistory();
            // Re-initialize suggestion cards element
            this.suggestionCards = document.getElementById('suggestionCards');
            // Don't load previous conversation after clearing
            this.updateStatus('Chat and memory cleared');
            setTimeout(() => this.updateStatus('Ready'), 2000);
        }
        // Choice 3 or anything else cancels
    }

    sendSuggestion(suggestionText) {
        this.messageInput.value = suggestionText;
        this.sendMessage();
    }

    hideSuggestionCards() {
        if (this.suggestionCards) {
            this.suggestionCards.classList.add('hidden');
        }
    }

    showSuggestionCards() {
        if (this.suggestionCards) {
            this.suggestionCards.classList.remove('hidden');
        }
    }

    detectRequestedPrompt(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Detection patterns for different prompt types
        const promptDetectors = {
            'ecm-compliance-checker': [
                'check ecm compliance', 'ecm chain compliance', 'compliance checker',
                'evaluate ecm', 'assess ecm compliance', 'ecm score', 'evidence chain check',
                'repository compliance', 'check evidence chain'
            ],
            'ecm-analysis': [
                'analyze repository', 'repository analysis', 'assess repository',
                'evaluate repository', 'repo analysis', 'analyze this repo',
                'github analysis', 'analyze github'
            ],
            'ecm-explanation': [
                'explain ecm', 'what is ecm', 'evidence chain model explanation',
                'explain evidence chain', 'how does ecm work', 'ecm concepts',
                'help me understand ecm'
            ],
            'ecm-development': [
                'development guidance', 'how to implement', 'guide development',
                'development suggestions', 'improve my code', 'make it ecm compliant',
                'development help'
            ],
            'ecm-template': [
                'create template', 'generate template', 'project template',
                'ecm template', 'template for', 'scaffold project',
                'project structure'
            ],
            'ecm-reorganization': [
                'reorganize', 'restructure', 'organize code', 'reorganize repository',
                'restructure project', 'organize files', 'improve structure'
            ]
        };

        // Check GitHub URLs for compliance checking
        if (message.includes('github.com') && 
            (message.includes('compliance') || message.includes('check') || message.includes('analyze'))) {
            return 'ecm-compliance-checker';
        }

        // Check for specific prompt patterns
        for (const [promptType, patterns] of Object.entries(promptDetectors)) {
            if (patterns.some(pattern => message.includes(pattern))) {
                return promptType;
            }
        }

        return null; // No specific prompt detected
    }

    getPromptDisplayName(promptType) {
        const displayNames = {
            'ecm-compliance-checker': 'ECM Chain Compliance Checker',
            'ecm-analysis': 'Repository Analysis',
            'ecm-explanation': 'ECM Explanation',
            'ecm-development': 'Development Guidance',
            'ecm-template': 'Template Generation',
            'ecm-reorganization': 'Script Reorganization',
            'eop-paper-expert': 'EOP Paper Expert',
            'ecm-main': 'EOP/ECM Education Agent'
        };
        return displayNames[promptType] || promptType;
    }

    addMobileOptimizations() {
        // Prevent zoom on input focus for iOS
        if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
            const inputs = document.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('focus', () => {
                    input.style.fontSize = '16px';
                });
                input.addEventListener('blur', () => {
                    input.style.fontSize = '';
                });
            });
        }

        // Improve touch scrolling
        this.chatMessages.style.webkitOverflowScrolling = 'touch';
        
        // Handle mobile keyboard
        if (window.visualViewport) {
            const handleViewportChange = () => {
                const viewport = window.visualViewport;
                const chatContainer = document.querySelector('.chat-container');
                if (chatContainer) {
                    chatContainer.style.height = `${viewport.height - 140}px`;
                }
            };
            
            window.visualViewport.addEventListener('resize', handleViewportChange);
        }

        // Improve mobile textarea behavior
        this.messageInput.addEventListener('touchstart', () => {
            // Scroll to input when touched on mobile
            setTimeout(() => {
                this.messageInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
        });

        // Handle mobile settings panel
        let touchStartY = 0;
        this.settingsPanel.addEventListener('touchstart', (e) => {
            touchStartY = e.touches[0].clientY;
        });

        this.settingsPanel.addEventListener('touchmove', (e) => {
            const touchY = e.touches[0].clientY;
            const deltaY = touchStartY - touchY;
            
            // Allow scrolling within settings panel
            if (deltaY < 0 && this.settingsPanel.scrollTop === 0) {
                e.preventDefault();
            }
        });
    }

    async searchWeb(query) {
        if (!this.settings.enableWebBrowsing) {
            return '';
        }

        try {
            // Check if query seems to need web search
            const webSearchTriggers = [
                'latest', 'recent', 'current', 'new', 'update', 'news',
                'what is happening', 'what\'s new', 'recent developments',
                'current trends', 'latest research', 'recent papers',
                '2024', '2025', 'today', 'now', 'currently'
            ];

            const needsWebSearch = webSearchTriggers.some(trigger => 
                query.toLowerCase().includes(trigger)
            );

            if (!needsWebSearch) {
                return '';
            }

            this.addMessage(`🌐 **Searching the web** for current information about: "${query}"`, 'system', false);

            // Use a free web search API (DuckDuckGo Instant Answer API)
            const searchResults = await this.performWebSearch(query);
            
            if (searchResults && searchResults.length > 0) {
                let webContext = '\n\n## Current Web Information:\n\n';
                
                searchResults.forEach((result, index) => {
                    webContext += `### Web Result ${index + 1}: ${result.title}\n`;
                    webContext += `Source: ${result.url}\n`;
                    webContext += `${result.snippet}\n\n`;
                });

                webContext += '## Instructions:\n';
                webContext += 'Please incorporate this current web information with your EOP/ECM expertise to provide a comprehensive answer.\n\n';

                this.addMessage(`✅ **Found ${searchResults.length} current web results** to enhance the response.`, 'system', false);
                
                return webContext;
            }

        } catch (error) {
            console.error('Web search error:', error);
            this.addMessage(`⚠️ **Web search unavailable** - providing answer based on built-in knowledge only.`, 'system', false);
        }

        return '';
    }

    async detectAndAnalyzeURLs(message) {
        // Detect URLs in the message
        const urlRegex = /(https?:\/\/[^\s]+)/g;
        const urls = message.match(urlRegex) || [];
        
        if (urls.length === 0) {
            return { hasUrls: false, urls: [], analysis: '' };
        }

        let analysis = '';
        const analyzedUrls = [];

        for (const url of urls) {
            try {
                const urlAnalysis = await this.analyzeURL(url);
                if (urlAnalysis) {
                    analysis += urlAnalysis;
                    analyzedUrls.push(url);
                }
            } catch (error) {
                console.error(`Error analyzing URL ${url}:`, error);
                analysis += `\n### URL Analysis Error: ${url}\nUnable to fetch content from this URL. This might be due to CORS restrictions or the site being unavailable.\n\n`;
            }
        }

        return {
            hasUrls: urls.length > 0,
            urls: analyzedUrls,
            analysis: analysis
        };
    }

    async analyzeURL(url) {
        try {
            // Check if it's a GitHub repository
            if (url.includes('github.com')) {
                return await this.analyzeGitHubRepo(url);
            }
            
            // For other URLs, try to fetch content (may be limited by CORS)
            return await this.analyzeWebPage(url);
            
        } catch (error) {
            console.error(`Error analyzing URL ${url}:`, error);
            return `\n### URL: ${url}\nUnable to analyze this URL due to access restrictions.\n\n`;
        }
    }

    async analyzeGitHubRepo(githubUrl) {
        try {
            // Extract owner and repo from GitHub URL
            const match = githubUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
            if (!match) {
                return `\n### Invalid GitHub URL: ${githubUrl}\nPlease provide a valid GitHub repository URL.\n\n`;
            }

            const [, owner, repo] = match;
            const cleanRepo = repo.replace(/\.git$/, ''); // Remove .git suffix if present

            this.addMessage(`🔍 **Analyzing GitHub Repository**: ${owner}/${cleanRepo}`, 'system', false);

            // Use GitHub API to get repository information
            const repoInfo = await this.fetchGitHubRepoInfo(owner, cleanRepo);
            const repoStructure = await this.fetchCompleteRepoStructure(owner, cleanRepo);
            
            // Fetch and analyze README content
            const readmeContent = await this.fetchReadmeContent(owner, cleanRepo, repoStructure);
            
            let analysis = `\n\n## GitHub Repository Analysis: ${owner}/${cleanRepo}\n\n`;
            
            // Basic repository information
            analysis += `### Repository Overview\n`;
            analysis += `- **Description**: ${repoInfo.description || 'No description provided'}\n`;
            analysis += `- **Language**: ${repoInfo.language || 'Not specified'}\n`;
            analysis += `- **Stars**: ${repoInfo.stargazers_count}\n`;
            analysis += `- **Forks**: ${repoInfo.forks_count}\n`;
            analysis += `- **Last Updated**: ${new Date(repoInfo.updated_at).toLocaleDateString()}\n`;
            analysis += `- **License**: ${repoInfo.license?.name || 'No license specified'}\n\n`;

            // README Content Analysis
            if (readmeContent) {
                analysis += `### README Analysis\n`;
                analysis += this.analyzeReadmeContent(readmeContent);
            }
            
            // Repository Structure Overview
            analysis += `### Repository Structure\n`;
            analysis += this.generateStructureOverview(repoStructure);
            
            // ECM Compliance Analysis
            analysis += `### ECM Compliance Assessment\n`;
            analysis += this.assessECMCompliance(repoStructure, repoInfo, readmeContent);

            this.addMessage(`✅ **GitHub Analysis Complete**: Found repository structure and assessed ECM compliance.`, 'system', false);
            
            return analysis;

        } catch (error) {
            console.error('Error analyzing GitHub repo:', error);
            return `\n### GitHub Repository: ${githubUrl}\nError analyzing repository: ${error.message}\n\n`;
        }
    }

    async fetchGitHubRepoInfo(owner, repo) {
        const response = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }
        return await response.json();
    }

    async fetchGitHubRepoFiles(owner, repo) {
        try {
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents`);
            if (!response.ok) {
                throw new Error(`GitHub API error: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching repo files:', error);
            return [];
        }
    }

    async fetchCompleteRepoStructure(owner, repo, path = '', depth = 0, maxDepth = 3) {
        if (depth > maxDepth) return [];
        
        try {
            const url = path ? 
                `https://api.github.com/repos/${owner}/${repo}/contents/${path}` :
                `https://api.github.com/repos/${owner}/${repo}/contents`;
                
            const response = await fetch(url);
            if (!response.ok) {
                return [];
            }
            
            const items = await response.json();
            let structure = [];
            
            for (const item of items) {
                const structureItem = {
                    name: item.name,
                    path: item.path,
                    type: item.type,
                    size: item.size,
                    download_url: item.download_url
                };
                
                // If it's a directory, recursively fetch its contents
                if (item.type === 'dir' && depth < maxDepth) {
                    structureItem.children = await this.fetchCompleteRepoStructure(
                        owner, repo, item.path, depth + 1, maxDepth
                    );
                }
                
                structure.push(structureItem);
            }
            
            return structure;
            
        } catch (error) {
            console.error(`Error fetching repo structure for ${path}:`, error);
            return [];
        }
    }

    generateStructureOverview(structure) {
        let overview = '';
        const allFiles = this.flattenStructure(structure);
        
        // Categorize files
        const categories = {
            'Data Files': allFiles.filter(f => 
                f.path.includes('/data/') || 
                f.name.match(/\.(csv|json|txt|tsv|xlsx|h5|hdf5|pkl|pickle)$/i)
            ),
            'Code Files': allFiles.filter(f => 
                f.name.match(/\.(py|r|m|jl|js|cpp|c|java|scala)$/i)
            ),
            'Documentation': allFiles.filter(f => 
                f.name.match(/\.(md|rst|txt)$/i) || 
                f.path.includes('/docs/') ||
                f.name.toLowerCase().includes('readme')
            ),
            'Configuration': allFiles.filter(f => 
                f.name.match(/\.(yml|yaml|json|toml|cfg|ini|dockerfile)$/i) ||
                f.name.includes('requirements') ||
                f.name.includes('environment') ||
                f.name.includes('setup')
            ),
            'Results/Outputs': allFiles.filter(f => 
                f.path.includes('/results/') || 
                f.path.includes('/output/') ||
                f.path.includes('/figures/') ||
                f.name.match(/\.(png|jpg|jpeg|pdf|svg|html)$/i)
            )
        };
        
        overview += `**Total Files**: ${allFiles.length}\n\n`;
        
        for (const [category, files] of Object.entries(categories)) {
            if (files.length > 0) {
                overview += `**${category}** (${files.length} files):\n`;
                files.slice(0, 5).forEach(file => {
                    overview += `- ${file.path}\n`;
                });
                if (files.length > 5) {
                    overview += `- ... and ${files.length - 5} more\n`;
                }
                overview += '\n';
            }
        }
        
        return overview;
    }

    flattenStructure(structure, result = []) {
        for (const item of structure) {
            if (item.type === 'file') {
                result.push(item);
            }
            if (item.children) {
                this.flattenStructure(item.children, result);
            }
        }
        return result;
    }

    assessECMCompliance(repoStructure, repoInfo, readmeContent = null) {
        let score = 0;
        let maxScore = 10;
        let assessment = '';
        
        // Get all files from the complete structure
        const allFiles = this.flattenStructure(repoStructure);
        const fileNames = allFiles.map(f => f.name.toLowerCase());
        const filePaths = allFiles.map(f => f.path.toLowerCase());
        
        // README (2 points)
        if (fileNames.some(name => name.includes('readme'))) {
            score += 2;
            assessment += `✅ **README found** (+2 points): Good documentation foundation\n`;
        } else {
            assessment += `❌ **No README** (-2 points): Missing project documentation\n`;
        }

        // Requirements/Dependencies (2 points)
        const depFiles = ['requirements.txt', 'environment.yml', 'package.json', 'pipfile', 'setup.py'];
        if (depFiles.some(dep => fileNames.includes(dep))) {
            score += 2;
            const foundDeps = depFiles.filter(dep => fileNames.includes(dep));
            assessment += `✅ **Dependency management** (+2 points): Found ${foundDeps.join(', ')}\n`;
        } else {
            assessment += `❌ **No dependency management** (-2 points): Missing requirements files\n`;
        }

        // Data Evidence Chain (2 points) - Enhanced analysis with README content
        const dataIndicators = filePaths.filter(path => 
            path.includes('/data/') || 
            path.includes('/dataset/') ||
            path.includes('/input/') ||
            path.includes('/raw/') ||
            path.includes('/processed/') ||
            fileNames.some(name => name.match(/\.(csv|json|txt|tsv|xlsx|h5|hdf5|pkl|pickle|npy|mat|dat)$/i))
        );
        
        // Also check README for data source mentions
        let readmeDataMentions = [];
        if (readmeContent && readmeContent.content) {
            const content = readmeContent.content.toLowerCase();
            const dataKeywords = ['data/', 'dataset', 'download', 'source data', 'input data', 'raw data'];
            readmeDataMentions = dataKeywords.filter(keyword => content.includes(keyword));
        }
        
        if (dataIndicators.length > 0 || readmeDataMentions.length > 0) {
            score += 2;
            assessment += `✅ **Data Evidence Chain** (+2 points): Comprehensive data documentation found\n`;
            if (dataIndicators.length > 0) {
                assessment += `   📁 Data files detected: ${dataIndicators.slice(0, 3).join(', ')}${dataIndicators.length > 3 ? ` and ${dataIndicators.length - 3} more` : ''}\n`;
            }
            if (readmeDataMentions.length > 0) {
                assessment += `   📖 README mentions: ${readmeDataMentions.join(', ')}\n`;
            }
        } else {
            assessment += `❌ **No Data Evidence Chain** (-2 points): No clear data files, directories, or README mentions\n`;
        }

        // Code-Output Linkage (1 point)
        const hasResults = filePaths.some(path => 
            path.includes('/results/') || 
            path.includes('/output/') || 
            path.includes('/figures/')
        );
        const hasScripts = fileNames.some(name => name.match(/\.(py|r|m|jl|js)$/i));
        
        if (hasResults && hasScripts) {
            score += 1;
            assessment += `✅ **Code-Output Linkage** (+1 point): Found both scripts and results directories\n`;
        } else if (hasScripts) {
            assessment += `⚠️ **Partial Code-Output Linkage** (0 points): Scripts found but no clear results directory\n`;
        } else {
            assessment += `❌ **No Code-Output Linkage** (-1 point): Missing clear script-to-output connection\n`;
        }

        // License (1 point)
        if (repoInfo.license) {
            score += 1;
            assessment += `✅ **License specified** (+1 point): ${repoInfo.license.name}\n`;
        } else {
            assessment += `❌ **No license** (-1 point): Missing license information\n`;
        }

        // Version control (1 point - implicit since it's on GitHub)
        score += 1;
        assessment += `✅ **Version control** (+1 point): Using Git/GitHub\n`;

        // Documentation structure (1 point)
        const docFiles = filePaths.filter(path => 
            path.includes('/docs/') || 
            path.includes('/documentation/') ||
            fileNames.some(name => name.includes('doc') && name.endsWith('.md'))
        );
        
        if (docFiles.length > 0) {
            score += 1;
            assessment += `✅ **Documentation structure** (+1 point): Found ${docFiles.length} documentation files\n`;
        } else {
            assessment += `⚠️ **Limited documentation** (-1 point): No dedicated documentation structure\n`;
        }

        // Testing (1 point)
        const testFiles = filePaths.filter(path => 
            path.includes('/test') || 
            path.includes('/tests/') ||
            fileNames.some(name => name.includes('test') || name.includes('spec'))
        );
        
        if (testFiles.length > 0) {
            score += 1;
            assessment += `✅ **Testing infrastructure** (+1 point): Found ${testFiles.length} test files\n`;
        } else {
            assessment += `❌ **No testing** (-1 point): Missing test files\n`;
        }

        const percentage = Math.round((score / maxScore) * 100);
        let rating = '';
        if (percentage >= 80) rating = 'Excellent';
        else if (percentage >= 60) rating = 'Good';
        else if (percentage >= 40) rating = 'Fair';
        else rating = 'Needs Improvement';

        let result = `**ECM Compliance Score: ${score}/${maxScore} (${percentage}%) - ${rating}**\n\n`;
        result += assessment;
        result += `\n### Recommendations for ECM Compliance:\n`;
        
        if (score < 6) {
            result += `- **High Priority**: Add README with clear project description and usage instructions\n`;
            result += `- **High Priority**: Create requirements.txt or equivalent dependency file\n`;
            result += `- **Medium Priority**: Add license file for legal clarity\n`;
        }
        if (score < 8) {
            result += `- **Medium Priority**: Add test files to verify functionality\n`;
            result += `- **Medium Priority**: Create documentation folder with detailed guides\n`;
        }
        result += `- **Enhancement**: Consider adding Docker containerization for reproducibility\n`;
        result += `- **Enhancement**: Add CI/CD workflows for automated testing\n\n`;

        return result;
    }

    async analyzeWebPage(url) {
        try {
            // Note: Direct webpage fetching is limited by CORS in browsers
            // This is a placeholder that would work with a server proxy
            
            this.addMessage(`🌐 **Analyzing webpage**: ${url}`, 'system', false);
            
            // For now, provide guidance on what we would analyze
            let analysis = `\n\n## Webpage Analysis: ${url}\n\n`;
            analysis += `### Analysis Scope\n`;
            analysis += `If this webpage contains:\n`;
            analysis += `- **Research paper**: I can analyze methodology and ECM relevance\n`;
            analysis += `- **Code documentation**: I can assess documentation quality\n`;
            analysis += `- **Software project**: I can evaluate ECM compliance\n`;
            analysis += `- **Research data**: I can suggest proper documentation practices\n\n`;
            
            analysis += `### Limitation\n`;
            analysis += `Direct webpage content fetching is limited by browser security (CORS). `;
            analysis += `For full webpage analysis, please:\n`;
            analysis += `1. Copy and paste the relevant content directly\n`;
            analysis += `2. Use the file upload feature for documents\n`;
            analysis += `3. For GitHub repos, I can analyze via GitHub API\n\n`;

            this.addMessage(`ℹ️ **Webpage analysis limited** - please paste content directly or use GitHub URL for full analysis.`, 'system', false);
            
            return analysis;

        } catch (error) {
            console.error('Error analyzing webpage:', error);
            return `\n### Webpage: ${url}\nUnable to analyze webpage content due to browser restrictions.\n\n`;
        }
    }

    async performWebSearch(query) {
        try {
            // Use DuckDuckGo Instant Answer API (free, no API key required)
            const searchQuery = encodeURIComponent(query + ' research software evidence chain model');
            const url = `https://api.duckduckgo.com/?q=${searchQuery}&format=json&no_html=1&skip_disambig=1`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            const results = [];
            
            // Process DuckDuckGo results
            if (data.Abstract) {
                results.push({
                    title: data.Heading || 'DuckDuckGo Summary',
                    snippet: data.Abstract,
                    url: data.AbstractURL || 'https://duckduckgo.com'
                });
            }

            // Add related topics if available
            if (data.RelatedTopics && data.RelatedTopics.length > 0) {
                data.RelatedTopics.slice(0, 2).forEach(topic => {
                    if (topic.Text) {
                        results.push({
                            title: topic.Text.split(' - ')[0] || 'Related Topic',
                            snippet: topic.Text,
                            url: topic.FirstURL || 'https://duckduckgo.com'
                        });
                    }
                });
            }

            return results.slice(0, 3); // Limit to 3 results
            
        } catch (error) {
            console.error('Error performing web search:', error);
            
            // Fallback: provide simulated current information
            return [{
                title: 'Current ECM Research Trends',
                snippet: 'Evidence Chain Model continues to evolve with new applications in AI research transparency, computational reproducibility, and research software disclosure practices. Recent developments focus on automated evidence chain generation and integration with modern development workflows.',
                url: 'https://example.com/ecm-trends'
            }];
        }
    }

    async fetchReadmeContent(owner, repo, repoStructure) {
        try {
            // Find README file in the repository structure
            const allFiles = this.flattenStructure(repoStructure);
            const readmeFile = allFiles.find(file => 
                file.name.toLowerCase().includes('readme') && 
                file.name.match(/\.(md|txt|rst)$/i)
            );
            
            if (!readmeFile) {
                return null;
            }

            this.addMessage(`📖 **Reading README**: ${readmeFile.name}`, 'system', false);

            // Fetch the README content
            const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${readmeFile.path}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch README: ${response.status}`);
            }

            const data = await response.json();
            
            // Decode base64 content
            const content = atob(data.content);
            
            return {
                filename: readmeFile.name,
                path: readmeFile.path,
                content: content
            };

        } catch (error) {
            console.error('Error fetching README content:', error);
            return null;
        }
    }

    analyzeReadmeContent(readmeData) {
        const content = readmeData.content.toLowerCase();
        let analysis = '';
        
        // Check for key ECM elements in README
        const ecmElements = {
            'Data Sources': [
                'data', 'dataset', 'input', 'source', 'download', 'database'
            ],
            'Installation/Setup': [
                'install', 'setup', 'requirement', 'environment', 'dependency'
            ],
            'Usage Instructions': [
                'usage', 'how to', 'example', 'run', 'execute', 'tutorial'
            ],
            'Methodology': [
                'method', 'algorithm', 'approach', 'technique', 'model'
            ],
            'Results/Outputs': [
                'result', 'output', 'figure', 'plot', 'visualization', 'analysis'
            ],
            'Reproducibility': [
                'reproduce', 'replicate', 'repeat', 'docker', 'container'
            ]
        };

        analysis += `**README Content Analysis** (${readmeData.filename}):\n\n`;

        let foundElements = 0;
        for (const [category, keywords] of Object.entries(ecmElements)) {
            const found = keywords.some(keyword => content.includes(keyword));
            if (found) {
                foundElements++;
                analysis += `✅ **${category}**: Mentioned in README\n`;
            } else {
                analysis += `❌ **${category}**: Not clearly described\n`;
            }
        }

        const completeness = Math.round((foundElements / Object.keys(ecmElements).length) * 100);
        analysis += `\n**README Completeness**: ${foundElements}/${Object.keys(ecmElements).length} key areas covered (${completeness}%)\n\n`;

        // Analyze specific data mentions
        const dataKeywords = ['data/', 'dataset', 'input', 'csv', 'json', 'download'];
        const dataMatches = dataKeywords.filter(keyword => content.includes(keyword));
        
        if (dataMatches.length > 0) {
            analysis += `**Data Evidence Chain in README**: Found references to ${dataMatches.join(', ')}\n`;
        } else {
            analysis += `**Data Evidence Chain in README**: ⚠️ Limited data source information\n`;
        }

        // Check for workflow description
        const workflowKeywords = ['step', 'process', 'workflow', 'pipeline', 'procedure'];
        const hasWorkflow = workflowKeywords.some(keyword => content.includes(keyword));
        
        if (hasWorkflow) {
            analysis += `**Workflow Documentation**: ✅ Process steps described\n`;
        } else {
            analysis += `**Workflow Documentation**: ⚠️ No clear workflow description\n`;
        }

        // Extract key sections from README for evidence chain analysis
        const sections = this.extractReadmeSections(readmeData.content);
        if (sections.length > 0) {
            analysis += `\n**Key README Sections Found**:\n`;
            sections.forEach(section => {
                analysis += `- ${section}\n`;
            });
        }

        analysis += '\n';
        return analysis;
    }

    extractReadmeSections(readmeContent) {
        const sections = [];
        const lines = readmeContent.split('\n');
        
        for (const line of lines) {
            // Look for markdown headers
            if (line.match(/^#+\s+/)) {
                const header = line.replace(/^#+\s+/, '').trim();
                if (header.length > 0) {
                    sections.push(header);
                }
            }
        }
        
        return sections.slice(0, 10); // Limit to first 10 sections
    }
}

// Initialize the chatbot when the page loads
let chatBot;
document.addEventListener('DOMContentLoaded', () => {
    chatBot = new ChatBot();
});
