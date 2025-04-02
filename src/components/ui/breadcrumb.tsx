import type * as React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';

interface BreadcrumbProps extends React.HTMLAttributes<HTMLElement> {
  segments: {
    name: string;
    href: string;
  }[];
  homeHref?: string;
  separator?: React.ReactNode;
}

export function Breadcrumb({
  segments,
  homeHref = '/dashboard',
  separator = <ChevronRight className="h-4 w-4 flex-shrink-0 text-muted-foreground" />,
  className,
  ...props
}: BreadcrumbProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn('mb-4 flex items-center text-sm text-muted-foreground', className)}
      {...props}
    >
      <ol className="flex flex-wrap items-center gap-1.5">
        <li className="inline-flex items-center gap-1.5">
          <Link
            href={homeHref}
            className="inline-flex items-center gap-1.5 rounded-md text-foreground hover:text-muted-foreground"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Accueil</span>
          </Link>
          {separator}
        </li>
        {segments.map((segment, index) => (
          <li key={segment.href} className="inline-flex items-center gap-1.5">
            {index < segments.length - 1 ? (
              <>
                <Link href={segment.href} className="rounded-md hover:text-foreground">
                  {segment.name}
                </Link>
                {separator}
              </>
            ) : (
              <span className="font-medium text-foreground" aria-current="page">
                {segment.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
