// main.js - Main Application Initialization

// Global managers
window.elementManager = null;
window.historyManager = null;
window.canvasManager = null;
window.propertiesManager = null;
window.sidebarManager = null;
window.toolbarManager = null;
window.exportImportManager = null;

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApplication();
    setupKeyboardShortcuts();
    loadSavedProject();
});

// Initialize all managers
function initializeApplication() {
    // Initialize managers in correct order
    window.elementManager = new ElementManager();
    window.historyManager = new HistoryManager();
    window.canvasManager = new CanvasManager(window.elementManager, window.historyManager);
    window.propertiesManager = new PropertiesManager(window.elementManager, window.historyManager);
    window.sidebarManager = new SidebarManager();
    window.toolbarManager = new ToolbarManager(window.elementManager, window.historyManager);
    window.exportImportManager = new ExportImportManager(window.elementManager, window.historyManager);

    console.log('TailUI CSS Generator initialized successfully!');
    
    // Show welcome hint
    setTimeout(() => {
        window.sidebarManager.addDragHint();
    }, 1000);
}

// Setup keyboard shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Prevent default browser shortcuts when focusing on app
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            
            // Ctrl+Z / Cmd+Z for Undo
            if ((e.ctrlKey || e.metaKey) && !e.shiftKey && e.key === 'z') {
                e.preventDefault();
                window.toolbarManager.handleUndo();
            }
            
            // Ctrl+Shift+Z / Cmd+Shift+Z for Redo
            else if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') {
                e.preventDefault();
                window.toolbarManager.handleRedo();
            }
            
            // Delete/Backspace to delete selected element
            else if (e.key === 'Delete' || e.key === 'Backspace') {
                if (window.elementManager.selectedElementId) {
                    e.preventDefault();
                    window.canvasManager.deleteSelectedElement();
                }
            }
            
            // Escape to clear selection
            else if (e.key === 'Escape') {
                e.preventDefault();
                window.elementManager.clearSelection();
                window.canvasManager.render();
                window.propertiesManager.updatePropertiesPanel();
            }
            
            // Ctrl+S / Cmd+S to export
            else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                window.exportImportManager.handleExport();
            }
            
            // Ctrl+O / Cmd+O to trigger import
            else if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
                e.preventDefault();
                document.getElementById('importInput').click();
            }
        }
    });
}

// Load saved project from localStorage
function loadSavedProject() {
    const savedProject = loadFromLocalStorage();
    if (savedProject) {
        try {
            window.elementManager.setElements(savedProject.elements);
            window.toolbarManager.setColumns(savedProject.columns);
            window.historyManager.reset(savedProject.elements);
            window.canvasManager.render();
            window.propertiesManager.updatePropertiesPanel();
            
            console.log('Loaded saved project with', savedProject.elements.length, 'elements');
        } catch (error) {
            console.error('Failed to load saved project:', error);
            // Clear corrupted data
            clearLocalStorage();
        }
    }
}

// Handle window resize
window.addEventListener('resize', function() {
    // Debounce resize events
    clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
        window.canvasManager.render();
    }, 150);
});

// Handle page visibility change (save when user switches tabs)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Save current state when user leaves the page
        const elements = window.elementManager.getAllElements();
        const columns = window.toolbarManager.getColumns();
        saveToLocalStorage(elements, columns);
    }
});

// Handle beforeunload (save before page closes)
window.addEventListener('beforeunload', function() {
    const elements = window.elementManager.getAllElements();
    const columns = window.toolbarManager.getColumns();
    saveToLocalStorage(elements, columns);
});

// Utility function to check if app is ready
window.isAppReady = function() {
    return window.elementManager && 
           window.historyManager && 
           window.canvasManager && 
           window.propertiesManager && 
           window.sidebarManager && 
           window.toolbarManager && 
           window.exportImportManager;
};

// Debug functions (available in console)
window.debug = {
    getElements: () => window.elementManager.getAllElements(),
    getSelectedElement: () => window.elementManager.getSelectedElement(),
    getHistory: () => window.historyManager.history,
    clearAll: () => {
        window.elementManager.setElements([]);
        window.canvasManager.render();
        window.propertiesManager.updatePropertiesPanel();
        clearLocalStorage();
    },
    exportState: () => {
        return {
            elements: window.elementManager.getAllElements(),
            columns: window.toolbarManager.getColumns(),
            selectedId: window.elementManager.selectedElementId
        };
    }
};

console.log('TailUI CSS Generator Debug functions available via window.debug');