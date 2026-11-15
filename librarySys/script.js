const form = document.getElementById("add-book-form");
const bookNameInput = document.getElementById("book-name-input");
const authorInput = document.getElementById("book-author-input");
const booksList = document.getElementById("books-list");
const searchInput = document.getElementById("search-input");
const clearSearchButton = document.getElementById("clear-search-button");
let books = [];

function renderBooks(booksToRender = books) {
    booksList.innerHTML = "";
    booksToRender.forEach(function (book) {
        const li = document.createElement("li");
        li.className = "book-item";
        li.setAttribute("data-id", book.id);
        li.innerHTML = `
            <div class="book-info">
                <span class="book-title">${book.title}</span>
                <span class="book-author">Author: ${book.author}</span>
            </div>
            <div class="book-actions">
                <button class="edit-btn" title="Edit">
                    <i class="fa-solid fa-pen-to-square"></i>
                    Edit
                </button>
                <button class="delete-btn" title="Delete">
                    <i class="fa-solid fa-trash"></i>
                    Delete
                </button>
            </div>
        `;
        booksList.appendChild(li);
    });
}

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const bookName = bookNameInput.value.trim();
    const authorName = authorInput.value.trim();

    if (bookName === "" || authorName === "") {
        return;
    }

    const newBook = { // to store in array 
        id: Date.now(),
        title: bookName,
        author: authorName
    };
    books.push(newBook);

    renderBooks();
    console.log(books);

    bookNameInput.value = "";
    authorInput.value = "";
});

booksList.addEventListener("click", function (event) {
    if (event.target.closest(".delete-btn")) { // for delete btn
        const bookItem = event.target.closest(".book-item");
        const bookId = Number(bookItem.getAttribute("data-id"));

        const confirmDelete = confirm("Are you sure you want to delete this book?");

        if (confirmDelete) {
            books = books.filter(book => book.id !== bookId);
            console.log("-- After deletion (Updated Array)", books);
            renderBooks();
        }
    }
    if (event.target.closest(".edit-btn")) { // edit btn
        const bookItem = event.target.closest(".book-item");
        const bookId = Number(bookItem.getAttribute("data-id"));
        const book = books.find(b => b.id === bookId); // to find the book in array 

        if (!book) return;

        const newTitle = prompt("Enter the new book title:", book.title);
        const newAuthor = prompt("Enter the new author name:", book.author);

        if (newTitle !== null && newTitle.trim() !== "") {
            book.title = newTitle.trim();
        }
        if (newAuthor !== null && newAuthor.trim() !== "") {
            book.author = newAuthor.trim();
        }
        renderBooks();
    }
});

searchInput.addEventListener("input", function () {
    const searchText = searchInput.value.toLowerCase().trim();

    const filteredBooks = books.filter(book =>
        book.title.toLowerCase().includes(searchText)
    );
    renderBooks(filteredBooks);
});

clearSearchButton.addEventListener("click", function () {
    searchInput.value = "";
    renderBooks(books);
});