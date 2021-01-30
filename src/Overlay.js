import React, { useState, useEffect } from "react";
import "./Overlay.css";
import Editor from "./Components/Editor";
import PublicNotes from "./Components/PublicNotes";
import DoneButton from "./Components/DoneButton";
import { motion, AnimatePresence } from "framer-motion";

const Overlay = ({
  displayname,
  username,
  toggle,
  Firebase,
  huh_user,
  instanceNumber,
}) => {
  const [notes, setNotes] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const overlayBGVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  const overlayContentContainerVariants = {
    hidden: {
      y: 500,
      transition: {
        // when: "afterChildren",
        duration: 0.2,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
    visible: {
      y: 0,
      transition: {
        // when: "beforeChildren",
        delayChildren: 0.2,
        duration: 0.3,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  };

  const overlayContentVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.2,
        ease: [0.43, 0.13, 0.23, 0.96],
      },
    },
  };

  useEffect(() => {
    // console.log(displayname, username, huh_user, instanceNumber);
    let ref = Firebase.database().ref(`/${username}`);
    ref.on("value", (snapshot) => {
      setNotes(snapshot.val());
    });
    setIsVisible(true);
  }, [username, instanceNumber]);
  const handleSubmit = () => {
    const newnote = document.getElementById("note-text").innerText;
    let newNotesObj = {};
    if (notes) {
      newNotesObj = notes;
    }
    newNotesObj[huh_user] = newnote;
    Firebase.database().ref(`/${username}`).set(newNotesObj);
    setIsVisible(false);
  };
  const publicNotesExit = () => {
    if (!notes) {
      return false;
    } else {
      let authors = notes ? Object.keys(notes) : [];
      if (authors.indexOf(huh_user) > -1) {
        authors.splice(huh_user, 1);
      }
      if (authors.length > 0) {
        for (let author of authors) {
          if (notes[author].length > 0) {
            return true;
          }
        }
      } else {
        return false;
      }
    }
  };
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div className="overlay-container">
          <motion.div
            className="overlay-bg"
            variants={overlayBGVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => {
              handleSubmit();
              // toggle();
            }}
          ></motion.div>
          <motion.div
            variants={overlayContentContainerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="overlay-content-container"
          >
            <motion.div
              variants={overlayContentVariants}
              className="overlay-content"
            >
              <header>
                <div>
                  <motion.h1>{displayname}</motion.h1>
                  <motion.p>
                    <a href={`https://twitter.com/${huh_user}`}>@{username}</a>
                  </motion.p>
                </div>
                <DoneButton handleSubmit={handleSubmit} />
              </header>
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
              {publicNotesExit() && (
                <PublicNotes notes={notes} huh_user={huh_user} />
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Overlay;
