"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import styles from "./SuccessModal.module.css";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: React.ReactNode;
};

export default function SuccessModal({
  isOpen,
  onClose,
  title,
  description,
}: Props) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={24} strokeWidth={2} />
        </button>

        <div className={styles.imageWrapper}>
          <picture className={styles.image}>
            <source
              srcSet="/img/ok_hand@1x.webp 1x, /img/ok_hand@2x.webp 2x"
              media="(min-width: 320px)"
            />
            <img
              src="/img/ok_hand@1x.webp"
              alt="Good job"
              className={styles.imgElement}
            />
          </picture>
        </div>

        <h2 className={styles.title}>{title}</h2>

        {description && <div className={styles.description}>{description}</div>}
      </div>
    </div>
  );
}
