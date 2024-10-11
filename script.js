const fileList = document.getElementById('fileList');
const filePreview = document.getElementById('filePreview');
const previewContent = document.getElementById('previewContent');
const closePreviewButton = document.getElementById('closePreview'); // Close button
const saveContentButton = document.getElementById('saveContent'); // Save button
const fileNameInput = document.getElementById('fileNameInput'); // Input for editing file name

let files = []; // Array to store files and folders
let currentFileIndex = null; // Variable to keep track of the currently selected file index

function createFolder() {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
        files.push({ name: folderName, type: 'folder' });
        renderFiles();
    }
}

function createFile() {
    const fileName = prompt("Enter file name:");
    if (fileName) {
        files.push({ name: fileName, type: 'file', content: '' }); // Initialize with empty content
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
        renderFiles(); // Re-render files to reflect changes
    } else {
        alert('Error: No file selected!');
    }
}

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

function searchItems() {
    const searchQuery = document.getElementById('searchBar').value.toLowerCase();
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
    renderFiles();
}

// Event listeners for close and save buttons
closePreviewButton.onclick = closePreview;
saveContentButton.onclick = saveContent;
