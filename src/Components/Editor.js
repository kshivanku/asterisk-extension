import React from "react";
import "./styles/Editor.css";

const Editor = ({ notes }) => {
  return (
    <React.Fragment>
      <div
        id="note-text"
        contentEditable="true"
        data-placeholder="Write your note here..."
        className="note-text"
      >
        {notes ? notes : ""}
      </div>
    </React.Fragment>
  );
};

export default Editor;
