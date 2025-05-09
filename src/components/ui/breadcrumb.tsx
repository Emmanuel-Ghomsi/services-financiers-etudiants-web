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
            className="inline-flex items-center gap-1.5 rounded-md text-foreground hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            <span className="sr-only">Accueil</span>
          </Link>
          {separator}
        </li>
        {segments.map((segment, index) => (
          <li key={index} className="inline-flex items-center gap-1.5">
            <Link href={segment.href} className="rounded-md text-foreground hover:text-foreground">
              {segment.name}
            </Link>
            {index < segments.length - 1 && separator}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export const BreadcrumbList = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLOListElement>) => {
  return (
    <ol className={cn('flex flex-wrap items-center gap-1.5', className)} {...props}>
      {children}
    </ol>
  );
};

export const BreadcrumbItem = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLLIElement>) => {
  return (
    <li className={cn('inline-flex items-center gap-1.5', className)} {...props}>
      {children}
    </li>
  );
};

export const BreadcrumbLink = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLAnchorElement>) => {
  return (
    <Link
      href="/"
      className={cn('rounded-md text-foreground hover:text-foreground', className)}
      {...props}
    >
      {children}
    </Link>
  );
};

export const BreadcrumbPage = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={cn('font-medium text-foreground', className)} {...props}>
      {children}
    </span>
  );
};

export const BreadcrumbSeparator = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={cn('mx-1 text-muted-foreground', className)} {...props}>
      /
    </span>
  );
};

export const BreadcrumbEllipsis = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span className={cn('mx-1 text-muted-foreground', className)} {...props}>
      ...
    </span>
  );
};
