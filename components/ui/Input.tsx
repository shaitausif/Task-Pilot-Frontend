"use client";
import React from "react";
import { FieldError } from "react-hook-form";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  name: string;
  error?: FieldError | undefined;
}

export default function Input({ label, error, ...rest }: Props) {
  return (
    <label className="block">
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <input
        {...rest}
        className={`mt-1 w-full rounded-md border px-3 py-2 text-sm placeholder-gray-400 dark:text darkText focus:outline-none focus:ring-2 focus:ring-blue-400
          ${error ? "border-red-400 ring-red-200" : "border-gray-200"}`}
      />
      {error && <p className="mt-1 text-xs text-red-500">{error.message}</p>}
    </label>
  );
}
