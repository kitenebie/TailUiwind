// toolbar.js - Toolbar Management

class ToolbarManager {
    constructor(elementManager, historyManager) {
        this.elementManager = elementManager;
        this.historyManager = historyManager;
        this.columns = 12;
        this.initializeEventListeners();
    }

    // Initialize toolbar event listeners
    initializeEventListeners() {
        // Column controls
        document.getElementById('decreaseColumns').addEventListener('click', () => {
            this.updateColumns(Math.max(1, this.columns - 1));
        });

        document.getElementById('increaseColumns').addEventListener('click', () => {
            this.updateColumns(Math.min(12, this.columns + 1));
        });

        // Undo/Redo buttons
        document.getElementById('undoBtn').addEventListener('click', () => {
            this.handleUndo();
        });

        document.getElementById('redoBtn').addEventListener('click', () => {
            this.handleRedo();
        });

        // Export buttons
        document.getElementById('exportJSONBtn').addEventListener('click', () => {
            window.exportImportManager.handleExport();
        });
        
        document.getElementById('exportHTMLBtn').addEventListener('click', () => {
            window.exportImportManager.exportAsCode();
        });
        
        document.getElementById('exportTailwindBtn').addEventListener('click', () => {
            window.exportImportManager.exportAsTailwindCSS();
        });

        // Preview button
        document.getElementById('previewBtn').addEventListener('click', () => {
            this.handlePreview();
        });

        // Responsive design button
        document.getElementById('responsiveBtn').addEventListener('click', () => {
            this.makeResponsive();
        });
    }

    // Update column count
    updateColumns(newColumns) {
        this.columns = newColumns;
        document.getElementById('columnCount').textContent = newColumns;
        window.canvasManager.updateColumns(newColumns);
        
        // Save to localStorage
        const elements = this.elementManager.getAllElements();
        saveToLocalStorage(elements, this.columns);
    }

    // Handle undo
    handleUndo() {
        const previousState = this.historyManager.undo();
        if (previousState) {
            this.elementManager.setElements(previousState);
            window.canvasManager.render();
            window.propertiesManager.updatePropertiesPanel();
            saveToLocalStorage(previousState, this.columns);
        }
    }

    // Handle redo
    handleRedo() {
        const nextState = this.historyManager.redo();
        if (nextState) {
            this.elementManager.setElements(nextState);
            window.canvasManager.render();
            window.propertiesManager.updatePropertiesPanel();
            saveToLocalStorage(nextState, this.columns);
        }
    }

    // Get current column count
    getColumns() {
        return this.columns;
    }

    // Set column count (used when loading projects)
    setColumns(columns) {
        this.columns = columns;
        document.getElementById('columnCount').textContent = columns;
        window.canvasManager.updateColumns(columns);
    }

    // Handle preview functionality
    handlePreview() {
        const elements = this.elementManager.getAllElements();
        const columns = this.getColumns();
        
        // Generate HTML for preview
        let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TailUI Preview</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        .preview-container {
            background-image: repeating-linear-gradient(90deg, transparent, transparent calc(${100/columns}% - 1px), #e5e7eb calc(${100/columns}% - 1px), #e5e7eb ${100/columns}%);
            min-height: 100vh;
        }
    </style>
</head>
<body class="bg-gray-100">
    <div class="preview-container relative">
        ${elements.map(element => window.exportImportManager.generateElementHTML(element)).join('\n')}
    </div>
</body>
</html>`;

        // Open preview in new window
        const previewWindow = window.open('', '_blank', 'width=1200,height=800');
        previewWindow.document.write(html);
        previewWindow.document.close();
    }

    // Make design responsive
    makeResponsive() {
        const elements = this.elementManager.getAllElements();
        const updatedElements = [];

        elements.forEach(element => {
            const responsiveElement = { ...element };
            
            // Convert absolute positioning to responsive classes
            const canvasWidth = window.canvasManager.canvas.clientWidth || 1200;
            const widthPercentage = Math.round((element.width / canvasWidth) * 100);
            
            // Add responsive breakpoints
            responsiveElement.responsive = {
                sm: { width: Math.max(widthPercentage, 50) + '%' },
                md: { width: Math.max(widthPercentage * 0.8, 40) + '%' },
                lg: { width: widthPercentage + '%' },
                xl: { width: Math.min(widthPercentage * 1.2, 100) + '%' }
            };
            
            // Convert to relative positioning for mobile
            if (element.y < 200) { // Top elements
                responsiveElement.mobilePosition = 'relative';
                responsiveElement.mobileMarginTop = '1rem';
            } else {
                responsiveElement.mobilePosition = 'relative';
                responsiveElement.mobileMarginTop = '2rem';
            }
            
            // Adjust text sizes for mobile
            if (element.fontSize) {
                responsiveElement.responsiveFontSize = {
                    sm: Math.max(element.fontSize - 2, 12),
                    md: element.fontSize - 1,
                    lg: element.fontSize,
                    xl: element.fontSize + 1
                };
            }
            
            updatedElements.push(responsiveElement);
        });

        // Update all elements with responsive properties
        updatedElements.forEach(element => {
            this.elementManager.updateElement(element.id, element);
        });

        // Save and render
        const newElements = this.elementManager.getAllElements();
        this.historyManager.addToHistory(newElements);
        saveToLocalStorage(newElements, this.columns);
        window.canvasManager.render();
        
        // Show success notification
        this.showNotification('Design made responsive! Elements now adapt to different screen sizes.', 'success');
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Update toolbar state
    updateToolbarState() {
        this.historyManager.updateUndoRedoButtons();
    }
}