import React, { useState } from "react";

const RecommendationForm = ({ onClose, onRecommendationSubmit }) => {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [recommendation, setRecommendation] = useState("");
 

  const handleSubmit = (event) => {
    event.preventDefault();
    // Call the onRecommendationSubmit function passed from the parent component
    onRecommendationSubmit({ title, author, recommendation });
    // Clear form fields after submission (optional)
    setTitle("");
    setAuthor("");
    setRecommendation("");
  };

  return (
    <div className="modal-backdrop">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {/* <span className="close" onClick={onClose}>&times;</span> */}

        <div className="modal-content">
          <span className="close" onClick={onClose}>
            &times;{" "}
          </span>
          <h2>Submit Your Book Recommendation</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title">Title:</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="author">Author:</label>
              <input
                type="text"
                id="author"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="recommendation">Recommendation:</label>
              <textarea
                id="recommendation"
                value={recommendation}
                onChange={(event) => setRecommendation(event.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RecommendationForm;
