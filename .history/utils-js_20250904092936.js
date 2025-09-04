// utils.js - Utility Functions

// Snap value to grid
function snapToGrid(value, gridSize = 20) {
    return Math.round(value / gridSize) * gridSize;
}

// Generate unique ID
function generateId() {
    return Math.random().toString(36).substr(2, 9);
}

// Get default element properties
function getDefaultElement(type) {
    const defaults = {
        container: {
            width: 400,
            height: 300,
            backgroundColor: '#f9fafb',
            textContent: 'Main Container',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 400,
            textAlign: 'center',
            lineHeight: 1.5,
            tag: 'main'
        },
        div: {
            width: 200,
            height: 150,
            backgroundColor: '#ffffff',
            textContent: 'Division',
            borderRadius: 4,
            fontSize: 14,
            fontWeight: 400,
            textAlign: 'center',
            lineHeight: 1.5,
            tag: 'div'
        },
        text: {
            width: 150,
            height: 40,
            backgroundColor: 'transparent',
            textContent: 'Sample Text',
            fontSize: 16,
            borderRadius: 0,
            fontWeight: 400,
            textAlign: 'left',
            lineHeight: 1.5,
            tag: 'p'
        },
        button: {
            width: 120,
            height: 40,
            backgroundColor: '#3b82f6',
            textContent: 'Button',
            fontSize: 14,
            borderRadius: 6,
            fontWeight: 500,
            textAlign: 'center',
            lineHeight: 1.5,
            tag: 'button'
        }
    };

    return {
        type,
        ...defaults[type],
        // Layout
        display: 'block',
        position: 'absolute',
        float: 'none',
        clear: 'none',
        isolation: 'auto',
        objectFit: 'fill',
        objectPosition: 'center',
        overflow: 'visible',
        overflowX: 'visible',
        overflowY: 'visible',
        overscrollBehavior: 'auto',
        visibility: 'visible',
        zIndex: 1,
        
        // Flexbox & Grid
        flexBasis: 'auto',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        flex: '0 1 auto',
        flexGrow: 0,
        flexShrink: 1,
        order: 0,
        gridTemplateColumns: 'none',
        gridColumn: 'auto',
        gridTemplateRows: 'none',
        gridRow: 'auto',
        gridAutoFlow: 'row',
        gridAutoColumns: 'auto',
        gridAutoRows: 'auto',
        gap: 0,
        justifyContent: 'start',
        justifyItems: 'stretch',
        justifySelf: 'auto',
        alignContent: 'start',
        alignItems: 'stretch',
        alignSelf: 'auto',
        placeContent: 'start',
        placeItems: 'stretch',
        placeSelf: 'auto',
        
        // Spacing
        padding: 8,
        paddingTop: 8,
        paddingRight: 8,
        paddingBottom: 8,
        paddingLeft: 8,
        margin: 4,
        marginTop: 4,
        marginRight: 4,
        marginBottom: 4,
        marginLeft: 4,
        
        // Sizing
        width: defaults[type]?.width || 200,
        minWidth: 0,
        maxWidth: 'none',
        height: defaults[type]?.height || 150,
        minHeight: 0,
        maxHeight: 'none',
        
        // Typography
        fontFamily: 'system-ui',
        fontSize: defaults[type]?.fontSize || 14,
        fontSmoothing: 'auto',
        fontStyle: 'normal',
        fontWeight: defaults[type]?.fontWeight || 400,
        fontStretch: 'normal',
        fontVariantNumeric: 'normal',
        letterSpacing: 'normal',
        lineClamp: 'none',
        lineHeight: defaults[type]?.lineHeight || 1.5,
        listStyleImage: 'none',
        listStylePosition: 'outside',
        listStyleType: 'disc',
        textAlign: defaults[type]?.textAlign || 'left',
        textColor: '#1f2937',
        textDecorationLine: 'none',
        textDecorationColor: 'currentColor',
        textDecorationStyle: 'solid',
        textDecorationThickness: 'auto',
        textUnderlineOffset: 'auto',
        textTransform: 'none',
        textOverflow: 'clip',
        textWrap: 'wrap',
        textIndent: 0,
        verticalAlign: 'baseline',
        whiteSpace: 'normal',
        wordBreak: 'normal',
        overflowWrap: 'normal',
        hyphens: 'manual',
        content: 'none',
        
        // Backgrounds
        backgroundAttachment: 'scroll',
        backgroundClip: 'border-box',
        backgroundColor: defaults[type]?.backgroundColor || '#ffffff',
        backgroundImage: 'none',
        backgroundOrigin: 'padding-box',
        backgroundPosition: 'center',
        backgroundRepeat: 'repeat',
        backgroundSize: 'auto',
        
        // Borders
        borderRadius: defaults[type]?.borderRadius || 0,
        borderTopLeftRadius: defaults[type]?.borderRadius || 0,
        borderTopRightRadius: defaults[type]?.borderRadius || 0,
        borderBottomRightRadius: defaults[type]?.borderRadius || 0,
        borderBottomLeftRadius: defaults[type]?.borderRadius || 0,
        borderWidth: 1,
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderLeftWidth: 1,
        borderColor: '#e5e7eb',
        borderTopColor: '#e5e7eb',
        borderRightColor: '#e5e7eb',
        borderBottomColor: '#e5e7eb',
        borderLeftColor: '#e5e7eb',
        borderStyle: 'solid',
        borderTopStyle: 'solid',
        borderRightStyle: 'solid',
        borderBottomStyle: 'solid',
        borderLeftStyle: 'solid',
        outlineWidth: 0,
        outlineColor: 'transparent',
        outlineStyle: 'none',
        outlineOffset: 0,
        
        // Effects
        boxShadow: 'none',
        textShadow: 'none',
        opacity: 100,
        mixBlendMode: 'normal',
        backgroundBlendMode: 'normal',
        
        // Transforms
        transform: 'none',
        transformOrigin: 'center',
        rotate: 0,
        scale: 1,
        skew: 0,
        translateX: 0,
        translateY: 0,
        
        // Transitions
        transitionProperty: 'all',
        transitionDuration: '150ms',
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDelay: '0ms',
        
        // Interactivity
        cursor: 'auto',
        pointerEvents: 'auto',
        resize: 'none',
        userSelect: 'auto',
        
        // Custom properties
        textContent: defaults[type]?.textContent || '',
        tag: defaults[type]?.tag || 'div'
    };
}

// Get animation CSS class
function getAnimationClass(animationType) {
    if (animationType === 'none') return '';
    const animationMap = {
        bounce: 'animate-bounce',
        pulse: 'animate-pulse',
        spin: 'animate-spin'
    };
    return animationMap[animationType] || '';
}