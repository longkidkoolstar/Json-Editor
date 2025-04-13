// Main Application
class App {
    constructor() {
        // Initialize components
        this.initComponents();
        
        // Create notification container
        this.createNotificationContainer();
    }

    initComponents() {
        // Initialize authentication
        window.auth = new Auth();
        
        // Initialize editor
        window.editor = new JSONEditor();
    }

    createNotificationContainer() {
        // Create notification container if it doesn't exist
        if (!document.getElementById('notificationContainer')) {
            const container = document.createElement('div');
            container.id = 'notificationContainer';
            container.style.position = 'fixed';
            container.style.top = '20px';
            container.style.right = '20px';
            container.style.zIndex = '1000';
            document.body.appendChild(container);
        }
    }

    showNotification(message, type = 'info') {
        const container = document.getElementById('notificationContainer');
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.style.padding = '10px 15px';
        notification.style.marginBottom = '10px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.style.transition = 'all 0.3s ease';
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(50px)';
        
        // Set background color based on type
        switch (type) {
            case 'success':
                notification.style.backgroundColor = '#d4edda';
                notification.style.color = '#155724';
                notification.style.borderLeft = '4px solid #28a745';
                break;
            case 'error':
                notification.style.backgroundColor = '#f8d7da';
                notification.style.color = '#721c24';
                notification.style.borderLeft = '4px solid #dc3545';
                break;
            case 'warning':
                notification.style.backgroundColor = '#fff3cd';
                notification.style.color = '#856404';
                notification.style.borderLeft = '4px solid #ffc107';
                break;
            default:
                notification.style.backgroundColor = '#d1ecf1';
                notification.style.color = '#0c5460';
                notification.style.borderLeft = '4px solid #17a2b8';
        }
        
        // Set message
        notification.textContent = message;
        
        // Add to container
        container.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(50px)';
            
            // Remove from DOM after animation
            setTimeout(() => {
                container.removeChild(notification);
            }, 300);
        }, 5000);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
