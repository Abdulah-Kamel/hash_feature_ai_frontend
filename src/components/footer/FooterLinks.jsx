import React from 'react';
import Link from 'next/link';

const FooterLinks = ({ title, links }) => {
  return (
    <div className="text-center md:text-right">
      <h3 className="text-lg font-semibold text-foreground mb-4">{title}</h3>
      <ul className="space-y-3">
        {links.map((link) => (
          <li key={link.id}>
            <Link 
              href={link.href} 
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer rounded-lg p-2 transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterLinks;
