// canvas.js - Canvas Management

class CanvasManager {
    constructor(elementManager, historyManager) {
        this.elementManager = elementManager;
        this.historyManager = historyManager;
        this.canvas = document.getElementById('canvas');
        this.draggedType = null;
        this.draggedElement = null;
        this.dragOffset = { x: 0, y: 0 };
        this.columns = 12;
        
        this.initializeCanvas();
    }

    // Initialize canvas event listeners
    initializeCanvas() {
        this.canvas.addEventListener('click', (e) => this.handleCanvasClick(e));
        this.canvas.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.canvas.addEventListener('drop', (e) => this.handleDrop(e));
    }

    // Handle canvas click
    handleCanvasClick(e) {
        if (e.target === this.canvas) {
            this.elementManager.clearSelection();
            this.render();
            window.propertiesManager.updatePropertiesPanel();
        }
    }

    // Handle drag over
    handleDragOver(e) {
        e.preventDefault();
    }

    // Handle drop
    handleDrop(e) {
        e.preventDefault();
        
        const rect = this.canvas.getBoundingClientRect();
        const x = snapToGrid(e.clientX - rect.left);
        const y = snapToGrid(e.clientY - rect.top);

        if (this.draggedType) {
            // Create new element from sidebar
            const newElement = this.elementManager.createElement(this.draggedType, x, y);
            const newElements = this.elementManager.addElement(newElement);
            this.historyManager.addToHistory(newElements);
            saveToLocalStorage(newElements, this.columns);
            this.render();
        } else if (this.draggedElement) {
            // Move existing element
            const newElements = this.elementManager.updateElement(this.draggedElement.id, {
                x: x - this.dragOffset.x,
                y: y - this.dragOffset.y
            });
            this.historyManager.addToHistory(newElements);
            saveToLocalStorage(newElements, this.columns);
            this.render();
        }

        this.draggedType = null;
        this.draggedElement = null;
    }

    // Set dragged type from sidebar
    setDraggedType(type) {
        this.draggedType = type;
    }

    // Update columns and grid
    updateColumns(columns) {
        this.columns = columns;
        const columnWidth = 100 / columns;
        this.canvas.style.backgroundImage = `repeating-linear-gradient(90deg, transparent, transparent calc(${columnWidth}% - 1px), #e5e7eb calc(${columnWidth}% - 1px), #e5e7eb ${columnWidth}%)`;
        
        // Update grid lines
        this.renderGridLines();
    }

    // Render grid lines
    renderGridLines() {
        // Remove existing grid lines
        const existingLines = this.canvas.querySelectorAll('.grid-line');
        existingLines.forEach(line => line.remove());

        // Add new grid lines
        for (let i = 0; i <= this.columns; i++) {
            const line = document.createElement('div');
            line.className = 'grid-line absolute top-0 bottom-0 border-l border-gray-300 pointer-events-none';
            line.style.left = `${(i / this.columns) * 100}%`;
            this.canvas.appendChild(line);
        }
    }

    // Create element HTML
    createElementHTML(element) {
        const elementDiv = document.createElement('div');
        elementDiv.id = `element-${element.id}`;
        elementDiv.className = `absolute cursor-move border-solid ${getAnimationClass(element.animation.type)}`;
        elementDiv.draggable = true;
        elementDiv.tabIndex = 0;

        // Apply styles
        const borderRadius = element.type === 'circle' ? '50%' : `${element.borderRadius}px`;
        
        elementDiv.style.cssText = `
            width: ${element.width}px;
            height: ${element.height}px;
            left: ${element.x}px;
            top: ${element.y}px;
            background-color: ${element.backgroundColor};
            border-color: ${element.borderColor};
            border-width: ${element.borderWidth}px;
            border-radius: ${borderRadius};
            padding: ${element.padding}px;
            margin: ${element.margin}px;
            z-index: ${element.zIndex};
            transform: rotate(${element.angle}deg);
        `;

        // Add content based on type
        elementDiv.innerHTML = this.getElementContent(element);

        // Add event listeners
        this.addElementEventListeners(elementDiv, element);

        return elementDiv;
    }

