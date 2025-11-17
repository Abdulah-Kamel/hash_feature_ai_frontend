import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import logo from "../../assets/logo.svg";

const NavLogo = () => {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image src={logo} alt="Hash Plus Logo" className="h-11 w-auto" />
      <span className="text-2xl font-bold">هاش بلس</span>
    </Link>
  );
};

export default NavLogo;
