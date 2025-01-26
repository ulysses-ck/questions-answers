'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ReactNode } from 'react';

interface ActiveLinkProps {
  href: string;
  children: ReactNode;
}

export function ActiveLink({ href, children }: ActiveLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link 
      href={href}
      className={`block px-4 py-2 rounded-md transition-colors ${
        isActive 
          ? 'bg-blue-600 text-white' 
          : 'text-gray-300 hover:bg-gray-800'
      }`}
    >
      {children}
    </Link>
  );
} 