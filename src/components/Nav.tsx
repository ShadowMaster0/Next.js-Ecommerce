'use client';

import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    className?: string;
}

export function Nav({ children }: { children: React.ReactNode }) {
    return <nav className="bg-primary text-primary-foreground flex justify-center px-4">{children}</nav>;
}

export function NavLink({ href, children, className }: NavLinkProps) {
    const pathname = usePathname();
    const isActive = pathname === href;

    return (
        <a
            href={href}
            className={cn(
                "p-4 hover:bg-secondary hover:text-secondary-foreground focus-visible:bg-secondary focus-visible:text-secondary-foreground",
                isActive ? "bg-primary text-primary-foreground" : "text-foreground",
                className
            )}
            style={{ color: isActive ? 'var(--primary-foreground)' : 'var(--foreground)', backgroundColor: isActive ? 'var(--primary)' : 'transparent' }} // Debugging styles
        >
            {children}
        </a>
    );
}
