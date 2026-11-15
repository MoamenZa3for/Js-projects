let notes = [];
let editingNoteId = null;

function loadNotes() {
    const savedNotes = localStorage.getItem('quickNotes');
    return savedNotes ? JSON.parse(savedNotes) : [];
}

function saveNote(event) {
    event.preventDefault();

    const title = document.getElementById('noteTitle').value.trim();
    const content = document.getElementById('noteContent').value.trim();

    if (editingNoteId) {
        // UPDATE EXISTING NOTE
        const noteIndex = notes.findIndex(note => note.id === editingNoteId);
        if (noteIndex !== -1) {
            notes[noteIndex] = {
                ...notes[noteIndex],
                title: title,
                content: content
            };
        }
    } else {
        // ADD NEW NOTE
        notes.unshift({
            id: generateId(),
            title: title,
            content: content
        });
    }

    closeNoteDialog();
    saveNotes();
    renderNotes();
}

function deleteNote(noteId) {
    notes = notes.filter(note => note.id != noteId);
    saveNotes();
    renderNotes();
}

function generateId() {
    return Date.now().toString();
}

function saveNotes() {
    localStorage.setItem('quickNotes', JSON.stringify(notes));
}

function renderNotes() {
    const notesContainer = document.getElementById('notesCont');

    if (notes.length === 0) {
        notesContainer.innerHTML = `
            <div class="empty-state">
                <h2>No notes yet</h2>
                <p>Create your first note to get started</p>
                <button class="add-note-btn" onclick="openNoteDialog()">+ Add Your First Note</button>
            </div>
        `;
        return;
    }

    notesContainer.innerHTML = notes.map(note => `
        <div class="note-card">
            <div>
                <h3 class="note-title">${escapeHTML(note.title)}</h3>
                <p class="note-content">${escapeHTML(note.content)}</p>
            </div>
            <div class="note-actions">
                <button class="note-action-btn edit-btn" onclick="openNoteDialog('${note.id}')">✏️ Edit</button>
                <button class="note-action-btn delete-btn" onclick="deleteNote('${note.id}')">🗑️ Delete</button>
            </div>
        </div>
    `).join('');
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g,
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

function openNoteDialog(noteId = null) {
    const dialog = document.getElementById('noteDial');
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');

    if (noteId) {
        // EDIT MODE
        const noteToEdit = notes.find(note => note.id === noteId);
        if (noteToEdit) {
            editingNoteId = noteId;
            document.getElementById('dialogTitle').textContent = 'Edit Note';
            titleInput.value = noteToEdit.title;
            contentInput.value = noteToEdit.content;
        }
    } else {
        // ADD MODE
        editingNoteId = null;
        document.getElementById('dialogTitle').textContent = 'Add New Note';
        titleInput.value = '';
        contentInput.value = '';
    }

    dialog.showModal();
    titleInput.focus();
}

function closeNoteDialog() {
    document.getElementById('noteDial').close();
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.textContent = isDark ? '☀️' : '🌙';
    }
}

document.addEventListener('DOMContentLoaded', function () {
    notes = loadNotes();
    renderNotes();

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        const themeBtn = document.getElementById('themeToggleBtn');
        if (themeBtn) themeBtn.textContent = '☀️';
    }

    const themeBtn = document.getElementById('themeToggleBtn');
    if (themeBtn) {
        themeBtn.addEventListener('click', toggleTheme);
    }

    const noteForm = document.getElementById('noteForm');
    if (noteForm) {
        noteForm.addEventListener('submit', saveNote);
    }

    const noteDial = document.getElementById('noteDial');
    if (noteDial) {
        noteDial.addEventListener('click', function (event) {
            if (event.target === this) {
                closeNoteDialog();
            }
        });
    }
});