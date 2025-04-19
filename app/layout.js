import './globals.css';

export const metadata = {
  title: 'Spoons Baseline Calculator for AuDHD',
  description: 'Calculate your maximum energy capacity using spoon theory',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}