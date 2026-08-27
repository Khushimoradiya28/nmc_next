"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Handles smooth scrolling to hash anchors on page load and navigation.
 * Place this component inside any page that uses hash-based section links.
 */
export default function HashScrollHandler() {
  const pathname = usePathname();

  useEffect(() => {
    const scrollToHash = () => {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace("#", "");
        const element = document.getElementById(id);
        if (element) {
          // Small delay to ensure page is fully rendered
          setTimeout(() => {
            const headerOffset = 100; // Account for fixed header
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }, 100);
        }
      }
    };

    scrollToHash();

    // Also listen for hash changes (same-page navigation)
    window.addEventListener("hashchange", scrollToHash);
    return () => window.removeEventListener("hashchange", scrollToHash);
  }, [pathname]);

  return null;
}
