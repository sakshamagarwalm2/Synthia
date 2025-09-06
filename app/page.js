import { Button } from "@/components/ui/button";
import Image from "next/image";
import ChatInputBox from "./_components/ChatInputBox";

export default function Home() {
  return (
    <div className="w-full h-screen">
      <ChatInputBox/>
    </div>
  );
}
