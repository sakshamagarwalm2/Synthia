import React from 'react';

// Function to safely extract domain and get a favicon URL
const getFaviconUrl = (url) => {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}`;
    } catch (e) {
        return null;
    }
};

function AnswerDisplay({ results }) {
    if (!results || !results.items) {
        return <div className="p-4 text-gray-500">No results to display.</div>;
    }

    const uniqueSources = Array.from(
        new Map(results?.items?.map(item => [getFaviconUrl(item.link), item])).values()
    );

    return (
        <div className="mt-4 p-6">
            {/* Sources section */}
            <div className="flex items-center space-x-2 -mt-4 mb-4">
                <span className="text-sm font-semibold text-gray-700">Sources:</span>
                <div className="flex -space-x-4">
                    {uniqueSources.map((item, index) => {
                        const faviconUrl = getFaviconUrl(item.link);
                        
                        return faviconUrl ? (
                            <a
                                key={index}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative flex-shrink-0 w-8 h-8 rounded-full border border-black bg-white overflow-hidden shadow-sm hover:z-10 transition-transform hover:scale-125"
                                style={{ zIndex: uniqueSources.length - index }}
                            >
                                <img
                                    src={faviconUrl}
                                    alt={`Favicon for ${item.displayLink}`}
                                    className="w-full h-full object-cover"
                                />
                            </a>
                        ) : null;
                    })}
                </div>
            </div>
        </div>
    );
}

export default AnswerDisplay;