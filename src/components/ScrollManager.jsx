import { useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

// Scroll behaviour for the single-page app:
// - opening a new page (link click, PUSH) starts at the top;
// - Back/Forward (POP) returns to where the visitor was on that page;
// - in-page URL updates that replace history (filters, sort) leave scroll alone.
export default function ScrollManager() {
  const location = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef(new Map()); // location.key -> scrollY
  const currentKey = useRef(location.key);

  // Remember the position of the page we are on, continuously.
  useEffect(() => {
    const onScroll = () => positions.current.set(currentKey.current, window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    currentKey.current = location.key;
    if (navigationType === "REPLACE") return;

    if (navigationType === "PUSH") {
      window.scrollTo(0, 0);
      return;
    }

    // POP: restore once the page is tall enough (listings load asynchronously).
    const target = positions.current.get(location.key) ?? 0;
    let frames = 0;
    let raf;
    const tryRestore = () => {
      const maxY = document.documentElement.scrollHeight - window.innerHeight;
      if (maxY >= target || frames > 30) {
        window.scrollTo(0, target);
        return;
      }
      frames += 1;
      raf = requestAnimationFrame(tryRestore);
    };
    tryRestore();
    return () => cancelAnimationFrame(raf);
  }, [location.key, navigationType]);

  return null;
}
