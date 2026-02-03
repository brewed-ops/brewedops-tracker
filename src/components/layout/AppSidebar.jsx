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
  FileStack,
  Scissors,
  ImagePlus,
  Film,
  ScissorsLineDashed,
  FileText,
  Replace,
  CaseSensitive,
  Hash,
  GitBranch,
  Braces,
  Clock,
  BookOpen,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"

const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' }

// Navigation items
const homeItems = [
  { id: "dashboard", title: "Finance Tracker", icon: Wallet, path: "/" },
  { id: "vakita", title: "VAKita", icon: Headset, path: "/vakita" },
  { id: "taskmanager", title: "Task Manager", icon: CheckSquare, path: "/taskmanager" },
  { id: "brewednotes", title: "Brewed Notes", icon: FileText, path: "/brewednotes" },
]

const imageTools = [
  { id: "bgremover", title: "BG Remover", icon: Sparkles, path: "/bgremover" },
  { id: "imagecropper", title: "Image Cropper", icon: Crop, path: "/imagecropper" },
  { id: "imageresizer", title: "Image Resizer", icon: Minimize2, path: "/imageresizer" },
  { id: "imagecompressor", title: "Image Compressor", icon: ImageDown, path: "/imagecompressor" },
  { id: "imageconverter", title: "Image Converter", icon: RefreshCw, path: "/imageconverter" },
  { id: "colorpicker", title: "Color Picker", icon: Palette, path: "/colorpicker" },
  { id: "imagetopdf", title: "Image to PDF", icon: ImagePlus, path: "/imagetopdf" },
]

const videoTools = [
  { id: "videocompressor", title: "Video Compressor", icon: Film, path: "/videocompressor" },
  { id: "videotrimmer", title: "Video Trimmer", icon: ScissorsLineDashed, path: "/videotrimmer" },
]

const documentTools = [
  { id: "pdfeditor", title: "PDF Editor", icon: FileEdit, path: "/pdfeditor" },
  { id: "pdfmerge", title: "PDF Merge", icon: FileStack, path: "/pdfmerge" },
  { id: "pdfsplit", title: "PDF Split", icon: Scissors, path: "/pdfsplit" },
]

const otherTools = [
  { id: "qrgenerator", title: "QR Generator", icon: QrCode, path: "/qrgenerator" },
  { id: "findreplace", title: "Find & Replace", icon: Replace, path: "/findreplace" },
  { id: "caseconverter", title: "Case Converter", icon: CaseSensitive, path: "/caseconverter" },
  { id: "wordcounter", title: "Word Counter", icon: Hash, path: "/wordcounter" },
  { id: "mermaid", title: "Mermaid Reader", icon: GitBranch, path: "/mermaid" },
  { id: "markdownviewer", title: "Markdown Viewer", icon: BookOpen, path: "/markdownviewer" },
  { id: "jsonformatter", title: "JSON Formatter", icon: Braces, path: "/jsonformatter" },
  { id: "crongenerator", title: "Cron Generator", icon: Clock, path: "/crongenerator" },
]

export function AppSidebar({ isDark, ...props }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { setOpenMobile, isMobile } = useSidebar()

  const isActive = (path) => path === "/" ? location.pathname === "/" : location.pathname === path

  const handleNavigation = (path) => {
    navigate(path)
    if (isMobile) setOpenMobile(false)
  }

  const getItemStyle = (path) => isActive(path) ? { backgroundColor: BRAND.blue, color: '#ffffff' } : {}
  const getIconStyle = (path) => isActive(path) ? { color: '#ffffff' } : {}

  const renderMenuItems = (items) => (
    <SidebarMenu className="gap-0.5">
      {items.map((item) => (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            tooltip={item.title}
            isActive={isActive(item.path)}
            onClick={() => handleNavigation(item.path)}
            style={getItemStyle(item.path)}
            className="h-7 px-2"
          >
            <item.icon className="size-3.5 shrink-0" style={getIconStyle(item.path)} />
            <span className="text-xs">{item.title}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  )

  const categoryStyle = {
    fontSize: '9px',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    color: isDark ? '#6b5f52' : '#a09585',
    padding: '4px 8px 2px 8px',
  }

  // Solid background for sidebar
  const sidebarBg = isDark ? '#0d0b09' : '#faf8f5'

  return (
    <Sidebar 
      collapsible="icon" 
      {...props}
      className="border-r"
      style={{ backgroundColor: sidebarBg }}
    >
      <SidebarHeader className="p-2" style={{ backgroundColor: sidebarBg }}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="h-12"
              onClick={() => handleNavigation("/")}
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg">
                <img src="https://i.imgur.com/R52jwPv.png" alt="BrewedOps" className="size-7 rounded" />
              </div>
              <span className="font-bold text-base" style={{ fontFamily: "'Montserrat', sans-serif" }}>
                <span style={{ color: isDark ? '#ffffff' : BRAND.brown }}>Brewed</span>
                <span style={{ color: BRAND.blue }}>Ops</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-1" style={{ backgroundColor: sidebarBg }}>
        <SidebarGroup className="py-0.5">
          <div style={categoryStyle}>Home</div>
          <SidebarGroupContent>{renderMenuItems(homeItems)}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="py-0.5">
          <div style={categoryStyle}>Image Tools</div>
          <SidebarGroupContent>{renderMenuItems(imageTools)}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="py-0.5">
          <div style={categoryStyle}>Video Tools</div>
          <SidebarGroupContent>{renderMenuItems(videoTools)}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="py-0.5">
          <div style={categoryStyle}>Document Tools</div>
          <SidebarGroupContent>{renderMenuItems(documentTools)}</SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="py-0.5">
          <div style={categoryStyle}>Other Tools</div>
          <SidebarGroupContent>{renderMenuItems(otherTools)}</SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-1" style={{ backgroundColor: sidebarBg }}>
        <div className="text-[9px] text-muted-foreground text-center py-1">
          © 2026 BrewedOps
        </div>
      </SidebarFooter>

      <SidebarRail className="md:hidden" />
    </Sidebar>
  )
}
