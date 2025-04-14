// Supabase configuration
// Use environment variables if available, otherwise fallback to hardcoded values
const SUPABASE_URL = window.ENV?.SUPABASE_URL || 'https://tdnqlrgmawelafiffuvd.supabase.co';
const SUPABASE_KEY = window.ENV?.SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRkbnFscmdtYXdlbGFmaWZmdXZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ1NDk5MDAsImV4cCI6MjA2MDEyNTkwMH0.OGJnGwWUukiXtNPevBU51_GnfQZveKC9P7_GvJBqmQw';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Table names
const DOCUMENTS_TABLE = 'json_documents';
