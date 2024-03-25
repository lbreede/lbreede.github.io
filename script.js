// Get all elements with the class "folder"
const folders = document.querySelectorAll('.folder');

// Add event listeners for mousedown and mousemove events
folders.forEach(folder => {
  folder.addEventListener('mousedown', startDragging);
});

let activeFolder = null;
let initialX = 0;
let initialY = 0;

function startDragging(e) {
  e.preventDefault(); // Prevent default action (e.g., following the link)
  activeFolder = e.target.closest('.folder');
  if (activeFolder) {
    initialX = e.clientX - activeFolder.getBoundingClientRect().left;
    initialY = e.clientY - activeFolder.getBoundingClientRect().top;
    document.addEventListener('mousemove', dragFolder);
    document.addEventListener('mouseup', stopDragging);
  }
}

function dragFolder(e) {
  if (activeFolder && e.buttons === 1) { // Check if left mouse button is pressed
    e.preventDefault(); // Prevent default action (e.g., selecting text)
    const newX = e.clientX - initialX;
    const newY = e.clientY - initialY;
    activeFolder.style.left = newX + 'px';
    activeFolder.style.top = newY + 'px';
  }
}

function stopDragging() {
  activeFolder = null;
  document.removeEventListener('mousemove', dragFolder);
  document.removeEventListener('mouseup', stopDragging);
}

function doubleClick(file) {
  window.location.href = file;
}
