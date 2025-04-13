// Supabase configuration from environment variables
const SUPABASE_URL = window.ENV?.SUPABASE_URL || '';
const SUPABASE_KEY = window.ENV?.SUPABASE_KEY || '';

// Log configuration (without sensitive data in production)
console.log('Using Supabase URL:', SUPABASE_URL);

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Table names from environment variables
const DOCUMENTS_TABLE = window.ENV?.DOCUMENTS_TABLE || 'json_documents';

// Validate configuration
if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('Missing Supabase configuration. Please check your environment variables.');
    // Show an error message to the user
    document.addEventListener('DOMContentLoaded', () => {
        const errorDiv = document.createElement('div');
        errorDiv.style.position = 'fixed';
        errorDiv.style.top = '0';
        errorDiv.style.left = '0';
        errorDiv.style.right = '0';
        errorDiv.style.padding = '10px';
        errorDiv.style.backgroundColor = '#f8d7da';
        errorDiv.style.color = '#721c24';
        errorDiv.style.textAlign = 'center';
        errorDiv.style.zIndex = '9999';
        errorDiv.textContent = 'Error: Missing Supabase configuration. Please check your environment variables.';
        document.body.prepend(errorDiv);
    });
}
