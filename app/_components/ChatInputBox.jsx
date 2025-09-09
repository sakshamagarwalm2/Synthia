"use client";

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import {
  Atom,
  AudioLines,
  Cpu,
  Ghost,
  Mic,
  Search,
  SendHorizonal,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { supabase } from "../../Services/supabase";
import { useUser } from "@clerk/nextjs";
import { Button } from "../../components/ui/button";
import { useRouter } from "next/navigation";

function ChatInputBox() {
  const libid = crypto.randomUUID();
  const [userSearchInput, setUserSearchInput] = useState("");
  const [searchType, setSearchType] = useState("search");
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const manuallyStoppedRef = useRef(false); // ✅ prevent auto-restart when clicked stop

  const router = useRouter();

  // ---------------------- SPEECH RECOGNITION ----------------------
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("webkitSpeechRecognition" in window || "SpeechRecognition" in window)
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = true;
      recognition.continuous = true;

      recognition.onstart = () => {
        console.log("🎤 Started listening...");
        setIsRecording(true);
        manuallyStoppedRef.current = false;
      };

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        console.log("📝 Transcript:", transcript);
        setUserSearchInput(transcript);
      };

      recognition.onerror = (event) => {
        console.error("❌ Speech recognition error:", event.error);
        setIsRecording(false);
      };

      recognition.onend = () => {
        console.log("⏹️ Recognition ended");
        if (!manuallyStoppedRef.current) {
          console.log("🔁 Auto-restarting...");
          recognition.start();
        } else {
          console.log("🛑 Stopped by user");
          setIsRecording(false);
        }
      };

      recognitionRef.current = recognition;
    } else {
      console.warn("⚠️ SpeechRecognition API not supported in this browser.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleMicClick = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition not supported. Try Another Browser");
      return;
    }

    if (isRecording) {
      console.log("🛑 Stopping recognition...");
      manuallyStoppedRef.current = true; // ✅ don’t restart after stop
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      console.log("▶️ Starting recognition...");
      manuallyStoppedRef.current = false;
      recognitionRef.current.start();
    }
  };

  // ---------------------- SEARCH HANDLER ----------------------
  const onSearchQuery = async () => {
    setLoading(true);

    await supabase
      .from("Librery")
      .insert([
        {
          searchinput: userSearchInput,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          type: searchType,
          libid: libid,
        },
      ])
      .select();

    setLoading(false);
    router.push(`/search/${libid}`);
  };

  // ---------------------- RENDER ----------------------
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
              placeholder={isRecording ? "Listening..." : "Ask Anything..."}
              value={userSearchInput}
              onChange={(e) => setUserSearchInput(e.target.value)}
              className="w-full p-4 pr-32 outline-none resize-none min-h-[60px] max-h-[200px] overflow-y-auto"
              rows={1}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 200) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  userSearchInput ? onSearchQuery() : null;
                }
              }}
            />
          </TabsContent>

          <TabsContent value="password">
            <textarea
              placeholder={isRecording ? "Listening..." : "Research Anything..."}
              value={userSearchInput}
              onChange={(e) => setUserSearchInput(e.target.value)}
              className="w-full p-4 pr-32 outline-none resize-none min-h-[60px] max-h-[200px] overflow-y-auto"
              rows={1}
              onInput={(e) => {
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 200) + "px";
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  userSearchInput ? onSearchQuery() : null;
                }
              }}
            />
          </TabsContent>

          <TabsList>
            <TabsTrigger
              value="account"
              className={"text-primary"}
              onClick={() => setSearchType("search")}
            >
              <Search />
              Search
            </TabsTrigger>

            <TabsTrigger
              value="password"
              className={"text-primary"}
              onClick={() => setSearchType("research")}
            >
              <Atom />
              Research
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="absolute right-4 bottom-3 flex gap-2 justify-center items-center">
          {/* 🎤 MIC BUTTON with animation */}
          <Button
            variant={Ghost}
            onClick={handleMicClick}
            className={`border border-transparent border-solid rounded-full transition-all duration-300 ${
              isRecording
                ? "bg-red-100 animate-pulse border-red-500 shadow-lg shadow-red-300"
                : "hover:border-amber-950"
            }`}
          >
            <Mic
              className={`h-5 w-5 cursor-pointer transition-colors ${
                isRecording ? "text-red-600" : "text-gray-500 hover:text-gray-700"
              }`}
            />
          </Button>

          {/* SEND BUTTON */}
          <Button
            className={"rounded-full"}
            onClick={() => {
              userSearchInput ? onSearchQuery() : null;
            }}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-5 w-5 cursor-pointer animate-spin" />
            ) : !userSearchInput ? (
              <AudioLines className="h-5 w-5 cursor-pointer" />
            ) : (
              <SendHorizonal className="h-5 w-5 cursor-pointer" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatInputBox;
