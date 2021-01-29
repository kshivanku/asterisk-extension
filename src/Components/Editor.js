import React from "react";
import "./styles/Editor.css";
import { motion } from "framer-motion";

const Editor = ({ notes, variants }) => {
  return (
    <React.Fragment>
      <motion.div
        variants={variants}
        id="note-text"
        contentEditable="true"
        data-placeholder="Write your note here..."
        className="note-text"
      >
        {notes ? notes : ""}
      </motion.div>
    </React.Fragment>
  );
};

export default Editor;
