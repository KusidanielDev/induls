"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    tidioChatApi?: {
      on: (evt: string, cb: () => void) => void;
      show: () => void;
      hide: () => void;
      open: () => void;
      close: () => void;
      setVisitorData?: (data: {
        email?: string;
        name?: string;
        phone?: string;
      }) => void;
    };
  }
}

export default function Tidio({
  identify,
}: {
  identify?: { email?: string; name?: string };
}) {
  const pathname = usePathname();
  const hideOnThisRoute = pathname?.startsWith("/admin"); // 👈 don't load on admin

  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = process.env.NEXT_PUBLIC_TIDIO_KEY;
    if (!key) return;

    // If we don't want it here, hide if already loaded and bail early.
    if (hideOnThisRoute) {
      if (window.tidioChatApi) window.tidioChatApi.hide();
      return;
    }

    // Already loaded? just ensure it’s visible & (re)identify.
    if (window.tidioChatApi) {
      window.tidioChatApi.show();
      if (identify && window.tidioChatApi.setVisitorData) {
        window.tidioChatApi.setVisitorData(identify);
      }
      return;
    }

    // Inject script once
    const id = "tidio-script";
    if (!document.getElementById(id)) {
      const s = document.createElement("script");
      s.src = `https://code.tidio.co/${key}.js`;
      s.async = true;
      s.id = id;
      document.body.appendChild(s);
      s.addEventListener("load", () => {
        // When Tidio is ready, you can set visitor info or auto-open
        window.tidioChatApi?.on?.("ready", () => {
          if (identify && window.tidioChatApi?.setVisitorData) {
            window.tidioChatApi.setVisitorData(identify);
          }
          // Example: auto-open once per session
          // window.tidioChatApi?.open?.();
        });
      });
    }

    // Don’t remove the script on unmount (keeps widget persistent between pages)
  }, [hideOnThisRoute, identify]);

  return null; // no visible React UI; the script injects the widget
}
