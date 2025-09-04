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

    // Create element HTML with comprehensive Tailwind CSS properties
    createElementHTML(element) {
        const elementDiv = document.createElement('div');
        elementDiv.id = `element-${element.id}`;
        
        // Build class names based on properties
        let classNames = ['cursor-move'];
        
        // Display classes
        if (element.display === 'flex') {
            classNames.push('flex');
        } else if (element.display === 'grid') {
            classNames.push('grid');
        } else if (element.display === 'inline') {
            classNames.push('inline');
        } else if (element.display === 'inline-block') {
            classNames.push('inline-block');
        } else if (element.display === 'hidden') {
            classNames.push('hidden');
        } else {
            classNames.push('block');
        }

        // Position classes
        if (element.position === 'absolute') {
            classNames.push('absolute');
        } else if (element.position === 'relative') {
            classNames.push('relative');
        } else if (element.position === 'fixed') {
            classNames.push('fixed');
        } else if (element.position === 'sticky') {
            classNames.push('sticky');
        }

        // Shadow class
        if (element.shadow && element.shadow !== 'none') {
            classNames.push(`shadow-${element.shadow}`);
        }

        // Border style class
        if (element.borderStyle === 'dashed') {
            classNames.push('border-dashed');
        } else if (element.borderStyle === 'dotted') {
            classNames.push('border-dotted');
        } else if (element.borderStyle === 'double') {
            classNames.push('border-double');
        } else if (element.borderStyle !== 'none') {
            classNames.push('border-solid');
        }

        elementDiv.className = classNames.filter(Boolean).join(' ');
        elementDiv.draggable = true;
        elementDiv.tabIndex = 0;

        // Apply comprehensive styles
        const opacity = (element.opacity || 100) / 100;
        
        let styles = `
            width: ${element.width || 200}px;
            height: ${element.height || 150}px;
            left: ${element.x || 0}px;
            top: ${element.y || 0}px;
            min-width: ${element.minWidth || 0}px;
            max-width: ${element.maxWidth || 'none'}px;
            background-color: ${element.backgroundColor || '#ffffff'};
            color: ${element.textColor || '#1f2937'};
            border-color: ${element.borderColor || '#e5e7eb'};
            border-width: ${element.borderWidth || 1}px;
            border-radius: ${element.borderRadius || 0}px;
            padding-top: ${element.paddingTop || element.padding || 8}px;
            padding-right: ${element.paddingRight || element.padding || 8}px;
            padding-bottom: ${element.paddingBottom || element.padding || 8}px;
            padding-left: ${element.paddingLeft || element.padding || 8}px;
            margin-top: ${element.marginTop || element.margin || 4}px;
            margin-right: ${element.marginRight || element.margin || 4}px;
            margin-bottom: ${element.marginBottom || element.margin || 4}px;
            margin-left: ${element.marginLeft || element.margin || 4}px;
            z-index: ${element.zIndex || 1};
            opacity: ${opacity};
            font-family: ${element.fontFamily || 'system-ui'};
            font-size: ${element.fontSize || 14}px;
            font-weight: ${element.fontWeight || 400};
            text-align: ${element.textAlign || 'left'};
            line-height: ${element.lineHeight || 1.5};
            text-transform: ${element.textTransform || 'none'};
            overflow: ${element.overflow || 'visible'};
            transform: rotate(${element.rotate || 0}deg);
        `;

        // Add float if specified
        if (element.float && element.float !== 'none') {
            styles += `float: ${element.float};`;
        }

        // Add flexbox styles if display is flex
        if (element.display === 'flex') {
            styles += `
                justify-content: ${element.justifyContent || 'start'};
                align-items: ${element.alignItems || 'stretch'};
                flex-direction: ${element.flexDirection || 'row'};
                flex-wrap: ${element.flexWrap || 'nowrap'};
                gap: ${element.gap || 0}px;
            `;
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
        const fontFamily = element.fontFamily || 'system-ui';
        const textAlign = element.textAlign || 'left';
        const lineHeight = element.lineHeight || 1.5;
        const textTransform = element.textTransform || 'none';
        
        const textStyles = `
            font-family: ${fontFamily};
            font-size: ${fontSize}px;
            font-weight: ${fontWeight};
            text-align: ${textAlign};
            line-height: ${lineHeight};
            text-transform: ${textTransform};
        `;

        switch (element.type) {
            case 'container':
                return `<div class="w-full h-full flex items-center justify-center" style="${textStyles}">
                    ${element.textContent || 'Main Container'}
                </div>`;
            case 'div':
                return `<div class="w-full h-full flex items-center justify-center" style="${textStyles}">
                    ${element.textContent || 'Division'}
                </div>`;
            case 'text':
                return `<div class="w-full h-full flex items-center justify-start" style="${textStyles}">
                    ${element.textContent || 'Sample Text'}
                </div>`;
            case 'button':
                return `<button class="w-full h-full rounded border-0" style="${textStyles}">
                    ${element.textContent || 'Button'}
                </button>`;
            default:
                return `<div class="w-full h-full flex items-center justify-center" style="${textStyles}">
                    ${element.textContent || element.type}
                </div>`;
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