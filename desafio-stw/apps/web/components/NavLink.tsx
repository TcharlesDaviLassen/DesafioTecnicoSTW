"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface NavLinkProps {
  href: string;
  label: string;
}

export function NavLink({ href, label }: NavLinkProps) {
  const pathname = usePathname();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`px-4 py-2 rounded transition-colors ${
        isActive
          ? "text-blue-600"
          : "text-black dark:text-white hover:text-blue-500"
      }`}
    >
      {label}
    </Link>
  );
}
