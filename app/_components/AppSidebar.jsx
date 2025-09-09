"use client";
import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../../components/ui/sidebar";
import Image from "next/image";
import {
  Compass,
  GalleryHorizontalEnd,
  Search,
  Github,
  Linkedin,
  Mail,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "../../components/ui/button";
import {
  SignUpButton,
  SignInButton,
  UserButton,
  SignedIn,
  SignedOut,
  useUser,
} from "@clerk/nextjs";

const MenuOptions = [
  {
    title: "Home",
    icon: Search,
    path: "/",
  },
  {
    title: "Discover",
    icon: Compass,
    path: "/discover",
  },
  {
    title: "Library",
    icon: GalleryHorizontalEnd,
    path: "/library",
  },
];

function AppSidebar() {
  const path = usePathname();
  const { state } = useSidebar();
  const { user } = useUser();
  const isCollapsed = state === "collapsed";

  const socialLinks = [
    {
      icon: Github,
      href: "https://github.com/sakshamagarwalm2",
      label: "GitHub",
      bg: "bg-black",
    },
    {
      icon: Linkedin,
      href: "https://www.linkedin.com/in/sakshamagarwalm2/",
      label: "LinkedIn",
      bg: "bg-blue-700",
    },
    {
      icon: Mail,
      href: "mailto:sakshamagaarwalm2@gmail.com",
      label: "Mail",
      bg: "bg-red-600",
    },
  ];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-accent">
        <div className="flex justify-evenly items-center">
          <Image src={"/Synthialogo.png"} alt="logo" width={80} height={30} />
          <span
            className={`font-black font-stretch-75% text-3xl michroma-text transition-all duration-300 ease-in-out overflow-hidden ${
              isCollapsed
                ? "opacity-0 w-0 transform scale-0"
                : "opacity-100 w-auto transform scale-100"
            }`}
          >
            SYNTHIA
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="bg-accent">
        <SidebarGroup>
          <SidebarContent>
            <SidebarMenu>
              {MenuOptions.map((menu, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton
                    asChild
                    className={`p-5 py-6 hover:bg-transparent hover:font-bold
                      ${path?.includes(menu.path) && "font-bold"}`}
                  >
                    <a href={menu.path}>
                      <menu.icon className="h-7 w-8" />
                      <span
                        className={`text-lg transition-all duration-300 ease-in-out overflow-hidden ${
                          isCollapsed
                            ? "opacity-0 w-0 transform scale-0"
                            : "opacity-100 w-auto transform scale-100"
                        }`}
                      >
                        {menu.title}
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <hr className="border-t border-gray-300 my-2 mx-4" />
            {/* Social media links */}
            <div
              className={`flex gap-1 ${
                isCollapsed ? "flex-col justify-center" : "justify-evenly"
              }`}
            >
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-white ${
                    link.bg
                  } transition-colors p-2 rounded-full
                  ${isCollapsed ? "mb-2" : ""}
                `}
                >
                  <link.icon className="h-4 w-4" />
                  <span className="sr-only">{link.label}</span>
                </a>
              ))}
            </div>

            <SignedOut>
              <div
                className={`mx-4 mt-4 space-y-2 transition-all duration-300 ease-in-out overflow-hidden ${
                  isCollapsed
                    ? "opacity-0 max-h-0 transform scale-0"
                    : "opacity-100 max-h-32 transform scale-100"
                }`}
              >
                <SignUpButton mode="modal">
                  <Button className="rounded-full w-full">Sign Up</Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button variant="outline" className="rounded-full w-full">
                    Sign In
                  </Button>
                </SignInButton>
              </div>
            </SignedOut>
          </SidebarContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-accent">
        <div className="w-full transition-all duration-300 ease-in-out overflow-hidden flex flex-col">
          {/* Upgrade prompt - only show when signed in */}
          <SignedIn>
            <div
              className={`mt-4 transition-all duration-300 ease-in-out overflow-hidden flex flex-col ${
                isCollapsed
                  ? "opacity-0 max-h-0 transform scale-0"
                  : "opacity-100 max-h-40 transform scale-100"
              }`}
            >
              <h2 className="font-bold text-gray-500">Try Premium</h2>
              <p className="text-gray-400 text-sm">
                Upgrade for more benefits & more chats.
              </p>
              <a href="mailto:sakshamagaarwalm2@gmail.com" target="_blank">
                <Button className="rounded-full w-full mt-2" size="sm">
                  Learn More
                </Button>
              </a>
            </div>
          </SignedIn>
        </div>

        {/* User button with conditional name display */}
        <SignedIn>
          <div className="w-full transition-all duration-300 ease-in-out overflow-hidden p-2">
            <div
              className={`flex items-center ${
                isCollapsed ? "justify-center" : "space-x-3"
              }`}
            >
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-8 h-8",
                    userButtonBox: `${
                      !isCollapsed ? "w-full justify-start" : "justify-center"
                    }`,
                    userButtonOuterBox: "w-full",
                  },
                }}
                userProfileMode="modal"
                afterSignOutUrl="/"
              />
              {!isCollapsed && user && (
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {user.firstName || user.username || "User"}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {user.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
              )}
            </div>
          </div>
        </SignedIn>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
