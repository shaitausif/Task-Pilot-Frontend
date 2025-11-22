"use client";

import { useFormContext } from "react-hook-form";
import Input from "../ui/Input"; // Assuming you might use this Input component, though currently using raw input/textarea

export default function NoteFormFields({
  register: propRegister, // Renamed prop to avoid conflict
  errors: propErrors,     // Renamed prop to avoid conflict
  defaultValue = {},      // Default to empty object for safety
}: {
  register?: any;
  errors?: any;
  defaultValue?: any;
}) {
  // Try to access the Form Context
  const context = useFormContext();

  // --- 1. Determine the source of RHF state ---
  
  // Use propRegister if provided, otherwise fallback to context.register
  const register = propRegister || context?.register;
  
  // Use propErrors if provided, otherwise fallback to context.formState.errors, 
  // finally default to an empty object {}
  const formErrors = propErrors || context?.formState?.errors || {}; 

  // --- 2. Fail Safe Check ---
  
  if (!register) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        "NoteFormFields requires a 'register' prop or must be wrapped in a <FormProvider>."
      );
    }
    return null; 
  }

  // --- 3. Component Rendering ---
  
  const { title, content, tag } = defaultValue;

  return (
    <div className="text-primary flex-col flex gap-2">
      <div>
        <label className="text-sm text-tp-textMuted">Title</label>
        <input
          {...register("title")}
          // Set defaultValue safely
          defaultValue={title} 
          className="w-full text-primary mt-1 px-3 py-2 rounded-md border bg-tp-bgLight border-tp-border"
        />
        {/* Display error message if it exists */}
        {formErrors.title && (
          <p className="mt-1 text-xs text-red-500">
            {formErrors.title.message as string}
          </p>
        )}
      </div>

      <div>
        <label className="text-sm text-tp-textMuted">Content</label>
        <textarea
          {...register("content")}
          // Set defaultValue safely
          defaultValue={content}
          className="w-full mt-1 px-3 py-2 text-primary rounded-md border bg-tp-bgLight border-tp-border"
        />
        {/* Display error message if it exists */}
        {formErrors.content && (
          <p className="mt-1 text-xs text-red-500">
            {formErrors.content.message as string}
          </p>
        )}
      </div>
      
      <div>
        <label className="text-sm text-tp-textMuted">Tag</label>
        <select
          {...register("tag")}
          // Set defaultValue safely
          defaultValue={tag}
          className={`mt-1 w-full rounded-md border px-3 py-2 text-sm dark:text darkText
             bg-tp-bgLight focus:outline-none focus:ring-2 focus:ring-blue-400
             `}
        >
          <option value="Personal">Personal</option>
          <option value="Work">Work</option>
        </select>
        {/* Display error message if it exists */}
        {formErrors.tag && (
          <p className="mt-1 text-xs text-red-500">
            {formErrors.tag.message as string}
          </p>
        )}
      </div>
    </div>
  );
}