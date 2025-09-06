"use client";

import Image from "next/image";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Atom,
  AudioLines,
  Cpu,
  Ghost,
  Globe,
  Mic,
  Paperclip,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AIModelsOption } from "@/Services/Shared";

function ChatInputBox() {
  return (
    <div className="flex justify-center items-center w-full h-full flex-col">
      <div className="flex justify-evenly items-center">
        <Image src={"/Synthialogo.png"} alt="logo" width={100} height={50} />
        <h1 className="font-black font-stretch-75% text-5xl michroma-text!important">
          SYNTHIA
        </h1>
      </div>
      <div className="p-2 w-full max-w-2xl border rounded-2xl relative mt-10">
        <Tabs defaultValue="account" className="w-full">
          <TabsContent value="account">
            <textarea
              placeholder="Ask Anything..."
              className="w-full p-4 pr-32 outline-none resize-none min-h-[60px] max-h-[200px] overflow-y-auto"
              rows={1}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 200) + "px";
              }}
            />
          </TabsContent>
          <TabsContent value="password">
            <textarea
              placeholder="Research Anything..."
              className="w-full p-4 pr-32 outline-none resize-none min-h-[60px] max-h-[200px] overflow-y-auto"
              rows={1}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 200) + "px";
              }}
            />
          </TabsContent>
          <TabsList>
            <TabsTrigger value="account" className={"text-primary"}>
              <Search />
              Search
            </TabsTrigger>
            <TabsTrigger value="password" className={"text-primary"}>
              <Atom />
              Research
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="absolute right-4 bottom-3 flex gap-2 justify-center items-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant={Ghost} className={'border border-transparent border-solid hover:border-amber-950 rounded-full'}>
                <Cpu className="text-gray-500 h-5 w-5 cursor-pointer hover:text-gray-700" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Select Model</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {AIModelsOption.map((model,index)=>(
                <DropdownMenuItem key={index}>
                    <div>
                        <h2 className="mb-1 text-sm">{model.name}</h2>
                        <p className="text-xs">{model.desc}</p>
                    </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant={Ghost}  className={'border border-transparent border-solid hover:border-amber-950 rounded-full'}>
            <Globe className="text-gray-500 h-5 w-5 cursor-pointer hover:text-gray-700" />
          </Button>
          <Button variant={Ghost} className={'border border-transparent border-solid hover:border-amber-950 rounded-full'}>
            <Paperclip className="text-gray-500 h-5 w-5 cursor-pointer hover:text-gray-700" />
          </Button>
          <Button variant={Ghost} className={'border border-transparent border-solid hover:border-amber-950 rounded-full'}>
            <Mic className="text-gray-500 h-5 w-5 cursor-pointer hover:text-gray-700" />
          </Button>
          <Button className={"rounded-full"}>
            <AudioLines className="h-5 w-5 cursor-pointer" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatInputBox;
