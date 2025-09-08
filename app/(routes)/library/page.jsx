"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../Services/supabase";
import { UserButton, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { LibraryBig, Trash2 } from "lucide-react";
import { Button } from "../../../components/ui/button";
import { Loader2 } from "lucide-react";

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
    // console.log(Librery);

    if (error) {
      console.error("Error fetching library history:", error);
      // You can add a simple alert or console log here for user feedback
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
      // First, delete from 'Chats' table (where libid is the foreign key)
      const { error: chatsError } = await supabase
        .from("Chats")
        .delete()
        .eq("libid", libid);

      if (chatsError) {
        throw new Error(chatsError.message);
      }

      // Then, delete from 'Librery' table
      const { error: libreryError } = await supabase
        .from("Librery")
        .delete()
        .eq("libid", libid);

      if (libreryError) {
        throw new Error(libreryError.message);
      }

      // Update the state to reflect the deletion
      setHistory(history.filter((item) => item.libid !== libid));
      console.log("Chat successfully deleted.");
    } catch (error) {
      console.error("Error deleting chat:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" px-10 md:px-20 lg:px-36 xl:px-56 mb-10">
      <div className="w-full p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <UserButton />
          
        </div>
        <h2 className="line-clamp-1 max-w-md">
          Library
        </h2>
        
      </div>
      <h1 className="mt-20 text-3xl font-bold mb-10 flex flex-row gap-4 items-center"><LibraryBig/> Library Page</h1>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
        </div>
      ) : history.length > 0 ? (
        <div className="space-y-4">
          {history.map((record) => (
            <div
              key={record.libid}
              className="flex justify-between items-center p-4 border border-gray-200 rounded-lg transition-colors hover:bg-gray-50"
            >
              <div
                onClick={() => handleChatClick(record.libid)}
                className="flex-1 cursor-pointer"
              >
                <h2 className="text-lg font-semibold line-clamp-1">
                  {record.searchinput}
                </h2>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                  {record.type === "search" ? "Searched" : "Researched"} on{" "}
                  {new Date(record.created_at).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(record.libid)}
                disabled={loading}
                className="ml-4 text-red-500 hover:text-red-700"
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
