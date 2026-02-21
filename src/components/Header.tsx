"use client";

import { useState, useEffect } from "react";

export default function Header() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Inicio", href: "#hero" },
        { name: "Trayectoria", href: "#about" },
        { name: "Larimar City", href: "#larimar-city" },
        { name: "Visión", href: "#corporate" },
        { name: "Prensa", href: "#media" },
    ];

    return (
        <header className={`header ${scrolled ? "header-scrolled" : ""}`}>
            <div className="container header-container">
                <a href="#hero" className="header-logo">
                    <span className="brand-prefix slot-machine-container">
                        <ul className="slot-machine-list">
                            <li className="slot-accent">ARQ.</li>
                            <li className="slot-accent">EMP.</li>
                            <li className="slot-accent">CEO.</li>
                            <li className="slot-accent">ARQ.</li>
                        </ul>
                    </span>
                    <span>JUAN ANDRÉS ROMERO</span>
                </a>

                {/* Desktop Nav */}
                <nav className="header-nav">
                    {navLinks.map((link) => (
                        <a key={link.name} href={link.href} className="header-link">
                            {link.name}
                        </a>
                    ))}
                </nav>

                {/* Mobile Toggle */}
                <button
                    className={`mobile-menu-btn desktop-hidden ${mobileMenuOpen ? 'menu-open' : ''}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    <span className={`hamburger-line ${mobileMenuOpen ? "open-1" : ""}`}></span>
                    <span className={`hamburger-line ${mobileMenuOpen ? "open-2" : ""}`}></span>
                    <span className={`hamburger-line ${mobileMenuOpen ? "open-3" : ""}`}></span>
                </button>
            </div>

            {/* Mobile Nav */}
            <div className={`mobile-nav ${mobileMenuOpen ? "mobile-nav-open" : ""}`}>
                {navLinks.map((link) => (
                    <a
                        key={link.name}
                        href={link.href}
                        className="mobile-link"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {link.name}
                    </a>
                ))}
            </div>
        </header>
    );
}
