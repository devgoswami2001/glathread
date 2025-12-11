
'use client';

import type { Metadata } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

const fontBody = Inter({ subsets: ['latin'], variable: '--font-body' });
const fontHeadline = Space_Grotesk({ subsets: ['latin'], variable: '--font-headline' });

// This metadata is now static and won't be dynamically generated per page.
// If you need dynamic metadata, you'll need a different approach.
// export const metadata: Metadata = {
//   title: 'GLAThread',
//   description: 'Streamlined transport and logistics management.',
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en" suppressHydrationWarning>
       <head>
        <title>GLAThread</title>
        <meta name="description" content="Streamlined transport and logistics management." />
      </head>
      <body className={cn(
        "font-body antialiased",
        fontBody.variable,
        fontHeadline.variable
      )}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
