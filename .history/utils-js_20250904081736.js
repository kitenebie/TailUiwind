// utils.js - Utility Functions

// Snap value to grid
function snapToGrid(value, gridSize = 20) {
    return Math.round(value / gridSize) * gridSize;
}

// Generate unique ID
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Get default element properties
function getDefaultElement(type) {
    const defaults = {
        rectangle: { 
            width: 120, 
            height: 80, 
            backgroundColor: '#3b82f6', 
            textContent: '', 
            borderRadius: 4 
        },
        circle: { 
            width: 80, 
            height: 80, 
            backgroundColor: '#10b981', 
            textContent: '', 
            borderRadius: 40 
        },
        text: { 
            width: 150, 
            height: 40, 
            backgroundColor: 'transparent', 
            textContent: 'Sample Text', 
            fontSize: 16, 
            borderRadius: 0 
        },
        button: { 
            width: 120, 
            height: 40, 
            backgroundColor: '#6366f1', 
            textContent: 'Button', 
            fontSize: 14, 
            borderRadius: 6 
        },
        image: { 
            width: 120, 
            height: 120, 
            backgroundColor: '#f3f4f6', 
            textContent: '', 
            borderRadius: 8 
        },
        card: { 
            width: 200, 
            height: 150, 
            backgroundColor: '#ffffff', 
            textContent: 'Card Content', 
            borderRadius: 12 
        }
    };

    return {
        type,
        ...defaults[type],
        angle: 0,
        colSpan: 2,
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 8,
        margin: 4,
        zIndex: 1,
        animation: {
            type: 'none',
            duration: 1000,
            delay: 0,
            loop: false
        }
    };
}

// Get animation CSS class
function getAnimationClass(animationType) {
    if (animationType === 'none') return '';
    const animationMap = {
        bounce: 'animate-bounce',
        pulse: 'animate-pulse',
        spin: 'animate-spin'
    };
    return animationMap[animationType] || '';
}