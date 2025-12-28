import React from 'react';
import Link from 'next/link';
import { Facebook, MessageCircle, Youtube } from 'lucide-react';
import { Button } from "@/components/ui/button";

const FooterContact = ({ contact, social }) => {
  const getSocialIcon = (iconName) => {
    switch (iconName) {
      case 'facebook':
        return <Facebook className="w-5 h-5 text-foreground" />;
      case 'whatsapp':
        return <MessageCircle className="w-5 h-5 text-foreground" />;
      case 'youtube':
        return <Youtube className="w-5 h-5 text-foreground" />;
      default:
        return null;
    }
  };

  return (
    <div className="text-center md:text-right">
      <h3 className="text-lg font-semibold text-foreground mb-4">{contact.title}</h3>
      <p className="text-muted-foreground mb-4">{contact.email}</p>
      
      <div className="flex gap-3 justify-center md:justify-start">
        {social.map((item) => (
          <Button asChild key={item.id} variant="outline" size="icon" className="rounded-full bg-background border-white cursor-pointer">
            <Link
              href={item.href}
              aria-label={item.name}
            >
              {getSocialIcon(item.icon)}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FooterContact;
