"use client";
import { UserButton } from "@clerk/nextjs";
import axios from "axios";
import { Cpu, Globe, IndianRupee, Palette, Star } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from 'lucide-react';

const options = [
  {
    title: "Top",
    icon: Star,
  },
  {
    title: "Technology",
    icon: Cpu,
  },
  {
    title: "Finance",
    icon: IndianRupee,
  },
  {
    title: "Art and Culture",
    icon: Palette,
  },
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
    //console.log(response.data);
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
    <div className="px-10 md:px-20 lg:px-36 xl:px-56 mb-10">
      <div className="w-full p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-2">
          <UserButton />
        </div>
        <h2 className="line-clamp-1 max-w-md">Discover</h2>
        <button
        onClick={() => router.push("/")}
        className="px-6 py-3 text-sm font-semibold text-white bg-primary rounded-full"
      >
        Search for Something New
      </button>
      </div>
      <h1 className="mt-20 text-3xl font-bold mb-10 flex flex-row gap-4 items-center">
        <Globe /> Discover Page
      </h1>

      <div className="flex mt-5 gap-4">
        {options.map((option, index) => (
          <div
            onClick={() => {
              setSelectedOption(option.title);
            }}
            className={`flex gap-1 p-3 px-5 hover:text-primary cursor-pointer rounded-full justify-center items-center ${
              selectedOption === option.title && "bg-accent text-primary"
            }`}
            key={index}
          >
            <option.icon className="inline text-sm" />
            <span className="text-sm">{option.title}</span>
          </div>
        ))}
      </div>

      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          </div>
        ) : latestNews.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {latestNews.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-md overflow-hidden transition-transform transform hover:scale-[1.01] cursor-pointer"
                onClick={() => handleTitleClick(item.link)}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center p-6 gap-6">
                  {/* Conditional rendering for the image */}
                  {item.pagemap?.cse_image?.[0]?.src && (
                    <img
                      src={item.pagemap.cse_image[0].src}
                      alt={item.title}
                      className="w-full md:w-64 h-48 object-cover rounded-lg flex-shrink-0"
                    />
                  )}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 hover:underline">
                      {item.title}
                    </h3>
                    {/* Conditional rendering for the site name */}
                    {item.displayLink && (
                      <p className="text-sm text-gray-500 mt-1">
                        {item.displayLink}
                      </p>
                    )}
                    {/* Description or snippet */}
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">
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