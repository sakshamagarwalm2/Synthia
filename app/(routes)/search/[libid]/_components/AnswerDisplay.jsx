import React from 'react';
import SourceList from './SourceList';

function AnswerDisplay({ results, searchInputRecord, currentChat }) {
    // Use currentChat if provided, otherwise fall back to the first chat with AI response
    const chatToDisplay = currentChat || (results?.Chats?.find(chat => chat.aiResp) || results?.Chats?.[0]);

    if (!chatToDisplay) {
        return (
            <div className="p-4 text-gray-500">
                No results to display. Search results are being processed...
            </div>
        );
    }

    return (
        <div className="mt-4">
            {/* Display sources if available for this chat */}
            {chatToDisplay.searchResult && chatToDisplay.searchResult.length > 0 && (
                <div className="mb-6">
                    <SourceList webResults={chatToDisplay.searchResult} />
                </div>
            )}

            {/* Display the AI response if available */}
            {chatToDisplay.aiResp ? (
                <div className="mb-6">
                    <div className="prose prose-gray max-w-none">
                        <div
                            className="text-gray-800 leading-relaxed"
                            dangerouslySetInnerHTML={{
                                __html: chatToDisplay.aiResp
                                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                    .replace(/## (.*?)(\n|$)/g, '<h2 class="text-xl font-semibold mt-6 mb-3 text-gray-900">$1</h2>')
                                    .replace(/### (.*?)(\n|$)/g, '<h3 class="text-lg font-semibold mt-4 mb-2 text-gray-900">$1</h3>')
                                    .replace(/\* (.*?)(\n|$)/g, '<li class="ml-4 mb-1">$1</li>')
                                    .replace(/(\n|^)([^#*\n].*?)(\n|$)/g, '<p class="mb-4">$2</p>')
                                    .replace(/<li/g, '<ul class="list-disc ml-4 mb-4"><li')
                                    .replace(/li>/g, 'li></ul>')
                                    .replace(/<\/ul><ul class="list-disc ml-4 mb-4">/g, '')
                            }}
                        />
                    </div>
                </div>
            ) : (
                <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-3"></div>
                        <p className="text-yellow-800">AI response is being generated...</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AnswerDisplay;