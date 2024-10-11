const fileList = document.getElementById('fileList');

function createFile() {
    const fileName = prompt('Enter file name:');
    if (fileName) {
        addItem(fileName, 'file');
    }
}

function createFolder() {
    const folderName = prompt('Enter folder name:');
    if (folderName) {
        addItem(folderName, 'folder');
    }
}

function addItem(name, type) {
    const itemDiv = document.createElement('div');
    itemDiv.className = type;
    itemDiv.draggable = true;
    itemDiv.innerHTML = `
        <span>${type === 'folder' ? '📁' : '📄'} ${name}</span>
        <button onclick="deleteSingleItem(this)">Delete</button>
    `;
    itemDiv.addEventListener('dragstart', dragStart);
    itemDiv.addEventListener('dragover', dragOver);
    itemDiv.addEventListener('drop', dropItem);
    fileList.appendChild(itemDiv);
}

function deleteFile() {
    const items = fileList.children;
    if (items.length > 0) {
        fileList.removeChild(items[items.length - 1]);
    } else {
        alert('No items to delete!');
    }
}

function deleteSingleItem(button) {
    const item = button.parentNode;
    fileList.removeChild(item);
}

function searchFiles() {
    const query = document.getElementById('search').value.toLowerCase();
    const items = fileList.getElementsByClassName('file');
    const folders = fileList.getElementsByClassName('folder');

    Array.from([...items, ...folders]).forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'flex' : 'none';
    });
}

function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.innerHTML);
    event.target.style.opacity = '0.5';
}

function dragOver(event) {
    event.preventDefault();
}

function dropItem(event) {
    event.preventDefault();
    event.target.style.opacity = '1';
    const draggedHTML = event.dataTransfer.getData('text/plain');
    event.target.innerHTML = draggedHTML;
}
