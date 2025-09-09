"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { supabase } from "../../../../Services/supabase";
import Header from "./_components/Header";
import DisplayResult from "./_components/DisplayResult";

function SearchQueryResult() {
  const params = useParams();
  const libid = params.libid; // Extract the actual libid value
  const [searchInputRecord, setSearchInputRecord] = useState();

  useEffect(() => {
    if (libid) {
      // Only run if libid exists
      GetSearchQueryRecord();
    }
  }, [libid]); // Add libid as dependency

  const GetSearchQueryRecord = async () => {
    try {
      const { data: Librery, error } = await supabase
        .from("Librery")
        .select("*,Chats(*)")
        .eq("libid", libid); // Now using the actual string value


      if (error) {
        console.error("Supabase error:", error);
        return;
      }

      if (Librery && Librery.length > 0) {
        setSearchInputRecord(Librery[0]);
      } 
      // else {
        // console.log("No record found for libid:", libid);
      // }
    } catch (err) {
      console.error("Error fetching record:", err);
    }
  };

  return (
    <div>
      <Header searchInputRecord={searchInputRecord} />
      <div className="px-10 md:px-20 lg:px-50 mt-20">
        <DisplayResult searchInputRecord={searchInputRecord} />
      </div>
    </div>
  );
}

export default SearchQueryResult;
