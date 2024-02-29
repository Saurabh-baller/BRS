import React from 'react';
import './BookDetailsModal.css'; // Import CSS for styling the modal

const BookDetailsModal = ({ selectedBook, onClose }) => {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <span className="close" onClick={onClose}>&times;</span>
        <div className="modal-content">
          <h2>{selectedBook.title}</h2>
          <div className="details">
            <div className="cover-image">
              <img src={selectedBook.coverImageUrl} alt={selectedBook.title} />
            </div>
            <div className="book-info">
              <p><strong>Author:</strong> {selectedBook.authors}</p>
              <p><strong>Description:</strong> {selectedBook.description}</p>
              <p><strong>Publication Date:</strong> {selectedBook.publicationDate}</p>
              <p><strong>Genre:</strong> {selectedBook.genre}</p>
              <p><strong>Page Count:</strong> {selectedBook.pageCount}</p>
              <p><strong>Language:</strong> {selectedBook.language}</p>
              <p><strong>Publisher:</strong> {selectedBook.publisher}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailsModal;
