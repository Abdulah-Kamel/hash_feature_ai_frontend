'use client';
import React, { useState } from 'react';
import { Menu } from 'lucide-react';
import { navLinks } from '../../data/navigationData';
import NavLogo from './NavLogo';
import NavActions from './NavActions';
import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';

export function NavBar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
 
  return (
    <>
      <nav className="sticky w-full z-20 top-0 bg-background start-0">
        <div className="flex flex-wrap w-full items-center justify-between p-4 lg:px-12">
          <NavLogo />
          <NavActions />
          <DesktopMenu navLinks={navLinks} />
 
          <button
            className="lg:hidden inline-flex items-center justify-center p-2 w-10 h-10 text-foreground rounded-lg hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-accent"
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            aria-controls="mobile-nav"
            aria-expanded={isMobileMenuOpen}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="w-5 h-5 text-foreground" />
          </button>
        </div>
      </nav>

      <MobileMenu 
        navLinks={navLinks} 
        isOpen={isMobileMenuOpen} 
        onClose={() => setMobileMenuOpen(false)} 
      />
    </>
  );
}
