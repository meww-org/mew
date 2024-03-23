import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@radix-ui/react-icons";

function Text() {
  return (
    <>
      <div className=" my-20">
        <div className="text-6xl mr-20 font-black leading-[5rem]">
          Helping developers ship features fast.
        </div>
        <div className="mt-10 mr-36 text-zinc-300">
          Understand your codebase, make changes with confidence, and ship
          features faster. Meww does the heavy lifting so you can focus on what
          you do best.
        </div>
        <div className="mt-14">
          <Link
            href={"https://dub.sh/meww"}
            className="bg-accent w-[12vw] text-zinc-950 px-8 py-4 font-bold rounded-full hover:bg-[#07b546] flex items-center justify-center"
          >
            Join the waitlist
            <ArrowRightIcon className="h-5 w-5 ml-2 text-black" />
          </Link>
        </div>
      </div>
    </>
  );
}

function HeroImage() {
  return (
    <>
      <Image src={"/hero2.png"} alt="hero-img" width={700} height={700} />
    </>
  );
}

function GradientCircle() {
  return <div className="gradient-circle"></div>;
}

export default function Hero() {
  return (
    <div>
      <div className="flex flex-row mt-20">
        <Text />
        <HeroImage />
      </div>
      <div className="absolute ">
        <GradientCircle />
      </div>
    </div>
  );
}
