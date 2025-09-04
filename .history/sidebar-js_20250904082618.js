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

    // Enable click-to-place mode as drag and drop fallback
    enableClickToPlace(type) {
        console.log('Click-to-place mode enabled for:', type);
        
        // Change cursor
        const canvas = document.getElementById('canvas');
        canvas.style.cursor = 'crosshair';
        
        // Add instruction
        this.showInstruction(`Click on the canvas to place a ${type}`);
        
        // Add one-time click listener to canvas
        const placeElement = (e) => {
            if (e.target === canvas || e.target.classList.contains('grid-line')) {
                const rect = canvas.getBoundingClientRect();
                const x = snapToGrid(e.clientX - rect.left);
                const y = snapToGrid(e.clientY - rect.top);
                
                console.log('Placing element at:', x, y);
                
                // Create and add element
                const newElement = window.elementManager.createElement(type, x, y);
                const newElements = window.elementManager.addElement(newElement);
                window.historyManager.addToHistory(newElements);
                saveToLocalStorage(newElements, window.canvasManager.columns);
                window.canvasManager.render();
                
                // Reset cursor and remove listeners
                canvas.style.cursor = '';
                canvas.removeEventListener('click', placeElement);
                this.hideInstruction();
                
                console.log('Element placed successfully!');
            }
        };
        
        canvas.addEventListener('click', placeElement);
        
        // Allow escape to cancel
        const cancelPlace = (e) => {
            if (e.key === 'Escape') {
                canvas.style.cursor = '';
                canvas.removeEventListener('click', placeElement);
                document.removeEventListener('keydown', cancelPlace);
                this.hideInstruction();
                console.log('Click-to-place cancelled');
            }
        };
        
        document.addEventListener('keydown', cancelPlace);
    }

    // Show instruction message
    showInstruction(message) {
        let instruction = document.getElementById('instruction-message');
        if (!instruction) {
            instruction = document.createElement('div');
            instruction.id = 'instruction-message';
            instruction.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg z-50';
            document.body.appendChild(instruction);
        }
        instruction.textContent = message + ' (Press Escape to cancel)';
    }

    // Hide instruction message
    hideInstruction() {
        const instruction = document.getElementById('instruction-message');
        if (instruction) {
            instruction.remove();
        }
    }
}