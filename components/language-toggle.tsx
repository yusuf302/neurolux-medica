"use client";

import { useEffect, useState } from "react";

export function LanguageToggle() {
  const [language, setLanguage] = useState("en");

  useEffect(() => {
    const saved = window.localStorage.getItem("neurolux-language") || "en";
    setLanguage(saved);
    document.documentElement.lang = saved === "sw" ? "sw-TZ" : "en";
  }, []);

  function choose(next: string) {
    setLanguage(next);
    window.localStorage.setItem("neurolux-language", next);
    document.documentElement.lang = next === "sw" ? "sw-TZ" : "en";
  }

  return (
    <div className="language" aria-label="Choose language">
      <button className={language === "en" ? "active" : ""} onClick={() => choose("en")} type="button">English</button>
      <button className={language === "sw" ? "active" : ""} onClick={() => choose("sw")} type="button">Kiswahili</button>
    </div>
  );
}
