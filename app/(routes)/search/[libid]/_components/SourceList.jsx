import React from 'react';

// Function to safely extract domain and get a favicon URL
const getFaviconUrl = (url) => {
    try {
        const domain = new URL(url).hostname;
        // Use a more reliable favicon service with fallback options
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch (e) {
        return null;
    }
};

function SourceList({ webResults }) {
    // Handle the case where webResults is the search result array directly
    const results = Array.isArray(webResults) ? webResults : webResults?.items || [];
    
    // Create unique sources based on domain and filter out invalid URLs
    const uniqueSources = Array.from(
        new Map(results
            .filter(item => getFaviconUrl(item.url || item.link))
            .map(item => [getFaviconUrl(item.url || item.link), item])
        ).values()
    );

    if (!uniqueSources || uniqueSources.length === 0) {
        return <div className="text-gray-500">No sources available</div>;
    }

    return (
        <div>
            <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm font-semibold text-gray-700">Sources:</span>
                <div className="flex -space-x-4">
                    {uniqueSources.slice(0, 8).map((item, index) => {
                        const itemLink = item.url || item.link;
                        const itemTitle = item.title;
                        const itemDomain = item.longname || item.displayLink;
                        const faviconUrl = getFaviconUrl(itemLink);

                        return (
                            <a
                                key={index}
                                href={itemLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="relative flex-shrink-0 w-8 h-8 rounded-full border border-black bg-white overflow-hidden shadow-sm hover:z-10 transition-transform hover:scale-125 hover:border-2"
                                style={{ zIndex: uniqueSources.length - index }}
                                title={`${itemTitle} - ${itemDomain}`}
                            >
                                <img
                                    src={faviconUrl}
                                    alt={`Favicon for ${itemDomain}`}
                                    className="w-full h-full object-cover"
                                    // The onError handler is removed to simply not show the image on a 404
                                    // A more robust solution is to use state, as shown below.
                                />
                            </a>
                        );
                    })}
                    {uniqueSources.length > 8 && (
                        <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-300 bg-gray-100 text-xs font-medium text-gray-600">
                            +{uniqueSources.length - 8}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default SourceList;