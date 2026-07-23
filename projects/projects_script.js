// Make all project rows clickable
document.querySelectorAll('.project-row').forEach(row => {
    row.addEventListener('click', function() {
        // Get the project ID from the row
        const projectId = this.id;

        // Find the corresponding expandable content row
        const expandableRow = document.getElementById('expand-' + projectId);

        if (expandableRow) {
            // Toggle visibility
            if (expandableRow.style.display === 'table-row' ||
                expandableRow.style.display === '') {
                expandableRow.style.display = 'none';
                // Remove active class from row
                this.classList.remove('active');
            } else {
                // Close all other expandable rows (accordion behavior)
                document.querySelectorAll('.expandable-content').forEach(row => {
                    row.style.display = 'none';
                    row.previousElementSibling.classList.remove('active');
                });

                expandableRow.style.display = 'table-row';
                this.classList.add('active');
            }
        }
    });

    // Add cursor pointer to indicate clickability
    row.style.cursor = 'pointer';
});

// Hide all expandable content initially
document.querySelectorAll('.expandable-content').forEach(row => {
    row.style.display = 'none';
});
