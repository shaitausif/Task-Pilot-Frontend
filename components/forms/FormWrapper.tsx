"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function FormWrapper<T extends z.ZodType>({
  schema,
  onSubmit,
  defaultValues,
  children,
  submitLabel = "Save",
}: {
  schema: T | any;
  onSubmit: (v: z.infer<T>) => void;
  defaultValues?: any;
  children: React.ReactNode;
  submitLabel?: string;
}) {
  const methods = useForm<z.infer<T> | any>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
  if (defaultValues) {
    methods.reset(defaultValues); 
  }
}, [defaultValues]);

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {children}
        <button
          type="submit"
          className="mt-2 rounded-md bg-tp-primary px-4 py-2 text-white hover:bg-primary/90 bg-primary hover:bg-tp-primaryDark duration-200"
        >
          {submitLabel}
        </button>
      </form>
    </FormProvider>
  );
}
