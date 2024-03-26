import React from "react";
import Image from "next/image";
import Link from "next/link";

function Text() {
  return (
    <>
      <div className=" my-20 max-lg:items-center max-lg:flex max-lg:flex-col">
        <div className="lg:text-6xl text-4xl max-lg:text-center  lg:mr-20 font-black leading-[5rem]">
          Helping developers ship features fast.
        </div>
        <div className="lg:mt-10 lg:mr-36 text-zinc-300 max-lg:text-center">
          Understand your codebase, make changes with confidence, and ship
          features faster. Meww does the heavy lifting so you can focus on what
          you do best.
        </div>
        <div className="mt-14">
          <Link
            href={"https://dub.sh/meww"}
            className="bg-accent text-zinc-950 px-8 py-4 font-bold rounded-full "
          >
            Join the waitlist
          </Link>
        </div>
      </div>
    </>
  );
}

function HeroImage() {
  return (
    <div className=" max-lg:flex max-lg:justify-center ">
      <Image
        src={"/hero2.png"}
        alt="hero-img"
        className="max-md:w-[350px] max-md:h-[350px]  "
        width={700}
        height={700}
      />
    </div>
  );
}

function GradientCircle() {
  return <div className="gradient-circle"></div>;
}

export default function Hero() {
  return (
    <div className=" 2xl:flex 2xl:justify-center">
      <div className="absolute lg:hidden block ">
        <GradientCircle />
      </div>
      <div className="lg:flex lg:flex-row flex-col flex mt-20">
        <Text />
        <HeroImage />
      </div>
      <div className="absolute lg:block hidden ">
        <GradientCircle />
      </div>
    </div>
  );
}
