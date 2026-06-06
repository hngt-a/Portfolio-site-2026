'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

const navItems = [
    { label: 'Upcoming', path: 'upcoming' },
    { label: 'Works', path: '' },
    { label: 'CV', path: 'cv' },
    { label: 'Statement', path: 'statement' },
    { label: 'Contact', path: 'contact' },
]

const INSTAGRAM_URL = 'https://www.instagram.com/shin.hanagata'

const InstagramIcon = ({ className }: { className?: string }) => (
    <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        className={className}
    >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
)

export const Navigation = ({ lang }: { lang: string }) => {
    const pathname = usePathname()
    // const isEn = lang === 'en' // Not strictly needed for top nav if we just link
    const [isOpen, setIsOpen] = React.useState(false)

    // Close mobile menu when route changes
    React.useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    return (
        <>
            <nav className="w-full py-6 px-4 md:px-8 flex justify-between items-center z-50 sticky top-0 mix-blend-difference text-white">
                <div className="font-pinyon text-[2.475rem] relative group">
                    <Link href={`/${lang}`} className="hover:!text-white hover:!bg-transparent hover:opacity-100">
                        Shin Hanagata
                    </Link>
                </div>

                {/* DESKTOP MENU (> 700px) */}
                <ul className="hidden min-[740px]:flex gap-4 text-sm items-center">
                    {navItems.map((item) => {
                        const href = item.path === '' ? `/${lang}` : `/${lang}/${item.path}`
                        const isActive = pathname === href || (item.path === '' && pathname === `/${lang}/`)

                        return (
                            <li key={item.path}>
                                <Link
                                    href={href}
                                    className={cn(
                                        "transition-all decoration-1 underline-offset-4 hover:bg-white hover:text-black hover:no-underline px-1",
                                        isActive ? "underline font-bold opacity-100" : "opacity-100"
                                    )}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        )
                    })}
                    {/* Instagram */}
                    <li>
                        <a
                            href={INSTAGRAM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="block transition-opacity hover:opacity-60"
                        >
                            <InstagramIcon className="w-5 h-5" />
                        </a>
                    </li>
                    {/* Language Switcher */}
                    <li>
                        <Link
                            href={pathname.replace(`/${lang}`, `/${lang === 'en' ? 'ja' : 'en'}`)}
                            className="transition-all border border-white rounded-full w-8 h-8 flex items-center justify-center text-xs hover:bg-white hover:text-black"
                        >
                            {lang === 'en' ? 'JA' : 'EN'}
                        </Link>
                    </li>
                </ul>

                {/* MOBILE TOGGLE (<= 700px) */}
                <button
                    className="min-[740px]:hidden z-50 relative p-2"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-label="Toggle menu"
                >
                    <div className="w-6 flex flex-col items-end gap-1.5">
                        <span className={cn("block w-full h-0.5 bg-white transition-transform duration-300", isOpen && "rotate-45 translate-y-2")} />
                        <span className={cn("block w-full h-0.5 bg-white transition-opacity duration-300", isOpen && "opacity-0")} />
                        <span className={cn("block w-full h-0.5 bg-white transition-transform duration-300", isOpen && "-rotate-45 -translate-y-2")} />
                    </div>
                </button>
            </nav>

            {/* MOBILE OVERLAY */}
            <div
                className={cn(
                    "fixed inset-0 bg-black z-40 transition-all duration-300 flex flex-col items-center justify-center gap-8 min-[740px]:hidden",
                    isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                )}
            >
                <ul className="flex flex-col items-center gap-8 text-xl">
                    {navItems.map((item) => {
                        const href = item.path === '' ? `/${lang}` : `/${lang}/${item.path}`
                        const isActive = pathname === href || (item.path === '' && pathname === `/${lang}/`)

                        return (
                            <li key={item.path}>
                                <Link
                                    href={href}
                                    className={cn(
                                        "transition-all decoration-1 underline-offset-8 hover:bg-white hover:text-black hover:no-underline px-2",
                                        isActive ? "underline font-bold" : ""
                                    )}
                                >
                                    {item.label}
                                </Link>
                            </li>
                        )
                    })}
                    {/* Instagram Mobile */}
                    <li>
                        <a
                            href={INSTAGRAM_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                            className="block transition-opacity hover:opacity-60"
                        >
                            <InstagramIcon className="w-5 h-5" />
                        </a>
                    </li>
                    {/* Language Switcher Mobile */}
                    <li className="mt-4">
                        <Link
                            href={pathname.replace(`/${lang}`, `/${lang === 'en' ? 'ja' : 'en'}`)}
                            className="border border-white rounded-full w-12 h-12 flex items-center justify-center text-sm transition-all hover:bg-white hover:text-black"
                        >
                            {lang === 'en' ? 'JA' : 'EN'}
                        </Link>
                    </li>
                </ul>
            </div>
        </>
    )
}
