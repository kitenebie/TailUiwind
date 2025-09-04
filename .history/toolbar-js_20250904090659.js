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

        // Import file input
        document.getElementById('importInput').addEventListener('change', (e) => {
            window.exportImportManager.handleImport(e);
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

    // Update toolbar state
    updateToolbarState() {
        this.historyManager.updateUndoRedoButtons();
    }
}