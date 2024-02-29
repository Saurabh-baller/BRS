import React, { useState, useEffect } from "react";
import axios from "axios";
import BookDetailsModal from "./components/BookDetailsModal";
import RecommendationForm from "./components/RecommendationForm";
import "./App.css";
import { Button, Rating, TextField } from "@mui/material";

function App() {
  const [books, setBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showRecommendationForm, setShowRecommendationForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterGenre, setFilterGenre] = useState("");
  const [similarBooks, setSimilarBooks] = useState([]);
  const [comments, setComments] = useState({});
  const [commentValue, setCommentValue] = useState("");

  useEffect(() => {
    axios
      .get("https://www.googleapis.com/books/v1/volumes?q=javascript")
      .then((response) => {
        setBooks(
          response.data.items.map((item) => ({
            id: item.id,
            title: item.volumeInfo.title,
            authors: item.volumeInfo.authors
              ? item.volumeInfo.authors.join(", ")
              : "Unknown Author",
            description:
              item.volumeInfo.description || "No description available",
            publicationDate: item.volumeInfo.publishedDate || "Unknown Date",
            pageCount: item.volumeInfo.pageCount || "Unknown Pages",
            language: item.volumeInfo.language || "Unknown Language",
            publisher: item.volumeInfo.publisher || "Unknown Publisher",
            genre: item.volumeInfo.categories
              ? item.volumeInfo.categories.join(", ")
              : "Unknown Genre",
            coverImageUrl:
              item.volumeInfo.imageLinks?.thumbnail ||
              "https://via.placeholder.com/150",
            rating: 0,
            comments: comments[item.id] || [], // Load comments from state
          }))
        );
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    const storedComments = JSON.parse(localStorage.getItem("bookComments"));
    if (storedComments) {
      setComments(storedComments);
    }
  }, []);

  useEffect(() => {
    // Update local storage when comments change
    localStorage.setItem("bookComments", JSON.stringify(comments));
  }, [comments]);

  const toggleRecommendationForm = () => {
    setShowRecommendationForm(!showRecommendationForm);
  };

  const handleRecommendationSubmit = (recommendation) => {
    console.log("Submitted recommendation:", recommendation);
    // Create a new book object with the recommendation data
    const newBook = {
      id: Math.random().toString(), // Generate a unique ID for the new book
      title: recommendation.title,
      authors: recommendation.author,
      description: recommendation.recommendation,
      publicationDate: "Unknown Date",
      pageCount: "Unknown Pages",
      language: "Unknown Language",
      publisher: "Unknown Publisher",
      genre: "Recommended", // You can set a specific genre for recommended books
      coverImageUrl: "https://via.placeholder.com/150",
      rating: 0,
      comments: [], // Initialize comments as an empty array for the recommended book
    };
    // Update the books state by adding the new book to the existing list of books
    setBooks((prevBooks) => [...prevBooks, newBook]);
    toggleRecommendationForm();
  };

  const fetchSimilarBooks = (book) => {
    const similar = books.filter(
      (b) => b.genre === book.genre && b.id !== book.id
    );
    setSimilarBooks(similar);
  };

  const handleBookClick = (book) => {
    setSelectedBook(book);
    fetchSimilarBooks(book);
  };

  const handleRatingChange = (newValue, bookId) => {
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId ? { ...book, rating: newValue } : book
      )
    );
  };

  const handleCommentSubmit = (bookId, comment) => {
    const updatedComments = {
      ...comments,
      [bookId]: [...(comments[bookId] || []), comment],
    };
    setComments(updatedComments);
    setBooks((prevBooks) =>
      prevBooks.map((book) =>
        book.id === bookId
          ? { ...book, comments: updatedComments[bookId] }
          : book
      )
    );
    setCommentValue("");
  };

  return (
    <div>
      <div className="book-container">
        <h1 className="book-title">Book Recommendation App </h1>
        <div className="search-filter-section">
          <input
            type="text"
            className="search-input"
            placeholder="Search by title"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={filterGenre}
            onChange={(e) => setFilterGenre(e.target.value)}
          >
            <option value="">Filter by genre</option>
            <option value="Fiction">Fiction</option>
            <option value="Non-fiction">Non-fiction</option>
          </select>
          <button
            className="recommendation-button"
            onClick={toggleRecommendationForm}
          >
            Add Recommendation
          </button>
          {showRecommendationForm && (
            <RecommendationForm
              onClose={toggleRecommendationForm}
              onRecommendationSubmit={handleRecommendationSubmit}
            />
          )}
        </div>
        <ul className="book-list">
          {books
            .filter((book) => {
              const titleMatch = book.title
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
              const genreMatch = filterGenre
                ? book.genre.toLowerCase() === filterGenre.toLowerCase()
                : true;
              return titleMatch && genreMatch;
            })
            .map((book) => (
              <li key={book.id} className="book-item">
                <img
                  src={book.coverImageUrl}
                  alt={book.title}
                  className="book-cover"
                  onClick={() => handleBookClick(book)}
                />
                <div className="book-details">
                  <h2 className="book-title">{book.title}</h2>
                  <p className="book-author">Author(s): {book.authors}</p>
                  <p className="book-description">{book.description}</p>
                  <Rating
                    name={`book-rating-${book.id}`}
                    value={book.rating}
                    onChange={(event, newValue) =>
                      handleRatingChange(newValue, book.id)
                    }
                  />
                  <div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <TextField
                        id="outlined-basic"
                        variant="outlined"
                        type="text"
                        placeholder="Add a comment"
                        style={{ marginRight: "8px" }}
                        value={commentValue}
                        onChange={(e) => setCommentValue(e.target.value)}
                      />
                      <Button
                        variant="outlined"
                        size="medium"
                        style={{ marginLeft: "8px" }}
                        onClick={() =>
                          handleCommentSubmit(book.id, commentValue)
                        }
                      >
                        Comment
                      </Button>
                    </div>
                    <ul>
                      Comments:
                      {book.comments?.map((comment, index) => (
                        <li key={index}>{comment}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
        </ul>
        {selectedBook && (
          <BookDetailsModal
            selectedBook={selectedBook}
            similarBooks={similarBooks}
            onClose={() => setSelectedBook(null)}
          />
        )}
      </div>
    </div>
  );
}

export default App;
