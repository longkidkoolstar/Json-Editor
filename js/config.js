// Supabase configuration
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Table names
const DOCUMENTS_TABLE = 'json_documents';

// Log configuration status (for debugging)
console.log('Supabase configuration loaded:', {
    url: SUPABASE_URL ? 'Configured' : 'Missing',
    key: SUPABASE_KEY ? 'Configured' : 'Missing'
});
