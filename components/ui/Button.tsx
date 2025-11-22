"use client";

import { Loader2 } from "lucide-react";

export default function Button({ children, loading, ...rest }: any) {
  return (
    <>
      <div className="flex justify-center">
        {loading ? (
          <Loader2 size={18} className="animate-spin darkText dark:text" />
        ) : (
          <button
          {...rest}
          className="px-4 py-2 dark:primary text-secondary bg-[#232a32]/90 rounded-lg hover:bg-[#232a32] cursor-pointer duration-200">{children}</button>
        )}
      </div>
    </>
  );
}
