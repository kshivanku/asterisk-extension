import React, { useState, useEffect } from "react";
import "./Overlay.css";
import Editor from "./Components/Editor";

const Overlay = ({ displayname, username, toggle, Firebase }) => {
  const [notes, setNotes] = useState(null);
  useEffect(() => {
    let ref = Firebase.database().ref(`/${username}`);
    ref.on("value", (snapshot) => {
      setNotes(snapshot.val());
    });
  }, [username]);
  const handleSubmit = () => {
    const newnote = document.getElementById("note-text").innerText;
    const post = {
      kshivanku: newnote,
    };
    Firebase.database().ref(`/${username}`).set(post);
  };
  return (
    <div className="overlay-container">
      <div
        className="overlay-bg"
        onClick={() => {
          handleSubmit();
          toggle();
        }}
      ></div>
      <div className="overlay-content-container">
        <div className="overlay-content">
          <h1>{displayname}</h1>
          <p>{username}</p>
          <Editor
            notes={
              notes
                ? notes["kshivanku"].length > 0
                  ? notes["kshivanku"]
                  : null
                : null
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Overlay;
