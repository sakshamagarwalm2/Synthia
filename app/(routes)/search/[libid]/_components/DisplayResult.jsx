import React, { useEffect, useState } from "react";
import AnswerDisplay from "./AnswerDisplay";
import ImageTabList from "./ImageTabList";
import SourceCard from "./SourceCard";
import {
  LucideImage,
  LucideList,
  LucideSparkles,
} from "lucide-react";
import { supabase } from "../../../../../Services/supabase";
import { useParams } from "next/navigation";
import axios from "axios";

const tabs = [
  { label: "Answer", icon: LucideSparkles },
  { label: "Images", icon: LucideImage },
  { label: "Sources", icon: LucideList },
];

function DisplayResult({ searchInputRecord }) {
  const [activeTab, setActiveTab] = useState("Answer");
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const libid = useParams().libid;

  useEffect(() => {
    if (!searchInputRecord || searchResults) {
      return;
    }

    if (searchInputRecord?.Chats?.length === 0) {
      GetSearchApiResult();
    } else {
      GetSearchRecords();
    }
    setSearchResults(searchInputRecord);
  }, [searchInputRecord, searchResults]);

  const GetSearchApiResult = async () => {
    setLoading(true);
    setError(null);

    const input = searchInputRecord?.searchinput?.trim() ?? "";
    if (!input) {
      setError("Search input cannot be empty");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/search-api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInput: input,
          searchType: searchInputRecord?.type ?? "search",
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Server error response:", errorData);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.message || "Unknown error"}`);
      }
      const dataResult = await response.json();
      setSearchResults(dataResult);
      console.log("Search API Result:", dataResult);

      const formattedSearchResp = dataResult?.items?.map((item) => ({
        title: item?.title,
        description: item?.snippet,
        longname: item?.displayLink,
        url: item?.link,
        image: item?.pagemap?.cse_image?.[0]?.src,
      }));

      console.log("Formatted search response:", formattedSearchResp);

      const { data, error } = await supabase
        .from("Chats")
        .insert([
          {
            libid: libid,
            searchResult: formattedSearchResp,
            userSearchInput: input,
          },
        ])
        .select();
      await GetSearchRecords();

      if (error) {
        throw new Error(error.message);
      }

      console.log("Inserted search results:", data ,"dataid:", data[0].id);

      if (data && data[0]) {
        await GenerateAIResp(formattedSearchResp, data[0].id);
      }
    } catch (error) {
      console.error("Failed to fetch search results:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const GenerateAIResp = async (formattedSearchResp, recordId) => {
    try {
      const result = await axios.post("/api/llm-model", {
        userInput: searchInputRecord?.searchinput,
        searchResult: formattedSearchResp,
        recordId: recordId,
      });

      const runId = result.data;
      console.log("AI generation initiated, runId:", runId, result);

      console.log("Inngest function triggered, runId:", runId,result);
      if (!runId || typeof runId !== "string") {
        console.error("Invalid runId received:", runId);
        await GetSearchRecords(); // Fallback
        return;
      }

      console.log("Polling with runId:", runId);
      const interval = setInterval(async () => {
        try {
          const runResp = await axios.post("/api/get-inngest-status", {
            runID: runId,
          });

          // Check for aiResp existence in the database
          const { data, error } = await supabase
            .from("Chats")
            .select("aiResp")
            .eq("id", recordId)
            .single();

          if (error) {
            console.error("Error fetching aiResp for recordId:", recordId, error);
            // Continue polling if there's an error fetching the record
          }

          // Check if Inngest status is 'completed' OR if aiResp is not null
          if ((runResp.data.data && runResp.data.data[0]?.status === "completed") || (data?.aiResp !== null)) {
            await GetSearchRecords();
            clearInterval(interval);
          }
        } catch (error) {
          console.error("Error checking run status or aiResp:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            runId: runId,
            timestamp: new Date().toISOString(),
          });
          await GetSearchRecords(); // Fallback on error
          clearInterval(interval);
        }
      }, 1000);
    } catch (error) {
      console.error("Error generating AI response:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        timestamp: new Date().toISOString(),
      });
      await GetSearchRecords(); // Fallback on initial failure
    }
  };

  const GetSearchRecords = async () => {
    try {
      const { data: Librery, error } = await supabase
        .from("Librery")
        .select("*,Chats(*)")
        .eq("libid", libid);
      setSearchResults(Librery[0]);
    } catch (err) {
      console.error("Error fetching record:", err);
    }
  };

  if (loading) {
    return (
      <div className="mt-7">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">Loading search results...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-7">
        <div className="flex items-center justify-center py-8">
          <div className="text-red-500">Error: {error}</div>
        </div>
      </div>
    );
  }

  if (!searchInputRecord) {
    return (
      <div className="mt-7">
        <div className="flex items-center justify-center py-8">
          <div className="text-gray-500">No search query found</div>
        </div>
      </div>
    );
  }

  // Use searchResults?.Chats instead of searchInputRecord?.Chats for live data
  const sourcesCount = searchResults?.Chats?.[0]?.searchResult?.length || 0;

  const mostRecentSearchResult = searchResults?.Chats?.[0]?.searchResult;
  const currentChat = searchResults?.Chats?.[0] || {};

  const mediaItems = mostRecentSearchResult
    ?.map((item) => {
      if (item.image) {
        return {
          type: "image",
          url: item.image,
          sourceUrl: item.url,
        };
      }
      return null;
    })
    .filter(Boolean);

  const dynamicTabs = tabs.map((tab) =>
    tab.label === "Sources" ? { ...tab, badge: sourcesCount } : tab
  );

  return (
    <div className="mt-7 mb-24">
      {searchResults?.Chats?.length > 0 && (
        <div key={currentChat.id}>
          <h2 className="font-medium text-3xl line-clamp-2 mb-6">
            {currentChat.userSearchInput}
          </h2>
          <div className="flex items-center space-x-6 border-b border-gray-200 pb-2">
            {dynamicTabs.map(({ label, icon: Icon, badge }) => (
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
          </div>

          <div className="mt-6">
            {activeTab === "Answer" && (
              <AnswerDisplay
                results={searchResults}
                searchInputRecord={searchResults}
                currentChat={currentChat}
              />
            )}
            {activeTab === "Images" && (
              <div className="text-gray-500 py-8">
                <ImageTabList mediaItems={mediaItems} />
              </div>
            )}
            {activeTab === "Sources" && (
              <div className="py-4">
                <div className="space-y-4">
                  <h3 className="font-medium mb-4">Sources from Latest Search</h3>
                  {mostRecentSearchResult?.length > 0 ? (
                    mostRecentSearchResult.map((source, index) => (
                      <SourceCard key={index} source={source} />
                    ))
                  ) : (
                    <div className="text-gray-500 py-8">No sources found.</div>
                  )}
                </div>
              </div>
            )}
          </div>
          <hr className="my-5 mb-4" />
        </div>
      )}
      {searchResults?.Chats?.length === 0 && (
        <div className="mt-7">
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">No chat records found.</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DisplayResult;