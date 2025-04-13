// Import all JavaScript files
import './config.js';

// We need to make the classes globally available
// since the original code expects them to be in the global scope
document.addEventListener('DOMContentLoaded', () => {
    // First, load the Auth class
    const authScript = document.createElement('script');
    authScript.src = 'js/auth.js';
    authScript.onload = () => {
        // Then load the JSONEditor class
        const editorScript = document.createElement('script');
        editorScript.src = 'js/editor.js';
        editorScript.onload = () => {
            // Finally load the App class and initialize it
            const appScript = document.createElement('script');
            appScript.src = 'js/app.js';
            document.head.appendChild(appScript);
        };
        document.head.appendChild(editorScript);
    };
    document.head.appendChild(authScript);

    console.log('Application initialized with environment variables');
});
