import React from "react";
import "./styles/PublicNotes.css";

const PublicPosts = ({ notes, huh_user }) => {
  console.log(notes);
  let authors = notes ? Object.keys(notes) : [];
  return (
    <div className="public-posts-container">
      <h3>Other's Notes</h3>
      {notes && (
        <ul>
          {authors.map(
            (author) =>
              author !== huh_user && (
                <li>
                  <p className="pubic-note-author">
                    <a href={`https://twitter.com/${author}`}>@{author}</a>
                  </p>
                  <p className="public-note">{notes[author]}</p>
                </li>
              )
          )}
        </ul>
      )}
    </div>
  );
};

export default PublicPosts;
