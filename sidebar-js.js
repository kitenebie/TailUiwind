// sidebar.js - Sidebar Management with extended UI categories and components

class SidebarManager {
    constructor() {
        this.populateSidebar();
        this.initializeEventListeners();
    }

    // Populate sidebar with all UI categories and components
    populateSidebar() {
        const sidebar = document.getElementById('sidebar');
        if (!sidebar) return;

        const sections = {
            "Application UI": [
                "Application Shells", "Stacked Layouts", "Sidebar Layouts", "Multi-Column Layouts",
                "Headings", "Page Headings", "Card Headings", "Section Headings",
                "Data Display", "Description Lists", "Stats", "Calendars",
                "Lists", "Stacked Lists", "Tables", "Grid Lists", "Feeds",
                "Forms", "Form Layouts", "Input Groups", "Select Menus",
                "Sign-in and Registration", "Textareas", "Radio Groups", "Checkboxes", "Toggles",
                "Action Panels", "Comboboxes",
                "Feedback", "Alerts", "Empty States",
                "Navigation", "Navbars", "Pagination", "Tabs", "Vertical Navigation", "Sidebar Navigation", "Breadcrumbs",
                "Progress Bars", "Command Palettes",
                "Overlays", "Modal Dialogs", "Drawers", "Notifications",
                "Elements", "Avatars", "Badges", "Dropdowns", "Buttons", "Button Groups",
                "Layout", "Containers", "Cards", "List containers", "Media Objects", "Dividers",
                "Page Examples", "Home Screens", "Detail Screens", "Settings Screens"
            ],
            "Components": [
                "Introduction", "Autocomplete", "Command palette", "Dialog", "Disclosure",
                "Dropdown menu", "Popover", "Select", "Tabs"
            ]
        };

        sidebar.innerHTML = "";

        Object.entries(sections).forEach(([category, items]) => {
            const categoryEl = document.createElement('div');
            categoryEl.className = "sidebar-category mb-4";

            const heading = document.createElement('h3');
            heading.textContent = category;
            heading.className = "font-bold text-gray-700 mb-2";
            categoryEl.appendChild(heading);

            const list = document.createElement('ul');
            list.className = "space-y-1";

            items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                li.className = "shape-item cursor-pointer px-2 py-1 rounded hover:bg-gray-100";
                li.setAttribute('draggable', 'true');
                li.setAttribute('data-type', item.toLowerCase().replace(/\s+/g, '-'));
                list.appendChild(li);
            });

            categoryEl.appendChild(list);
            sidebar.appendChild(categoryEl);
        });
    }

    // Initialize sidebar event listeners
    initializeEventListeners() {
        const shapeItems = document.querySelectorAll('.shape-item');
        
        shapeItems.forEach(item => {
            // Handle drag start
            item.addEventListener('dragstart', (e) => {
                const type = item.getAttribute('data-type');
                console.log('Drag started for type:', type);
                
                // Set drag data
                e.dataTransfer.setData('text/plain', type);
                e.dataTransfer.effectAllowed = 'copy';
                
                // Set dragged type in canvas manager
                if (window.canvasManager) {
                    window.canvasManager.setDraggedType(type);
                }
                
                // Visual feedback
                item.classList.add('opacity-50');
                
                // Create drag image
                const dragImage = item.cloneNode(true);
                dragImage.style.transform = 'rotate(-5deg)';
                dragImage.style.opacity = '0.8';
                document.body.appendChild(dragImage);
                e.dataTransfer.setDragImage(dragImage, 50, 20);
                
                // Remove drag image after drag starts
                setTimeout(() => {
                    if (document.body.contains(dragImage)) {
                        document.body.removeChild(dragImage);
                    }
                }, 0);
            });

            // Handle drag end
            item.addEventListener('dragend', () => {
                item.classList.remove('opacity-50');
            });
        });
    }
}

// Initialize sidebar manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.sidebarManager = new SidebarManager();
});
