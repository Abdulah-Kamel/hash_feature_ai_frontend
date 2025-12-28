import React from 'react';
import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

// A reusable list item component for the dropdown menu
const ListItem = React.forwardRef(({ href, title, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          ref={ref}
          className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          {...props}
        >
          <div className="text-sm text-end font-medium leading-none">{title}</div>
        </Link>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

const DesktopMenu = ({ navLinks }) => {
  return (
    <div className="hidden lg:flex lg:w-auto lg:order-1">
      <NavigationMenu>
        <NavigationMenuList dir={'rtl'}>
          {navLinks.map((link) => {
            if (link.hasDropdown) {
              return (
                <NavigationMenuItem key={link.id} >
                  <NavigationMenuTrigger>{link.label}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[300px] gap-3 p-4 md:w-[400px] md:grid-cols-2">
                      {link.dropdownItems.map((item) => (
                        <ListItem
                          key={item.id}
                          href={item.href}
                          title={item.label}
                        />
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            }

            return (
              <NavigationMenuItem key={link.id}>
                <NavigationMenuLink asChild>
                  <Link 
                    href={link.href}
                    className={`${navigationMenuTriggerStyle()} ${link.isActive ? 'bg-accent text-accent-foreground' : ''}`}
                  >
                    {link.label}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            );
          })}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default DesktopMenu;
