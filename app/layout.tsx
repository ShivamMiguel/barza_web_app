import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['700', '800'],
  variable: '--font-plus-jakarta',
});

export const metadata: Metadata = {
  title: 'BARZA | A Beleza é Presença',
  description: 'Barza junta comunidade, serviços e produtos numa só plataforma. Descobre tendências, marca profissionais e compra com confiança.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="dark">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} ${plusJakarta.variable} bg-surface-container-lowest selection:bg-primary-container selection:text-on-primary-container overflow-x-hidden`}>
        {children}
      </body>
    </html>
  );
}
