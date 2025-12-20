import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from "@/assets/HashFlowlogo.png";

const NavLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image src={logo} alt="Hash Flow Logo" className="h-11 w-auto" />
    </Link>
  );
};

export default NavLogo;
