"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../Services/supabase";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LibraryBig, Trash2, Loader2 } from "lucide-react";
import { Button } from "../../../components/ui/button";

function Librery() {
  const { user } = useUser();
  const router = useRouter();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getLibraryHistory();
    }
  }, [user]);

  const getLibraryHistory = async () => {
    setLoading(true);
    const { data: Librery, error } = await supabase
      .from("Librery")
      .select("*")
      .eq("userEmail", user?.primaryEmailAddress?.emailAddress)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching library history:", error);
    } else {
      setHistory(Librery);
    }
    setLoading(false);
  };

  const handleChatClick = (libid) => {
    router.push(`/search/${libid}`);
  };

  const handleDelete = async (libid) => {
    setLoading(true);
    try {
      const { error: chatsError } = await supabase
        .from("Chats")
        .delete()
        .eq("libid", libid);

      if (chatsError) throw new Error(chatsError.message);

      const { error: libreryError } = await supabase
        .from("Librery")
        .delete()
        .eq("libid", libid);

      if (libreryError) throw new Error(libreryError.message);

      setHistory(history.filter((item) => item.libid !== libid));
    } catch (error) {
      console.error("Error deleting chat:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-36 2xl:px-56 mb-10">
      {/* Header */}
      <div className="w-full p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <UserButton />
        </div>
        <h2 className="text-lg font-semibold">Library</h2>
        <button
          onClick={() => router.push("/")}
          className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-primary rounded-full"
        >
          Search for Something New
        </button>
      </div>

      {/* Title */}
      <h1 className="mt-10 sm:mt-20 text-2xl sm:text-3xl font-bold mb-6 flex flex-row gap-3 items-center">
        <LibraryBig className="w-6 h-6 sm:w-8 sm:h-8" /> Library Page
      </h1>

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      ) : history.length > 0 ? (
        <div className="space-y-4">
          {history.map((record) => (
            <div
              key={record.libid}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 border border-gray-200 rounded-lg transition-colors hover:bg-gray-50 gap-3"
            >
              {/* Chat entry */}
              <div
                onClick={() => handleChatClick(record.libid)}
                className="flex-1 cursor-pointer w-full"
              >
                <h2 className="text-base sm:text-lg font-semibold line-clamp-1">
                  {record.searchinput}
                </h2>
                <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 mt-1">
                  {record.type === "search" ? "Searched" : "Researched"} on{" "}
                  {new Date(record.created_at).toLocaleDateString()}
                </p>
              </div>

              {/* Delete button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(record.libid)}
                disabled={loading}
                className="self-end sm:self-auto text-red-500 hover:text-red-700"
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 py-10">
          <p>You have no chat history. Start a new search!</p>
        </div>
      )}
    </div>
  );
}

export default Librery;
