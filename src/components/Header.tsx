import React from "react";
import Link from "next/link";
import Image from "next/image";

const Header = () => (
  <header className="bg-transparent  p-2 md:flex md:justify-between md:items-center border-b-2">
    <div className="flex justify-between items-center">
      <div className="w-14 h-14 relative">
        <Image
          src={"/lightlogo.webp"}
          className="rounded-full absolute top-0 left-0"
          layout="fill"
          objectFit="cover"
          alt="logo"
        />
      </div>
    </div>
    <div className="hidden md:block space-x-10">
      <Link href="examples" className="text-lg">
        examples
      </Link>
      <Link href="Login" className="text-lg bg-accent text-primary py-2 px-6 rounded-full border-2 border-accent hover:bg-primary hover:text-accent">
        login
      </Link>
    </div>
  </header>
);

export default Header;
