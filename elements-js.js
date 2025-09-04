// elements.js - Element Management

class ElementManager {
    constructor() {
        this.elements = [];
        this.selectedElementId = null;
    }

    // Add element
    addElement(element) {
        this.elements.push(element);
        return this.elements;
    }

    // Update element
    updateElement(id, updates) {
        const elementIndex = this.elements.findIndex(el => el.id === id);
        if (elementIndex !== -1) {
            this.elements[elementIndex] = { ...this.elements[elementIndex], ...updates };
        }
        return this.elements;
    }

    // Delete element
    deleteElement(id) {
        this.elements = this.elements.filter(el => el.id !== id);
        if (this.selectedElementId === id) {
            this.selectedElementId = null;
        }
        return this.elements;
    }

    // Get element by ID
    getElementById(id) {
        return this.elements.find(el => el.id === id);
    }

    // Get selected element
    getSelectedElement() {
        return this.selectedElementId ? this.getElementById(this.selectedElementId) : null;
    }

    // Select element
    selectElement(id) {
        this.selectedElementId = id;
    }

    // Clear selection
    clearSelection() {
        this.selectedElementId = null;
    }

    // Set all elements
    setElements(elements) {
        this.elements = elements;
        // Clear selection if selected element no longer exists
        if (this.selectedElementId && !this.getElementById(this.selectedElementId)) {
            this.selectedElementId = null;
        }
    }

    // Get all elements
    getAllElements() {
        return this.elements;
    }

    // Create element from type and position
    createElement(type, x, y) {
        const elementData = getDefaultElement(type);
        return {
            id: generateId(),
            x: snapToGrid(x),
            y: snapToGrid(y),
            ...elementData
        };
    }
}