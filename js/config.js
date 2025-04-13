// Supabase configuration
// Use import.meta.env for Vite in development, which will be replaced during build
const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || 'https://tdnqlrgmawelafiffuvd.supabase.co';
const SUPABASE_KEY = import.meta.env?.VITE_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkbnFscmdtYXdlbGFmaWZmdXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NDk5MDAsImV4cCI6MjA2MDEyNTkwMH0.OGJnGwWUukiXtNPevBU51_GnfQZveKC9P7_GvJBqmQw';

// Initialize Supabase client
window.supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Table names
window.DOCUMENTS_TABLE = 'json_documents';

// Log configuration status (for debugging)
console.log('Supabase configuration loaded:', {
    url: SUPABASE_URL ? 'Configured' : 'Missing',
    key: SUPABASE_KEY ? 'Configured (length: ' + SUPABASE_KEY.length + ')' : 'Missing'
});
