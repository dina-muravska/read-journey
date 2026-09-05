"use client";

import React, { useState } from "react";
import {
  FieldErrors,
  FieldValues,
  UseFormRegister,
  FieldPath,
} from "react-hook-form";
import styles from "./AuthInputs.module.css";

type AuthFormInputFieldsProps<T extends FieldValues> = {
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
};

export default function AuthFormInputFields<T extends FieldValues>({
  register,
  errors,
}: AuthFormInputFieldsProps<T>) {
  const [showPassword, setShowPassword] = useState(false);

  const emailError = errors.email?.message as string | undefined;
  const passwordError = errors.password?.message as string | undefined;

  return (
    <>
      {/* Email */}
      <div className={styles.fieldGroup}>
        <div className={styles.inputWrapper}>
          <input
            type="email"
            placeholder="Email"
            className={`${styles.inputField} ${
              emailError ? styles.inputFieldError : ""
            }`}
            {...register("email" as FieldPath<T>)}
          />
        </div>
        {emailError && <p className={styles.errorMessage}>{emailError}</p>}
      </div>

      <div className={styles.fieldGroup}>
        <div className={styles.inputWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className={`${styles.inputField} ${styles.passwordInput} ${
              passwordError ? styles.inputFieldError : ""
            }`}
            {...register("password" as FieldPath<T>)}
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className={styles.toggleButton}
            aria-label="Toggle password visibility"
          >
            {passwordError ? (
              <svg className={styles.icon}>
                <use href="/icons.svg#icon-pajamas_error" fill="#E90516" />
              </svg>
            ) : (
              <svg className={styles.icon}>
                <use
                  href={
                    showPassword
                      ? "/icons.svg#icon-eye"
                      : "/icons.svg#icon-eye-off"
                  }
                  fill="#141414"
                  stroke="#F9F9F9"
                />
              </svg>
            )}
          </button>
        </div>
        {passwordError && (
          <p className={styles.errorMessage}>{passwordError}</p>
        )}
      </div>
    </>
  );
}
