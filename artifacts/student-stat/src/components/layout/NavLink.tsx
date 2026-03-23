'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { forwardRef } from 'react'
import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

type NavLinkProps = {
  href: string
  activeClassName?: string
} & Omit<ComponentProps<typeof Link>, 'href'>

const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(
  ({ href, className, activeClassName, children, ...props }, ref) => {
    const pathname = usePathname() ?? ''
    const isActive = pathname === href || (href !== '/' && pathname.startsWith(href + '/'))

    return (
      <Link
        ref={ref}
        href={href}
        className={cn(className, isActive && activeClassName)}
        {...props}
      >
        {children}
      </Link>
    )
  },
)

NavLink.displayName = 'NavLink'

export { NavLink }
