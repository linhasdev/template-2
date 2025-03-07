import { ChatbotProvider } from '@/lib/contexts/ChatbotContext';
import './globals.css';
import { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next.js Template',
  description: 'Next.js Template with Tailwind CSS, TypeScript, and more.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Existing code */}
      </head>
      <body className={inter.className}>
        <ChatbotProvider>
          {children}
        </ChatbotProvider>
      </body>
    </html>
  );
}
