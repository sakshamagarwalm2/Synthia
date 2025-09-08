import React from 'react';

function ImageTabList({ mediaItems }) {
  // Check if mediaItems array is empty or undefined
  if (!mediaItems || mediaItems.length === 0) {
    return (
      <div className="text-gray-500 py-8 text-center">
        No media available.
      </div>
    );
  }

  return (
    <div className="masonry-container">
      {mediaItems.map((item, index) => {
        // Check if the item has an image or a video URL
        const isImage = item.type === 'image' && item.url;
        const isVideo = item.type === 'video' && item.url;
        
        if (!isImage && !isVideo) {
          return null; // Skip if no valid media
        }

        return (
          <a
            key={index}
            href={item.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="masonry-item"
            style={{ breakInside: 'avoid' }} // Prevents items from breaking across columns
          >
            {isImage && (
              <img
                src={item.url}
                alt={`Search result image ${index + 1}`}
                className="w-full h-auto object-cover rounded-lg shadow-md mb-4 hover:scale-110 transition-transform"
                loading="lazy"
              />
            )}
            {isVideo && (
              <video
                src={item.url}
                controls
                className="w-full h-auto rounded-lg shadow-md mb-4 hover:scale-110 transition-transform"
              />
            )}
          </a>
        );
      })}
      <style jsx>{`
        .masonry-container {
          column-count: 2; /* Default number of columns */
          column-gap: 1rem;
        }

        @media (min-width: 640px) {
          .masonry-container {
            column-count: 3;
          }
        }

        @media (min-width: 768px) {
          .masonry-container {
            column-count: 4;
          }
        }
      `}</style>
    </div>
  );
}

export default ImageTabList;