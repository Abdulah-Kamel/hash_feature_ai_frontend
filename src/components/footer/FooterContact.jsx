import React from 'react';
import Link from 'next/link';
import {
  Facebook,
  MessageCircle,
  Youtube,
  Linkedin,
  Instagram,
  Twitter,
  Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const FooterContact = ({ contact, social }) => {
  const getSocialIcon = (iconName) => {
    switch (iconName) {
      case "facebook":
        return <Facebook className="w-5 h-5 text-foreground" />;
      case "whatsapp":
        return <MessageCircle className="w-5 h-5 text-foreground" />;
      case "youtube":
        return <Youtube className="w-5 h-5 text-foreground" />;
      case "linkedin":
        return <Linkedin className="w-5 h-5 text-foreground" />;
      case "telegram":
        return <Send className="w-5 h-5 text-foreground" />; // Using Send for Telegram
      case "instagram":
        return <Instagram className="w-5 h-5 text-foreground" />;
      case "twitter":
        return <Twitter className="w-5 h-5 text-foreground" />;
      case "tiktok":
        return (
          <svg
            className="w-5 h-5 text-foreground"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="text-center md:text-right">
      <h3 className="text-lg font-semibold text-foreground mb-4">
        {contact.title}
      </h3>
      <p className="text-muted-foreground mb-4">{contact.email}</p>

      <div className="flex gap-3 justify-center md:justify-start">
        {social.map((item) => (
          <Button
            asChild
            key={item.id}
            variant="outline"
            size="icon"
            className="rounded-full bg-background border-white cursor-pointer"
          >
            <Link href={item.href} aria-label={item.name}>
              {getSocialIcon(item.icon)}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FooterContact;
