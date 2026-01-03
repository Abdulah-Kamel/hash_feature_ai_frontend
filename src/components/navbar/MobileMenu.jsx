"use client";
import React, { useState } from "react";
import Link from "next/link";
import { X, ChevronDown } from "lucide-react";

const MobileMenu = ({ navLinks, isOpen, onClose }) => {
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleDropdownToggle = (id) => {
    setOpenDropdown(openDropdown === id ? null : id);
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <div
        id="mobile-nav"
        className={`fixed top-0 right-0 z-40 h-screen w-72 bg-background p-4 shadow-lg transition-transform lg:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        tabIndex="-1"
        aria-labelledby="mobile-nav-label"
      >
        <div className="flex items-center justify-between mb-6">
          <h5
            id="mobile-nav-label"
            className="text-base font-semibold text-foreground"
          >
            القائمة
          </h5>
          <button
            type="button"
            className="text-foreground bg-transparent hover:bg-accent hover:text-accent-foreground rounded-lg text-sm p-2 inline-flex items-center"
            onClick={onClose}
            aria-controls="mobile-nav"
          >
            <span className="sr-only">Close sidebar</span>
            <X className="w-4 h-4" />
          </button>
        </div>

        <ul className="space-y-2 font-medium text-foreground">
          {navLinks.map((link) => {
            if (link.hasDropdown) {
              return (
                <li key={link.id}>
                  <button
                    onClick={() => handleDropdownToggle(link.id)}
                    className="flex w-full items-center justify-between py-2 px-3 rounded hover:bg-accent hover:text-accent-foreground"
                  >
                    {link.label}
                    <ChevronDown
                      className={`w-6 h-6 transition-transform ${
                        openDropdown === link.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  {openDropdown === link.id && (
                    <ul className="py-2 text-sm text-foreground">
                      {link.dropdownItems.map((item) => (
                        <li key={item.id}>
                          <Link
                            href={item.href}
                            className="block px-4 py-2 hover:bg-accent hover:text-accent-foreground"
                            onClick={onClose}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            }

            return (
              <li key={link.id}>
                <Link
                  href={link.href}
                  className="block py-2 px-3 rounded hover:bg-accent hover:text-accent-foreground"
                  onClick={onClose}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}

          <li className="pt-2 border-t">
            <Link
              href="/register"
              className="w-full block text-foreground text-center bg-background border-white border cursor-pointer rounded-lg py-2 mt-2"
              onClick={onClose}
            >
              انشاء حساب
            </Link>
            <Link
              href="/login"
              className="w-full block text-foreground text-center bg-primary hover:bg-primary/90 cursor-pointer rounded-lg py-2 mt-2"
              onClick={onClose}
            >
              تسجيل الدخول
            </Link>
          </li>
        </ul>
      </div>
    </>
  );
};

export default MobileMenu;
