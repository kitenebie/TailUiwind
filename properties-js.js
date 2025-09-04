// properties.js - Properties Panel Management

class PropertiesManager {
    constructor(elementManager, historyManager) {
        this.elementManager = elementManager;
        this.historyManager = historyManager;
        this.initializeEventListeners();
    }

    // Initialize event listeners for property inputs
    initializeEventListeners() {
        // Helper function to safely add event listener
        const safeAddListener = (id, event, handler) => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener(event, handler);
            } else {
                console.warn(`Element ${id} not found, skipping event listener`);
            }
        };

        // Layout & Display inputs
        safeAddListener('displayInput', 'change', (e) => this.updateProperty('display', e.target.value));
        safeAddListener('positionInput', 'change', (e) => this.updateProperty('position', e.target.value));
        safeAddListener('floatInput', 'change', (e) => this.updateProperty('float', e.target.value));
        safeAddListener('overflowInput', 'change', (e) => this.updateProperty('overflow', e.target.value));
        safeAddListener('zIndexInput', 'input', (e) => this.updateProperty('zIndex', parseInt(e.target.value) || 0));

        // Sizing inputs
        safeAddListener('widthInput', 'input', (e) => this.updateProperty('width', parseInt(e.target.value) || 0));
        safeAddListener('heightInput', 'input', (e) => this.updateProperty('height', parseInt(e.target.value) || 0));
        safeAddListener('minWidthInput', 'input', (e) => this.updateProperty('minWidth', parseInt(e.target.value) || 0));
        safeAddListener('maxWidthInput', 'input', (e) => this.updateProperty('maxWidth', parseInt(e.target.value) || 0));

        // Spacing inputs
        safeAddListener('paddingTopInput', 'input', (e) => this.updateProperty('paddingTop', parseInt(e.target.value) || 0));
        safeAddListener('paddingRightInput', 'input', (e) => this.updateProperty('paddingRight', parseInt(e.target.value) || 0));
        safeAddListener('paddingBottomInput', 'input', (e) => this.updateProperty('paddingBottom', parseInt(e.target.value) || 0));
        safeAddListener('paddingLeftInput', 'input', (e) => this.updateProperty('paddingLeft', parseInt(e.target.value) || 0));
        safeAddListener('marginTopInput', 'input', (e) => this.updateProperty('marginTop', parseInt(e.target.value) || 0));
        safeAddListener('marginRightInput', 'input', (e) => this.updateProperty('marginRight', parseInt(e.target.value) || 0));
        safeAddListener('marginBottomInput', 'input', (e) => this.updateProperty('marginBottom', parseInt(e.target.value) || 0));
        safeAddListener('marginLeftInput', 'input', (e) => this.updateProperty('marginLeft', parseInt(e.target.value) || 0));

        // Typography inputs
        safeAddListener('textContentInput', 'input', (e) => this.updateProperty('textContent', e.target.value));
        safeAddListener('fontFamilyInput', 'change', (e) => this.updateProperty('fontFamily', e.target.value));
        safeAddListener('fontSizeInput', 'change', (e) => this.updateProperty('fontSize', parseInt(e.target.value) || 16));
        safeAddListener('fontWeightInput', 'change', (e) => this.updateProperty('fontWeight', parseInt(e.target.value) || 400));
        safeAddListener('textAlignInput', 'change', (e) => this.updateProperty('textAlign', e.target.value));
        safeAddListener('lineHeightInput', 'change', (e) => this.updateProperty('lineHeight', parseFloat(e.target.value) || 1.5));
        safeAddListener('textTransformInput', 'change', (e) => this.updateProperty('textTransform', e.target.value));

        // Colors & Backgrounds inputs
        safeAddListener('backgroundColorInput', 'input', (e) => this.updateProperty('backgroundColor', e.target.value));
        safeAddListener('backgroundColorText', 'input', (e) => this.updateProperty('backgroundColor', e.target.value));
        safeAddListener('textColorInput', 'input', (e) => this.updateProperty('textColor', e.target.value));
        safeAddListener('textColorText', 'input', (e) => this.updateProperty('textColor', e.target.value));

        // Borders & Effects inputs
        safeAddListener('borderWidthInput', 'input', (e) => this.updateProperty('borderWidth', parseInt(e.target.value) || 0));
        safeAddListener('borderRadiusInput', 'input', (e) => this.updateProperty('borderRadius', parseInt(e.target.value) || 0));
        safeAddListener('borderColorInput', 'input', (e) => this.updateProperty('borderColor', e.target.value));
        safeAddListener('borderStyleInput', 'change', (e) => this.updateProperty('borderStyle', e.target.value));
        safeAddListener('shadowInput', 'change', (e) => this.updateProperty('shadow', e.target.value));
        safeAddListener('opacityInput', 'input', (e) => {
            const value = parseInt(e.target.value);
            this.updateProperty('opacity', value);
            const opacityValue = document.getElementById('opacityValue');
            if (opacityValue) opacityValue.textContent = value + '%';
        });

        // Sync color inputs
        safeAddListener('backgroundColorInput', 'input', (e) => {
            const textInput = document.getElementById('backgroundColorText');
            if (textInput) textInput.value = e.target.value;
        });
        safeAddListener('backgroundColorText', 'input', (e) => {
            const colorInput = document.getElementById('backgroundColorInput');
            if (colorInput) colorInput.value = e.target.value;
        });
        safeAddListener('textColorInput', 'input', (e) => {
            const textInput = document.getElementById('textColorText');
            if (textInput) textInput.value = e.target.value;
        });
        safeAddListener('textColorText', 'input', (e) => {
            const colorInput = document.getElementById('textColorInput');
            if (colorInput) colorInput.value = e.target.value;
        });
    }

    // Toggle flex section visibility
    toggleFlexSection(show) {
        const flexSection = document.getElementById('flexSection');
        if (show) {
            flexSection.classList.remove('hidden');
        } else {
            flexSection.classList.add('hidden');
        }
    }

    // Handle image upload
    handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageUrl = e.target.result;
                this.updateProperty('imageUrl', imageUrl);
                document.getElementById('imageUrlInput').value = imageUrl;
            };
            reader.readAsDataURL(file);
        }
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

        if (!selectedElement) {
            noSelection.classList.remove('hidden');
            propertiesContent.classList.add('hidden');
            return;
        }

        noSelection.classList.add('hidden');
        propertiesContent.classList.remove('hidden');

        // Update title
        document.getElementById('elementTitle').textContent = `${selectedElement.type} Properties`;

        // Helper function to safely update input value
        const safeUpdateValue = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.value = value;
            }
        };

        // Update layout & display inputs
        safeUpdateValue('displayInput', selectedElement.display || 'block');
        safeUpdateValue('positionInput', selectedElement.position || 'absolute');
        safeUpdateValue('floatInput', selectedElement.float || 'none');
        safeUpdateValue('overflowInput', selectedElement.overflow || 'visible');
        safeUpdateValue('zIndexInput', selectedElement.zIndex || 1);

        // Update sizing inputs
        safeUpdateValue('widthInput', selectedElement.width || 0);
        safeUpdateValue('heightInput', selectedElement.height || 0);
        safeUpdateValue('minWidthInput', selectedElement.minWidth || 0);
        safeUpdateValue('maxWidthInput', selectedElement.maxWidth || 0);

        // Update spacing inputs
        safeUpdateValue('paddingTopInput', selectedElement.paddingTop || selectedElement.padding || 8);
        safeUpdateValue('paddingRightInput', selectedElement.paddingRight || selectedElement.padding || 8);
        safeUpdateValue('paddingBottomInput', selectedElement.paddingBottom || selectedElement.padding || 8);
        safeUpdateValue('paddingLeftInput', selectedElement.paddingLeft || selectedElement.padding || 8);
        safeUpdateValue('marginTopInput', selectedElement.marginTop || selectedElement.margin || 4);
        safeUpdateValue('marginRightInput', selectedElement.marginRight || selectedElement.margin || 4);
        safeUpdateValue('marginBottomInput', selectedElement.marginBottom || selectedElement.margin || 4);
        safeUpdateValue('marginLeftInput', selectedElement.marginLeft || selectedElement.margin || 4);

        // Update typography inputs
        safeUpdateValue('textContentInput', selectedElement.textContent || '');
        safeUpdateValue('fontFamilyInput', selectedElement.fontFamily || 'sans');
        safeUpdateValue('fontSizeInput', selectedElement.fontSize || 16);
        safeUpdateValue('fontWeightInput', selectedElement.fontWeight || 400);
        safeUpdateValue('textAlignInput', selectedElement.textAlign || 'left');
        safeUpdateValue('lineHeightInput', selectedElement.lineHeight || 1.5);
        safeUpdateValue('textTransformInput', selectedElement.textTransform || 'none');

        // Update colors & backgrounds
        safeUpdateValue('backgroundColorInput', selectedElement.backgroundColor || '#ffffff');
        safeUpdateValue('backgroundColorText', selectedElement.backgroundColor || '#ffffff');
        safeUpdateValue('textColorInput', selectedElement.textColor || '#1f2937');
        safeUpdateValue('textColorText', selectedElement.textColor || '#1f2937');

        // Update borders & effects
        safeUpdateValue('borderWidthInput', selectedElement.borderWidth || 1);
        safeUpdateValue('borderRadiusInput', selectedElement.borderRadius || 0);
        safeUpdateValue('borderColorInput', selectedElement.borderColor || '#e5e7eb');
        safeUpdateValue('borderStyleInput', selectedElement.borderStyle || 'solid');
        safeUpdateValue('shadowInput', selectedElement.shadow || 'none');
        safeUpdateValue('opacityInput', selectedElement.opacity || 100);
        
        const opacityValue = document.getElementById('opacityValue');
        if (opacityValue) {
            opacityValue.textContent = (selectedElement.opacity || 100) + '%';
        }
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