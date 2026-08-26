import React, { useState, useEffect, useRef, useLayoutEffect, useMemo, createContext } from 'react'

/**
 * Saves the old ThemeContext for future use
 * @param {string} theme - Name of current theme
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
  const [theme, setTheme] = useState(() => {
    // Check if initialized for NMC Portal
    const initialized = localStorage.getItem('nmc_portal_light_default');
    if (!initialized) {
      localStorage.setItem('nmc_portal_light_default', 'true');
      localStorage.setItem(key, 'light');
      return 'light';
    }

    const stored = localStorage.getItem(key);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
    return 'light';
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
      setTheme,
    }),
    [theme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
