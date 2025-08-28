"use client";

import { useTransition } from "react";

type Props = {
  label?: string;
  confirmText?: string;
};

export default function DeleteButton({
  label = "Delete",
  confirmText = "Permanently delete this user? This cannot be undone.",
}: Props) {
  const [isPending] = useTransition();

  return (
    <button
      type="submit"
      onClick={(e) => {
        if (!confirm(confirmText)) {
          e.preventDefault();
        }
      }}
      disabled={isPending}
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: 8,
        border: "1px solid #fecaca",
        color: "#b91c1c",
        background: "white",
        cursor: "pointer",
      }}
    >
      {isPending ? "Deleting..." : label}
    </button>
  );
}
