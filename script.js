const fileList = document.getElementById('fileList');
const filePreview = document.getElementById('filePreview');
const previewContent = document.getElementById('previewContent');
const closePreviewButton = document.getElementById('closePreview'); // Close button
const saveContentButton = document.getElementById('saveContent'); // Save button
const deleteFileButton = document.getElementById('deleteFile'); // Delete button
const fileNameInput = document.getElementById('fileNameInput'); // Input for editing file name
const searchBar = document.getElementById('searchBar'); // Search bar for filtering files
const folderContents = document.getElementById('folderContents'); // Div to display folder contents
const fileTableBody = document.getElementById('fileTableBody'); // Table body for folder contents

let files = JSON.parse(localStorage.getItem('files')) || []; // Load files from localStorage
let currentFileIndex = null; // Variable to keep track of the currently selected file index

// Create a new folder
function createFolder() {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
        files.push({ name: folderName, type: 'folder', content: [] }); // Initialize with empty content array for folders
        saveFiles(); // Save to localStorage
        renderFiles();
    }
}

// Create a new file
function createFile() {
    const fileName = prompt("Enter file name:");
    if (fileName) {
        const folderIndex = prompt("Enter the folder index (or leave blank for root):");
        const newFile = { name: fileName, type: 'file', content: '' }; // Initialize with empty content

        // If the user specifies a folder, add the file to that folder
        if (folderIndex !== null && folderIndex !== '') {
            const index = parseInt(folderIndex);
            if (!isNaN(index) && index >= 0 && index < files.length && files[index].type === 'folder') {
                files[index].content.push(newFile); // Add file to the selected folder's content
                alert(`File "${fileName}" created inside folder "${files[index].name}"`);
            } else {
                files.push(newFile); // Add file at root level if no valid folder is selected
                alert(`File "${fileName}" created at root level`);
            }
        } else {
            files.push(newFile); // Add file at root level if no folder is selected
            alert(`File "${fileName}" created at root level`);
        }

        saveFiles(); // Save to localStorage
        renderFiles(); // Re-render files
    }
}

// Render the file list
function renderFiles() {
    fileList.innerHTML = ''; // Clear existing files
    files.forEach((file, index) => {
        const fileDiv = document.createElement('div');
        fileDiv.className = file.type;

        // Add icon based on file type
        const icon = file.type === 'folder' ? '📁' : '📄';
        fileDiv.innerHTML = `${icon} ${file.name}`; // Display icon with file name

        // If the file is a folder, handle its click event to show contents
        if (file.type === 'folder') {
            fileDiv.onclick = () => {
                currentFileIndex = index; // Set the current folder index
                showFolderContents(index); // Show the contents of the folder
            };

            // Allow folder div to accept drops
            fileDiv.ondragover = (event) => {
                event.preventDefault(); // Prevent default to allow drop
            };
            fileDiv.ondrop = (event) => {
                event.preventDefault(); // Prevent default behavior
                const draggedFileIndex = event.dataTransfer.getData('text/plain');
                moveFileToFolder(draggedFileIndex, index); // Move file to folder
            };
        } else {
            // Set draggable attribute for files
            fileDiv.setAttribute('draggable', true);
            fileDiv.ondragstart = (event) => {
                event.dataTransfer.setData('text/plain', index); // Store index of the file being dragged
            };

            fileDiv.onclick = () => previewFile(index); // Preview on click
        }

        fileList.appendChild(fileDiv);
    });
}

// Show folder contents
function showFolderContents(folderIndex) {
    const folder = files[folderIndex];
    folderContents.style.display = 'block'; // Show folder contents
    fileTableBody.innerHTML = ''; // Clear existing table rows

    // Populate the table with the files in the folder
    folder.content.forEach((file) => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${file.name}</td><td>${file.type}</td>`;
        fileTableBody.appendChild(row);
    });
}

// Preview the selected file or folder
function previewFile(index) {
    const selectedFile = files[index];
    currentFileIndex = index; // Store the current file index

    // Display content based on file type
    if (selectedFile.type === 'file') {
        previewContent.value = selectedFile.content || ''; // Use existing content if available
        fileNameInput.value = selectedFile.name; // Set input for file name
        folderContents.style.display = 'none'; // Hide folder contents
    } else {
        previewContent.value = `This is a folder: ${selectedFile.name}`;
        showFolderContents(index); // Show folder contents
    }

    filePreview.style.display = 'block'; // Show the file preview
}

// Close the file preview
function closePreview() {
    filePreview.style.display = 'none'; // Hide the preview
    previewContent.value = ''; // Reset content
    fileNameInput.value = ''; // Reset file name input
}

// Save the content of the file
function saveContent() {
    if (currentFileIndex !== null) { // Check if a file is currently selected
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

// Toggle dark mode
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
}

// Search and filter files
function searchItems() {
    const searchQuery = searchBar.value.toLowerCase();
    const filteredFiles = files.filter(file => file.name.toLowerCase().includes(searchQuery));
    renderFilteredFiles(filteredFiles); // Render filtered files
}

// Render filtered files based on search
function renderFilteredFiles(filteredFiles) {
    fileList.innerHTML = ''; // Clear existing files
    filteredFiles.forEach((file, index) => {
        const fileDiv = document.createElement('div');
        fileDiv.className = file.type;

        // Add icon based on file type
        const icon = file.type === 'folder' ? '📁' : '📄';
        fileDiv.innerHTML = `${icon} ${file.name}`; // Display icon with file name

        // Set draggable attribute for files
        if (file.type === 'file') {
            fileDiv.setAttribute('draggable', true);
            fileDiv.ondragstart = (event) => {
                event.dataTransfer.setData('text/plain', index); // Store index of the file being dragged
            };
        }

        // Allow folder div to accept drops
        if (file.type === 'folder') {
            fileDiv.ondragover = (event) => {
                event.preventDefault(); // Prevent default to allow drop
            };
            fileDiv.ondrop = (event) => {
                event.preventDefault(); // Prevent default behavior
                const draggedFileIndex = event.dataTransfer.getData('text/plain');
                moveFileToFolder(draggedFileIndex, index); // Move file to folder
            };
        }

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
    renderFiles(); // Re-render files to reflect changes
}

// Function to move a file to a folder
function moveFileToFolder(fileIndex, folderIndex) {
    const fileToMove = files[fileIndex]; // Get the file to move
    const targetFolder = files[folderIndex]; // Get the target folder

    if (fileToMove && targetFolder && targetFolder.type === 'folder') {
        files.splice(fileIndex, 1); // Remove file from original location
        targetFolder.content.push(fileToMove); // Add file to target folder's content
        alert(`Moved file "${fileToMove.name}" to folder "${targetFolder.name}"`);
        saveFiles(); // Save to localStorage
        renderFiles(); // Re-render files to reflect changes
    }
}

// Add event listeners
closePreviewButton.onclick = closePreview; // Close button event
saveContentButton.onclick = saveContent; // Save button event
deleteFileButton.onclick = deleteFile; // Delete button event
searchBar.addEventListener('input', searchItems); // Search bar event

// Initial rendering of files
renderFiles();


