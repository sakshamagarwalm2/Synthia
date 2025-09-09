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
        setIsRecording(true);
        manuallyStoppedRef.current = false;
      };

      recognition.onresult = (event) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setUserSearchInput(transcript);
      };

      recognition.onerror = () => {
        setIsRecording(false);
      };

      recognition.onend = () => {
        if (!manuallyStoppedRef.current) {
          recognition.start();
        } else {
          setIsRecording(false);
        }
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const handleMicClick = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      manuallyStoppedRef.current = true;
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      manuallyStoppedRef.current = false;
      recognitionRef.current.start();
    }
  };
  // ---------------------- END SPEECH RECOGNITION ----------------------

  const onSearchQuery = async () => {
    if (!user && hasSearched) {
      router.push('/sign-in');
      return;
    }

    if (user && userDetail !== undefined) {
      if (userDetail.credits < 1000) {
        setShowCreditPopup(true);
        return;
      }
    }

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

        if (updateError) throw new Error("Failed to deduct credits.");

        if (updatedUser && updatedUser[0]) setUserDetail(updatedUser[0]);
      }

      const { error: insertError } = await supabase
        .from("Librery")
        .insert([
          {
            searchinput: userSearchInput,
            userEmail: user?.primaryEmailAddress?.emailAddress,
            type: searchType,
            libid: libid,
          },
        ]);

      if (insertError) throw new Error("Failed to log search query.");

      if (!user) {
        localStorage.setItem('hasSearched', 'true');
        setHasSearched(true);
      }

      router.push(`/search/${libid}`);
    } catch (error) {
      console.error("Search query failed:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyCredits = async () => {
  // Step 1: Open UPI payment app
  window.location.href = "upi://pay?pa=9216778386@ptyes&pn=Saksham%20Agarwal&am=5000&cu=INR";

  // Step 2: Ask user to confirm after payment
  const confirmed = confirm("Did you complete the payment of ₹5000? This App is just a demo.");

  if (confirmed) {
    const { data, error } = await supabase
      .from("Users")
      .update({ credits: userDetail.credits + 5000 }) // add credits
      .eq("email", userDetail.email)
      .select();

    if (!error && data[0]) setUserDetail(data[0]);
    setShowCreditPopup(false);
  }
};

  return (
    <div className="flex flex-col justify-center items-center w-full h-full px-4 sm:px-6 md:px-10">
      {showCreditPopup && (
        <CreditPopup
          onClose={() => setShowCreditPopup(false)}
          onBuy={handleBuyCredits}
        />
      )}

      {/* Logo + Title */}
      <div className="flex justify-center items-center gap-2 sm:gap-4 w-full">
        <Image src={"/Synthialogo.png"} alt="logo" width={80} height={40} className="sm:w-[100px] sm:h-[50px]" />
        <h1 className="font-black text-3xl sm:text-5xl text-center sm:text-left michroma-text!important">
          SYNTHIA
        </h1>
      </div>

      {/* Credits */}
      {isLoaded && user && (
        <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-sm font-semibold text-gray-800 mt-2 sm:mt-3">
          <CreditCard className="h-4 w-4 text-primary" />
          <span className="text-xs sm:text-sm">{userDetail?.credits || 0}</span>
        </div>
      )}

      {/* Input Area */}
      <div className="p-2 w-full max-w-full sm:max-w-2xl border rounded-2xl relative mt-5 sm:mt-7">
        <Tabs defaultValue="account" className="w-full">
          <TabsContent value="account">
            <textarea
              placeholder={isRecording ? "Listening..." : "Ask Anything..."}
              value={userSearchInput}
              onChange={(e) => setUserSearchInput(e.target.value)}
              className="w-full p-3 sm:p-4 pr-20 sm:pr-32 outline-none resize-none min-h-[60px] max-h-[200px] overflow-y-auto text-sm sm:text-base"
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
              className="w-full p-3 sm:p-4 pr-20 sm:pr-32 outline-none resize-none min-h-[60px] max-h-[200px] overflow-y-auto text-sm sm:text-base"
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

          <TabsList className="flex flex-wrap gap-2 sm:gap-4 mt-2">
            <TabsTrigger
              value="account"
              className={"text-primary flex items-center gap-1 text-sm sm:text-base"}
              onClick={() => setSearchType("search")}
            >
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
              Search
            </TabsTrigger>

            <TabsTrigger
              value="password"
              className={"text-primary flex items-center gap-1 text-sm sm:text-base"}
              onClick={() => setSearchType("research")}
            >
              <Atom className="h-4 w-4 sm:h-5 sm:w-5" />
              Research
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Buttons */}
        <div className="absolute right-3 sm:right-4 bottom-2 sm:bottom-3 flex gap-1 sm:gap-2 justify-center items-center">
          <Button
            variant={Ghost}
            onClick={handleMicClick}
            className={`border border-transparent border-solid rounded-full transition-all duration-300 p-1 sm:p-2 ${
              isRecording
                ? "bg-red-100 animate-pulse border-red-500 shadow-lg shadow-red-300"
                : "hover:border-amber-950"
            }`}
          >
            <Mic
              className={`h-4 w-4 sm:h-5 sm:w-5 cursor-pointer transition-colors ${
                isRecording
                  ? "text-red-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            />
          </Button>

          <Button
            className={"rounded-full p-1 sm:p-2"}
            onClick={() => {
              userSearchInput ? onSearchQuery() : null;
            }}
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 cursor-pointer animate-spin" />
            ) : !userSearchInput ? (
              <AudioLines className="h-4 w-4 sm:h-5 sm:w-5 cursor-pointer" />
            ) : (
              <SendHorizonal className="h-4 w-4 sm:h-5 sm:w-5 cursor-pointer" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ChatInputBox;