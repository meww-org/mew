"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, Popover, PopoverTrigger } from "@nextui-org/react";
import menuIcon from "@/assets/hamburger.svg";
import crossIcon from "@/assets/cross.svg";
function Header() {
  const [click, setClick] = useState(true);
  const handleClick = () => {
    setClick(!click);
    setIsPopoverOpen(!isPopoverOpen);
  };

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1020) {
        setIsPopoverOpen(false);
        setClick(true);
      }
    };

    window.addEventListener("resize", handleResize);

    handleResize();
  }, []);
  return (
    <div className="bg-transparent  text-base p-2 pb-4 md:flex md:justify-between 2xl:justify-center 2xl:gap-[500px] md:items-center mt-6 mb-2 ">
      <div className="flex justify-between items-center">
        <div className="w-12 h-12 relative 2xl:mr-64 ">
          <Image
            src={"/lightlogo.webp"}
            className="rounded-full absolute top-0 left-0"
            layout="fill"
            objectFit="cover"
            alt="logo"
          />
        </div>
      </div>
      <div className="hidden lg:flex lg:items-center space-x-10 2xl:ml-64">
        <Link href="examples" className=" cursor-pointer hover:text-slate-200">
          Examples
        </Link>
        <Button
          color="success"
          variant="bordered"
          className="   border-2 py-2 px-6 rounded-full  "
        >
          login
        </Button>
      </div>
      {/* <div className="    lg:hidden flex">
        <Popover placement="bottom" color="primary">
          <PopoverTrigger>
          
            <Image
              className=" w-[20px] h-[20px] mr-2"
              src={click ? menuIcon : crossIcon}
              onClick={handleClick}
              alt=""
            />
          </PopoverTrigger>
          <div className=" bg-black p-5  border-none gap-5">
            <Link href="examples" className=" hover:text-slate-200">
              Examples
            </Link>
            <Button
              color="success"
              variant="bordered"
              className="   border-2 py-2 px-6 rounded-full  "
            >
              login
            </Button>
          </div>
        </Popover>
      </div> */}
    </div>
  );
}
export default Header;
