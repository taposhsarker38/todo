// app/layout.tsx
import ClientProviders from '@/components/ClientProviders';
import './globals.css';


export const metadata = {
  title: 'To‑Do App',
  description: 'A To‑Do App built with Next.js App Router, Redux Toolkit, and DRF backend.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
