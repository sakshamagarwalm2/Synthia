import React, { useEffect, useState } from "react";
import AnswerDisplay from "./AnswerDisplay";

import {
  LucideImage,
  LucideList,
  LucideSparkles,
  LucideVideo,
} from "lucide-react";
import { SearchResult } from "../../../../../Services/Shared";
import { supabase } from "../../../../../Services/supabase";
import { useParams } from "next/navigation";

const tabs = [
  { label: "Answer", icon: LucideSparkles },
  { label: "Images", icon: LucideImage },
  { label: "Videos", icon: LucideVideo },
  { label: "Sources", icon: LucideList, badge: 10 },
];

function DisplayResult({ searchInputRecord }) {
  const [activeTab, setActiveTab] = useState("Answer");
  const [searchResults, setSearchResults] = useState(SearchResult);
  const libid=useParams().libid

  useEffect(() => {
    if (searchInputRecord) {
      GetSearchApiResult();
    }
  }, [searchInputRecord]);

  const GetSearchApiResult = async () => {
    try {
      // const response = await fetch("/api/search-api", {
      //   method: "POST", // Corrected: Use POST method
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     // Corrected: Stringify the body
      //     userInput: searchInputRecord?.searchinput,
      //     searchType: searchInputRecord?.searchType,
      //   }),
      // });

      // if (!response.ok) {
      //   throw new Error(`HTTP error! status: ${response.status}`);
      // }

      // const data = await response.json();
      // setSearchResults(data); // Set the search results in state

      // console.log("Search API Result:", data);

      const searchresp = SearchResult

      const formattedSearchResp = SearchResult?.items?.map((item) => ({
        title: item?.title,
        description: item?.snippet, // The snippet is a brief description of the result
        longname: item?.displayLink, // The displayLink is the clean URL (e.g., "en.wikipedia.org")
        url: item?.link, // The full URL to the page
        // Images are often nested. We can check for them in the pagemap.
        image: item?.pagemap?.cse_image?.[0]?.src,
      }));

      console.log("Formatted search response:", formattedSearchResp);

      const {data,error}=await supabase
      .from('Chats')
      .insert([
        {
          libid: libid,
          searchResult: formattedSearchResp,
        },
      ])
      .select()
      console.log("Inserted search results:", data, error);





    } catch (error) {
      console.error("Failed to fetch search results:", error);
      // Handle error state, e.g., show an error message to the user
    }
  };

  return (
    <div className="mt-7">
      <h2 className="font-medium text-3xl line-clamp-2">
        {searchInputRecord?.searchinput}
      </h2>
      <div className="flex items-center space-x-6 border-b border-gray-200 pb-2 mt-6">
        {tabs.map(({ label, icon: Icon, badge }) => (
          <button
            key={label}
            onClick={() => setActiveTab(label)}
            className={`flex items-center gap-1 relative text-sm font-medium text-gray-700 hover:text-black ${
              activeTab === label ? "text-black" : ""
            }`}
          >
            <Icon className="w-4 h-4" />
            <span>{label}</span>
            {badge && (
              <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">
                {badge}
              </span>
            )}
            {activeTab === label && (
              <span className="absolute -bottom-2 left-0 w-full h-0.5 bg-black rounded"></span>
            )}
          </button>
        ))}
        <div className="ml-auto text-sm text-gray-500">
          1 task <span className="ml-1">↗</span>
        </div>
      </div>
      <div>
        {activeTab === "Answer" ? (
          <AnswerDisplay results={searchResults} /> // Pass results to AnswerDisplay
        ) : null}
      </div>
    </div>
  );
}

export default DisplayResult;
