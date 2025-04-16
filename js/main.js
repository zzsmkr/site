document.addEventListener('DOMContentLoaded', function() {
    // Initialize windows
    const windows = document.querySelectorAll('.draggable-window');
    const dockItems = document.querySelectorAll('.dock-item');
    const closeButtons = document.querySelectorAll('.close');
    
    // Z-index counter for window stacking
    let zIndexCounter = 100;
    
    // Make windows draggable
    windows.forEach(window => {
        makeDraggable(window);
    });
    
    // Dock item click handlers
    dockItems.forEach(item => {
        item.addEventListener('click', function() {
            const windowId = this.getAttribute('data-window') + '-window';
            const targetWindow = document.getElementById(windowId);
            
            if (targetWindow) {
                // Position the window closer to the center with some variation
                const viewportWidth = document.body.clientWidth;
                const viewportHeight = document.body.clientHeight;
                const windowWidth = targetWindow.offsetWidth;
                const windowHeight = targetWindow.offsetHeight;
                
                // Calculate center position
                const centerX = (viewportWidth - windowWidth) / 2;
                const centerY = (viewportHeight - windowHeight) / 2;
                
                // Add some variation but keep it within the central area (±20% of viewport)
                const variationRangeX = viewportWidth * 0.2;
                const variationRangeY = viewportHeight * 0.2;
                
                const randomX = centerX + (Math.random() * variationRangeX - variationRangeX/2);
                const randomY = centerY + (Math.random() * variationRangeY - variationRangeY/2);
                
                // Ensure window stays within viewport bounds
                const finalX = Math.max(0, Math.min(randomX, viewportWidth - windowWidth));
                const finalY = Math.max(0, Math.min(randomY, viewportHeight - windowHeight));
                
                targetWindow.style.left = finalX + 'px';
                targetWindow.style.top = finalY + 'px';
                
                // Show window with animation
                openWindow(targetWindow);
            }
        });
    });
    
    // Close button handlers
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const window = this.closest('.window');
            if (window && !window.classList.contains('main-window')) {
                closeWindow(window);
            }
        });
    });
    
    // Window focus handler
    windows.forEach(window => {
        window.addEventListener('mousedown', function() {
            bringToFront(this);
        });
    });
    
    // Function to make an element draggable
    function makeDraggable(element) {
        const header = element.querySelector('.window-header');
        let isDragging = false;
        let offsetX, offsetY;
        
        header.addEventListener('mousedown', startDrag);
        
        function startDrag(e) {
            // Don't drag if clicking on window controls
            if (e.target.classList.contains('control')) return;
            
            isDragging = true;
            offsetX = e.clientX - element.getBoundingClientRect().left;
            offsetY = e.clientY - element.getBoundingClientRect().top;
            
            // Bring window to front when starting to drag
            bringToFront(element);
            
            // Add global event listeners
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
            
            // Prevent text selection during drag
            e.preventDefault();
        }
        
        function drag(e) {
            if (!isDragging) return;
            
            // Calculate new position
            let newX = e.clientX - offsetX;
            let newY = e.clientY - offsetY;
            
            // Constrain to viewport
            const maxX = document.body.clientWidth - element.offsetWidth;
            const maxY = document.body.clientHeight - element.offsetHeight;
            
            newX = Math.max(0, Math.min(newX, maxX));
            newY = Math.max(0, Math.min(newY, maxY));
            
            // Apply new position
            element.style.left = newX + 'px';
            element.style.top = newY + 'px';
        }
        
        function stopDrag() {
            isDragging = false;
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDrag);
        }
    }
    
    // Function to bring a window to the front
    function bringToFront(window) {
        zIndexCounter++;
        window.style.zIndex = zIndexCounter;
    }
    
    // Function to open a window with animation
    function openWindow(window) {
        // Set initial position if not set
        if (!window.style.left) {
            window.style.left = '50%';
            window.style.top = '50%';
            window.style.transform = 'translate(-50%, -50%)';
        }
        
        // Display the window
        window.style.display = 'block';
        
        // Bring to front
        bringToFront(window);
        
        // Animate opening with GSAP
        gsap.fromTo(window, 
            { opacity: 0, scale: 0.8 }, 
            { 
                opacity: 1, 
                scale: 1, 
                duration: 0.3, 
                ease: "back.out(1.7)",
                onStart: () => {
                    window.classList.add('window-active');
                }
            }
        );
    }
    
    // Function to close a window with animation
    function closeWindow(window) {
        gsap.to(window, {
            opacity: 0,
            scale: 0.8,
            duration: 0.2,
            ease: "power2.in",
            onComplete: () => {
                window.classList.remove('window-active');
                window.style.display = 'none';
            }
        });
    }
});
