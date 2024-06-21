document.addEventListener('click', function(event) {
    const screenWidth = window.innerWidth;
    const clickX = event.clientX;

    // Define a threshold for the side of the screen
    const threshold = 50; // You can adjust this value as needed

    // Check if the click occurred close to the side of the screen
    if (clickX < threshold) {
        // Scroll all containers to the left
        moveContainers(-100);
    } else if (clickX > screenWidth - threshold) {
        // Scroll all containers to the right
        moveContainers(100);
    }
});

function moveContainers(distance) {
    // Select all containers (adjust the selector as needed)
    const containers = document.querySelectorAll('.container');

    // Loop through each container and scroll horizontally
    containers.forEach(function(container) {
        container.scrollLeft += distance;
    });
}