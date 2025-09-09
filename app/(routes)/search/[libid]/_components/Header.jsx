import { UserButton } from '@clerk/nextjs';
import { Link, Clock, CreditCard } from 'lucide-react'; // Add Gem for the credit icon
import moment from 'moment';
import React, { useState, useContext } from 'react'; // Add useContext
import { Button } from '../../../../../components/ui/button';
import { UserDetailContext } from '../../../../../context/UserDetailContext'; // Adjust path

function Header({ searchInputRecord }) {
  const [copied, setCopied] = useState(false);
  const { userDetail } = useContext(UserDetailContext); // Access user details

  const handleCopyLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // hide after 2 seconds
      })
      .catch((err) => console.error('Failed to copy: ', err));
  };

  return (
    <div className="w-full p-4 border-b flex justify-between items-center">
      {/* Left side: User info, time, and CREDITS */}
      <div className="flex items-center gap-4">
        <UserButton />
        <div className="hidden md:flex gap-1 justify-center items-center">
          <Clock className="h-5 w-5 text-gray-500" />
          <h2 className="text-sm text-gray-700">{moment(searchInputRecord?.created_at).fromNow()}</h2>
        </div>
        {/* New element to display credits */}
        <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full border border-gray-200">
          <CreditCard className="h-4 w-4 text-primary" />
          <span className="text-sm font-semibold text-gray-800">
            {userDetail?.credits || 0}
          </span>
        </div>
      </div>

      {/* Middle: Search input heading */}
      <h2 className="line-clamp-1 max-w-md text-base font-semibold text-gray-800">
        {searchInputRecord?.searchinput}
      </h2>

      {/* Right side: Copy link button */}
      <div className="flex gap-3 items-center relative">
        <Button onClick={handleCopyLink}>
          <Link className="mr-1 h-4 w-4" />
        </Button>
        {copied && (
          <span className="absolute top-full mt-1 left-1/2 transform -translate-x-1/2 text-xs text-white font-sm bg-gray-800/90 px-2 py-1 rounded">
            Copied!
          </span>
        )}
      </div>
    </div>
  );
}

export default Header;