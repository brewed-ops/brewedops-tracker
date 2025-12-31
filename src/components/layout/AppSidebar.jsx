"use client"

import * as React from "react"
import {
  Wallet,
  Headset,
  CheckSquare,
  FileEdit,
  Image,
  Video,
  MoreHorizontal,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

// BrewedOps Brand Colors
const BRAND = {
  brown: '#3F200C',
  blue: '#004AAC',
  green: '#51AF43',
  cream: '#FFF0D4'
}

// Navigation items with colors for active state
const homeItems = [
  {
    id: "dashboard",
    title: "Finance Tracker",
    icon: Wallet,
    activeColor: BRAND.green,
  },
  {
    id: "vakita",
    title: "VAKita",
    icon: Headset,
    activeColor: BRAND.blue,
  },
  {
    id: "tasks",
    title: "Task Manager",
    icon: CheckSquare,
    activeColor: "#f59e0b", // amber
  },
]

const moreToolsItems = [
  {
    id: "pdf-editor",
    title: "PDF Editor",
    icon: FileEdit,
    comingSoon: false,
  },
  {
    id: "image-tools",
    title: "Image Tools",
    icon: Image,
    comingSoon: true,
  },
  {
    id: "video-compress",
    title: "Video Compressor",
    icon: Video,
    comingSoon: true,
  },
]

export function AppSidebar({ activeSection, setActiveSection, isDark, ...props }) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-transparent"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg overflow-hidden">
                <img
                  src="https://i.imgur.com/R52jwPv.png"
                  alt="BrewedOps"
                  className="size-8 object-cover"
                />
              </div>
              <span 
                className="truncate font-bold text-base"
                style={{ fontFamily: "'Montserrat', sans-serif" }}
              >
                <span style={{ color: isDark ? '#ffffff' : BRAND.brown }}>Brewed</span>
                <span style={{ color: BRAND.blue }}>Ops</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Home Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Home</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {homeItems.map((item) => {
                const isActive = activeSection === item.id
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      isActive={isActive}
                      onClick={() => setActiveSection(item.id)}
                      className={cn(
                        "transition-all duration-200 relative",
                        isActive && "font-semibold"
                      )}
                      style={isActive ? {
                        backgroundColor: `${item.activeColor}20`,
                        color: item.activeColor,
                      } : {}}
                    >
                      {/* Active indicator bar */}
                      {isActive && (
                        <div 
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full"
                          style={{ backgroundColor: item.activeColor }}
                        />
                      )}
                      <item.icon 
                        style={isActive ? { color: item.activeColor } : {}}
                      />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* More Tools Section */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <MoreHorizontal className="mr-2 size-4" />
            More Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {moreToolsItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    tooltip={item.comingSoon ? `${item.title} (Coming Soon)` : item.title}
                    disabled={item.comingSoon}
                    onClick={() => !item.comingSoon && setActiveSection(item.id)}
                    className={item.comingSoon ? "opacity-50 cursor-not-allowed" : ""}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                  {item.comingSoon && (
                    <SidebarMenuBadge className="bg-muted text-muted-foreground text-[10px] px-1.5">
                      Soon
                    </SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="mt-auto">
        {/* Copyright */}
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm" className="text-xs text-muted-foreground justify-center pointer-events-none">
              <span>© 2025 BrewedOps</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
