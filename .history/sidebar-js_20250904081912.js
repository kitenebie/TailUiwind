// sidebar.js - Sidebar Management

class SidebarManager {
    constructor() {
        this.initializeEventListeners();
    }

    // Initialize sidebar event listeners
    initializeEventListeners() {
        const shapeItems = document.querySelectorAll('.shape-item');
        
        shapeItems.forEach(item => {
            // Handle drag start
            item.addEventListener('dragstart', (e) => {
                const type = item.getAttribute('data-type');
                window.canvasManager.setDraggedType(type);
                
                // Visual feedback
                item.classList.add('opacity-50');
            });

            // Handle drag end
            item.addEventListener('dragend', (e) => {
                // Remove visual feedback
                item.classList.remove('opacity-50');
            });

            // Add hover effects
            item.addEventListener('mouseenter', () => {
                item.classList.add('scale-105', 'shadow-lg');
            });

            item.addEventListener('mouseleave', () => {
                item.classList.remove('scale-105', 'shadow-lg');
            });
        });
    }

    // Add pulsing animation to indicate drag availability
    addDragHint() {
        const shapeItems = document.querySelectorAll('.shape-item');
        shapeItems.forEach(item => {
            item.classList.add('animate-pulse');
        });

        // Remove hint after a few seconds
        setTimeout(() => {
            shapeItems.forEach(item => {
                item.classList.remove('animate-pulse');
            });
        }, 3000);
    }

    // Highlight specific shape type
    highlightShape(type) {
        const shapeItem = document.querySelector(`[data-type="${type}"]`);
        if (shapeItem) {
            shapeItem.classList.add('ring-2', 'ring-blue-500');
            setTimeout(() => {
                shapeItem.classList.remove('ring-2', 'ring-blue-500');
            }, 1000);
        }
    }
}