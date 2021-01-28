import React, { useState, useEffect } from "react";
import "./Overlay.css";
import Editor from "./Components/Editor";

const Overlay = ({ displayname, username, toggle, Firebase, huh_user }) => {
  const [notes, setNotes] = useState(null);
  useEffect(() => {
    let ref = Firebase.database().ref(`/${username}`);
    ref.on("value", (snapshot) => {
      setNotes(snapshot.val());
    });
  }, [username]);
  const handleSubmit = () => {
    const newnote = document.getElementById("note-text").innerText;
    let newNotesObj = {};
    if (notes) {
      newNotesObj = notes;
    }
    newNotesObj[huh_user] = newnote;
    Firebase.database().ref(`/${username}`).set(newNotesObj);
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
                ? notes[huh_user]
                  ? notes[huh_user].length > 0
                    ? notes[huh_user]
                    : null
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