    // Get element content based on type
    getElementContent(element) {
        switch (element.type) {
            case 'text':
                return `<div class="w-full h-full flex items-center justify-center text-gray-800" style="font-size: ${element.fontSize}px">${element.textContent || 'Text'}</div>`;
            case 'button':
                return `<button class="w-full h-full text-white font-medium rounded border-0" style="font-size: ${element.fontSize}px">${element.textContent || 'Button'}</button>`;
            case 'image':
                return `<div class="w-full h-full bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500">
                    <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                    </svg>
                </div>`;
            case 'card':
                return `<div class="w-full h-full bg-white rounded-lg shadow-md p-4 border">
                    <div class="text-sm text-gray-600">${element.textContent || 'Card Content'}</div>
                </div>`;
            case 'circle':
                return '<div class="w-full h-full rounded-full"></div>';
            default:
                return '<div class="w-full h-full"></div>';
        }
    }

    // Add event listeners to element
    addElementEventListeners(elementDiv, element) {
        // Click to select
        elementDiv.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            this.elementManager.selectElement(element.id);
            this.render();
            window.propertiesManager.updatePropertiesPanel();
        });

        // Drag start
        elementDiv.addEventListener('dragstart', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.draggedElement = element;
            this.dragOffset = {
                x: e.clientX - rect.left - element.x,
                y: e.clientY - rect.top - element.y
            };
        });

        // Keyboard events
        elementDiv.addEventListener('keydown', (e) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                this.deleteSelectedElement();
            }
        });
    }

    // Delete selected element
    deleteSelectedElement() {
        if (this.elementManager.selectedElementId) {
            const newElements = this.elementManager.deleteElement(this.elementManager.selectedElementId);
            this.historyManager.addToHistory(newElements);
            saveToLocalStorage(newElements, this.columns);
            this.render();
            window.propertiesManager.updatePropertiesPanel();
        }
    }

    // Add selection indicators
    addSelectionIndicators(elementDiv, element) {
        // Delete button
        const deleteBtn = document.createElement('div');
        deleteBtn.className = 'absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer text-xs';
        deleteBtn.innerHTML = '×';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.deleteSelectedElement();
        });
        elementDiv.appendChild(deleteBtn);

        // Resize handle
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'absolute -bottom-2 -right-2 bg-blue-500 rounded-full w-4 h-4 cursor-nw-resize';
        this.addResizeHandlers(resizeHandle, element);
        elementDiv.appendChild(resizeHandle);

        // Rotation handle
        const rotationHandle = document.createElement('div');
        rotationHandle.className = 'absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-500 rounded-full w-4 h-4 cursor-grab';
        this.addRotationHandlers(rotationHandle, element);
        elementDiv.appendChild(rotationHandle);
    }

    // Add resize handlers
    addResizeHandlers(handle, element) {
        handle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = element.width;
            const startHeight = element.height;

            const handleMouseMove = (e) => {
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                
                const newElements = this.elementManager.updateElement(element.id, {
                    width: Math.max(20, startWidth + deltaX),
                    height: Math.max(20, startHeight + deltaY)
                });
                
                this.render();
                window.propertiesManager.updatePropertiesPanel();
            };

            const handleMouseUp = () => {
                const newElements = this.elementManager.getAllElements();
                this.historyManager.addToHistory(newElements);
                saveToLocalStorage(newElements, this.columns);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });
    }

    // Add rotation handlers
    addRotationHandlers(handle, element) {
        handle.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            const centerX = element.x + element.width / 2;
            const centerY = element.y + element.height / 2;

            const handleMouseMove = (e) => {
                const rect = this.canvas.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;
                
                const angle = Math.atan2(mouseY - centerY, mouseX - centerX) * 180 / Math.PI;
                
                const newElements = this.elementManager.updateElement(element.id, {
                    angle: Math.round(angle)
                });
                
                this.render();
                window.propertiesManager.updatePropertiesPanel();
            };

            const handleMouseUp = () => {
                const newElements = this.elementManager.getAllElements();
                this.historyManager.addToHistory(newElements);
                saveToLocalStorage(newElements, this.columns);
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });
    }

    // Render all elements
    render() {
        // Clear existing elements
        const existingElements = this.canvas.querySelectorAll('[id^="element-"]');
        existingElements.forEach(el => el.remove());

        // Render each element
        this.elementManager.getAllElements().forEach(element => {
            const elementDiv = this.createElementHTML(element);
            
            // Add selection styling
            if (this.elementManager.selectedElementId === element.id) {
                elementDiv.classList.add('ring-2', 'ring-blue-500');
                this.addSelectionIndicators(elementDiv, element);
            }
            
            this.canvas.appendChild(elementDiv);
        });

        // Ensure grid lines are on top
        this.renderGridLines();
    }
}
            