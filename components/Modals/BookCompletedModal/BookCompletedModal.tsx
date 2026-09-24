"use client";

import React from "react";
import styles from "./BookCompletedModal.module.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function BookCompletedModal({ isOpen, onClose }: Props) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.icon}>📚👍</div>
        <h2 className={styles.title}>The book is read!</h2>
        <p className={styles.text}>
          It was an exciting journey, where each page revealed new horizons, and
          the knowledge gained remained forever in your memory.
        </p>
        <button onClick={onClose} className={styles.button}>
          Great!
        </button>
      </div>
    </div>
  );
}
