// JSON Editor Module
class JSONEditor {
    constructor() {
        this.editor = document.getElementById('jsonEditor');
        this.errorContainer = document.getElementById('errorContainer');
        this.formatBtn = document.getElementById('formatBtn');
        this.validateBtn = document.getElementById('validateBtn');
        this.newBtn = document.getElementById('newBtn');
        this.saveBtn = document.getElementById('saveBtn');
        this.loadBtn = document.getElementById('loadBtn');
        this.documentsModal = document.getElementById('documentsModal');
        this.documentsList = document.getElementById('documentsList');
        this.closeBtns = document.querySelectorAll('.close-btn');

        this.currentDocumentId = null;
        this.currentDocumentTitle = 'Untitled Document';
        this.originalContent = null; // Store original content to track changes
        this.isDocumentModified = false;

        this.init();
    }

    init() {
        // Set initial content
        this.setDefaultContent();

        // Add event listeners
        this.formatBtn.addEventListener('click', () => this.formatJSON());
        this.validateBtn.addEventListener('click', () => this.validateJSON());
        this.newBtn.addEventListener('click', () => this.newDocument());
        this.saveBtn.addEventListener('click', () => this.saveDocument());
        this.loadBtn.addEventListener('click', () => this.openDocumentsModal());

        // Add input event for syntax highlighting and change tracking
        this.editor.addEventListener('input', () => {
            this.highlightSyntax();
            this.checkForChanges();
        });

        // Close modal
        this.closeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.documentsModal.classList.add('hidden');
            });
        });

        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === this.documentsModal) {
                this.documentsModal.classList.add('hidden');
            }
        });

        // Listen for authentication events
        document.addEventListener('userAuthenticated', (e) => {
            console.log('Editor received userAuthenticated event:', e.detail);
            // Update save button state
            this.saveBtn.disabled = false;
        });

        document.addEventListener('userLoggedOut', () => {
            console.log('Editor received userLoggedOut event');
            // Update save button state
            this.saveBtn.disabled = true;
            // Reset current document
            this.currentDocumentId = null;
            this.currentDocumentTitle = 'Untitled Document';
            this.originalContent = null;
            this.isDocumentModified = false;
            this.updateDocumentStatus();
        });

        // Add window beforeunload event to warn about unsaved changes
        window.addEventListener('beforeunload', (e) => {
            if (this.isDocumentModified) {
                // Standard way to show a confirmation dialog before leaving
                const message = 'You have unsaved changes. Are you sure you want to leave?';
                e.preventDefault();
                // For modern browsers
                e.returnValue = message;
                // For older browsers
                return message;
            }
        });

        // Initial syntax highlighting
        this.highlightSyntax();

        // Create document status indicator in toolbar
        this.createStatusIndicator();
    }

    createStatusIndicator() {
        // Create a status indicator element if it doesn't exist
        if (!document.getElementById('documentStatus')) {
            const toolbar = document.querySelector('.toolbar');
            const statusIndicator = document.createElement('div');
            statusIndicator.id = 'documentStatus';
            statusIndicator.className = 'document-status';
            toolbar.appendChild(statusIndicator);
        }

        // Initialize status
        this.updateDocumentStatus();
    }

    updateDocumentStatus() {
        const statusIndicator = document.getElementById('documentStatus');
        if (!statusIndicator) return;

        if (this.isDocumentModified) {
            statusIndicator.textContent = 'Modified';
            statusIndicator.className = 'document-status modified';
            // Also update the document title with an asterisk
            document.title = `* ${this.currentDocumentTitle} - JSON Editor`;
        } else {
            statusIndicator.textContent = this.currentDocumentId ? 'Saved' : 'New';
            statusIndicator.className = 'document-status';
            // Update the document title without asterisk
            document.title = `${this.currentDocumentTitle} - JSON Editor`;
        }
    }

    checkForChanges() {
        if (this.originalContent === null) return;

        const currentContent = this.getContent();
        const wasModified = this.isDocumentModified;

        // Check if content has changed from original
        this.isDocumentModified = currentContent !== this.originalContent;

        // Only update UI if modification state has changed
        if (wasModified !== this.isDocumentModified) {
            this.updateDocumentStatus();
        }
    }

    setDefaultContent() {
        const defaultJSON = {
            "example": "This is a JSON editor",
            "instructions": "Edit this JSON or create a new one",
            "features": [
                "Syntax highlighting",
                "Validation",
                "Formatting",
                "Save to Supabase"
            ],
            "version": 1.0
        };

        const content = JSON.stringify(defaultJSON, null, 2);
        this.editor.textContent = content;
        this.currentDocumentId = null;
        this.currentDocumentTitle = 'Untitled Document';

        // Set original content for change tracking
        this.originalContent = content;
        this.isDocumentModified = false;
        this.updateDocumentStatus();
    }

    getContent() {
        return this.editor.textContent || '';
    }

    setContent(content) {
        // Ensure content is a string
        content = String(content || '');

        // Set the content
        this.editor.textContent = content;

        // Apply syntax highlighting
        this.highlightSyntax();
    }

    validateJSON() {
        try {
            // Get content and normalize it
            let content = this.getContent();

            // Normalize content to handle potential encoding issues
            content = this.normalizeContent(content);

            // Check for common issues before parsing
            if (content.startsWith(':')) {
                throw new Error('JSON cannot start with a colon. Remove the colon at the beginning.');
            }

            if (content.startsWith(',')) {
                throw new Error('JSON cannot start with a comma. Remove the comma at the beginning.');
            }

            // Try to parse the JSON
            JSON.parse(content);

            this.errorContainer.classList.add('hidden');
            this.errorContainer.textContent = '';

            showNotification('JSON is valid!', 'success');
            return true;
        } catch (error) {
            this.errorContainer.classList.remove('hidden');

            // Provide more helpful error messages
            let errorMessage = error.message;

            // Add line and column indicators for better debugging
            if (errorMessage.includes('position')) {
                const match = errorMessage.match(/position (\d+)/i);
                if (match && match[1]) {
                    const position = parseInt(match[1]);
                    const content = this.getContent();

                    // Calculate line and column
                    let line = 1;
                    let column = 0;
                    for (let i = 0; i < position && i < content.length; i++) {
                        column++;
                        if (content[i] === '\n') {
                            line++;
                            column = 0;
                        }
                    }

                    errorMessage = `${errorMessage} (line ${line}, column ${column})`;

                    // Highlight the error in the editor
                    this.highlightError(line, column);
                }
            }

            this.errorContainer.textContent = `Error: ${errorMessage}`;
            showNotification('Invalid JSON. Please check for errors.', 'error');
            return false;
        }
    }

    // Helper method to normalize content and handle encoding issues
    normalizeContent(content) {
        if (!content) return '';

        // Trim whitespace
        content = content.trim();

        // Remove BOM if present
        if (content.charCodeAt(0) === 0xFEFF) {
            content = content.slice(1);
        }

        // Replace any non-printable characters except whitespace
        content = content.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, '');

        // Normalize line endings to \n
        content = content.replace(/\r\n|\r/g, '\n');

        return content;
    }

    highlightError(line, column) {
        // This is a simple implementation to highlight errors
        // In a production app, you might want a more sophisticated approach
        const content = this.getContent();
        const lines = content.split('\n');

        if (line > 0 && line <= lines.length) {
            const errorLine = lines[line - 1];
            const beforeError = errorLine.substring(0, column - 1);
            const errorChar = errorLine.substring(column - 1, column) || ' ';
            const afterError = errorLine.substring(column);

            // Create a highlighted version of the line with the error
            const highlightedLine = `${beforeError}<span style="background-color: #ffcccc; color: red; font-weight: bold;">${errorChar}</span>${afterError}`;
            lines[line - 1] = highlightedLine;

            // Add an error indicator
            const errorIndicator = `<div style="color: red; margin-top: 5px;">Error at line ${line}, column ${column}</div>`;

            // Display in error container
            this.errorContainer.innerHTML = `Error in JSON: ${errorIndicator}`;
        }
    }

    formatJSON() {
        try {
            // Get content and normalize it
            let content = this.getContent();
            content = this.normalizeContent(content);

            // Check for and fix common issues before parsing
            if (content.startsWith(':')) {
                content = content.substring(1).trim();
                showNotification('Removed leading colon before formatting', 'warning');
            }

            if (content.startsWith(',')) {
                content = content.substring(1).trim();
                showNotification('Removed leading comma before formatting', 'warning');
            }

            // Try to clean up any potential invisible characters
            try {
                // First attempt to parse as is
                JSON.parse(content);
            } catch (e) {
                // If that fails, try a more aggressive cleanup
                // Replace all non-ASCII characters
                const cleanedContent = content.replace(/[^\x20-\x7E\n\r\t]/g, '');
                content = cleanedContent;
                showNotification('Removed some non-standard characters', 'warning');
            }

            // Try to parse the JSON
            const parsedJSON = JSON.parse(content);
            const formattedJSON = JSON.stringify(parsedJSON, null, 2);

            this.setContent(formattedJSON);
            this.errorContainer.classList.add('hidden');
            showNotification('JSON formatted successfully!', 'success');
        } catch (error) {
            // If validation fails, show detailed error
            this.validateJSON(); // This will show detailed error information
            showNotification('Cannot format invalid JSON. Please fix errors first.', 'error');
        }
    }

    highlightSyntax() {
        try {
            // Get content and normalize it
            let content = this.getContent();

            // Only attempt to highlight if content is not empty
            if (content.trim()) {
                // Normalize content to handle potential encoding issues
                content = this.normalizeContent(content);

                // Check for common issues that would prevent parsing
                if (content.startsWith(':') || content.startsWith(',')) {
                    // Don't try to highlight invalid JSON with leading colon or comma
                    return;
                }

                // Try to parse the JSON, with a fallback for invisible characters
                let parsedJSON;
                try {
                    parsedJSON = JSON.parse(content);
                } catch (e) {
                    // If parsing fails, try more aggressive cleaning before giving up
                    try {
                        // Replace all non-ASCII characters
                        const cleanedContent = content.replace(/[^\x20-\x7E\n\r\t]/g, '');
                        parsedJSON = JSON.parse(cleanedContent);
                        // If we get here, the cleaning worked
                        content = cleanedContent;
                    } catch (e2) {
                        // Still failed, give up on highlighting
                        return;
                    }
                }

                // Create highlighted HTML
                const highlightedHTML = this.syntaxHighlight(JSON.stringify(parsedJSON, null, 2));

                // Temporarily remove event listener to prevent infinite loop
                this.editor.removeEventListener('input', this.highlightSyntax);

                // Save cursor position
                const selection = window.getSelection();
                let cursorOffset = 0;

                try {
                    const range = selection.getRangeAt(0);
                    cursorOffset = range.startOffset;
                } catch (e) {
                    // If there's no range, just use 0
                }

                // Update content with highlighted HTML
                this.editor.innerHTML = highlightedHTML;

                // Restore cursor position (approximate)
                this.placeCursorApproximately(cursorOffset);

                // Re-add event listener
                this.editor.addEventListener('input', () => this.highlightSyntax());

                // Hide error container
                this.errorContainer.classList.add('hidden');
            }
        } catch (error) {
            // If JSON is invalid, don't apply highlighting
            // But don't show error here to avoid constant error messages while typing
            console.log('Highlighting error:', error);
        }
    }

    syntaxHighlight(json) {
        // Replace with regex to add spans for syntax highlighting
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'number';

            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                    // Remove the colon from the match for styling
                    match = match.replace(/:$/, '');
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }

            // Add the colon back if it was a key
            if (cls === 'key') {
                return '<span class="' + cls + '">' + match + '</span>:';
            }

            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    placeCursorApproximately(offset) {
        // This is a simplified approach to place cursor
        // In a production app, you'd want a more sophisticated approach
        const selection = window.getSelection();
        const range = document.createRange();

        // Try to place cursor at the right position
        try {
            if (this.editor.childNodes.length > 0) {
                // Find the right text node and position
                let currentOffset = 0;
                let targetNode = null;
                let targetOffset = 0;

                const findNode = (node) => {
                    if (node.nodeType === Node.TEXT_NODE) {
                        if (currentOffset + node.length >= offset) {
                            targetNode = node;
                            targetOffset = offset - currentOffset;
                            return true;
                        }
                        currentOffset += node.length;
                    } else {
                        for (let i = 0; i < node.childNodes.length; i++) {
                            if (findNode(node.childNodes[i])) {
                                return true;
                            }
                        }
                    }
                    return false;
                };

                findNode(this.editor);

                if (targetNode) {
                    range.setStart(targetNode, Math.min(targetOffset, targetNode.length));
                    range.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range);
                } else {
                    // Fallback: place at the end
                    this.placeCursorAtEnd();
                }
            } else {
                this.placeCursorAtEnd();
            }
        } catch (e) {
            // Fallback if anything goes wrong
            this.placeCursorAtEnd();
        }
    }

    placeCursorAtEnd() {
        const selection = window.getSelection();
        const range = document.createRange();

        range.selectNodeContents(this.editor);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    }

    newDocument() {
        // Check if current document has unsaved changes
        if (this.currentDocumentId) {
            if (confirm('Create a new document? Any unsaved changes will be lost.')) {
                this.setDefaultContent();
            }
        } else {
            this.setDefaultContent();
        }
    }

    async saveDocument() {
        // Check if user is authenticated
        if (!window.auth.isAuthenticated()) {
            showNotification('Please login to save documents', 'error');
            window.auth.openAuthModal('login');
            return;
        }

        // Validate JSON before saving
        if (!this.validateJSON()) {
            return;
        }

        // If document is not modified and already has an ID, no need to save
        if (!this.isDocumentModified && this.currentDocumentId) {
            showNotification('No changes to save', 'info');
            return;
        }

        // Get document title
        let title = prompt('Enter a title for your document:', this.currentDocumentTitle);

        if (!title) {
            // User cancelled
            return;
        }

        // Trim and set default if empty
        title = title.trim() || 'Untitled Document';
        this.currentDocumentTitle = title;

        const content = this.getContent();
        const user = window.auth.getCurrentUser();

        // Debug user information
        console.log('Current user:', user);

        if (!user || !user.id) {
            showNotification('User ID not found. Please log out and log in again.', 'error');
            return;
        }

        const userId = user.id;

        try {
            // Debug the data we're sending
            console.log('Saving document with:', { title, content: content.substring(0, 50) + '...', userId });

            let result;

            if (this.currentDocumentId) {
                // Update existing document
                result = await supabase
                    .from(DOCUMENTS_TABLE)
                    .update({
                        title,
                        content,
                        updated_at: new Date()
                    })
                    .eq('id', this.currentDocumentId)
                    .eq('user_id', userId);
            } else {
                // Create new document
                result = await supabase
                    .from(DOCUMENTS_TABLE)
                    .insert({
                        title,
                        content,
                        user_id: userId
                    })
                    .select();
            }

            // Debug the result
            console.log('Supabase result:', result);

            if (result.error) throw result.error;

            if (!this.currentDocumentId && result.data && result.data[0]) {
                this.currentDocumentId = result.data[0].id;
            }

            // Update change tracking
            this.originalContent = content;
            this.isDocumentModified = false;
            this.updateDocumentStatus();

            showNotification('Document saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving document:', error);
            showNotification('Error saving document: ' + (error.message || 'Unknown error'), 'error');

            // Show more detailed error information
            if (error.details || error.hint) {
                console.error('Additional error details:', {
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });
            }
        }
    }

    async loadDocuments() {
        // Check if user is authenticated
        if (!window.auth.isAuthenticated()) {
            showNotification('Please login to load documents', 'error');
            window.auth.openAuthModal('login');
            return;
        }

        const userId = window.auth.getCurrentUser().id;

        try {
            const { data, error } = await supabase
                .from(DOCUMENTS_TABLE)
                .select('id, title, created_at, updated_at')
                .eq('user_id', userId)
                .order('updated_at', { ascending: false });

            if (error) throw error;

            return data || [];
        } catch (error) {
            console.error('Error loading documents:', error.message);
            showNotification('Error loading documents: ' + error.message, 'error');
            return [];
        }
    }

    async loadDocument(id) {
        // Check if user is authenticated
        if (!window.auth.isAuthenticated()) {
            showNotification('Please login to load documents', 'error');
            window.auth.openAuthModal('login');
            return;
        }

        // Check for unsaved changes
        if (this.isDocumentModified) {
            if (!confirm('You have unsaved changes. Are you sure you want to load another document?')) {
                return;
            }
        }

        const userId = window.auth.getCurrentUser().id;

        try {
            const { data, error } = await supabase
                .from(DOCUMENTS_TABLE)
                .select('id, title, content')
                .eq('id', id)
                .eq('user_id', userId)
                .single();

            if (error) throw error;

            if (data) {
                // Set content
                this.setContent(data.content);
                this.currentDocumentId = data.id;
                this.currentDocumentTitle = data.title;

                // Set original content for change tracking
                this.originalContent = data.content;
                this.isDocumentModified = false;
                this.updateDocumentStatus();

                showNotification(`Loaded document: ${data.title}`, 'success');
            }
        } catch (error) {
            console.error('Error loading document:', error);
            showNotification('Error loading document: ' + (error.message || 'Unknown error'), 'error');
        }
    }

    async renameDocument(id) {
        // Check if user is authenticated
        if (!window.auth.isAuthenticated()) {
            showNotification('Please login to rename documents', 'error');
            window.auth.openAuthModal('login');
            return;
        }

        try {
            // Get the current document title
            const { data, error } = await supabase
                .from(DOCUMENTS_TABLE)
                .select('title')
                .eq('id', id)
                .eq('user_id', window.auth.getCurrentUser().id)
                .single();

            if (error) throw error;

            if (!data) {
                showNotification('Document not found', 'error');
                return;
            }

            // Prompt for new title
            const newTitle = prompt('Enter a new title for the document:', data.title);

            if (!newTitle || newTitle.trim() === '') {
                // User cancelled or entered empty title
                return;
            }

            // Update the document title
            const { error: updateError } = await supabase
                .from(DOCUMENTS_TABLE)
                .update({
                    title: newTitle.trim(),
                    updated_at: new Date()
                })
                .eq('id', id)
                .eq('user_id', window.auth.getCurrentUser().id);

            if (updateError) throw updateError;

            // Update current document title if this is the current document
            if (id === this.currentDocumentId) {
                this.currentDocumentTitle = newTitle.trim();
            }

            showNotification('Document renamed successfully!', 'success');

            // Refresh documents list
            this.renderDocumentsList();
        } catch (error) {
            console.error('Error renaming document:', error);
            showNotification('Error renaming document: ' + (error.message || 'Unknown error'), 'error');
        }
    }

    async deleteDocument(id) {
        // Check if user is authenticated
        if (!window.auth.isAuthenticated()) {
            showNotification('Please login to delete documents', 'error');
            window.auth.openAuthModal('login');
            return;
        }

        if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
            return;
        }

        const userId = window.auth.getCurrentUser().id;

        try {
            const { error } = await supabase
                .from(DOCUMENTS_TABLE)
                .delete()
                .eq('id', id)
                .eq('user_id', userId);

            if (error) throw error;

            // If the deleted document is the current one, reset
            if (id === this.currentDocumentId) {
                this.setDefaultContent();
            }

            showNotification('Document deleted successfully!', 'success');

            // Refresh documents list
            this.renderDocumentsList();
        } catch (error) {
            console.error('Error deleting document:', error);
            showNotification('Error deleting document: ' + (error.message || 'Unknown error'), 'error');
        }
    }

    async openDocumentsModal() {
        this.documentsModal.classList.remove('hidden');
        await this.renderDocumentsList();
    }

    async renderDocumentsList() {
        const documents = await this.loadDocuments();

        if (documents.length === 0) {
            this.documentsList.innerHTML = '<p>No documents found. Create a new one!</p>';
            return;
        }

        let html = '';

        documents.forEach(doc => {
            const date = new Date(doc.updated_at || doc.created_at).toLocaleString();
            const isCurrentDoc = doc.id === this.currentDocumentId;
            const currentClass = isCurrentDoc ? 'current-document' : '';

            html += `
                <div class="document-item ${currentClass}" data-id="${doc.id}">
                    <div class="document-info">
                        <div class="document-title">${doc.title} ${isCurrentDoc ? '<span class="current-label">(Current)</span>' : ''}</div>
                        <div class="document-date">${date}</div>
                    </div>
                    <div class="document-actions">
                        <button class="load-doc-btn" data-id="${doc.id}" title="Load document"><i class="fas fa-folder-open"></i></button>
                        <button class="edit-doc-btn" data-id="${doc.id}" title="Rename document"><i class="fas fa-edit"></i></button>
                        <button class="delete-doc-btn" data-id="${doc.id}" title="Delete document"><i class="fas fa-trash"></i></button>
                    </div>
                </div>
            `;
        });

        this.documentsList.innerHTML = html;

        // Add event listeners
        document.querySelectorAll('.load-doc-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                this.loadDocument(id);
                this.documentsModal.classList.add('hidden');
            });
        });

        document.querySelectorAll('.edit-doc-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                this.renameDocument(id);
            });
        });

        document.querySelectorAll('.delete-doc-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                this.deleteDocument(id);
            });
        });
    }
}
