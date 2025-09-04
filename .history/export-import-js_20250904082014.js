// export-import.js - Export/Import Management

class ExportImportManager {
    constructor(elementManager, historyManager) {
        this.elementManager = elementManager;
        this.historyManager = historyManager;
    }

    // Handle export
    handleExport() {
        const project = {
            elements: this.elementManager.getAllElements(),
            columns: window.toolbarManager.getColumns(),
            version: '1.0.0'
        };
        
        const blob = new Blob([JSON.stringify(project, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tailui-project-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Project exported successfully!', 'success');
    }

    // Handle import
    handleImport(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const project = JSON.parse(e.target.result);
                this.validateProject(project);
                this.loadProject(project);
                this.showNotification('Project imported successfully!', 'success');
            } catch (error) {
                console.error('Import error:', error);
                this.showNotification('Failed to import project. Invalid file format.', 'error');
            }
        };

        reader.onerror = () => {
            this.showNotification('Failed to read file.', 'error');
        };

        reader.readAsText(file);
        
        // Clear the input so the same file can be imported again
        event.target.value = '';
    }

    // Validate project structure
    validateProject(project) {
        if (!project || typeof project !== 'object') {
            throw new Error('Invalid project format');
        }

        if (!Array.isArray(project.elements)) {
            throw new Error('Invalid elements array');
        }

        if (typeof project.columns !== 'number' || project.columns < 1 || project.columns > 12) {
            throw new Error('Invalid columns value');
        }

        // Validate each element
        project.elements.forEach((element, index) => {
            if (!element.id || !element.type || typeof element.x !== 'number' || typeof element.y !== 'number') {
                throw new Error(`Invalid element at index ${index}`);
            }
        });
    }

    // Load project
    loadProject(project) {
        // Clear current selection
        this.elementManager.clearSelection();
        
        // Set elements
        this.elementManager.setElements(project.elements);
        
        // Set columns
        window.toolbarManager.setColumns(project.columns);
        
        // Reset history
        this.historyManager.reset(project.elements);
        
        // Render canvas
        window.canvasManager.render();
        
        // Update properties panel
        window.propertiesManager.updatePropertiesPanel();
        
        // Save to localStorage
        saveToLocalStorage(project.elements, project.columns);
    }

    // Export as CSS/HTML
    exportAsCode() {
        const elements = this.elementManager.getAllElements();
        const columns = window.toolbarManager.getColumns();
        
        let html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n';
        html += '    <meta charset="UTF-8">\n';
        html += '    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n';
        html += '    <title>Generated Layout</title>\n';
        html += '    <script src="https://cdn.tailwindcss.com"></script>\n';
        html += '</head>\n<body class="bg-gray-100">\n';
        html += `    <div class="relative min-h-screen" style="background-image: repeating-linear-gradient(90deg, transparent, transparent calc(${100/columns}% - 1px), #e5e7eb calc(${100/columns}% - 1px), #e5e7eb ${100/columns}%)">\n`;
        
        elements.forEach(element => {
            html += this.generateElementHTML(element);
        });
        
        html += '    </div>\n</body>\n</html>';
        
        // Download HTML file
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tailui-layout-${new Date().toISOString().split('T')[0]}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('HTML code exported successfully!', 'success');
    }

    // Generate HTML for individual element
    generateElementHTML(element) {
        const borderRadius = element.type === 'circle' ? '50%' : `${element.borderRadius}px`;
        
        let html = '        <div class="absolute" style="';
        html += `width: ${element.width}px; `;
        html += `height: ${element.height}px; `;
        html += `left: ${element.x}px; `;
        html += `top: ${element.y}px; `;
        html += `background-color: ${element.backgroundColor}; `;
        html += `border-color: ${element.borderColor}; `;
        html += `border-width: ${element.borderWidth}px; `;
        html += `border-radius: ${borderRadius}; `;
        html += `padding: ${element.padding}px; `;
        html += `margin: ${element.margin}px; `;
        html += `z-index: ${element.zIndex}; `;
        html += `transform: rotate(${element.angle}deg);`;
        html += '">\n';
        
        // Add content based on type
        switch (element.type) {
            case 'text':
                html += `            <div class="w-full h-full flex items-center justify-center text-gray-800" style="font-size: ${element.fontSize}px">${element.textContent || 'Text'}</div>\n`;
                break;
            case 'button':
                html += `            <button class="w-full h-full text-white font-medium rounded border-0" style="font-size: ${element.fontSize}px">${element.textContent || 'Button'}</button>\n`;
                break;
            case 'image':
                html += '            <div class="w-full h-full bg-gray-200 border-2 border-dashed border-gray-400 flex items-center justify-center text-gray-500">Image Placeholder</div>\n';
                break;
            case 'card':
                html += `            <div class="w-full h-full bg-white rounded-lg shadow-md p-4 border"><div class="text-sm text-gray-600">${element.textContent || 'Card Content'}</div></div>\n`;
                break;
        }
        
        html += '        </div>\n';
        return html;
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 px-4 py-2 rounded-md shadow-lg z-50 transition-all duration-300 ${
            type === 'success' ? 'bg-green-500 text-white' :
            type === 'error' ? 'bg-red-500 text-white' :
            'bg-blue-500 text-white'
        }`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateY(0)';
            notification.style.opacity = '1';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateY(-20px)';
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Export as Tailwind CSS classes
    exportAsTailwindCSS() {
        const elements = this.elementManager.getAllElements();
        let css = '/* Generated Tailwind CSS Classes */\n\n';
        
        elements.forEach((element, index) => {
            css += `.element-${element.type}-${index + 1} {\n`;
            css += `    @apply absolute;\n`;
            css += `    width: ${element.width}px;\n`;
            css += `    height: ${element.height}px;\n`;
            css += `    left: ${element.x}px;\n`;
            css += `    top: ${element.y}px;\n`;
            css += `    background-color: ${element.backgroundColor};\n`;
            css += `    border-color: ${element.borderColor};\n`;
            css += `    border-width: ${element.borderWidth}px;\n`;
            css += `    border-radius: ${element.type === 'circle' ? '50%' : element.borderRadius + 'px'};\n`;
            css += `    padding: ${element.padding}px;\n`;
            css += `    margin: ${element.margin}px;\n`;
            css += `    z-index: ${element.zIndex};\n`;
            css += `    transform: rotate(${element.angle}deg);\n`;
            css += '}\n\n';
        });
        
        // Download CSS file
        const blob = new Blob([css], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tailui-styles-${new Date().toISOString().split('T')[0]}.css`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('CSS exported successfully!', 'success');
    }
}