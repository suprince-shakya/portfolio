"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Menu, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

interface NavbarProps {
  sections: {
    name: string
    ref: React.RefObject<HTMLDivElement>
  }[]
}

export default function Navbar({ sections }: NavbarProps) {
  const { theme, setTheme } = useTheme()
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  if (!mounted) {
    return null
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tighter transition-colors">
            <span className="text-primary">Dev</span>Porfolio
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {sections.map((section) => (
              <button
                key={section.name}
                onClick={() => scrollToSection(section.ref)}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                {section.name}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <Sheet>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon" aria-label="Menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[240px] sm:w-[300px]">
                <nav className="flex flex-col gap-4 mt-8">
                  {sections.map((section) => (
                    <button
                      key={section.name}
                      onClick={() => {
                        scrollToSection(section.ref)
                        document.querySelector('[data-state="open"]')?.setAttribute("data-state", "closed")
                      }}
                      className="text-sm font-medium hover:text-primary transition-colors py-2"
                    >
                      {section.name}
                    </button>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

