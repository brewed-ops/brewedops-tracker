"use client"

import * as React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  Wallet,
  Headset,
  CheckSquare,
  FileEdit,
  Image,
  Video,
  Sparkles,
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
  SidebarRail,
} from "@/components/ui/sidebar"

// Navigation items with URL paths
const homeItems = [
  {
    id: "dashboard",
    title: "Finance Tracker",
    icon: Wallet,
    path: "/",
  },
  {
    id: "vakita",
    title: "VAKita",
    icon: Headset,
    path: "/vakita",
  },
  {
    id: "taskmanager",
    title: "Task Manager",
    icon: CheckSquare,
    path: "/taskmanager",
  },
]

const moreToolsItems = [
  {
    id: "pdfeditor",
    title: "PDF Editor",
    icon: FileEdit,
    path: "/pdfeditor",
    comingSoon: false,
  },
  {
    id: "bgremover",
    title: "BG Remover",
    icon: Sparkles,
    path: "/bgremover",
    comingSoon: false,
  },
  {
    id: "image-tools",
    title: "Image Tools",
    icon: Image,
    path: "/imagetools",
    comingSoon: true,
  },
  {
    id: "video-compress",
    title: "Video Compressor",
    icon: Video,
    path: "/videocompress",
    comingSoon: true,
  },
]

export function AppSidebar({ isDark, ...props }) {
  const navigate = useNavigate()
  const location = useLocation()

  // Check if current path matches item path
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/"
    }
    return location.pathname === path
  }

  const handleNavigation = (path, comingSoon = false) => {
    if (!comingSoon) {
      navigate(path)
    }
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              onClick={() => navigate("/")}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                <img
                  src="https://i.imgur.com/R52jwPv.png"
                  alt="BrewedOps"
                  className="size-6 rounded"
                />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">BrewedOps</span>
                <span className="truncate text-xs text-muted-foreground">Dashboard</span>
              </div>
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
              {homeItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={isActive(item.path)}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
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
                    isActive={isActive(item.path)}
                    onClick={() => handleNavigation(item.path, item.comingSoon)}
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

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="sm" className="text-xs text-muted-foreground justify-center">
              <span>© 2025 BrewedOps</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
