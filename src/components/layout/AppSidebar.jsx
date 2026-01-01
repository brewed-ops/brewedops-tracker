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
  Palette,
  ScanText,
  FileStack,
  Scissors,
  ImagePlus,
  Film,
  ScissorsLineDashed,
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
  { id: "dashboard", title: "Finance Tracker", icon: Wallet, path: "/" },
  { id: "vakita", title: "VAKita", icon: Headset, path: "/vakita" },
  { id: "taskmanager", title: "Task Manager", icon: CheckSquare, path: "/taskmanager" },
]

// Image Tools
const imageTools = [
  { id: "bgremover", title: "BG Remover", icon: Sparkles, path: "/bgremover" },
  { id: "imagecropper", title: "Image Cropper", icon: Crop, path: "/imagecropper" },
  { id: "imageresizer", title: "Image Resizer", icon: Minimize2, path: "/imageresizer" },
  { id: "imagecompressor", title: "Image Compressor", icon: ImageDown, path: "/imagecompressor" },
  { id: "imageconverter", title: "Image Converter", icon: RefreshCw, path: "/imageconverter" },
  { id: "colorpicker", title: "Color Picker", icon: Palette, path: "/colorpicker" },
  { id: "imagetotext", title: "Image to Text", icon: ScanText, path: "/imagetotext" },
  { id: "imagetopdf", title: "Image to PDF", icon: ImagePlus, path: "/imagetopdf" },
]

// Video Tools
const videoTools = [
  { id: "videocompressor", title: "Video Compressor", icon: Film, path: "/videocompressor" },
  { id: "videotrimmer", title: "Video Trimmer", icon: ScissorsLineDashed, path: "/videotrimmer" },
]

// Document Tools
const documentTools = [
  { id: "pdfeditor", title: "PDF Editor", icon: FileEdit, path: "/pdfeditor" },
  { id: "pdfmerge", title: "PDF Merge", icon: FileStack, path: "/pdfmerge" },
  { id: "pdfsplit", title: "PDF Split", icon: Scissors, path: "/pdfsplit" },
]

// Other Tools
const otherTools = [
  { id: "qrgenerator", title: "QR Generator", icon: QrCode, path: "/qrgenerator" },
]

export function AppSidebar({ isDark, ...props }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { setOpenMobile, isMobile } = useSidebar()

  const isActive = (path) => {
    if (path === "/") return location.pathname === "/"
    return location.pathname === path
  }

  const handleNavigation = (path) => {
    navigate(path)
    if (isMobile) setOpenMobile(false)
  }

  const getItemStyle = (path) => {
    if (isActive(path)) {
      return { backgroundColor: BRAND.blue, color: '#ffffff' }
    }
    return {}
  }

  const getIconStyle = (path) => {
    if (isActive(path)) return { color: '#ffffff' }
    return {}
  }

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
            size="sm"
          >
            <item.icon className="size-4" style={getIconStyle(item.path)} />
            <span className="text-sm">{item.title}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )

  // Category label style
  const categoryStyle = {
    fontSize: '11px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: isDark ? '#6b7280' : '#9ca3af',
    padding: '8px 12px 4px 12px',
  }

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
                <img src="https://i.imgur.com/R52jwPv.png" alt="BrewedOps" className="size-6 rounded" />
              </div>
              <div className="flex-1 text-left text-sm leading-tight">
                <span className="truncate font-bold text-base" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                  <span style={{ color: isDark ? '#ffffff' : BRAND.brown }}>Brewed</span>
                  <span style={{ color: BRAND.blue }}>Ops</span>
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0">
        {/* Home Section */}
        <SidebarGroup className="py-2">
          <div style={categoryStyle}>Home</div>
          <SidebarGroupContent className="px-2">
            {renderMenuItems(homeItems)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Image Tools */}
        <SidebarGroup className="py-2">
          <div style={categoryStyle}>Image Tools</div>
          <SidebarGroupContent className="px-2">
            {renderMenuItems(imageTools)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Video Tools */}
        <SidebarGroup className="py-2">
          <div style={categoryStyle}>Video Tools</div>
          <SidebarGroupContent className="px-2">
            {renderMenuItems(videoTools)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Document Tools */}
        <SidebarGroup className="py-2">
          <div style={categoryStyle}>Document Tools</div>
          <SidebarGroupContent className="px-2">
            {renderMenuItems(documentTools)}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Other Tools */}
        <SidebarGroup className="py-2">
          <div style={categoryStyle}>Other Tools</div>
          <SidebarGroupContent className="px-2">
            {renderMenuItems(otherTools)}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-2">
        <div className="text-[10px] text-muted-foreground text-center py-2">
          © 2025 BrewedOps
        </div>
      </SidebarFooter>

      {/* Only show rail on mobile for collapse functionality */}
      <SidebarRail className="md:hidden" />
    </Sidebar>
  )
}
