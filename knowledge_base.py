"""
Knowledge Base for EOP/ECM Education Agent
Contains embedded documents and guidelines that are automatically loaded
"""

import os
import json
from typing import Dict, List, Any

class KnowledgeBase:
    def __init__(self):
        self.documents = {}
        self.initialize_documents()
    
    def initialize_documents(self):
        """Initialize the knowledge base with embedded documents"""
        
        # EOP Draft Paper Content (extracted key sections)
        eop_content = """
# Emergency Operations Plan (EOP) for Research Software - Draft v1

## Executive Summary

The Evidence Chain Model (ECM) provides a comprehensive framework for maintaining computational transparency and reproducibility in research software, with special emphasis on crisis preparedness and emergency operations planning.

## 1. Introduction

Research software forms the backbone of modern scientific inquiry, yet it remains vulnerable to various disruptions including system failures, personnel changes, natural disasters, and institutional crises. The Emergency Operations Plan (EOP) for research software establishes protocols and procedures to ensure continuity of computational research during adverse conditions.

## 2. Core Principles of ECM

### 2.1 Computational Transparency
All computational steps must be documented and reproducible. This includes:
- Complete source code availability
- Clear documentation of algorithms and methodologies
- Explicit statement of assumptions and limitations
- Version control of all computational components

### 2.2 Evidence Completeness
Every scientific claim must be supported by verifiable computational evidence:
- Raw data preservation and accessibility
- Complete computational workflows
- Intermediate results and checkpoints
- Statistical analyses and visualizations

### 2.3 Logical Traceability
Clear relationships between inputs, processes, and outputs:
- Dependency mapping of all computational components
- Data flow documentation
- Process sequencing and timing
- Error handling and validation procedures

### 2.4 Environmental Documentation
Complete recording of computational environment:
- Operating system specifications
- Software versions and dependencies
- Hardware configurations
- Runtime parameters and settings

### 2.5 Provenance Tracking
Full history of data transformations and analysis steps:
- Data lineage documentation
- Transformation logs
- Analysis decision points
- Quality control measures

## 3. Crisis Management Framework

### 3.1 Risk Assessment
Research teams must identify potential vulnerabilities:
- Single points of failure in computational workflows
- Personnel dependencies and knowledge silos
- Infrastructure vulnerabilities
- Data loss scenarios

### 3.2 Preparedness Measures
Proactive steps to ensure research continuity:
- Distributed backup systems
- Documentation standardization
- Cross-training of team members
- Emergency contact protocols

### 3.3 Response Procedures
Immediate actions during crisis situations:
- Damage assessment protocols
- Communication procedures
- Resource reallocation strategies
- Temporary workflow modifications

### 3.4 Recovery Operations
Steps to restore full research capabilities:
- System restoration procedures
- Data recovery protocols
- Workflow validation processes
- Performance monitoring

## 4. Implementation Guidelines

### 4.1 Version Control Systems
Mandatory use of distributed version control:
- Git repositories for all code
- Branching strategies for collaborative development
- Tag-based release management
- Automated backup procedures

### 4.2 Dependency Management
Systematic tracking of software dependencies:
- Package managers (pip, conda, npm)
- Virtual environments
- Dependency lock files
- Regular security updates

### 4.3 Containerization
Isolation and portability of computational environments:
- Docker containers for reproducibility
- Singularity for HPC environments
- Container registries for distribution
- Automated container builds

### 4.4 Documentation Systems
Comprehensive documentation frameworks:
- README files with clear instructions
- API documentation
- User guides and tutorials
- Troubleshooting guides

### 4.5 Testing and Validation
Systematic verification of computational correctness:
- Unit tests for individual components
- Integration tests for workflows
- Regression tests for stability
- Performance benchmarks

### 4.6 Continuous Integration/Deployment
Automated quality assurance:
- Automated testing pipelines
- Code quality checks
- Security vulnerability scanning
- Deployment automation

## 5. Data Management and FAIR Principles

### 5.1 Findability
Data and software must be easily discoverable:
- Persistent identifiers (DOIs, ORCIDs)
- Rich metadata descriptions
- Searchable repositories
- Clear naming conventions

### 5.2 Accessibility
Open and standardized access protocols:
- Standard data formats
- Open source licensing
- API-based access
- Authentication systems

### 5.3 Interoperability
Compatibility across systems and platforms:
- Standard data formats
- Common vocabularies
- Protocol standardization
- Cross-platform compatibility

### 5.4 Reusability
Clear licensing and documentation for reuse:
- Open source licenses
- Usage documentation
- Example implementations
- Community support

## 6. Team Organization and Communication

### 6.1 Roles and Responsibilities
Clear definition of team member roles:
- Principal Investigator oversight
- Data steward responsibilities
- Software developer duties
- System administrator tasks

### 6.2 Communication Protocols
Established channels for team coordination:
- Regular team meetings
- Documentation standards
- Issue tracking systems
- Emergency contact procedures

### 6.3 Knowledge Management
Systematic capture and sharing of institutional knowledge:
- Documentation repositories
- Training materials
- Best practice guides
- Lessons learned databases

## 7. Compliance and Quality Assurance

### 7.1 Regulatory Compliance
Adherence to relevant standards and regulations:
- Data protection regulations
- Institutional policies
- Funding agency requirements
- Publication standards

### 7.2 Quality Metrics
Measurable indicators of ECM compliance:
- Documentation completeness scores
- Test coverage percentages
- Reproducibility success rates
- Response time metrics

### 7.3 Audit Procedures
Regular assessment of ECM implementation:
- Self-assessment checklists
- Peer review processes
- External audits
- Continuous improvement cycles

## 8. Technology Stack Recommendations

### 8.1 Core Technologies
Essential tools for ECM implementation:
- Git for version control
- Docker for containerization
- Jupyter for interactive analysis
- GitHub/GitLab for collaboration

### 8.2 Language-Specific Tools
Recommendations by programming language:
- Python: pip, conda, pytest, sphinx
- R: packrat, testthat, roxygen2
- JavaScript: npm, jest, jsdoc
- Java: Maven, JUnit, Javadoc

### 8.3 Infrastructure Components
Supporting infrastructure for ECM:
- Cloud storage solutions
- Continuous integration platforms
- Container registries
- Monitoring systems

## 9. Training and Education

### 9.1 Skill Development
Essential competencies for team members:
- Version control proficiency
- Documentation writing
- Testing methodologies
- Containerization concepts

### 9.2 Training Programs
Structured learning pathways:
- Onboarding procedures
- Regular skill updates
- Cross-training initiatives
- External workshop participation

## 10. Conclusion

The Emergency Operations Plan for research software provides a comprehensive framework for ensuring computational research continuity during adverse conditions. By implementing ECM principles systematically, research teams can build resilient, transparent, and reproducible computational workflows that withstand various challenges and disruptions.

The key to successful EOP implementation lies in proactive planning, systematic documentation, and regular practice of emergency procedures. Research teams that invest in these preparedness measures will find themselves better equipped to handle crises while maintaining the integrity and continuity of their scientific work.
        """
        
        # Store the EOP document
        self.documents['EOP_draft_v1'] = {
            'title': 'Emergency Operations Plan (EOP) for Research Software - Draft v1',
            'content': eop_content,
            'type': 'guideline',
            'version': '1.0',
            'last_updated': '2024-10-28'
        }
        
        # Additional ECM Guidelines
        ecm_guidelines = """
# Evidence Chain Model (ECM) Implementation Guidelines

## Quick Start Checklist

### Phase 1: Foundation (Week 1-2)
- [ ] Set up Git repository
- [ ] Create README.md with project description
- [ ] Initialize virtual environment
- [ ] Create requirements.txt or environment.yml
- [ ] Set up basic project structure

### Phase 2: Documentation (Week 3-4)
- [ ] Document all functions and classes
- [ ] Create user guide
- [ ] Write installation instructions
- [ ] Document data sources and formats
- [ ] Create troubleshooting guide

### Phase 3: Testing (Week 5-6)
- [ ] Write unit tests for core functions
- [ ] Set up integration tests
- [ ] Create test data sets
- [ ] Implement continuous integration
- [ ] Add code coverage reporting

### Phase 4: Reproducibility (Week 7-8)
- [ ] Containerize the application
- [ ] Create reproducible examples
- [ ] Test on different systems
- [ ] Document system requirements
- [ ] Create deployment guide

## Common Implementation Patterns

### Repository Structure
```
project/
├── README.md
├── requirements.txt
├── environment.yml
├── Dockerfile
├── src/
│   ├── __init__.py
│   ├── data/
│   ├── models/
│   └── utils/
├── tests/
├── docs/
├── examples/
└── data/
    ├── raw/
    ├── processed/
    └── external/
```

### Documentation Templates
- README template with all essential sections
- Function documentation with examples
- API documentation with usage patterns
- Troubleshooting guides with common issues

### Testing Strategies
- Unit tests for individual functions
- Integration tests for workflows
- Data validation tests
- Performance benchmarks
        """
        
        self.documents['ECM_Guidelines'] = {
            'title': 'Evidence Chain Model Implementation Guidelines',
            'content': ecm_guidelines,
            'type': 'guideline',
            'version': '1.0',
            'last_updated': '2024-10-28'
        }
    
    def get_document(self, doc_id: str) -> Dict[str, Any]:
        """Get a specific document by ID"""
        return self.documents.get(doc_id, {})
    
    def get_all_documents(self) -> Dict[str, Any]:
        """Get all documents in the knowledge base"""
        return self.documents
    
    def search_documents(self, query: str) -> List[Dict[str, Any]]:
        """Search for documents containing the query"""
        results = []
        query_lower = query.lower()
        
        for doc_id, doc in self.documents.items():
            if (query_lower in doc['title'].lower() or 
                query_lower in doc['content'].lower()):
                results.append({
                    'id': doc_id,
                    'title': doc['title'],
                    'type': doc['type'],
                    'relevance': doc['content'].lower().count(query_lower)
                })
        
        # Sort by relevance
        results.sort(key=lambda x: x['relevance'], reverse=True)
        return results
    
    def get_document_content(self, doc_id: str) -> str:
        """Get the content of a specific document"""
        doc = self.documents.get(doc_id, {})
        return doc.get('content', '')
    
    def get_knowledge_base_info(self) -> Dict[str, Any]:
        """Get information about the knowledge base"""
        return {
            'total_documents': len(self.documents),
            'document_types': list(set(doc['type'] for doc in self.documents.values())),
            'documents': [
                {
                    'id': doc_id,
                    'title': doc['title'],
                    'type': doc['type'],
                    'version': doc['version']
                }
                for doc_id, doc in self.documents.items()
            ]
        }

# Global instance
knowledge_base = KnowledgeBase()
