import React from "react";
import Link from "next/link";
import Image from "next/image";

const Header = () => (
  <header className="bg-transparent  text-base p-2 pb-4 md:flex md:justify-between md:items-center mt-6 mb-2 ">
    <Link href={'/'} className="flex justify-between items-center">
      <div className="w-12 h-12 relative">
        <Image
          src={"/lightlogo.webp"}
          className="rounded-full absolute top-0 left-0"
          layout="fill"
          objectFit="cover"
          alt="logo"
        />
      </div>
      <div className="mx-3 text-2xl font-black">
        Meww
      </div>
    </Link>
    <div className="hidden md:block space-x-10">
      <Link href="examples" className=" hover:text-slate-200">
        examples
      </Link>
      <Link
        href="Login"
        className=" bg-zinc-950 text-accent border-2 border-accent py-2 px-6 rounded-full  hover:bg-zinc-900 "
      >
        login
      </Link>
    </div>
  </header>
);

export default Header;
