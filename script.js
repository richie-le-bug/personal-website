// Simple script to highlight current page in navigation
document.addEventListener('DOMContentLoaded', function() {
    const currentPage = window.location.pathname;
    const navLinks = document.querySelectorAll('#nav-links a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('current');
        } else {
            link.classList.remove('current');
        }
    });
    
    // Ensure the scroll panel height is properly set
    function adjustLayout() {
        const header = document.querySelector('.header');
        const scrollPanel = document.querySelector('.scroll-panel');
        const headerHeight = header.offsetHeight;
        
        // Set max height for scroll panel based on available space
        scrollPanel.style.maxHeight = `calc(100vh - ${headerHeight}px - 4rem)`; // 4rem for padding
    }
    
    // Adjust on load and resize
    adjustLayout();
    window.addEventListener('resize', adjustLayout);
});