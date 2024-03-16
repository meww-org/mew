import {
  Avatar,
  Button,
  Chip,
  Input,
  ScrollShadow,
  Textarea,
} from "@nextui-org/react";
import React from "react";

function page() {
  return (
    <div className="  bg-gray-900  ">
      <main className="flex min-h-screen flex-col items-center justify-between md:px-24 py-5    ">
        <div className="flex md:w-[73%] w-[95%] md:p-3 p-2 flex-col   ">
          {/* <div className=" h-full flex flex-col gap-2 overflow-y-auto bg-scroll  py-8 px-3 w-full"> */}
          <div className="">
            <ScrollShadow
              //   ref={chatContainerRef}
              offset={100}
              orientation="horizontal"
              hideScrollBar
              className=" min-h-[730px] max-h-[730px]  "
            >
              {/* {chatHistory?.map((message, index) => (
            <div key={index} className="   ">
              <Chip
                color="success"
                radius="sm"
                variant="flat"
                avatar={
                  <Avatar
                    name={message?.role}
                    size="sm"
                    getInitials={(name) => name?.charAt(0)}
                  />
                }
                className=" md:text-xl font-medium  text-sm text-black  "
                classNames={{
                  // base: "bg-gradient-to-br from-indigo-500 to-pink-500 border-small border-white/50 shadow-pink-500/30",
                  content: "drop-shadow shadow-black text-black",
                }}
              >
                {message.role}{" "}
              </Chip>
              <h1 className=" md:text-lg font-medium  text-sm text-gray-700">
                {" "}
                {message.parts}{" "}
              </h1>
            </div>
          ))} */}
            </ScrollShadow>
          </div>

          <div className="relative  md:w-[100%] w-[95%] bottom-4 gap-2 flex justify-center items-center mt-10">
            <Input
              type="text"
              //   value={inputMessage}
              //   onChange={(e) => setInputMessage(e.target.value)}
              variant="underlined"
              color="primary"
              className="resize-none overflow-y-auto text-white font-semibold   rounded-l outline-none"
            />
            <Button
              className="py-2"
              variant="ghost"
              color="primary"
              //   onClick={sendMessage}
            >
              send
            </Button>
          </div>
        </div>
      </main>
      {/* <ThemeSwitcher /> */}
    </div>
  );
}

export default page;
