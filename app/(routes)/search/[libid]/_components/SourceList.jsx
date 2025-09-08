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

function SourceList({ webResults }) {
    // Handle the case where webResults is the search result array directly
    const results = Array.isArray(webResults) ? webResults : webResults?.items || [];
    
    if (!results || results.length === 0) {
        return <div className="text-gray-500">No sources available</div>;
    }

    // Create unique sources based on domain to avoid duplicate favicons
    const uniqueSources = Array.from(
        new Map(results.map(item => [getFaviconUrl(item.url || item.link), item])).values()
    );

    return (
        <div>
            <div className="flex items-center space-x-2 mb-4">
                <span className="text-sm font-semibold text-gray-700">Sources:</span>
                <div className="flex -space-x-4">
                    {uniqueSources.slice(0, 8).map((item, index) => {
                        const faviconUrl = getFaviconUrl(item.url || item.link);
                        const itemLink = item.url || item.link;
                        const itemTitle = item.title;
                        const itemDomain = item.longname || item.displayLink;
                        
                        return faviconUrl && itemLink ? (
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
                                    onError={(e) => {
                                        // Fallback to a generic icon if favicon fails to load
                                        e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';
                                    }}
                                />
                            </a>
                        ) : null;
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