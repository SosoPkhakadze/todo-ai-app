// src/components/theme-provider.tsx

"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
// No need to import the type separately, 'React.ComponentProps' will work.

export function ThemeProvider({ children, ...props }: React.ComponentProps<typeof NextThemesProvider>) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}