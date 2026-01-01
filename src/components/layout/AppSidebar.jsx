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
  Image,
  Video,
  FileText,
  Palette,
  ScanText,
  Film,
  Smile,
  FileStack,
  Scissors,
  ImagePlus,
  Stamp,
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
  useSidebar,
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

// Image Tools
const imageTools = [
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
    id: "imageresizer",
    title: "Image Resizer",
    icon: Minimize2,
    path: "/imageresizer",
  },
  {
    id: "imagecompressor",
    title: "Image Compressor",
    icon: ImageDown,
    path: "/imagecompressor",
  },
  {
    id: "imageconverter",
    title: "Image Converter",
    icon: RefreshCw,
    path: "/imageconverter",
  },
  {
    id: "colorpicker",
    title: "Color Picker",
    icon: Palette,
    path: "/colorpicker",
  },
  {
    id: "imagetotext",
    title: "Image to Text",
    icon: ScanText,
    path: "/imagetotext",
  },
  {
    id: "memegenerator",
    title: "Meme Generator",
    icon: Smile,
    path: "/memegenerator",
  },
  {
    id: "watermarkmaker",
    title: "Watermark Maker",
    icon: Stamp,
    path: "/watermarkmaker",
  },
  {
    id: "imagetopdf",
    title: "Image to PDF",
    icon: ImagePlus,
    path: "/imagetopdf",
  },
]

// Video Tools
const videoTools = [
  {
    id: "videotogif",
    title: "Video to GIF",
    icon: Film,
    path: "/videotogif",
  },
]

// Document Tools
const documentTools = [
  {
    id: "pdfeditor",
    title: "PDF Editor",
    icon: FileEdit,
    path: "/pdfeditor",
  },
  {
    id: "pdfmerge",
    title: "PDF Merge",
    icon: FileStack,
    path: "/pdfmerge",
  },
  {
    id: "pdfsplit",
    title: "PDF Split",
    icon: Scissors,
    path: "/pdfsplit",
  },
]

// Other Tools
const otherTools = [
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
  const { setOpenMobile, isMobile } = useSidebar()

  // Check if current path matches item path
  const isActive = (path) => {
    if (path === "/") {
      return location.pathname === "/"
    }
    return location.pathname === path
  }

  // Handle navigation and close sidebar on mobile
  const handleNavigation = (path) => {
    navigate(path)
    if (isMobile) {
      setOpenMobile(false)
    }
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

  // Render menu items helper
  const renderMenuItems = (items) => (
    <SidebarMenu>
      {items.map((item) => (
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
  )

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              onClick={() => handleNavigation("/")}
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
            {renderMenuItems(homeItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* More Tools Header */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <MoreHorizontal className="mr-2 size-4" />
            More Tools
          </SidebarGroupLabel>
        </SidebarGroup>

        {/* Image Tools */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <Image className="mr-2 size-4" />
            Image Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(imageTools)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Video Tools */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <Video className="mr-2 size-4" />
            Video Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(videoTools)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Document Tools */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <FileText className="mr-2 size-4" />
            Document Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(documentTools)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Other Tools */}
        <SidebarGroup>
          <SidebarGroupLabel>
            <MoreHorizontal className="mr-2 size-4" />
            Other Tools
          </SidebarGroupLabel>
          <SidebarGroupContent>
            {renderMenuItems(otherTools)}
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
