"use client";

import { useFormContext } from "react-hook-form";
import Input from "../ui/Input";

export default function TaskFormFields({
  register: propRegister, // Renamed prop to avoid local variable conflict
  errors: propErrors,     // Renamed prop to avoid local variable conflict
  defaultValue = {},      // Defaults to an empty object for safe destructuring
}: {
  register?: any;
  errors?: any;
  defaultValue?: any;
}) {
  // Try to access the Form Context, which will be available if inside <FormProvider>
  const context = useFormContext();

  // --- 1. Determine the source of RHF state ---
  
  // Use propRegister if provided, otherwise fallback to context.register
  const register = propRegister || context?.register;
  
  // Use propErrors if provided, otherwise fallback to context.formState.errors, 
  // and finally default to an empty object {} to safely access formErrors.title later.
  const formErrors = propErrors || context?.formState?.errors || {}; 

  // --- 2. Fail Safe Check ---
  
  // If we couldn't find a register function from props or context, the component cannot function.
  if (!register) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        "TaskFormFields must be rendered inside a <FormProvider> or receive 'register' and 'errors' props manually."
      );
    }
    return null; // Stop rendering if the core functionality is impossible
  }

  // --- 3. Component Rendering ---
  
  // Destructure for cleaner JSX access
  const { title, description, status, priority, dueDate } = defaultValue;

  return (
    <>
      {/* Title */}
      <Input
        label="Title"
        // Uses destructured value (will be undefined if not provided)
        defaultValue={title} 
        placeholder="Task title..."
        {...register("title")}
        // Use the resolved formErrors object
        error={formErrors.title} 
      />

      {/* Description */}
      <label className="block">
        <span className="text-sm font-medium text-gray-700">Description</span>
        <textarea
          {...register("description")}
          defaultValue={description}
          placeholder="Describe the task..."
          className={`mt-1 w-full rounded-md border px-3 py-2 text-sm placeholder-gray-400
             dark:text darkText bg-tp-bgLight focus:outline-none focus:ring-2 focus:ring-blue-400
             ${
               formErrors.description
                 ? "border-red-400 ring-red-200"
                 : "border-gray-200"
             }`}
        />
        {formErrors.description && (
          <p className="mt-1 text-xs text-red-500">
            {formErrors.description.message as string}
          </p>
        )}
      </label>

      {/* Status + Priority */}
      <div className="flex gap-4">
        {/* Status */}
        <label className="flex-1 block">
          <span className="text-sm font-medium text-gray-700">Status</span>
          <select
            {...register("status")}
            defaultValue={status}
            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm dark:text darkText
              bg-tp-bgLight focus:outline-none focus:ring-2 focus:ring-blue-400
              ${
                formErrors.status
                  ? "border-red-400 ring-red-200"
                  : "border-gray-200"
              }`}
          >
            <option value="Pending">Pending</option>
            <option value="In-Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {formErrors.status && (
            <p className="mt-1 text-xs text-red-500">
              {formErrors.status.message as string}
            </p>
          )}
        </label>

        {/* Priority */}
        <label className="flex-1 block">
          <span className="text-sm font-medium text-gray-700">Priority</span>
          <select
            defaultValue={priority}
            {...register("priority")}
            className={`mt-1 w-full rounded-md border px-3 py-2 text-sm dark:text darkText
              bg-tp-bgLight focus:outline-none focus:ring-2 focus:ring-blue-400
              ${
                formErrors.priority
                  ? "border-red-400 ring-red-200"
                  : "border-gray-200"
              }`}
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>

          {formErrors.priority && (
            <p className="mt-1 text-xs text-red-500">
              {formErrors.priority.message as string}
            </p>
          )}
        </label>
      </div>

      {/* Due Date */}
      <Input
        label="Due Date"
        type="date"
        defaultValue={dueDate}
        {...register("dueDate")}
        error={formErrors.dueDate}
      />
    </>
  );
}