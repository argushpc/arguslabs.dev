import type { MouseEvent } from "react";

export function smoothScrollHandler(targetId: string) {
  return (e: MouseEvent<HTMLAnchorElement>) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    e.preventDefault();

    if (targetId === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document
        .getElementById(targetId)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (window.location.hash) {
      history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  };
}
