/**
 * RAG (Retrieval-Augmented Generation) System for EOP Paper
 * Provides semantic search and context retrieval from documents
 */

class RAGSystem {
    constructor() {
        this.documents = new Map(); // Store processed documents
        this.chunks = []; // Store document chunks with embeddings
        this.isInitialized = false;
        this.maxChunkSize = 1000; // Characters per chunk
        this.overlapSize = 200; // Overlap between chunks
        this.maxRetrievedChunks = 5; // Number of chunks to retrieve for context
    }

    /**
     * Initialize the RAG system
     */
    async initialize() {
        try {
            console.log('🔧 Initializing RAG System...');
            this.isInitialized = true;
            console.log('✅ RAG System initialized');
        } catch (error) {
            console.error('❌ Failed to initialize RAG system:', error);
            throw error;
        }
    }

    /**
     * Process and index a document
     */
    async processDocument(fileName, content, fileType = 'text') {
        try {
            console.log(`📄 Processing document: ${fileName}`);
            
            let text = '';
            if (fileType === 'pdf') {
                text = await this.extractTextFromPDF(content);
            } else {
                text = content;
            }

            // Clean and normalize text
            text = this.cleanText(text);
            
            // Split into chunks
            const chunks = this.createChunks(text, fileName);
            
            // Store document
            this.documents.set(fileName, {
                content: text,
                chunks: chunks.length,
                processed: new Date().toISOString()
            });

            // Add chunks to the search index
            for (const chunk of chunks) {
                this.chunks.push(chunk);
            }

            console.log(`✅ Processed ${fileName}: ${chunks.length} chunks created`);
            return chunks.length;
        } catch (error) {
            console.error(`❌ Error processing document ${fileName}:`, error);
            throw error;
        }
    }

    /**
     * Extract text from PDF (simplified - in production use PDF.js)
     */
    async extractTextFromPDF(pdfContent) {
        // This is a placeholder - in a real implementation, you'd use PDF.js
        // For now, we'll return a message indicating PDF processing is needed
        return `[PDF Content - ${pdfContent.byteLength} bytes] 
        
This is a placeholder for PDF text extraction. In a production system, this would use PDF.js to extract the actual text content from the PDF file.

To implement full PDF support:
1. Include PDF.js library
2. Parse PDF structure
3. Extract text from each page
4. Maintain formatting and structure

For now, you can:
- Convert PDF to text manually and upload as .txt file
- Use the file upload feature with text content
- Provide key excerpts from the EOP paper directly in chat`;
    }

    /**
     * Clean and normalize text
     */
    cleanText(text) {
        return text
            .replace(/\s+/g, ' ') // Normalize whitespace
            .replace(/\n\s*\n/g, '\n\n') // Clean up line breaks
            .trim();
    }

    /**
     * Create overlapping chunks from text
     */
    createChunks(text, fileName) {
        const chunks = [];
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        
        let currentChunk = '';
        let chunkIndex = 0;

        for (const sentence of sentences) {
            const trimmedSentence = sentence.trim();
            if (!trimmedSentence) continue;

            const potentialChunk = currentChunk + (currentChunk ? '. ' : '') + trimmedSentence;
            
            if (potentialChunk.length > this.maxChunkSize && currentChunk.length > 0) {
                // Create chunk
                chunks.push({
                    id: `${fileName}_chunk_${chunkIndex}`,
                    text: currentChunk + '.',
                    source: fileName,
                    chunkIndex: chunkIndex,
                    length: currentChunk.length
                });
                
                chunkIndex++;
                
                // Start new chunk with overlap
                const words = currentChunk.split(' ');
                const overlapWords = words.slice(-Math.floor(this.overlapSize / 6)); // Approximate word count
                currentChunk = overlapWords.join(' ') + '. ' + trimmedSentence;
            } else {
                currentChunk = potentialChunk;
            }
        }

        // Add final chunk
        if (currentChunk.trim().length > 0) {
            chunks.push({
                id: `${fileName}_chunk_${chunkIndex}`,
                text: currentChunk + '.',
                source: fileName,
                chunkIndex: chunkIndex,
                length: currentChunk.length
            });
        }

        return chunks;
    }

