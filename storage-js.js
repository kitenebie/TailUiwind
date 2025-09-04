// storage.js - Storage Functions

// Save project to localStorage
function saveToLocalStorage(elements, columns) {
    const project = {
        elements,
        columns,
        version: '1.0.0'
    };
    localStorage.setItem('tailui-generator-project', JSON.stringify(project));
}

// Load project from localStorage
function loadFromLocalStorage() {
    try {
        const saved = localStorage.getItem('tailui-generator-project');
        if (saved) {
            return JSON.parse(saved);
        }
    } catch (error) {
        console.error('Failed to load saved project:', error);
    }
    return null;
}

// Clear localStorage
function clearLocalStorage() {
    localStorage.removeItem('tailui-generator-project');
}