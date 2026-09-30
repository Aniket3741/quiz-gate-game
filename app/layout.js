import "./globals.css";

export const metadata = {
  title: "Quiz Quest - Educational Gate Game",
  description: "Run, jump and answer questions to open every gate!",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
