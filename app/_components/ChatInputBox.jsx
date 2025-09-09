"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import {
  Atom,
  AudioLines,
  Ghost,
  Mic,
  Search,
  SendHorizonal,
  Loader2,
  CreditCard,
} from "lucide-react";
import { supabase } from "../../Services/supabase";

import { SignUpButton, useUser } from "@clerk/nextjs"; // useUser is crucial here
import { Button } from "../../components/ui/button";
import { useContext } from "react";
import { UserDetailContext } from "../../context/UserDetailContext";
import CreditPopup from "../../components/ui/CreditPopup";
import { useRouter } from "next/navigation";

function ChatInputBox() {
  const libid = crypto.randomUUID();

  const { userDetail, setUserDetail } = useContext(UserDetailContext);
  const [showCreditPopup, setShowCreditPopup] = useState(false);

  const [showSignInPopup, setShowSignInPopup] = useState(false);

  const [userSearchInput, setUserSearchInput] = useState();
  const [searchType, setSearchType] = useState("search");
  const { user, isLoaded } = useUser(); // Get both user and isLoaded

  const [loading, setLoading] = useState(false);

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);
  const manuallyStoppedRef = useRef(false);

  const router = useRouter();

  // Load hasSearched from localStorage on mount
  const [hasSearched, setHasSearched] = useState(false);
  useEffect(() => {
    const stored = localStorage.getItem('hasSearched');
    if (stored === 'true') {
      setHasSearched(true);
    }
  }, []);

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
      manuallyStoppedRef.current = true;
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      console.log("▶️ Starting recognition...");
      manuallyStoppedRef.current = false;
      recognitionRef.current.start();
    }
  };
  // ---------------------- END SPEECH RECOGNITION ----------------------

  const onSearchQuery = async () => {

    // Guest limit check
    if (!user && hasSearched) {
      console.log("Guest user has already searched once.");
      router.push('/sign-in');
      return;
    }


    if (user && userDetail !== undefined) {
      if (userDetail.credits < 1000) {
        setShowCreditPopup(true);
        return;
      }
    }
    // console.log("Search Input:", user);

    if (!userSearchInput) {
      return;
    }

    setLoading(true);

    try {
      if (user) {
        const { data: updatedUser, error: updateError } = await supabase
          .from("Users")
          .update({ credits: userDetail.credits - 1000 })
          .eq("email", userDetail.email)
          .select();

        if (updateError) {
          throw new Error("Failed to deduct credits.");
        }

        if (updatedUser && updatedUser[0]) {
          setUserDetail(updatedUser[0]);
        }

      }
        const { data: insertResult, error: insertError } = await supabase
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

        if (insertError) {
          throw new Error("Failed to log search query.");
        }

        // Set hasSearched for guests after successful search
      if (!user) {
        localStorage.setItem('hasSearched', 'true');
        setHasSearched(true);
        console.log("Set hasSearched to true for guest user");
      }

      router.push(`/search/${libid}`);
      
    } catch (error) {
      console.error("Search query failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyCredits = async () => {
    const { data, error } = await supabase
      .from("Users")
      .update({ credits: userDetail.credits + 10000 })
      .eq("email", userDetail.email)
      .select();

    if (!error && data[0]) {
      setUserDetail(data[0]);
    }
    setShowCreditPopup(false);
  };

  return (
    <div className="flex justify-center items-center w-full h-full flex-col">
      {showCreditPopup && (
        <CreditPopup
          onClose={() => setShowCreditPopup(false)}
          onBuy={handleBuyCredits}
        />
      )}
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
              placeholder={
                isRecording ? "Listening..." : "Research Anything..."
              }
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
              OnClick={() => setSearchType("research")}
            >
              <Atom />
              Research
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="absolute right-4 bottom-3 flex gap-2 justify-center items-center">
          {isLoaded && user && (
            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm font-semibold text-gray-800">
              <CreditCard className="h-4 w-4 text-primary" />
              <span className="text-xs">{userDetail?.credits || 0}</span>
            </div>
          )}
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
                isRecording
                  ? "text-red-600"
                  : "text-gray-500 hover:text-gray-700"
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
