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

document.addEventListener('DOMContentLoaded', () => {
  const folderDivs = document.querySelectorAll('.folder-pos');
  const storageKey = 'folderPositions';

  // Load saved positions
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    const positions = JSON.parse(saved);
    folderDivs.forEach(div => {
      const key = Array.from(div.classList).find(c => c.endsWith('-pos') && c !== 'folder-pos');
      if (positions[key]) {
        div.style.top = positions[key].top;
        div.style.left = positions[key].left;
      }
    });
  }

  let dragTarget = null;
  let offsetX = 0;
  let offsetY = 0;

  folderDivs.forEach(div => {
    div.style.cursor = 'grab';
    div.addEventListener('mousedown', (e) => {
      dragTarget = div;
      offsetX = e.clientX - div.offsetLeft;
      offsetY = e.clientY - div.offsetTop;
      div.style.zIndex = 1000;
      div.style.cursor = 'grabbing';
      e.preventDefault();
    });
  });

  document.addEventListener('mousemove', (e) => {
    if (dragTarget) {
      let x = e.clientX - offsetX;
      let y = e.clientY - offsetY;
      // Keep within window
      x = Math.max(0, Math.min(window.innerWidth - dragTarget.offsetWidth, x));
      y = Math.max(0, Math.min(window.innerHeight - dragTarget.offsetHeight, y));
      dragTarget.style.left = x + 'px';
      dragTarget.style.top = y + 'px';
    }
  });

  document.addEventListener('mouseup', () => {
    if (dragTarget) {
      // Save all positions
      const positions = {};
      folderDivs.forEach(div => {
        const key = Array.from(div.classList).find(c => c.endsWith('-pos') && c !== 'folder-pos');
        positions[key] = {
          top: div.style.top,
          left: div.style.left
        };
      });
      localStorage.setItem(storageKey, JSON.stringify(positions));
      dragTarget.style.zIndex = '';
      dragTarget.style.cursor = 'grab';
      dragTarget = null;
    }
  });
});
