"use client";

import { useFormContext } from "react-hook-form";
import Input from "../ui/Input";

export default function ProjectFormFields({
  register: propRegister,
  errors: propErrors,
  defaultValue = {}, // Default to empty object for safety
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
        "ProjectFormFields requires a 'register' prop or must be wrapped in a <FormProvider>."
      );
    }
    return null; 
  }

  // --- 3. Component Rendering ---
  
  const { name, description, status, dueDate } = defaultValue;

  return (
    <>
      <div className="text-primary flex flex-col gap-2">
        {/* Project Name */}
        <div>
          <label className="text-sm text-tp-textMuted">Project Name</label>
          <input
            {...register("name")}
            // Set defaultValue safely
            defaultValue={name}
            className="w-full mt-1 px-3 py-2 rounded-md border bg-tp-bgLight border-tp-border"
          />
          {formErrors.name && (
            <p className="mt-1 text-xs text-red-500">
              {formErrors.name.message as string}
            </p>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="text-sm text-tp-textMuted">Description</label>
          <textarea
            {...register("description")}
            // Set defaultValue safely
            defaultValue={description}
            className="w-full mt-1 px-3 py-2 rounded-md border bg-tp-bgLight border-tp-border"
          />
          {formErrors.description && (
            <p className="mt-1 text-xs text-red-500">
              {formErrors.description.message as string}
            </p>
          )}
        </div>
        
        {/* Status */}
        <div>
          <label className="text-sm text-tp-textMuted">Status</label>
          <select
            {...register("status")}
            // Set defaultValue safely
            defaultValue={status}
            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm dark:text darkText
              bg-tp-bgLight focus:outline-none focus:ring-2 focus:ring-blue-400
              `}
          >
            <option value="Active">Active</option>
            <option value="On Hold">On Hold</option>
            <option value="Completed">Completed</option>
          </select>
          {formErrors.status && (
            <p className="mt-1 text-xs text-red-500">
              {formErrors.status.message as string}
            </p>
          )}
        </div>
        
        {/* Due Date */}
        <div>
          <Input
            label="Due Date"
            type="date"
            // Set defaultValue safely
            defaultValue={dueDate}
            {...register("dueDate")}
            // Use the resolved formErrors object
            error={formErrors.dueDate}
          />
        </div>
      </div>
    </>
  );
}