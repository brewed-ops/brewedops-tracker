// BrewedNotes.jsx - Rich Text Notes App for BrewedOps
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Plus, Trash2, Edit3, Save, FileText, AlertTriangle,
  Bold, Italic, Underline, Strikethrough, List, ListOrdered, CheckSquare,
  AlignLeft, AlignCenter, AlignRight, Type, Heading1, Heading2, Heading3,
  X, Loader2, Highlighter, Undo, Redo
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { getTheme } from '../lib/theme';
import { supabase } from '../lib/supabase';

const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' };
const FONTS = { heading: "'Montserrat', sans-serif", body: "'Poppins', sans-serif" };

const NOTE_COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Red', value: '#ef4444' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Yellow', value: '#eab308' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Cyan', value: '#06b6d4' },
  { name: 'Gray', value: '#6b7280' },
];

const FONT_FAMILIES = [
  { name: 'Montserrat', value: 'Montserrat, sans-serif' },
  { name: 'Nunito', value: 'Nunito, sans-serif' },
  { name: 'Poppins', value: 'Poppins, sans-serif' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
];

const FONT_SIZES = [
  { label: '10px', value: '1' },
  { label: '13px', value: '2' },
  { label: '16px', value: '3' },
  { label: '18px', value: '4' },
  { label: '24px', value: '5' },
  { label: '32px', value: '6' },
  { label: '48px', value: '7' },
];

const TEXT_COLORS = [
  '#000000', '#374151', '#6b7280', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff'
];

const HIGHLIGHT_COLORS = [
  '#fef08a', '#fde047', '#fcd34d', '#fdba74', '#fca5a5', 
  '#d8b4fe', '#c4b5fd', '#a5b4fc', '#93c5fd', '#6ee7b7'
];

const BrewedNotes = ({ isDark, user }) => {
  const theme = getTheme(isDark);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [noteToEdit, setNoteToEdit] = useState(null);
  
  const [newNoteName, setNewNoteName] = useState('');
  const [newNoteColor, setNewNoteColor] = useState(NOTE_COLORS[0].value);
  
  const [showTextColorPicker, setShowTextColorPicker] = useState(false);
  const [showHighlightPicker, setShowHighlightPicker] = useState(false);
  
  const editorRef = useRef(null);

  useEffect(() => {
    if (user?.id) loadNotes();
  }, [user?.id]);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('brewed_notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setNotes(data || []);
      if (data?.length > 0 && !selectedNote) setSelectedNote(data[0]);
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNote = async () => {
    if (!newNoteName.trim()) return;
    try {
      setSaving(true);
      const newNote = {
        user_id: user.id,
        name: newNoteName.trim(),
        color: newNoteColor,
        content: '',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      const { data, error } = await supabase.from('brewed_notes').insert([newNote]).select().single();
      if (error) throw error;
      setNotes(prev => [data, ...prev]);
      setSelectedNote(data);
      setIsEditing(true);
      setShowAddModal(false);
      setNewNoteName('');
      setNewNoteColor(NOTE_COLORS[0].value);
    } catch (error) {
      console.error('Error creating note:', error);
    } finally {
      setSaving(false);
    }
  };

  const saveNote = async () => {
    if (!selectedNote || !editorRef.current) return;
    try {
      setSaving(true);
      const content = editorRef.current.innerHTML;
      const { error } = await supabase
        .from('brewed_notes')
        .update({ content, updated_at: new Date().toISOString() })
        .eq('id', selectedNote.id);
      if (error) throw error;
      setNotes(prev => prev.map(n => n.id === selectedNote.id ? { ...n, content, updated_at: new Date().toISOString() } : n));
      setSelectedNote(prev => ({ ...prev, content }));
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving note:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateNoteName = async () => {
    if (!noteToEdit || !newNoteName.trim()) return;
    try {
      setSaving(true);
      const { error } = await supabase.from('brewed_notes').update({ 
        name: newNoteName.trim(), 
        color: newNoteColor, 
        updated_at: new Date().toISOString() 
      }).eq('id', noteToEdit.id);
      if (error) throw error;
      setNotes(prev => prev.map(n => n.id === noteToEdit.id ? { ...n, name: newNoteName.trim(), color: newNoteColor } : n));
      if (selectedNote?.id === noteToEdit.id) setSelectedNote(prev => ({ ...prev, name: newNoteName.trim(), color: newNoteColor }));
      setShowEditNameModal(false);
      setNoteToEdit(null);
      setNewNoteName('');
    } catch (error) {
      console.error('Error updating note:', error);
    } finally {
      setSaving(false);
    }
  };

  const deleteNote = async () => {
    if (!noteToDelete) return;
    try {
      setSaving(true);
      const { error } = await supabase.from('brewed_notes').delete().eq('id', noteToDelete.id);
      if (error) throw error;
      setNotes(prev => prev.filter(n => n.id !== noteToDelete.id));
      if (selectedNote?.id === noteToDelete.id) {
        const remaining = notes.filter(n => n.id !== noteToDelete.id);
        setSelectedNote(remaining.length > 0 ? remaining[0] : null);
      }
      setShowDeleteModal(false);
      setNoteToDelete(null);
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      setSaving(false);
    }
  };

  // Simple exec command
  const execCmd = (cmd, value = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
  };

  // Format as heading - toggle between heading and paragraph
  const formatAsHeading = useCallback((level) => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    
    const currentBlock = document.queryCommandValue('formatBlock');
    
    if (currentBlock.toLowerCase() === level.toLowerCase()) {
      document.execCommand('formatBlock', false, 'p');
    } else {
      document.execCommand('formatBlock', false, level);
    }
  }, []);

  // Format as bullet list
  const formatAsBulletList = useCallback(() => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('insertUnorderedList', false, null);
  }, []);

  // Format as numbered list
  const formatAsNumberedList = useCallback(() => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand('insertOrderedList', false, null);
  }, []);

  // Format as checklist with strikethrough functionality
  const formatAsChecklist = useCallback(() => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    
    const selection = window.getSelection();
    const selectedText = selection.toString().trim();
    
    const createCheckItem = (text, checked = false) => {
      const strikeStyle = checked ? 'text-decoration: line-through; opacity: 0.6;' : '';
      return `<div class="checklist-item" style="display:flex;align-items:center;gap:8px;margin:6px 0;font-family: Montserrat, sans-serif;">
        <input type="checkbox" ${checked ? 'checked' : ''} style="width:18px;height:18px;cursor:pointer;accent-color:${BRAND.blue};flex-shrink:0;"/>
        <span style="${strikeStyle}">${text}</span>
      </div>`;
    };
    
    if (selectedText) {
      const lines = selectedText.split(/\n/).filter(line => line.trim());
      if (lines.length > 1) {
        const items = lines.map(line => createCheckItem(line.trim())).join('');
        document.execCommand('insertHTML', false, items);
      } else {
        document.execCommand('insertHTML', false, createCheckItem(selectedText));
      }
    } else {
      document.execCommand('insertHTML', false, createCheckItem('Task item'));
    }
  }, []);

  // Apply text color
  const applyTextColor = useCallback((color) => {
    editorRef.current?.focus();
    document.execCommand('foreColor', false, color);
    setShowTextColorPicker(false);
  }, []);

  // Apply highlight
  const applyHighlight = useCallback((color) => {
    editorRef.current?.focus();
    document.execCommand('hiliteColor', false, color);
    setShowHighlightPicker(false);
  }, []);

  // Remove all formatting
  const removeFormatting = useCallback(() => {
    editorRef.current?.focus();
    document.execCommand('removeFormat', false, null);
    document.execCommand('formatBlock', false, 'p');
  }, []);

  // Toolbar button
  const ToolbarBtn = ({ onClick, disabled, title, children, active }) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); if (!disabled) onClick?.(); }}
      disabled={disabled}
      className={`p-1.5 rounded hover:bg-muted disabled:opacity-40 transition-colors flex items-center justify-center min-w-[28px] h-7 ${active ? 'bg-muted' : ''}`}
      title={title}
    >
      {children}
    </button>
  );

  const handleEditorDoubleClick = () => {
    if (!isEditing && selectedNote) {
      setIsEditing(true);
      setTimeout(() => editorRef.current?.focus(), 10);
    }
  };

  // Handle keyboard shortcuts - prevent sidebar from capturing them
  const handleEditorKeyDown = useCallback((e) => {
    if (!isEditing) return;
    
    // Stop propagation for formatting shortcuts so sidebar doesn't capture them
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case 'b': // Bold
          e.preventDefault();
          e.stopPropagation();
          document.execCommand('bold', false, null);
          break;
        case 'i': // Italic
          e.preventDefault();
          e.stopPropagation();
          document.execCommand('italic', false, null);
          break;
        case 'u': // Underline
          e.preventDefault();
          e.stopPropagation();
          document.execCommand('underline', false, null);
          break;
        case 's': // Save
          e.preventDefault();
          e.stopPropagation();
          saveNote();
          break;
        default:
          break;
      }
    }
  }, [isEditing, saveNote]);

  // Handle checkbox click for strikethrough - using event delegation
  const handleEditorClick = useCallback((e) => {
    const target = e.target;
    if (target.type === 'checkbox') {
      const checkItem = target.closest('.checklist-item');
      if (checkItem) {
        const textSpan = checkItem.querySelector('span');
        if (textSpan) {
          // Use setTimeout to ensure checkbox state is updated first
          setTimeout(() => {
            if (target.checked) {
              textSpan.style.textDecoration = 'line-through';
              textSpan.style.opacity = '0.6';
              textSpan.style.color = isDark ? '#9ca3af' : '#6b7280';
            } else {
              textSpan.style.textDecoration = 'none';
              textSpan.style.opacity = '1';
              textSpan.style.color = '';
            }
          }, 0);
        }
      }
    }
  }, [isDark]);

  const handleNoteSelect = async (note) => {
    if (isEditing && selectedNote) await saveNote();
    setSelectedNote(note);
    setIsEditing(false);
  };

  const getNoteGradient = (color) => `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`;

  useEffect(() => {
    if (editorRef.current && selectedNote) {
      editorRef.current.innerHTML = selectedNote.content || '';
    }
  }, [selectedNote?.id]);

  if (loading) {
    return (
      <div className="p-4 md:p-6 w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.bg }}>
        <Loader2 className="size-8 animate-spin" style={{ color: BRAND.blue }} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: "'Montserrat', sans-serif" }}>
      {/* Import Google Fonts */}
      <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&family=Nunito:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      
      {/* Custom editor styles */}
      <style>{`
        .brewed-editor {
          color: ${isDark ? '#f3f4f6' : '#111827'};
          font-family: 'Montserrat', sans-serif;
        }
        .brewed-editor h1 { font-size: 2em; font-weight: bold; margin: 0.5em 0; font-family: 'Montserrat', sans-serif; }
        .brewed-editor h2 { font-size: 1.5em; font-weight: bold; margin: 0.5em 0; font-family: 'Montserrat', sans-serif; }
        .brewed-editor h3 { font-size: 1.25em; font-weight: bold; margin: 0.5em 0; font-family: 'Montserrat', sans-serif; }
        .brewed-editor p { margin: 0.5em 0; }
        
        /* BULLET LIST - Make bullets visible */
        .brewed-editor ul {
          list-style-type: disc !important;
          padding-left: 2em !important;
          margin: 0.5em 0 !important;
        }
        .brewed-editor ul li {
          display: list-item !important;
          margin: 0.25em 0 !important;
        }
        
        /* NUMBERED LIST - Make numbers visible */
        .brewed-editor ol {
          list-style-type: decimal !important;
          padding-left: 2em !important;
          margin: 0.5em 0 !important;
        }
        .brewed-editor ol li {
          display: list-item !important;
          margin: 0.25em 0 !important;
        }
        
        /* Nested lists */
        .brewed-editor ul ul { list-style-type: circle !important; }
        .brewed-editor ul ul ul { list-style-type: square !important; }
        .brewed-editor ol ol { list-style-type: lower-alpha !important; }
        .brewed-editor ol ol ol { list-style-type: lower-roman !important; }

        /* Checklist styling */
        .brewed-editor .checklist-item {
          font-family: 'Montserrat', sans-serif;
        }
        .brewed-editor .checklist-item input[type="checkbox"]:checked + span {
          text-decoration: line-through;
          opacity: 0.6;
        }
      `}</style>

      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.text, fontFamily: "'Montserrat', sans-serif" }}>
          <FileText className="size-5 md:size-8 shrink-0" style={{ color: BRAND.blue }} />
          Brewed Notes
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground" style={{ fontFamily: "'Montserrat', sans-serif" }}>Create and organize your notes with rich text formatting</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[calc(100vh-180px)]">
        {/* Sidebar */}
        <div className="w-full lg:w-56 shrink-0 flex flex-col" style={{ backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}` }}>
          <div className="p-3 border-b" style={{ borderColor: theme.cardBorder }}>
            <Button onClick={() => setShowAddModal(true)} className="w-full" style={{ backgroundColor: BRAND.blue, fontFamily: "'Montserrat', sans-serif" }}>
              <Plus className="size-4 mr-2" />Add New Note
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-40 lg:max-h-none">
            {notes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>No notes yet.</div>
            ) : notes.map(note => (
              <div
                key={note.id}
                onClick={() => handleNoteSelect(note)}
                className={`group relative p-2.5 rounded-lg cursor-pointer transition-all ${selectedNote?.id === note.id ? 'ring-2' : 'hover:opacity-80'}`}
                style={{ background: getNoteGradient(note.color), borderLeft: `4px solid ${note.color}`, ringColor: note.color }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm truncate pr-2" style={{ color: theme.text, fontFamily: "'Montserrat', sans-serif" }}>{note.name}</span>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); setNoteToEdit(note); setNewNoteName(note.name); setNewNoteColor(note.color); setShowEditNameModal(true); }} className="p-1 rounded hover:bg-black/10"><Edit3 className="size-3" style={{ color: theme.text }} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setNoteToDelete(note); setShowDeleteModal(true); }} className="p-1 rounded hover:bg-black/10"><Trash2 className="size-3 text-red-500" /></button>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5" style={{ fontFamily: "'Montserrat', sans-serif" }}>{new Date(note.updated_at).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 flex flex-col min-h-[400px]" style={{ backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}` }}>
          {selectedNote ? (
            <>
              {/* Toolbar */}
              <div className="p-2 border-b flex flex-wrap items-center gap-0.5" style={{ borderColor: theme.cardBorder }}>
                {/* Font Family */}
                <select
                  onMouseDown={(e) => e.stopPropagation()}
                  onChange={(e) => { editorRef.current?.focus(); document.execCommand('fontName', false, e.target.value); }}
                  disabled={!isEditing}
                  className="h-7 px-1 text-xs border rounded bg-background disabled:opacity-40"
                  style={{ borderColor: theme.cardBorder, width: '100px', fontFamily: "'Montserrat', sans-serif" }}
                  defaultValue="Montserrat, sans-serif"
                >
                  {FONT_FAMILIES.map(f => <option key={f.value} value={f.value} style={{ fontFamily: f.value }}>{f.name}</option>)}
                </select>

                {/* Font Size */}
                <select
                  onMouseDown={(e) => e.stopPropagation()}
                  onChange={(e) => { editorRef.current?.focus(); document.execCommand('fontSize', false, e.target.value); }}
                  disabled={!isEditing}
                  className="h-7 px-1 text-xs border rounded bg-background disabled:opacity-40"
                  style={{ borderColor: theme.cardBorder, width: '65px', fontFamily: "'Montserrat', sans-serif" }}
                  defaultValue="3"
                >
                  {FONT_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>

                <div className="w-px h-5 bg-border mx-1" />

                {/* Undo/Redo */}
                <ToolbarBtn onClick={() => execCmd('undo')} disabled={!isEditing} title="Undo"><Undo className="size-3.5" /></ToolbarBtn>
                <ToolbarBtn onClick={() => execCmd('redo')} disabled={!isEditing} title="Redo"><Redo className="size-3.5" /></ToolbarBtn>
                
                <div className="w-px h-5 bg-border mx-1" />

                {/* Basic formatting */}
                <ToolbarBtn onClick={() => execCmd('bold')} disabled={!isEditing} title="Bold (Ctrl+B)"><Bold className="size-3.5" /></ToolbarBtn>
                <ToolbarBtn onClick={() => execCmd('italic')} disabled={!isEditing} title="Italic (Ctrl+I)"><Italic className="size-3.5" /></ToolbarBtn>
                <ToolbarBtn onClick={() => execCmd('underline')} disabled={!isEditing} title="Underline (Ctrl+U)"><Underline className="size-3.5" /></ToolbarBtn>
                <ToolbarBtn onClick={() => execCmd('strikeThrough')} disabled={!isEditing} title="Strikethrough"><Strikethrough className="size-3.5" /></ToolbarBtn>

                <div className="w-px h-5 bg-border mx-1" />

                {/* Text Color */}
                <div className="relative">
                  <ToolbarBtn onClick={() => setShowTextColorPicker(!showTextColorPicker)} disabled={!isEditing} title="Text Color">
                    <div className="flex flex-col items-center"><Type className="size-3.5" /><div className="w-3 h-0.5 rounded" style={{ backgroundColor: '#ef4444' }} /></div>
                  </ToolbarBtn>
                  {showTextColorPicker && isEditing && (
                    <div className="absolute top-full left-0 mt-1 p-2 rounded-lg shadow-lg z-50 grid grid-cols-6 gap-1" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
                      {TEXT_COLORS.map(color => (
                        <button key={color} onMouseDown={(e) => { e.preventDefault(); applyTextColor(color); }} className="w-5 h-5 rounded border hover:scale-110 transition-transform" style={{ backgroundColor: color, borderColor: theme.cardBorder }} />
                      ))}
                    </div>
                  )}
                </div>

                {/* Highlight */}
                <div className="relative">
                  <ToolbarBtn onClick={() => setShowHighlightPicker(!showHighlightPicker)} disabled={!isEditing} title="Highlight"><Highlighter className="size-3.5" /></ToolbarBtn>
                  {showHighlightPicker && isEditing && (
                    <div className="absolute top-full left-0 mt-1 p-2 rounded-lg shadow-lg z-50 grid grid-cols-5 gap-1" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
                      {HIGHLIGHT_COLORS.map(color => (
                        <button key={color} onMouseDown={(e) => { e.preventDefault(); applyHighlight(color); }} className="w-5 h-5 rounded border hover:scale-110 transition-transform" style={{ backgroundColor: color, borderColor: theme.cardBorder }} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-px h-5 bg-border mx-1" />

                {/* Alignment */}
                <ToolbarBtn onClick={() => execCmd('justifyLeft')} disabled={!isEditing} title="Align Left"><AlignLeft className="size-3.5" /></ToolbarBtn>
                <ToolbarBtn onClick={() => execCmd('justifyCenter')} disabled={!isEditing} title="Center"><AlignCenter className="size-3.5" /></ToolbarBtn>
                <ToolbarBtn onClick={() => execCmd('justifyRight')} disabled={!isEditing} title="Align Right"><AlignRight className="size-3.5" /></ToolbarBtn>

                <div className="w-px h-5 bg-border mx-1" />

                {/* Lists */}
                <ToolbarBtn onClick={formatAsBulletList} disabled={!isEditing} title="Bullet List"><List className="size-3.5" /></ToolbarBtn>
                <ToolbarBtn onClick={formatAsNumberedList} disabled={!isEditing} title="Numbered List"><ListOrdered className="size-3.5" /></ToolbarBtn>
                <ToolbarBtn onClick={formatAsChecklist} disabled={!isEditing} title="Checklist (checks will strikethrough)"><CheckSquare className="size-3.5" /></ToolbarBtn>

                <div className="w-px h-5 bg-border mx-1" />

                {/* Headings */}
                <ToolbarBtn onClick={() => formatAsHeading('h1')} disabled={!isEditing} title="Heading 1 (click again to remove)"><Heading1 className="size-3.5" /></ToolbarBtn>
                <ToolbarBtn onClick={() => formatAsHeading('h2')} disabled={!isEditing} title="Heading 2 (click again to remove)"><Heading2 className="size-3.5" /></ToolbarBtn>
                <ToolbarBtn onClick={() => formatAsHeading('h3')} disabled={!isEditing} title="Heading 3 (click again to remove)"><Heading3 className="size-3.5" /></ToolbarBtn>

                {/* Clear Formatting */}
                <ToolbarBtn onClick={removeFormatting} disabled={!isEditing} title="Clear Formatting"><X className="size-3.5" /></ToolbarBtn>

                {/* Save */}
                <div className="ml-auto">
                  {isEditing && (
                    <Button onClick={saveNote} disabled={saving} size="sm" className="h-7 text-xs" style={{ backgroundColor: BRAND.green, fontFamily: "'Montserrat', sans-serif" }}>
                      {saving ? <Loader2 className="size-3 mr-1 animate-spin" /> : <Save className="size-3 mr-1" />}Save
                    </Button>
                  )}
                </div>
              </div>

              {/* Editor */}
              <div className="flex-1 overflow-hidden">
                <div
                  ref={editorRef}
                  contentEditable={isEditing}
                  onDoubleClick={handleEditorDoubleClick}
                  onKeyDown={handleEditorKeyDown}
                  onClick={handleEditorClick}
                  className="brewed-editor h-full p-4 overflow-y-auto outline-none"
                  style={{ fontSize: '15px', lineHeight: '1.7', minHeight: '300px', cursor: isEditing ? 'text' : 'default' }}
                  suppressContentEditableWarning={true}
                />
              </div>

              {/* Status */}
              <div className="px-4 py-2 border-t text-xs text-muted-foreground flex justify-between" style={{ borderColor: theme.cardBorder, fontFamily: "'Montserrat', sans-serif" }}>
                <span>{isEditing ? '✏️ Editing - Checked items will be crossed out' : '👁️ View mode - Double-click to edit'}</span>
                <span>Saved: {new Date(selectedNote.updated_at).toLocaleString()}</span>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center" style={{ fontFamily: "'Montserrat', sans-serif" }}><FileText className="size-12 mx-auto mb-3 opacity-20" /><p>Select or create a note</p></div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2" style={{ fontFamily: "'Montserrat', sans-serif" }}><Plus className="size-5" style={{ color: BRAND.blue }} />Create New Note</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label className="text-sm mb-2 block" style={{ fontFamily: "'Montserrat', sans-serif" }}>Note Name</Label><input type="text" value={newNoteName} onChange={(e) => setNewNoteName(e.target.value)} placeholder="Enter note name..." className="w-full h-10 px-3 border rounded-lg bg-background" style={{ borderColor: theme.cardBorder, fontFamily: "'Montserrat', sans-serif" }} autoFocus /></div>
            <div><Label className="text-sm mb-2 block" style={{ fontFamily: "'Montserrat', sans-serif" }}>Color</Label><div className="grid grid-cols-5 gap-2">{NOTE_COLORS.map(color => (<button key={color.value} onClick={() => setNewNoteColor(color.value)} className={`h-8 rounded-lg transition-all ${newNoteColor === color.value ? 'ring-2 ring-offset-2 scale-105' : 'hover:scale-105'}`} style={{ background: getNoteGradient(color.value), borderLeft: `4px solid ${color.value}`, ringColor: color.value }} title={color.name} />))}</div></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowAddModal(false)} style={{ fontFamily: "'Montserrat', sans-serif" }}>Cancel</Button><Button onClick={createNote} disabled={!newNoteName.trim() || saving} style={{ backgroundColor: BRAND.blue, fontFamily: "'Montserrat', sans-serif" }}>{saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Plus className="size-4 mr-2" />}Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditNameModal} onOpenChange={setShowEditNameModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2" style={{ fontFamily: "'Montserrat', sans-serif" }}><Edit3 className="size-5" style={{ color: BRAND.blue }} />Edit Note</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label className="text-sm mb-2 block" style={{ fontFamily: "'Montserrat', sans-serif" }}>Note Name</Label><input type="text" value={newNoteName} onChange={(e) => setNewNoteName(e.target.value)} className="w-full h-10 px-3 border rounded-lg bg-background" style={{ borderColor: theme.cardBorder, fontFamily: "'Montserrat', sans-serif" }} autoFocus /></div>
            <div><Label className="text-sm mb-2 block" style={{ fontFamily: "'Montserrat', sans-serif" }}>Color</Label><div className="grid grid-cols-5 gap-2">{NOTE_COLORS.map(color => (<button key={color.value} onClick={() => setNewNoteColor(color.value)} className={`h-8 rounded-lg transition-all ${newNoteColor === color.value ? 'ring-2 ring-offset-2 scale-105' : 'hover:scale-105'}`} style={{ background: getNoteGradient(color.value), borderLeft: `4px solid ${color.value}`, ringColor: color.value }} />))}</div></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowEditNameModal(false)} style={{ fontFamily: "'Montserrat', sans-serif" }}>Cancel</Button><Button onClick={updateNoteName} disabled={!newNoteName.trim() || saving} style={{ backgroundColor: BRAND.blue, fontFamily: "'Montserrat', sans-serif" }}>{saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Save className="size-4 mr-2" />}Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2" style={{ fontFamily: "'Montserrat', sans-serif" }}><AlertTriangle className="size-5 text-red-500" />Delete Note?</DialogTitle><DialogDescription style={{ fontFamily: "'Montserrat', sans-serif" }}>Are you sure you want to delete "<strong>{noteToDelete?.name}</strong>"?</DialogDescription></DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0"><Button variant="outline" onClick={() => setShowDeleteModal(false)} style={{ fontFamily: "'Montserrat', sans-serif" }}>Cancel</Button><Button variant="destructive" onClick={deleteNote} disabled={saving} style={{ fontFamily: "'Montserrat', sans-serif" }}>{saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Trash2 className="size-4 mr-2" />}Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {(showTextColorPicker || showHighlightPicker) && <div className="fixed inset-0 z-40" onClick={() => { setShowTextColorPicker(false); setShowHighlightPicker(false); }} />}
    </div>
  );
};

export default BrewedNotes;
