"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import type { ObjectSchema } from "yup";
import { toast } from "sonner";

import AuthFormInputFields from "../AuthInputs/AuthInputs";
import { useAuthStore } from "@/stores/store";
import styles from "./AuthForm.module.css";

type AuthFormValues = {
  name?: string;
  email: string;
  password: string;
};

type Props = {
  type: "login" | "register";
};

const authSchema: ObjectSchema<AuthFormValues> = yup.object({
  name: yup
    .string()
    .optional()
    .when("$type", {
      is: "register",
      then: (schema) =>
        schema
          .required("Name is required")
          .matches(/^[A-Za-z]+$/, "Only letters are allowed")
          .min(2, "Min 2 characters"),
      otherwise: (schema) => schema.notRequired(),
    }),
  email: yup
    .string()
    .matches(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/, "Invalid email format")
    .required("This field is required"),
  password: yup
    .string()
    .min(7, "Must be at least 7 characters")
    .required("This field is required"),
});

export default function AuthForm({ type }: Props) {
  const [localError, setLocalError] = useState("");
  const {
    login,
    register: registerUser,
    isLoading,
    error,
    clearError,
  } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthFormValues>({
    resolver: yupResolver(authSchema),
    context: { type },
  });

  const onSubmit = async (data: AuthFormValues) => {
    setLocalError("");
    clearError();

    try {
      if (type === "register") {
        await registerUser({
          name: data.name!,
          email: data.email.toLowerCase(),
          password: data.password,
        });
        toast.success("Registration successful 🎉");
      } else {
        await login({
          email: data.email.toLowerCase(),
          password: data.password,
        });
      }
      window.location.href = "/recommended";
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again.";

      toast.error(message);
      setLocalError(message);
    }
  };

  const isPending = isSubmitting || isLoading;

  return (
    <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.inputsContainer}>
        {type === "register" && (
          <div>
            <div className={styles.inputWrapper}>
              <input
                type="text"
                placeholder="Name"
                className={`${styles.inputField} ${
                  errors.name?.message ? styles.inputFieldError : ""
                }`}
                {...register("name")}
              />
            </div>
            {errors.name?.message && (
              <p className={styles.errorMessage}>{errors.name.message}</p>
            )}
          </div>
        )}

        <AuthFormInputFields<AuthFormValues>
          register={register}
          errors={errors}
        />
      </div>

      <div className={styles.actionsContainer}>
        <button
          type="submit"
          disabled={isPending}
          className={styles.submitButton}
        >
          {isPending
            ? type === "register"
              ? "Registering..."
              : "Logging in..."
            : type === "register"
              ? "Registration"
              : "Log in"}
        </button>

        <Link
          href={type === "register" ? "/login" : "/register"}
          className={styles.authLink}
        >
          {type === "register"
            ? "Already have an account?"
            : "Don't have an account?"}
        </Link>
      </div>

      {(localError || error) && (
        <div className={styles.globalError}>
          <p className={styles.errorMessage}>{localError || error}</p>
        </div>
      )}
    </form>
  );
}
