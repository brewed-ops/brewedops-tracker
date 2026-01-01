// BrewedNotes.jsx - Rich Text Notes App for BrewedOps
// Uses manual DOM manipulation for reliable formatting
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Plus, Trash2, Edit3, Save, FileText, AlertTriangle,
  Bold, Italic, Underline, Strikethrough, List, ListOrdered, CheckSquare,
  AlignLeft, AlignCenter, AlignRight, Type, Heading1, Heading2, Heading3,
  X, Loader2, Highlighter
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
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
];

const FONT_SIZES = [
  { label: '12px', value: '12px' },
  { label: '14px', value: '14px' },
  { label: '16px', value: '16px' },
  { label: '18px', value: '18px' },
  { label: '24px', value: '24px' },
  { label: '32px', value: '32px' },
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
        content: '<p><br></p>',
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
      const { error } = await supabase.from('brewed_notes').update({ name: newNoteName.trim(), color: newNoteColor, updated_at: new Date().toISOString() }).eq('id', noteToEdit.id);
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

  // Wrap selected text in a tag using Selection API
  const wrapSelectionWithTag = useCallback((tagName, styles = {}) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText) return;

    const wrapper = document.createElement(tagName);
    Object.assign(wrapper.style, styles);
    
    try {
      range.surroundContents(wrapper);
    } catch (e) {
      // If surroundContents fails (crosses node boundaries), use extractContents
      const fragment = range.extractContents();
      wrapper.appendChild(fragment);
      range.insertNode(wrapper);
    }
    
    selection.removeAllRanges();
  }, []);

  // Apply inline style to selection
  const applyInlineStyle = useCallback((styleProperty, styleValue) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    if (!selectedText) return;

    const span = document.createElement('span');
    span.style[styleProperty] = styleValue;
    
    try {
      range.surroundContents(span);
    } catch (e) {
      const fragment = range.extractContents();
      span.appendChild(fragment);
      range.insertNode(span);
    }
    
    selection.removeAllRanges();
  }, []);

  // Format as heading - wraps in heading tag
  const formatAsHeading = useCallback((level) => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = range.toString() || 'Heading';
    
    // Delete current selection
    range.deleteContents();
    
    // Create heading element
    const heading = document.createElement(level);
    heading.textContent = selectedText;
    heading.style.margin = '0.5em 0';
    
    range.insertNode(heading);
    
    // Add a line break after if needed
    const br = document.createElement('br');
    heading.parentNode.insertBefore(br, heading.nextSibling);
    
    selection.removeAllRanges();
  }, []);

  // Convert to bullet list
  const formatAsBulletList = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (!selectedText) {
      // Insert empty list item
      document.execCommand('insertHTML', false, '<ul><li>List item</li></ul>');
      return;
    }
    
    // Split by newlines and create list items
    const lines = selectedText.split('\n').filter(line => line.trim());
    const listItems = lines.map(line => `<li>${line.trim()}</li>`).join('');
    const listHTML = `<ul>${listItems}</ul>`;
    
    range.deleteContents();
    
    const template = document.createElement('template');
    template.innerHTML = listHTML;
    range.insertNode(template.content);
    
    selection.removeAllRanges();
  }, []);

  // Convert to numbered list
  const formatAsNumberedList = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    if (!selectedText) {
      document.execCommand('insertHTML', false, '<ol><li>List item</li></ol>');
      return;
    }
    
    const lines = selectedText.split('\n').filter(line => line.trim());
    const listItems = lines.map(line => `<li>${line.trim()}</li>`).join('');
    const listHTML = `<ol>${listItems}</ol>`;
    
    range.deleteContents();
    
    const template = document.createElement('template');
    template.innerHTML = listHTML;
    range.insertNode(template.content);
    
    selection.removeAllRanges();
  }, []);

  // Insert checklist
  const insertChecklist = useCallback(() => {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;
    
    const range = selection.getRangeAt(0);
    const selectedText = range.toString();
    
    let checklistHTML;
    if (!selectedText) {
      checklistHTML = `<div style="display:flex;align-items:center;gap:8px;margin:4px 0;"><input type="checkbox" style="width:16px;height:16px;"/><span>Task item</span></div>`;
    } else {
      const lines = selectedText.split('\n').filter(line => line.trim());
      checklistHTML = lines.map(line => 
        `<div style="display:flex;align-items:center;gap:8px;margin:4px 0;"><input type="checkbox" style="width:16px;height:16px;"/><span>${line.trim()}</span></div>`
      ).join('');
    }
    
    range.deleteContents();
    
    const template = document.createElement('template');
    template.innerHTML = checklistHTML;
    range.insertNode(template.content);
    
    selection.removeAllRanges();
  }, []);

  // Simple execCommand wrapper for basic formatting
  const execCmd = useCallback((cmd, value = null) => {
    editorRef.current?.focus();
    document.execCommand(cmd, false, value);
  }, []);

  const ToolbarBtn = ({ onClick, disabled, title, children }) => (
    <button
      type="button"
      onMouseDown={(e) => { e.preventDefault(); if (!disabled && onClick) onClick(); }}
      disabled={disabled}
      className="p-1.5 rounded hover:bg-muted disabled:opacity-40 transition-colors flex items-center justify-center min-w-[28px] h-7"
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

  const handleNoteSelect = (note) => {
    if (isEditing && selectedNote) {
      saveNote().then(() => { setSelectedNote(note); setIsEditing(false); });
    } else {
      setSelectedNote(note);
      setIsEditing(false);
    }
  };

  const getNoteGradient = (color) => `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`;

  useEffect(() => {
    if (editorRef.current && selectedNote) {
      editorRef.current.innerHTML = selectedNote.content || '<p><br></p>';
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
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: FONTS.body }}>
      <div className="mb-4 md:mb-6">
        <h1 className="text-xl md:text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
          <FileText className="size-5 md:size-8 shrink-0" style={{ color: BRAND.blue }} />
          Brewed Notes
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">Create and organize your notes with rich text formatting</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 h-auto lg:h-[calc(100vh-180px)]">
        {/* Sidebar */}
        <div className="w-full lg:w-56 shrink-0 flex flex-col" style={{ backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}` }}>
          <div className="p-3 border-b" style={{ borderColor: theme.cardBorder }}>
            <Button onClick={() => setShowAddModal(true)} className="w-full" style={{ backgroundColor: BRAND.blue }}>
              <Plus className="size-4 mr-2" />Add New Note
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1 max-h-40 lg:max-h-none">
            {notes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">No notes yet.</div>
            ) : notes.map(note => (
              <div
                key={note.id}
                onClick={() => handleNoteSelect(note)}
                className={`group relative p-2.5 rounded-lg cursor-pointer transition-all ${selectedNote?.id === note.id ? 'ring-2' : 'hover:opacity-80'}`}
                style={{ background: getNoteGradient(note.color), borderLeft: `4px solid ${note.color}`, ringColor: note.color }}
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm truncate pr-2" style={{ color: theme.text }}>{note.name}</span>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => { e.stopPropagation(); setNoteToEdit(note); setNewNoteName(note.name); setNewNoteColor(note.color); setShowEditNameModal(true); }} className="p-1 rounded hover:bg-black/10"><Edit3 className="size-3" style={{ color: theme.text }} /></button>
                    <button onClick={(e) => { e.stopPropagation(); setNoteToDelete(note); setShowDeleteModal(true); }} className="p-1 rounded hover:bg-black/10"><Trash2 className="size-3 text-red-500" /></button>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-0.5">{new Date(note.updated_at).toLocaleDateString()}</p>
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
                <select onChange={(e) => applyInlineStyle('fontFamily', e.target.value)} disabled={!isEditing} className="h-7 px-1 text-xs border rounded bg-background disabled:opacity-40" style={{ borderColor: theme.cardBorder, width: '90px' }}>
                  {FONT_FAMILIES.map(f => <option key={f.value} value={f.value}>{f.name}</option>)}
                </select>
                <select onChange={(e) => applyInlineStyle('fontSize', e.target.value)} disabled={!isEditing} className="h-7 px-1 text-xs border rounded bg-background disabled:opacity-40 w-16" style={{ borderColor: theme.cardBorder }}>
                  {FONT_SIZES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>

                <div className="w-px h-5 bg-border mx-0.5" />

                <ToolbarBtn onClick={() => execCmd('bold')} disabled={!isEditing} title="Bold"><Bold className="size-3.5" /></ToolbarBtn>
                <ToolbarBtn onClick={() => execCmd('italic')} disabled={!isEditing} title="Italic"><Italic className="size-3.5" /></ToolbarBtn>
                <ToolbarBtn onClick={() => execCmd('underline')} disabled={!isEditing} title="Underline"><Underline className="size-3.5" /></ToolbarBtn>
                <ToolbarBtn onClick={() => execCmd('strikeThrough')} disabled={!isEditing} title="Strikethrough"><Strikethrough className="size-3.5" /></ToolbarBtn>

                <div className="w-px h-5 bg-border mx-0.5" />

                {/* Text Color */}
                <div className="relative">
                  <ToolbarBtn onClick={() => setShowTextColorPicker(!showTextColorPicker)} disabled={!isEditing} title="Text Color">
                    <div className="flex flex-col items-center"><Type className="size-3.5" /><div className="w-3 h-0.5 rounded" style={{ backgroundColor: '#ef4444' }} /></div>
                  </ToolbarBtn>
                  {showTextColorPicker && isEditing && (
                    <div className="absolute top-full left-0 mt-1 p-2 rounded-lg shadow-lg z-50 grid grid-cols-6 gap-1" style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}>
                      {TEXT_COLORS.map(color => (
                        <button key={color} onMouseDown={(e) => { e.preventDefault(); applyInlineStyle('color', color); setShowTextColorPicker(false); }} className="w-5 h-5 rounded border hover:scale-110 transition-transform" style={{ backgroundColor: color, borderColor: theme.cardBorder }} />
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
                        <button key={color} onMouseDown={(e) => { e.preventDefault(); applyInlineStyle('backgroundColor', color); setShowHighlightPicker(false); }} className="w-5 h-5 rounded border hover:scale-110 transition-transform" style={{ backgroundColor: color, borderColor: theme.cardBorder }} />
                      ))}
                    </div>
                  )}
                </div>

                <div className="w-px h-5 bg-border mx-0.5" />

                <ToolbarBtn onClick={() => execCmd('justifyLeft')} disabled={!isEditing} title="Align Left"><AlignLeft className="size-3.5" /></ToolbarBtn>
                <ToolbarBtn onClick={() => execCmd('justifyCenter')} disabled={!isEditing} title="Center"><AlignCenter className="size-3.5" /></ToolbarBtn>
                <ToolbarBtn onClick={() => execCmd('justifyRight')} disabled={!isEditing} title="Align Right"><AlignRight className="size-3.5" /></ToolbarBtn>

                <div className="w-px h-5 bg-border mx-0.5" />

                <ToolbarBtn onClick={formatAsBulletList} disabled={!isEditing} title="Bullet List"><List className="size-3.5" /></ToolbarBtn>
                <ToolbarBtn onClick={formatAsNumberedList} disabled={!isEditing} title="Numbered List"><ListOrdered className="size-3.5" /></ToolbarBtn>
                <ToolbarBtn onClick={insertChecklist} disabled={!isEditing} title="Checklist"><CheckSquare className="size-3.5" /></ToolbarBtn>

                <div className="w-px h-5 bg-border mx-0.5" />

                <ToolbarBtn onClick={() => formatAsHeading('h1')} disabled={!isEditing} title="Heading 1"><Heading1 className="size-3.5" /></ToolbarBtn>
                <ToolbarBtn onClick={() => formatAsHeading('h2')} disabled={!isEditing} title="Heading 2"><Heading2 className="size-3.5" /></ToolbarBtn>
                <ToolbarBtn onClick={() => formatAsHeading('h3')} disabled={!isEditing} title="Heading 3"><Heading3 className="size-3.5" /></ToolbarBtn>
                <ToolbarBtn onClick={() => formatAsHeading('p')} disabled={!isEditing} title="Paragraph"><span className="text-[10px] font-bold">P</span></ToolbarBtn>

                <div className="ml-auto">
                  {isEditing && (
                    <Button onClick={saveNote} disabled={saving} size="sm" className="h-7 text-xs" style={{ backgroundColor: BRAND.green }}>
                      {saving ? <Loader2 className="size-3 mr-1 animate-spin" /> : <Save className="size-3 mr-1" />}Save
                    </Button>
                  )}
                </div>
              </div>

              {/* Editor Content */}
              <div className="flex-1 overflow-hidden">
                <div
                  ref={editorRef}
                  contentEditable={isEditing}
                  onDoubleClick={handleEditorDoubleClick}
                  className="h-full p-4 overflow-y-auto outline-none"
                  style={{ color: theme.text, fontSize: '15px', lineHeight: '1.7', minHeight: '300px', cursor: isEditing ? 'text' : 'default' }}
                  suppressContentEditableWarning={true}
                />
              </div>

              <div className="px-4 py-2 border-t text-xs text-muted-foreground flex justify-between" style={{ borderColor: theme.cardBorder }}>
                <span>{isEditing ? '✏️ Editing' : '👁️ View mode - Double-click to edit'}</span>
                <span>Saved: {new Date(selectedNote.updated_at).toLocaleString()}</span>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center"><FileText className="size-12 mx-auto mb-3 opacity-20" /><p>Select or create a note</p></div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Plus className="size-5" style={{ color: BRAND.blue }} />Create New Note</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label className="text-sm mb-2 block">Note Name</Label><input type="text" value={newNoteName} onChange={(e) => setNewNoteName(e.target.value)} placeholder="Enter note name..." className="w-full h-10 px-3 border rounded-lg bg-background" style={{ borderColor: theme.cardBorder }} autoFocus /></div>
            <div><Label className="text-sm mb-2 block">Color</Label><div className="grid grid-cols-5 gap-2">{NOTE_COLORS.map(color => (<button key={color.value} onClick={() => setNewNoteColor(color.value)} className={`h-8 rounded-lg transition-all ${newNoteColor === color.value ? 'ring-2 ring-offset-2 scale-105' : 'hover:scale-105'}`} style={{ background: getNoteGradient(color.value), borderLeft: `4px solid ${color.value}`, ringColor: color.value }} title={color.name} />))}</div></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button><Button onClick={createNote} disabled={!newNoteName.trim() || saving} style={{ backgroundColor: BRAND.blue }}>{saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Plus className="size-4 mr-2" />}Create</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showEditNameModal} onOpenChange={setShowEditNameModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Edit3 className="size-5" style={{ color: BRAND.blue }} />Edit Note</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div><Label className="text-sm mb-2 block">Note Name</Label><input type="text" value={newNoteName} onChange={(e) => setNewNoteName(e.target.value)} className="w-full h-10 px-3 border rounded-lg bg-background" style={{ borderColor: theme.cardBorder }} autoFocus /></div>
            <div><Label className="text-sm mb-2 block">Color</Label><div className="grid grid-cols-5 gap-2">{NOTE_COLORS.map(color => (<button key={color.value} onClick={() => setNewNoteColor(color.value)} className={`h-8 rounded-lg transition-all ${newNoteColor === color.value ? 'ring-2 ring-offset-2 scale-105' : 'hover:scale-105'}`} style={{ background: getNoteGradient(color.value), borderLeft: `4px solid ${color.value}`, ringColor: color.value }} />))}</div></div>
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setShowEditNameModal(false)}>Cancel</Button><Button onClick={updateNoteName} disabled={!newNoteName.trim() || saving} style={{ backgroundColor: BRAND.blue }}>{saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Save className="size-4 mr-2" />}Save</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><AlertTriangle className="size-5 text-red-500" />Delete Note?</DialogTitle><DialogDescription>Are you sure you want to delete "<strong>{noteToDelete?.name}</strong>"?</DialogDescription></DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0"><Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button><Button variant="destructive" onClick={deleteNote} disabled={saving}>{saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Trash2 className="size-4 mr-2" />}Delete</Button></DialogFooter>
        </DialogContent>
      </Dialog>

      {(showTextColorPicker || showHighlightPicker) && <div className="fixed inset-0 z-40" onClick={() => { setShowTextColorPicker(false); setShowHighlightPicker(false); }} />}
    </div>
  );
};

export default BrewedNotes;
