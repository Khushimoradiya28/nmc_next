import React, { useState, useEffect, useRef, useLayoutEffect, useMemo, createContext } from 'react'

/**
 * Saves the old ThemeContext for future use
 * @param {string} theme - Name of curent theme
 * @return {string} previousTheme
 */
function usePrevious(theme) {
  const ref = useRef()
  useEffect(() => {
    ref.current = theme
  })
  return ref.current
}

/**
 * Gets user preferences from local storage
 * @param {string} key - localStorage key
 * @return {array} getter and setter for user preferred theme
 */
function useStorageTheme(key) {
  // Get system preference
  const userPreference =
    !!window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem(key);

    // If strict string 'dark' or 'light', use it
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }

    // If boolean-like string (legacy), convert
    if (stored === 'true') return 'dark';
    if (stored === 'false') return 'light';

    // Fallback to system preference
    return userPreference ? 'dark' : 'light';
  });

  // update stored theme
  useEffect(() => {
    localStorage.setItem(key, theme);
  }, [theme, key]);

  return [theme, setTheme];
}

// create context
export const ThemeContext = createContext()

// create context provider
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useStorageTheme('theme')

  // update root element class on theme change
  const oldTheme = usePrevious(theme)
  useLayoutEffect(() => {
    document.documentElement.classList.remove(`theme-${oldTheme}`)
    document.documentElement.classList.add(`theme-${theme}`)

    // Toggle 'dark' class for Tailwind
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme, oldTheme])

  function toggleTheme() {
    if (theme === 'light') setTheme('dark')
    else setTheme('light')
  }

  const value = useMemo(
    () => ({
      theme,
      toggleTheme,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
