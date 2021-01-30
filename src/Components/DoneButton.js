import React from "react";
import { ReactComponent as Checkmark } from "./checkmark.svg";
import "./styles/DoneButton.css";
import { motion } from "framer-motion";

const DoneButton = ({ handleSubmit }) => {
  return (
    <motion.button
      className="DoneButton"
      onClick={() => {
        handleSubmit();
      }}
      whileHover={{ scale: 1.05 }}
      transition={{
        duration: 0.2,
        ease: [0.43, 0.13, 0.23, 0.96],
      }}
    >
      <Checkmark />
      Done
    </motion.button>
  );
};

export default DoneButton;