    /**
     * Search for relevant chunks based on query
     */
    async searchRelevantChunks(query, maxResults = null) {
        if (!this.isInitialized || this.chunks.length === 0) {
            return [];
        }

        const resultsLimit = maxResults || this.maxRetrievedChunks;
        
        // Simple keyword-based search (in production, use semantic embeddings)
        const queryTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 2);
        
        const scoredChunks = this.chunks.map(chunk => {
            const chunkText = chunk.text.toLowerCase();
            let score = 0;
            
            // Calculate relevance score
            for (const term of queryTerms) {
                try {
                    // Escape special regex characters to prevent errors
                    const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const termCount = (chunkText.match(new RegExp(escapedTerm, 'g')) || []).length;
                    score += termCount * (term.length > 4 ? 2 : 1); // Longer terms get higher weight
                } catch (error) {
                    // Fallback to simple string search if regex fails
                    const termCount = (chunkText.split(term).length - 1);
                    score += termCount * (term.length > 4 ? 2 : 1);
                }
            }
            
            // Boost score for exact phrase matches
            if (chunkText.includes(query.toLowerCase())) {
                score += 10;
            }
            
            return { ...chunk, relevanceScore: score };
        });

        // Sort by relevance and return top results
        return scoredChunks
            .filter(chunk => chunk.relevanceScore > 0)
            .sort((a, b) => b.relevanceScore - a.relevanceScore)
            .slice(0, resultsLimit);
    }

    /**
     * Generate context from retrieved chunks
     */
    generateContext(retrievedChunks, query) {
        if (retrievedChunks.length === 0) {
            return '';
        }

        let context = '\n\n## Relevant Information from EOP Paper:\n\n';
        
        retrievedChunks.forEach((chunk, index) => {
            context += `### Reference ${index + 1} (from ${chunk.source}):\n`;
            context += `${chunk.text}\n\n`;
        });

        context += `## Query Context:\n`;
        context += `Based on the above references from the EOP paper, please answer: ${query}\n\n`;
        
        return context;
    }

    /**
     * Get RAG-enhanced response context
     */
    async getEnhancedContext(userQuery) {
        try {
            if (!this.isInitialized || this.chunks.length === 0) {
                return {
                    context: '',
                    sources: [],
                    chunks: 0,
                    message: 'RAG system not initialized or no documents loaded.'
                };
            }

            // Sanitize the user query to prevent regex issues
            const sanitizedQuery = userQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            
            const relevantChunks = await this.searchRelevantChunks(userQuery);
            
            if (relevantChunks.length === 0) {
                return {
                    context: '',
                    sources: [],
                    chunks: 0,
                    message: 'No relevant information found in the indexed documents.'
                };
            }

            const context = this.generateContext(relevantChunks, userQuery);
            const sources = [...new Set(relevantChunks.map(chunk => chunk.source))];

            return {
                context: context,
                sources: sources,
                chunks: relevantChunks.length,
                message: `Found ${relevantChunks.length} relevant sections from ${sources.length} document(s).`
            };
        } catch (error) {
            console.error('❌ Error in RAG context generation:', error);
            return {
                context: '',
                sources: [],
                chunks: 0,
                message: `Error retrieving context: ${error.message}`
            };
        }
    }

    /**
     * Get system status
     */
    getStatus() {
        return {
            initialized: this.isInitialized,
            documentsCount: this.documents.size,
            chunksCount: this.chunks.length,
            documents: Array.from(this.documents.keys())
        };
    }

    /**
     * Clear all indexed documents
     */
    clearIndex() {
        this.documents.clear();
        this.chunks = [];
        console.log('🗑️ RAG index cleared');
    }
}

// Export for use in main application
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RAGSystem;
} else {
    window.RAGSystem = RAGSystem;
}
