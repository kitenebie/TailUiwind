// history.js - History Management

class HistoryManager {
    constructor() {
        this.history = [[]];
        this.currentIndex = 0;
    }

    // Add state to history
    addToHistory(elements) {
        // Remove any future history if we're not at the end
        this.history = this.history.slice(0, this.currentIndex + 1);
        
        // Add new state
        this.history.push([...elements]);
        this.currentIndex = this.history.length - 1;
        
        // Limit history size to prevent memory issues
        if (this.history.length > 50) {
            this.history.shift();
            this.currentIndex--;
        }

        this.updateUndoRedoButtons();
    }

    // Undo operation
    undo() {
        if (this.canUndo()) {
            this.currentIndex--;
            this.updateUndoRedoButtons();
            return [...this.history[this.currentIndex]];
        }
        return null;
    }

    // Redo operation
    redo() {
        if (this.canRedo()) {
            this.currentIndex++;
            this.updateUndoRedoButtons();
            return [...this.history[this.currentIndex]];
        }
        return null;
    }

    // Check if undo is possible
    canUndo() {
        return this.currentIndex > 0;
    }

    // Check if redo is possible
    canRedo() {
        return this.currentIndex < this.history.length - 1;
    }

    // Reset history
    reset(elements) {
        this.history = [elements];
        this.currentIndex = 0;
        this.updateUndoRedoButtons();
    }

    // Update undo/redo button states
    updateUndoRedoButtons() {
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');
        
        if (undoBtn) {
            undoBtn.disabled = !this.canUndo();
        }
        
        if (redoBtn) {
            redoBtn.disabled = !this.canRedo();
        }
    }
}