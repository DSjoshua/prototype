const fileList = document.getElementById('fileList');
const filePreview = document.getElementById('filePreview');
const previewContent = document.getElementById('previewContent');
const closePreviewButton = document.getElementById('closePreview'); // Close button
const saveContentButton = document.getElementById('saveContent'); // Save button
const deleteFileButton = document.getElementById('deleteFile'); // Delete button
const fileNameInput = document.getElementById('fileNameInput'); // Input for editing file name
const searchBar = document.getElementById('searchBar'); // Search bar for filtering files

let files = JSON.parse(localStorage.getItem('files')) || []; // Load files from localStorage
let currentFileIndex = null; // Variable to keep track of the currently selected file index

function createFolder() {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
        files.push({ name: folderName, type: 'folder' });
        saveFiles(); // Save to localStorage
        renderFiles();
    }
}

function createFile() {
    const fileName = prompt("Enter file name:");
    if (fileName) {
        files.push({ name: fileName, type: 'file', content: '' }); // Initialize with empty content
        saveFiles(); // Save to localStorage
        renderFiles();
    }
}

function renderFiles() {
    fileList.innerHTML = ''; // Clear existing files
    files.forEach((file, index) => {
        const fileDiv = document.createElement('div');
        fileDiv.className = file.type;
        fileDiv.innerHTML = file.name;
        fileDiv.onclick = () => previewFile(index); // Preview on click
        fileList.appendChild(fileDiv);
    });
}

function previewFile(index) {
    const selectedFile = files[index];
    currentFileIndex = index; // Store the current file index

    // Display content based on file type
    if (selectedFile.type === 'file') {
        previewContent.value = selectedFile.content || ''; // Use existing content if available
        fileNameInput.value = selectedFile.name; // Set input for file name
    } else {
        previewContent.value = `This is a folder: ${selectedFile.name}`;
    }

    filePreview.style.display = 'block'; // Show the file preview
}

function closePreview() {
    filePreview.style.display = 'none'; // Hide the preview
    previewContent.value = ''; // Reset content
    fileNameInput.value = ''; // Reset file name input
}

function saveContent() {
    if (currentFileIndex !== null) { // Check if a file is currently selected
        // Save the edited content directly to the current file
        files[currentFileIndex].content = previewContent.value; // Save the edited content
        
        // Update the file name if changed
        const newFileName = fileNameInput.value.trim();
        if (newFileName) {
            files[currentFileIndex].name = newFileName; // Update file name
        }
        
        alert('Content saved!'); // Notify user
        saveFiles(); // Save to localStorage
        renderFiles(); // Re-render files to reflect changes
    } else {
        alert('Error: No file selected!');
    }
}

// Delete the selected file or folder
function deleteFile() {
    if (currentFileIndex !== null) {
        const confirmation = confirm("Are you sure you want to delete this file/folder?");
        if (confirmation) {
            files.splice(currentFileIndex, 1); // Remove the file/folder from the array
            saveFiles(); // Save to localStorage
            closePreview(); // Close the preview
            renderFiles(); // Re-render files to reflect changes
            alert('File/Folder deleted successfully!'); // Notify user
        }
    } else {
        alert('Error: No file selected to delete!');
    }
}

// Save files to localStorage
function saveFiles() {
    localStorage.setItem('files', JSON.stringify(files));
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

function searchItems() {
    const searchQuery = searchBar.value.toLowerCase();
    const filteredFiles = files.filter(file => file.name.toLowerCase().includes(searchQuery));
    renderFilteredFiles(filteredFiles); // Render filtered files
}

function renderFilteredFiles(filteredFiles) {
    fileList.innerHTML = ''; // Clear existing files
    filteredFiles.forEach((file, index) => {
        const fileDiv = document.createElement('div');
        fileDiv.className = file.type;
        fileDiv.innerHTML = file.name;
        fileDiv.onclick = () => previewFile(files.indexOf(file)); // Reference original array for preview
        fileList.appendChild(fileDiv);
    });
}

// Sample sort function (sort by name or type)
function sortItems(type) {
    if (type === 'name') {
        files.sort((a, b) => a.name.localeCompare(b.name));
    } else if (type === 'type') {
        files.sort((a, b) => a.type.localeCompare(b.type));
    }
    saveFiles(); // Save to localStorage after sorting
    renderFiles();
}

// Event listeners for close, save, and delete buttons
closePreviewButton.onclick = closePreview;
saveContentButton.onclick = saveContent;
deleteFileButton.onclick = deleteFile; // Add event listener for delete button

// Load files on page load
document.addEventListener('DOMContentLoaded', renderFiles);
