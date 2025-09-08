import React, { useState } from 'react';

function SourceCard({ source }) {
  // Extract data from the source object
  const { title, description, longname, url, image } = source;
  
  // State to manage favicon loading error
  const [faviconError, setFaviconError] = useState(false);

  // Function to get a simple text-based fallback icon
  const getFallbackIcon = () => {
    if (longname) {
      return longname[0].toUpperCase();
    }
    // Extract the first letter of the domain if longname is not available
    try {
      const hostname = new URL(url).hostname;
      return hostname[0].toUpperCase();
    } catch (e) {
      return '?';
    }
  };

  // Get the hostname to fetch the favicon
  let hostname;
  try {
    hostname = new URL(url).hostname;
  } catch (e) {
    hostname = '';
  }

  // Construct the favicon URL using Google's S2 Favicons service
  const faviconUrl = `https://www.google.com/s2/favicons?sz=32&domain=${hostname}`;

  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="flex items-start gap-4 p-4 border rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
    >
      <div className="flex-shrink-0">
        {/* Favicon or fallback icon */}
        <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
          {!faviconError && hostname ? (
            <img
              src={faviconUrl}
              alt={`${longname || hostname} favicon`}
              className="w-full h-full object-contain"
              onError={() => setFaviconError(true)} // Set error state on failure
            />
          ) : (
            <span className="text-lg font-bold text-gray-500">
              {getFallbackIcon()}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <h3 className="text-base font-semibold text-gray-800 line-clamp-1">
          {title}
        </h3>
        <p className="text-sm text-gray-500 truncate mb-1">
          {longname}
        </p>
        <p className="text-sm text-gray-700 line-clamp-2">
          {description}
        </p>
      </div>

      {/* Conditional rendering for the thumbnail image on the right */}
      {image && (
        <div className="flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden">
          <img
            src={image}
            alt={`${title} thumbnail`}
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </a>
  );
}

export default SourceCard;