"use client";
import { UserButton } from "@clerk/nextjs";
import axios from "axios";
import { Cpu, Globe, IndianRupee, Palette, Star, Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const options = [
  { title: "Top", icon: Star },
  { title: "Technology", icon: Cpu },
  { title: "Finance", icon: IndianRupee },
  { title: "Art and Culture", icon: Palette },
];

function Discover() {
  const [selectedOption, setSelectedOption] = useState("Top");
  const [latestNews, setLatestNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    selectedOption && getSearchResult();
  }, [selectedOption]);

  const getSearchResult = async () => {
    setLoading(true);
    try {
      const response = await axios.post("/api/search-api", {
        userInput: selectedOption + " Latest News & Updates",
        searchType: "search",
      });
      setLatestNews(response.data.items || []);
    } catch (error) {
      console.error("Failed to fetch search results:", error);
      setLatestNews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTitleClick = (url) => {
    if (url) {
      window.open(url, "_blank");
    }
  };

  return (
    <div className="px-4 sm:px-6 md:px-10 lg:px-20 xl:px-36 2xl:px-56 mb-10">
      {/* Header */}
      <div className="w-full p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <UserButton />
        </div>
        <h2 className="text-lg font-semibold">Discover</h2>
        <button
          onClick={() => router.push("/")}
          className="w-full sm:w-auto px-6 py-3 text-sm font-semibold text-white bg-primary rounded-full"
        >
          Search for Something New
        </button>
      </div>

      {/* Title */}
      <h1 className="mt-10 sm:mt-20 text-2xl sm:text-3xl font-bold mb-6 flex flex-row gap-3 items-center">
        <Globe className="w-6 h-6 sm:w-8 sm:h-8" /> Discover Page
      </h1>

      {/* Category options */}
      <div className="flex flex-wrap mt-5 gap-3 sm:gap-4">
        {options.map((option, index) => (
          <div
            key={index}
            onClick={() => setSelectedOption(option.title)}
            className={`flex gap-1 p-2 sm:p-3 px-4 sm:px-5 hover:text-primary cursor-pointer rounded-full justify-center items-center text-xs sm:text-sm ${
              selectedOption === option.title && "bg-accent text-primary"
            }`}
          >
            <option.icon className="inline w-4 h-4 sm:w-5 sm:h-5" />
            <span>{option.title}</span>
          </div>
        ))}
      </div>

      {/* News results */}
      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        ) : latestNews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
            {latestNews.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-transform transform hover:scale-[1.01] cursor-pointer"
                onClick={() => handleTitleClick(item.link)}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center p-4 sm:p-6 gap-4 sm:gap-6">
                  {/* Conditional rendering for the image */}
                  {item.pagemap?.cse_image?.[0]?.src && (
                    <img
                      src={item.pagemap.cse_image[0].src}
                      alt={item.title}
                      className="w-full md:w-48 lg:w-64 h-40 sm:h-48 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-800 hover:underline">
                      {item.title}
                    </h3>
                    {/* Site name */}
                    {item.displayLink && (
                      <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        {item.displayLink}
                      </p>
                    )}
                    {/* Description */}
                    <p className="text-xs sm:text-sm text-gray-600 mt-2 line-clamp-3">
                      {item.snippet}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            No news found for this topic.
          </div>
        )}
      </div>
    </div>
  );
}

export default Discover;
