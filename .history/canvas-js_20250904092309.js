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
        this.canvas.addEventListener('dragenter', (e) => this.handleDragEnter(e));
        this.canvas.addEventListener('dragleave', (e) => this.handleDragLeave(e));
        
        console.log('Canvas drag and drop events initialized');
    }

    // Handle canvas click
    handleCanvasClick(e) {
        if (e.target === this.canvas) {
            this.elementManager.clearSelection();
            this.render();
            window.propertiesManager.updatePropertiesPanel();
        }
    }

    // Handle drag enter
    handleDragEnter(e) {
        e.preventDefault();
        console.log('Drag enter canvas');
        this.canvas.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
    }

    // Handle drag leave
    handleDragLeave(e) {
        e.preventDefault();
        // Only remove highlight if we're actually leaving the canvas
        if (!this.canvas.contains(e.relatedTarget)) {
            console.log('Drag leave canvas');
            this.canvas.style.backgroundColor = '';
        }
    }

    // Handle drag over
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }

    // Handle drop
    handleDrop(e) {
        e.preventDefault();
        console.log('Drop event triggered');
        
        // Remove visual feedback
        this.canvas.style.backgroundColor = '';
        
        const rect = this.canvas.getBoundingClientRect();
        const x = snapToGrid(e.clientX - rect.left);
        const y = snapToGrid(e.clientY - rect.top);

        console.log('Drop position:', x, y);
        console.log('Dragged type:', this.draggedType);
        console.log('Dragged element:', this.draggedElement);

        // Get drag data from dataTransfer as fallback
        const draggedTypeFromData = e.dataTransfer.getData('text/plain');
        const effectiveType = this.draggedType || draggedTypeFromData;

        if (effectiveType) {
            // Create new element from sidebar
            console.log('Creating new element of type:', effectiveType);
            const newElement = this.elementManager.createElement(effectiveType, x, y);
            const newElements = this.elementManager.addElement(newElement);
            this.historyManager.addToHistory(newElements);
            saveToLocalStorage(newElements, this.columns);
            this.render();
            
            // Show success feedback
            this.showDropFeedback(x, y, effectiveType);
            
        } else if (this.draggedElement) {
            // Move existing element
            console.log('Moving existing element:', this.draggedElement.id);
            const newElements = this.elementManager.updateElement(this.draggedElement.id, {
                x: x - this.dragOffset.x,
                y: y - this.dragOffset.y
            });
            this.historyManager.addToHistory(newElements);
            saveToLocalStorage(newElements, this.columns);
            this.render();
        } else {
            console.warn('No drag data found');
        }

        // Clear drag state
        this.draggedType = null;
        this.draggedElement = null;
        this.dragOffset = { x: 0, y: 0 };
    }

    // Show visual feedback when element is dropped
    showDropFeedback(x, y, type) {
        const feedback = document.createElement('div');
        feedback.className = 'absolute pointer-events-none z-50 bg-green-500 text-white px-2 py-1 rounded text-sm';
        feedback.style.left = x + 'px';
        feedback.style.top = (y - 30) + 'px';
        feedback.textContent = `${type} added!`;
        
        this.canvas.appendChild(feedback);
        
        // Animate and remove
        setTimeout(() => {
            feedback.style.transform = 'translateY(-10px)';
            feedback.style.opacity = '0';
            feedback.style.transition = 'all 0.3s ease';
        }, 100);
        
        setTimeout(() => {
            if (this.canvas.contains(feedback)) {
                this.canvas.removeChild(feedback);
            }
        }, 500);
    }

    // Set dragged type from sidebar
    setDraggedType(type) {
        this.draggedType = type;
        console.log('Canvas draggedType set to:', type);
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
        
        // Build class names based on properties
        let classNames = ['cursor-move', 'border-solid', getAnimationClass(element.animation?.type)];
        
        // Add display class
        if (element.display && element.display !== 'block') {
            classNames.push(element.display);
        } else {
            classNames.push('absolute');
        }

        // Add shadow class
        if (element.shadow && element.shadow !== 'none') {
            classNames.push(`shadow-${element.shadow}`);
        }

        elementDiv.className = classNames.filter(Boolean).join(' ');
        elementDiv.draggable = true;
        elementDiv.tabIndex = 0;

        // Apply styles
        const borderRadius = element.type === 'circle' ? '50%' : `${element.borderRadius || 0}px`;
        const opacity = (element.opacity || 100) / 100;
        
        let styles = `
            width: ${element.width}px;
            height: ${element.height}px;
            left: ${element.x}px;
            top: ${element.y}px;
            background-color: ${element.backgroundColor || '#3b82f6'};
            color: ${element.textColor || '#1f2937'};
            border-color: ${element.borderColor || '#e5e7eb'};
            border-width: ${element.borderWidth || 1}px;
            border-radius: ${borderRadius};
            padding: ${element.padding || 8}px;
            margin: ${element.margin || 4}px;
            z-index: ${element.zIndex || 1};
            opacity: ${opacity};
            transform: rotate(${element.angle || 0}deg);
        `;

        // Add flexbox styles if display is flex
        if (element.display === 'flex') {
            styles += `
                justify-content: ${element.justifyContent || 'center'};
                align-items: ${element.alignItems || 'center'};
            `;
        }

        // Add text alignment and typography
        if (element.textAlign) {
            styles += `text-align: ${element.textAlign};`;
        }
        if (element.fontWeight) {
            styles += `font-weight: ${element.fontWeight};`;
        }
        if (element.lineHeight) {
            styles += `line-height: ${element.lineHeight};`;
        }

        elementDiv.style.cssText = styles;

        // Add content based on type
        elementDiv.innerHTML = this.getElementContent(element);

        // Add event listeners
        this.addElementEventListeners(elementDiv, element);

        return elementDiv;
    }

    // Get element content based on type
    getElementContent(element) {
        const fontSize = element.fontSize || 16;
        const fontWeight = element.fontWeight || 400;
        const textAlign = element.textAlign || 'center';
        const lineHeight = element.lineHeight || 1.5;
        
        const textStyles = `font-size: ${fontSize}px; font-weight: ${fontWeight}; text-align: ${textAlign}; line-height: ${lineHeight};`;

        switch (element.type) {
            case 'text':
                return `<div class="w-full h-full flex items-center justify-center" style="${textStyles}">${element.textContent || 'Sample Text'}</div>`;
            case 'button':
                return `<button class="w-full h-full rounded border-0 text-white" style="${textStyles}">${element.textContent || 'Button'}</button>`;
            case 'image':
                if (element.imageUrl && element.imageUrl !== '') {
                    return `<img src="${element.imageUrl}" class="w-full h-full object-cover rounded" alt="Image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'">
                        <div class="w-full h-full bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500" style="display:none;">
                            <span>Image failed to load</span>
                        </div>`;
                } else {
                    return `<div class="w-full h-full bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500">
                        <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
                        </svg>
                        <span class="ml-2 text-xs">Click to upload</span>
                    </div>`;
                }
            case 'card':
                return `<div class="w-full h-full bg-white rounded-lg shadow-md p-4 border">
                    <div style="${textStyles}">${element.textContent || 'Card Content'}</div>
                </div>`;
            case 'navbar':
                return `<nav class="w-full h-full flex items-center justify-between px-4 text-white">
                    <div style="${textStyles}; color: white;">${element.textContent || 'Brand'}</div>
                    <div class="flex space-x-4">
                        <a href="#" class="text-sm hover:text-gray-300">Home</a>
                        <a href="#" class="text-sm hover:text-gray-300">About</a>
                        <a href="#" class="text-sm hover:text-gray-300">Contact</a>
                    </div>
                </nav>`;
            case 'tabs':
                const tabs = (element.textContent || 'Tab 1|Tab 2|Tab 3').split('|');
                return `<div class="w-full h-full">
                    <div class="flex border-b border-gray-200">
                        ${tabs.map((tab, index) =>
                            `<button class="px-4 py-2 text-sm ${index === 0 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600 hover:text-gray-800'}">${tab.trim()}</button>`
                        ).join('')}
                    </div>
                </div>`;
            case 'modal':
                return `<div class="w-full h-full bg-white rounded-lg border shadow-lg relative">
                    <div class="flex items-center justify-between p-4 border-b">
                        <h3 style="${textStyles}">Modal Title</h3>
                        <button class="text-gray-400 hover:text-gray-600">×</button>
                    </div>
                    <div class="p-4">
                        <p style="${textStyles}">${element.textContent || 'Modal content goes here...'}</p>
                    </div>
                </div>`;
            case 'form':
                return `<form class="w-full h-full p-4 space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Name</label>
                        <input type="text" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700">Email</label>
                        <input type="email" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
                    </div>
                    <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Submit</button>
                </form>`;
            case 'hero':
                return `<div class="w-full h-full flex items-center justify-center text-center text-white">
                    <div>
                        <h1 style="${textStyles}; color: white;">${element.textContent || 'Hero Title'}</h1>
                        <p class="mt-2 text-lg opacity-90">Subtitle or description</p>
                        <button class="mt-4 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">Get Started</button>
                    </div>
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
        deleteBtn.className = 'absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer text-xs font-bold hover:bg-red-600 transition-colors z-50';
        deleteBtn.innerHTML = '×';
        deleteBtn.title = 'Delete element';
        
        // Enhanced delete button event handler
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();
            console.log('Delete button clicked for element:', element.id);
            
            // Direct deletion with element ID
            if (element.id) {
                const newElements = this.elementManager.deleteElement(element.id);
                this.historyManager.addToHistory(newElements);
                saveToLocalStorage(newElements, this.columns);
                this.render();
                window.propertiesManager.updatePropertiesPanel();
                
                console.log('Element deleted successfully');
            }
        });
        
        // Prevent drag on delete button
        deleteBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
        
        elementDiv.appendChild(deleteBtn);

        // Resize handle
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'absolute -bottom-2 -right-2 bg-blue-500 rounded-full w-4 h-4 cursor-nw-resize hover:bg-blue-600 transition-colors';
        resizeHandle.title = 'Resize element';
        this.addResizeHandlers(resizeHandle, element);
        elementDiv.appendChild(resizeHandle);

        // Rotation handle
        const rotationHandle = document.createElement('div');
        rotationHandle.className = 'absolute -top-6 left-1/2 transform -translate-x-1/2 bg-green-500 rounded-full w-4 h-4 cursor-grab hover:bg-green-600 transition-colors';
        rotationHandle.title = 'Rotate element';
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