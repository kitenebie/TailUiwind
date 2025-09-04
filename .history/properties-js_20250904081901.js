// properties.js - Properties Panel Management

class PropertiesManager {
    constructor(elementManager, historyManager) {
        this.elementManager = elementManager;
        this.historyManager = historyManager;
        this.initializeEventListeners();
    }

    // Initialize event listeners for property inputs
    initializeEventListeners() {
        // Position & Size inputs
        document.getElementById('widthInput').addEventListener('input', (e) => this.updateProperty('width', parseInt(e.target.value) || 0));
        document.getElementById('heightInput').addEventListener('input', (e) => this.updateProperty('height', parseInt(e.target.value) || 0));
        document.getElementById('angleInput').addEventListener('input', (e) => this.updateProperty('angle', parseInt(e.target.value) || 0));
        document.getElementById('zIndexInput').addEventListener('input', (e) => this.updateProperty('zIndex', parseInt(e.target.value) || 0));

        // Styling inputs
        document.getElementById('backgroundColorInput').addEventListener('input', (e) => this.updateProperty('backgroundColor', e.target.value));
        document.getElementById('backgroundColorText').addEventListener('input', (e) => this.updateProperty('backgroundColor', e.target.value));
        document.getElementById('borderColorInput').addEventListener('input', (e) => this.updateProperty('borderColor', e.target.value));
        document.getElementById('borderWidthInput').addEventListener('input', (e) => this.updateProperty('borderWidth', parseInt(e.target.value) || 0));
        document.getElementById('borderRadiusInput').addEventListener('input', (e) => this.updateProperty('borderRadius', parseInt(e.target.value) || 0));
        document.getElementById('paddingInput').addEventListener('input', (e) => this.updateProperty('padding', parseInt(e.target.value) || 0));

        // Text content inputs
        document.getElementById('textContentInput').addEventListener('input', (e) => this.updateProperty('textContent', e.target.value));
        document.getElementById('fontSizeInput').addEventListener('input', (e) => this.updateProperty('fontSize', parseInt(e.target.value) || 12));

        // Animation inputs
        document.getElementById('animationTypeInput').addEventListener('change', (e) => this.updateAnimationProperty('type', e.target.value));
        document.getElementById('animationDurationInput').addEventListener('input', (e) => this.updateAnimationProperty('duration', parseInt(e.target.value) || 1000));
        document.getElementById('animationDelayInput').addEventListener('input', (e) => this.updateAnimationProperty('delay', parseInt(e.target.value) || 0));
        document.getElementById('animationLoopInput').addEventListener('change', (e) => this.updateAnimationProperty('loop', e.target.checked));

        // Sync color inputs
        document.getElementById('backgroundColorInput').addEventListener('input', (e) => {
            document.getElementById('backgroundColorText').value = e.target.value;
        });
        document.getElementById('backgroundColorText').addEventListener('input', (e) => {
            document.getElementById('backgroundColorInput').value = e.target.value;
        });
    }

    // Update element property
    updateProperty(property, value) {
        const selectedElement = this.elementManager.getSelectedElement();
        if (selectedElement) {
            const newElements = this.elementManager.updateElement(selectedElement.id, { [property]: value });
            window.canvasManager.render();
            // Don't add to history for every keystroke - could be optimized with debouncing
        }
    }

    // Update animation property
    updateAnimationProperty(property, value) {
        const selectedElement = this.elementManager.getSelectedElement();
        if (selectedElement) {
            const newAnimation = { ...selectedElement.animation, [property]: value };
            const newElements = this.elementManager.updateElement(selectedElement.id, { animation: newAnimation });
            window.canvasManager.render();
        }
    }

    // Update properties panel based on selected element
    updatePropertiesPanel() {
        const selectedElement = this.elementManager.getSelectedElement();
        const noSelection = document.getElementById('noSelection');
        const propertiesContent = document.getElementById('propertiesContent');
        const textSection = document.getElementById('textSection');
        const fontSizeSection = document.getElementById('fontSizeSection');

        if (!selectedElement) {
            noSelection.classList.remove('hidden');
            propertiesContent.classList.add('hidden');
            return;
        }

        noSelection.classList.add('hidden');
        propertiesContent.classList.remove('hidden');

        // Update title
        document.getElementById('elementTitle').textContent = `${selectedElement.type} Properties`;

        // Update position & size inputs
        document.getElementById('widthInput').value = selectedElement.width;
        document.getElementById('heightInput').value = selectedElement.height;
        document.getElementById('angleInput').value = selectedElement.angle;
        document.getElementById('zIndexInput').value = selectedElement.zIndex;

        // Update styling inputs
        document.getElementById('backgroundColorInput').value = selectedElement.backgroundColor;
        document.getElementById('backgroundColorText').value = selectedElement.backgroundColor;
        document.getElementById('borderColorInput').value = selectedElement.borderColor;
        document.getElementById('borderWidthInput').value = selectedElement.borderWidth;
        document.getElementById('borderRadiusInput').value = selectedElement.borderRadius;
        document.getElementById('paddingInput').value = selectedElement.padding;

        // Handle border radius for circles
        const borderRadiusInput = document.getElementById('borderRadiusInput');
        if (selectedElement.type === 'circle') {
            borderRadiusInput.disabled = true;
            borderRadiusInput.value = 'Auto (Circle)';
        } else {
            borderRadiusInput.disabled = false;
            borderRadiusInput.value = selectedElement.borderRadius;
        }

        // Update text content section
        if (selectedElement.type === 'text' || selectedElement.type === 'button' || selectedElement.type === 'card') {
            textSection.classList.remove('hidden');
            document.getElementById('textContentInput').value = selectedElement.textContent || '';
            
            if (selectedElement.fontSize !== undefined) {
                fontSizeSection.classList.remove('hidden');
                document.getElementById('fontSizeInput').value = selectedElement.fontSize;
            } else {
                fontSizeSection.classList.add('hidden');
            }
        } else {
            textSection.classList.add('hidden');
        }

        // Update animation inputs
        document.getElementById('animationTypeInput').value = selectedElement.animation.type;
        document.getElementById('animationDurationInput').value = selectedElement.animation.duration;
        document.getElementById('animationDelayInput').value = selectedElement.animation.delay;
        document.getElementById('animationLoopInput').checked = selectedElement.animation.loop;
    }

    // Add debounced history update for property changes
    debouncedHistoryUpdate = this.debounce(() => {
        const elements = this.elementManager.getAllElements();
        this.historyManager.addToHistory(elements);
        saveToLocalStorage(elements, window.canvasManager.columns);
    }, 500);

    // Debounce utility function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}