'use client';
import Link from "next/link";
import { useEffect, useRef, useState } from "react"

const ChevronDownIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export default function Navbar() {
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);
    const [openAccordion, setOpenAccordion] = useState<string | null>(null);
    const navbarRef = useRef<HTMLElement | null>(null);

    const links = [
        {
            name: "Home",
            href: "/"
        },
        {
            name: "Teams",
            href: "/teams"
        },
        {
            name: "Info",
            links: [
                {
                    name: "About", href: "/about",
                },
                {
                    name: "Ko-fi", href: "https://ko-fi.com/Echoviax"
                }
            ]
        },
        {
            name: "Account",
            links: [
                {
                    name: "Sign in", href: "/sign-in"
                }
            ]
        }
    ]

    useEffect(() => {
        function handleOutsideClick(event: MouseEvent) {
            if (navbarRef.current && !navbarRef.current.contains(event.target as Node)) {
                setOpenDropdown(null);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);

        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, [navbarRef])

    const handleDropdownToggle = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    }

    return (
        <div className="bg-[#364156] font-sans text-[#DCDCDC]">
            <nav ref={navbarRef} className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
                <div className="w-auto h-14 px-6 bg-[#364156]/50 backdrop-blur-lg border border-[#364156]/30 rounded-full shadow-lg flex items-center justify-between space-x-8 transition-all duration-300">
                    <Link href="/" className="flex items-center text-4xl">
                        ⚾
                    </Link>

                    <div className="flex items-center space-x-6">
                        {links.map((item) => {
                            return (
                                <div key={item.name} className="relative">
                                    {item.links && (<>
                                        <button onClick={() => handleDropdownToggle(item.name)} className="flex items-center space-x-1 text-sm font-medium text-[#DCDCDC] hover:text-[#C5C3C6] transition-colors">
                                            <span>{item.name}</span>
                                            <span className={`transition-transform duration-200 ${openDropdown === item.name ? 'rotate-180' : ''}`}>
                                                <ChevronDownIcon />
                                            </span>
                                        </button>

                                        <div className={`absolute top-full mt-3 w-24 bg-[#364156] rounded-xl shadow-xl transition-all duration-300 origin-top ${openDropdown === item.name ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                                            {item.links.map((link) => (
                                                <Link key={link.name} href={link.href} className="block px-4 py-2 text-sm text-[#EDEDED] rounded-lg hover:bg-[#465470] hover:text-[#FFFFFF]">
                                                    {link.name}
                                                </Link>
                                            ))}
                                        </div>
                                    </>)}
                                    {item.href && (
                                        <Link href={item.href} className="flex items-center space-x-1 text-sm font-medium text-[#DCDCDC] hover:text-[#C5C3C6] transition-colors">
                                            {item.name}
                                        </Link>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </nav>
        </div>
    )
}