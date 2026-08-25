import React, { Suspense, useContext, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { Windmill, WindmillContext } from '@windmill/react-ui';
import './assets/css/custom.css';
import './assets/css/tailwind.css';
import "./assets/css/tailwind.output.css";
import '@pathofdev/react-tag-input/build/index.css';
import App from './App';
import myTheme from './assets/theme/myTheme';
import { AdminProvider } from './context/AdminContext';
import { SidebarProvider } from './context/SidebarContext';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import ThemeSuspense from './components/theme/ThemeSuspense';

const MainApp = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  const windmillValue = useMemo(
    () => ({
      theme: myTheme,
      mode: theme,
      toggleMode: toggleTheme,
    }),
    [theme, toggleTheme]
  );

  return (
    <WindmillContext.Provider value={windmillValue}>
      <Windmill theme={myTheme} dark={theme === 'dark'}>
        <App />
      </Windmill>
    </WindmillContext.Provider>
  );
};

ReactDOM.render(
  <AdminProvider>
    <SidebarProvider>
      <ThemeProvider>
        <Suspense fallback={<ThemeSuspense />}>
          <MainApp />
        </Suspense>
      </ThemeProvider>
    </SidebarProvider>
  </AdminProvider>,

  document.getElementById('root')
);
