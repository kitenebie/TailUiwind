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
        document.getElementById('textColorInput').addEventListener('input', (e) => this.updateProperty('textColor', e.target.value));
        document.getElementById('textColorText').addEventListener('input', (e) => this.updateProperty('textColor', e.target.value));
        document.getElementById('borderColorInput').addEventListener('input', (e) => this.updateProperty('borderColor', e.target.value));
        document.getElementById('borderWidthInput').addEventListener('input', (e) => this.updateProperty('borderWidth', parseInt(e.target.value) || 0));
        document.getElementById('borderRadiusInput').addEventListener('input', (e) => this.updateProperty('borderRadius', parseInt(e.target.value) || 0));
        document.getElementById('paddingInput').addEventListener('input', (e) => this.updateProperty('padding', parseInt(e.target.value) || 0));
        
        // New styling inputs
        document.getElementById('shadowInput').addEventListener('change', (e) => this.updateProperty('shadow', e.target.value));
        document.getElementById('opacityInput').addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            this.updateProperty('opacity', value);
            document.getElementById('opacityValue').textContent = value + '%';
        });

        // Layout & Display inputs
        document.getElementById('displayInput').addEventListener('change', (e) => {
            this.updateProperty('display', e.target.value);
            this.toggleFlexSection(e.target.value === 'flex');
        });
        document.getElementById('positionInput').addEventListener('change', (e) => this.updateProperty('position', e.target.value));
        
        // Flexbox inputs
        document.getElementById('justifyContentInput').addEventListener('change', (e) => this.updateProperty('justifyContent', e.target.value));
        document.getElementById('alignItemsInput').addEventListener('change', (e) => this.updateProperty('alignItems', e.target.value));

        // Text content inputs
        document.getElementById('textContentInput').addEventListener('input', (e) => this.updateProperty('textContent', e.target.value));
        document.getElementById('fontSizeInput').addEventListener('change', (e) => this.updateProperty('fontSize', parseInt(e.target.value) || 16));
        document.getElementById('fontWeightInput').addEventListener('change', (e) => this.updateProperty('fontWeight', parseInt(e.target.value) || 400));
        document.getElementById('textAlignInput').addEventListener('change', (e) => this.updateProperty('textAlign', e.target.value));
        document.getElementById('lineHeightInput').addEventListener('change', (e) => this.updateProperty('lineHeight', parseFloat(e.target.value) || 1.5));

        // Image inputs
        document.getElementById('imageUrlInput').addEventListener('input', (e) => this.updateProperty('imageUrl', e.target.value));
        document.getElementById('imageUploadInput').addEventListener('change', (e) => this.handleImageUpload(e));
        document.getElementById('objectFitInput').addEventListener('change', (e) => this.updateProperty('objectFit', e.target.value));
        document.getElementById('altTextInput').addEventListener('input', (e) => this.updateProperty('altText', e.target.value));

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
        document.getElementById('textColorInput').addEventListener('input', (e) => {
            document.getElementById('textColorText').value = e.target.value;
        });
        document.getElementById('textColorText').addEventListener('input', (e) => {
            document.getElementById('textColorInput').value = e.target.value;
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

        // Update layout & display inputs
        document.getElementById('displayInput').value = selectedElement.display || 'block';
        document.getElementById('positionInput').value = selectedElement.position || 'absolute';
        document.getElementById('floatInput').value = selectedElement.float || 'none';
        document.getElementById('overflowInput').value = selectedElement.overflow || 'visible';
        document.getElementById('zIndexInput').value = selectedElement.zIndex || 1;

        // Update sizing inputs
        document.getElementById('widthInput').value = selectedElement.width || 0;
        document.getElementById('heightInput').value = selectedElement.height || 0;
        document.getElementById('minWidthInput').value = selectedElement.minWidth || 0;
        document.getElementById('maxWidthInput').value = selectedElement.maxWidth || 0;

        // Update spacing inputs
        document.getElementById('paddingTopInput').value = selectedElement.paddingTop || 8;
        document.getElementById('paddingRightInput').value = selectedElement.paddingRight || 8;
        document.getElementById('paddingBottomInput').value = selectedElement.paddingBottom || 8;
        document.getElementById('paddingLeftInput').value = selectedElement.paddingLeft || 8;
        document.getElementById('marginTopInput').value = selectedElement.marginTop || 4;
        document.getElementById('marginRightInput').value = selectedElement.marginRight || 4;
        document.getElementById('marginBottomInput').value = selectedElement.marginBottom || 4;
        document.getElementById('marginLeftInput').value = selectedElement.marginLeft || 4;

        // Update typography inputs
        document.getElementById('textContentInput').value = selectedElement.textContent || '';
        document.getElementById('fontFamilyInput').value = selectedElement.fontFamily || 'sans';
        document.getElementById('fontSizeInput').value = selectedElement.fontSize || 16;
        document.getElementById('fontWeightInput').value = selectedElement.fontWeight || 400;
        document.getElementById('textAlignInput').value = selectedElement.textAlign || 'left';
        document.getElementById('lineHeightInput').value = selectedElement.lineHeight || 1.5;
        document.getElementById('textTransformInput').value = selectedElement.textTransform || 'none';

        // Update colors & backgrounds
        document.getElementById('backgroundColorInput').value = selectedElement.backgroundColor || '#ffffff';
        document.getElementById('backgroundColorText').value = selectedElement.backgroundColor || '#ffffff';
        document.getElementById('textColorInput').value = selectedElement.textColor || '#1f2937';
        document.getElementById('textColorText').value = selectedElement.textColor || '#1f2937';

        // Update borders & effects
        document.getElementById('borderWidthInput').value = selectedElement.borderWidth || 1;
        document.getElementById('borderRadiusInput').value = selectedElement.borderRadius || 0;
        document.getElementById('borderColorInput').value = selectedElement.borderColor || '#e5e7eb';
        document.getElementById('borderStyleInput').value = selectedElement.borderStyle || 'solid';
        document.getElementById('shadowInput').value = selectedElement.shadow || 'none';
        document.getElementById('opacityInput').value = selectedElement.opacity || 100;
        document.getElementById('opacityValue').textContent = (selectedElement.opacity || 100) + '%';
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