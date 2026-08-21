import SmoothScrollProvider from "@/components/providers/SmoothScrollProvider";
import "@/styles/variables.css";
import "lenis/dist/lenis.css";
import "@/styles/designer.css";
// import "@/styles/globals.css";
// import "@/styles/typography.css";
// import "@/styles/layout.css";
// import "@/styles/grid.css";
// import "@/styles/buttons.css";
// import "@/styles/forms.css";
// import "@/styles/cards.css";
// import "@/styles/utilities.css";
// import "@/styles/responsive.css";
import ScriptLoader from '@/components/providers/ScriptLoader';
import TopProgressBar from '@/components/common/TopProgressBar/TopProgressBar';
import ScrollToTop from '@/components/common/ScrollToTop/ScrollToTop';

export const metadata = {
  title: "Nandkuvarba Mahila College",
  description: "Nandkuvarba Mahila College - Empowering Women Through Education",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning={true}>
      <head>
        <link rel="icon" href="/assets/favicon/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/assets/favicon/favicon-16x16.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/assets/favicon/apple-icon-180x180.png" />
        <link rel="manifest" href="/assets/favicon/manifest.json" />
        <meta name="msapplication-TileImage" content="/assets/favicon/ms-icon-144x144.png" />
        <meta name="msapplication-TileColor" content="#8a0000" />
        <meta name="theme-color" content="#8a0000" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </head>
      <body suppressHydrationWarning={true}>
        <TopProgressBar />
        <SmoothScrollProvider>
          {children}
        </SmoothScrollProvider>

        <ScrollToTop />
        <ScriptLoader />
      </body>
    </html>
  );
}
