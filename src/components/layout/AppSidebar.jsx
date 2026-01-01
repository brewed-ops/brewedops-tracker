"use client"

import * as React from "react"
import { useNavigate, useLocation } from "react-router-dom"
import {
  Wallet,
  Headset,
  CheckSquare,
  FileEdit,
  Sparkles,
  Crop,
  RefreshCw,
  Minimize2,
  QrCode,
  ImageDown,
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
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"

// Brand colors
const BRAND = {
  brown: '#3F200C',
  blue: '#004AAC',
}

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
  },
  {
    id: "bgremover",
    title: "BG Remover",
    icon: Sparkles,
    path: "/bgremover",
  },
  {
    id: "imagecropper",
    title: "Image Cropper",
    icon: Crop,
    path: "/imagecropper",
  },
  {
    id: "imageconverter",
    title: "Image Converter",
    icon: RefreshCw,
    path: "/imageconverter",
  },
  {
    id: "imagecompressor",
    title: "Image Compressor",
    icon: ImageDown,
    path: "/imagecompressor",
  },
  {
    id: "imageresizer",
    title: "Image Resizer",
    icon: Minimize2,
    path: "/imageresizer",
  },
  {
    id: "qrgenerator",
    title: "QR Generator",
    icon: QrCode,
    path: "/qrgenerator",
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

  const handleNavigation = (path) => {
    navigate(path)
  }

  // Active item styles
  const getItemStyle = (path) => {
    if (isActive(path)) {
      return {
        backgroundColor: BRAND.blue,
        color: '#ffffff',
      }
    }
    return {}
  }

  const getIconStyle = (path) => {
    if (isActive(path)) {
      return { color: '#ffffff' }
    }
    return {}
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
              <div className="flex-1 text-left text-sm leading-tight">
                <span 
                  className="truncate font-bold text-base"
                  style={{ fontFamily: "'Montserrat', sans-serif" }}
                >
                  <span style={{ color: isDark ? '#ffffff' : BRAND.brown }}>Brewed</span>
                  <span style={{ color: BRAND.blue }}>Ops</span>
                </span>
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
                    style={getItemStyle(item.path)}
                    className={isActive(item.path) ? "font-medium" : ""}
                  >
                    <item.icon style={getIconStyle(item.path)} />
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
                    tooltip={item.title}
                    isActive={isActive(item.path)}
                    onClick={() => handleNavigation(item.path)}
                    style={getItemStyle(item.path)}
                    className={isActive(item.path) ? "font-medium" : ""}
                  >
                    <item.icon style={getIconStyle(item.path)} />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
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
