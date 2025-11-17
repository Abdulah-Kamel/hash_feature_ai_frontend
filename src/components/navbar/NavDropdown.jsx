import React from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const NavDropdown = ({ label, dropdownId, items }) => {
  return (
    <li>
      <button
        id={`${dropdownId}Button`}
        data-dropdown-toggle={`${dropdownId}Menu`}
        className="flex items-center gap-2 py-2 text-gray-900 hover:text-primary px-5"
      >
        {label}
        <ChevronDown className="w-6 h-6" />
      </button>
      <div
        id={`${dropdownId}Menu`}
        className="z-20 hidden font-normal divide-y divide-gray-100 rounded-lg shadow-sm w-44 bg-white"
      >
        <ul className="py-2 text-sm text-gray-700" aria-labelledby={`${dropdownId}Button`}>
          {items.map((item) => (
            <li key={item.id}>
              <Link href={item.href} className="block px-4 py-2 hover:bg-gray-50">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
};

export default NavDropdown;
