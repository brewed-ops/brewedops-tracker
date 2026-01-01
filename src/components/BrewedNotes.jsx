// BrewedNotes.jsx - Rich Text Notes App for BrewedOps
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Plus, Trash2, Edit3, Save, FileText, AlertTriangle, Palette,
  Bold, Italic, Underline, Strikethrough, List, ListOrdered, CheckSquare,
  AlignLeft, AlignCenter, AlignRight, Type, Heading1, Heading2, Heading3,
  MoreVertical, X, Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { getTheme } from '../lib/theme';
import { supabase } from '../lib/supabase';

const BRAND = { brown: '#3F200C', blue: '#004AAC', green: '#51AF43', cream: '#FFF0D4' };
const FONTS = { heading: "'Montserrat', sans-serif", body: "'Poppins', sans-serif" };

// Predefined colors for notes
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

// Font families
const FONT_FAMILIES = [
  { name: 'Calibri', value: 'Calibri, sans-serif' },
  { name: 'Arial', value: 'Arial, sans-serif' },
  { name: 'Times New Roman', value: 'Times New Roman, serif' },
  { name: 'Georgia', value: 'Georgia, serif' },
  { name: 'Verdana', value: 'Verdana, sans-serif' },
  { name: 'Courier New', value: 'Courier New, monospace' },
];

// Font sizes
const FONT_SIZES = [10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48];

// Text colors
const TEXT_COLORS = [
  '#000000', '#374151', '#6b7280', '#ef4444', '#f97316', '#eab308',
  '#22c55e', '#14b8a6', '#3b82f6', '#8b5cf6', '#ec4899', '#ffffff'
];

const BrewedNotes = ({ isDark, user }) => {
  const theme = getTheme(isDark);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [noteToEdit, setNoteToEdit] = useState(null);
  
  // New note form
  const [newNoteName, setNewNoteName] = useState('');
  const [newNoteColor, setNewNoteColor] = useState(NOTE_COLORS[0].value);
  
  // Editor state
  const [fontSize, setFontSize] = useState(14);
  const [fontFamily, setFontFamily] = useState(FONT_FAMILIES[0].value);
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  const editorRef = useRef(null);

  // Load notes from Supabase
  useEffect(() => {
    if (user?.id) {
      loadNotes();
    }
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
      
      // Select first note if exists
      if (data && data.length > 0 && !selectedNote) {
        setSelectedNote(data[0]);
      }
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

      const { data, error } = await supabase
        .from('brewed_notes')
        .insert([newNote])
        .select()
        .single();

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
        .update({ 
          content, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', selectedNote.id);

      if (error) throw error;
      
      setNotes(prev => prev.map(n => 
        n.id === selectedNote.id ? { ...n, content, updated_at: new Date().toISOString() } : n
      ));
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
      const { error } = await supabase
        .from('brewed_notes')
        .update({ 
          name: newNoteName.trim(),
          color: newNoteColor,
          updated_at: new Date().toISOString() 
        })
        .eq('id', noteToEdit.id);

      if (error) throw error;
      
      setNotes(prev => prev.map(n => 
        n.id === noteToEdit.id ? { ...n, name: newNoteName.trim(), color: newNoteColor } : n
      ));
      if (selectedNote?.id === noteToEdit.id) {
        setSelectedNote(prev => ({ ...prev, name: newNoteName.trim(), color: newNoteColor }));
      }
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
      const { error } = await supabase
        .from('brewed_notes')
        .delete()
        .eq('id', noteToDelete.id);

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

  // Editor commands
  const execCommand = (command, value = null) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const formatBlock = (tag) => {
    execCommand('formatBlock', tag);
  };

  const handleEditorDoubleClick = () => {
    if (!isEditing && selectedNote) {
      setIsEditing(true);
    }
  };

  const handleNoteSelect = (note) => {
    if (isEditing && selectedNote) {
      // Auto-save before switching
      saveNote().then(() => {
        setSelectedNote(note);
        setIsEditing(false);
      });
    } else {
      setSelectedNote(note);
      setIsEditing(false);
    }
  };

  const openEditModal = (note, e) => {
    e.stopPropagation();
    setNoteToEdit(note);
    setNewNoteName(note.name);
    setNewNoteColor(note.color);
    setShowEditNameModal(true);
  };

  const openDeleteModal = (note, e) => {
    e.stopPropagation();
    setNoteToDelete(note);
    setShowDeleteModal(true);
  };

  const getNoteGradient = (color) => {
    return `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`;
  };

  if (loading) {
    return (
      <div className="p-4 md:p-6 w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.bg }}>
        <Loader2 className="size-8 animate-spin" style={{ color: BRAND.blue }} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: FONTS.body }}>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl md:text-3xl font-bold mb-1 flex items-center gap-2" style={{ color: theme.text, fontFamily: FONTS.heading }}>
          <FileText className="size-5 md:size-8 shrink-0" style={{ color: BRAND.blue }} />
          Brewed Notes
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground">Create and organize your notes with rich text formatting</p>
      </div>

      <div className="flex gap-4 h-[calc(100vh-180px)]">
        {/* Notes Sidebar */}
        <div className="w-64 shrink-0 flex flex-col" style={{ backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}` }}>
          {/* Add Note Button */}
          <div className="p-3 border-b" style={{ borderColor: theme.cardBorder }}>
            <Button 
              onClick={() => setShowAddModal(true)} 
              className="w-full" 
              style={{ backgroundColor: BRAND.blue }}
            >
              <Plus className="size-4 mr-2" />
              Add New Note
            </Button>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {notes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No notes yet.<br />Create your first note!
              </div>
            ) : (
              notes.map(note => (
                <div
                  key={note.id}
                  onClick={() => handleNoteSelect(note)}
                  className={`group relative p-3 rounded-lg cursor-pointer transition-all ${
                    selectedNote?.id === note.id ? 'ring-2' : 'hover:opacity-80'
                  }`}
                  style={{
                    background: getNoteGradient(note.color),
                    borderLeft: `4px solid ${note.color}`,
                    ringColor: note.color
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm truncate pr-2" style={{ color: theme.text }}>
                      {note.name}
                    </span>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => openEditModal(note, e)}
                        className="p-1 rounded hover:bg-black/10"
                        title="Edit"
                      >
                        <Edit3 className="size-3.5" style={{ color: theme.text }} />
                      </button>
                      <button
                        onClick={(e) => openDeleteModal(note, e)}
                        className="p-1 rounded hover:bg-black/10"
                        title="Delete"
                      >
                        <Trash2 className="size-3.5 text-red-500" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(note.updated_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 flex flex-col" style={{ backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}` }}>
          {selectedNote ? (
            <>
              {/* Toolbar */}
              <div className="p-2 border-b flex flex-wrap items-center gap-1" style={{ borderColor: theme.cardBorder }}>
                {/* Font Family */}
                <select
                  value={fontFamily}
                  onChange={(e) => {
                    setFontFamily(e.target.value);
                    execCommand('fontName', e.target.value);
                  }}
                  disabled={!isEditing}
                  className="h-8 px-2 text-xs border rounded bg-background"
                  style={{ borderColor: theme.cardBorder, minWidth: '100px' }}
                >
                  {FONT_FAMILIES.map(f => (
                    <option key={f.value} value={f.value}>{f.name}</option>
                  ))}
                </select>

                {/* Font Size */}
                <select
                  value={fontSize}
                  onChange={(e) => {
                    setFontSize(Number(e.target.value));
                    execCommand('fontSize', '7');
                    // Apply custom size via style
                    const selection = window.getSelection();
                    if (selection.rangeCount > 0) {
                      const range = selection.getRangeAt(0);
                      const span = document.createElement('span');
                      span.style.fontSize = `${e.target.value}px`;
                      range.surroundContents(span);
                    }
                  }}
                  disabled={!isEditing}
                  className="h-8 px-2 text-xs border rounded bg-background w-16"
                  style={{ borderColor: theme.cardBorder }}
                >
                  {FONT_SIZES.map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Text Formatting */}
                <button
                  onClick={() => execCommand('bold')}
                  disabled={!isEditing}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-50"
                  title="Bold"
                >
                  <Bold className="size-4" />
                </button>
                <button
                  onClick={() => execCommand('italic')}
                  disabled={!isEditing}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-50"
                  title="Italic"
                >
                  <Italic className="size-4" />
                </button>
                <button
                  onClick={() => execCommand('underline')}
                  disabled={!isEditing}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-50"
                  title="Underline"
                >
                  <Underline className="size-4" />
                </button>
                <button
                  onClick={() => execCommand('strikeThrough')}
                  disabled={!isEditing}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-50"
                  title="Strikethrough"
                >
                  <Strikethrough className="size-4" />
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Text Color */}
                <div className="relative">
                  <button
                    onClick={() => setShowColorPicker(!showColorPicker)}
                    disabled={!isEditing}
                    className="p-1.5 rounded hover:bg-muted disabled:opacity-50 flex items-center gap-1"
                    title="Text Color"
                  >
                    <Type className="size-4" />
                    <div className="w-4 h-1 rounded" style={{ backgroundColor: '#000' }} />
                  </button>
                  {showColorPicker && isEditing && (
                    <div 
                      className="absolute top-full left-0 mt-1 p-2 rounded-lg shadow-lg z-50 grid grid-cols-6 gap-1"
                      style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
                    >
                      {TEXT_COLORS.map(color => (
                        <button
                          key={color}
                          onClick={() => {
                            execCommand('foreColor', color);
                            setShowColorPicker(false);
                          }}
                          className="w-6 h-6 rounded border hover:scale-110 transition-transform"
                          style={{ backgroundColor: color, borderColor: theme.cardBorder }}
                        />
                      ))}
                    </div>
                  )}
                </div>

                {/* Background Color */}
                <div className="relative">
                  <button
                    onClick={() => {
                      const color = prompt('Enter background color (e.g., #ffff00 or yellow):');
                      if (color) execCommand('hiliteColor', color);
                    }}
                    disabled={!isEditing}
                    className="p-1.5 rounded hover:bg-muted disabled:opacity-50"
                    title="Highlight Color"
                  >
                    <Palette className="size-4" />
                  </button>
                </div>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Alignment */}
                <button
                  onClick={() => execCommand('justifyLeft')}
                  disabled={!isEditing}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-50"
                  title="Align Left"
                >
                  <AlignLeft className="size-4" />
                </button>
                <button
                  onClick={() => execCommand('justifyCenter')}
                  disabled={!isEditing}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-50"
                  title="Align Center"
                >
                  <AlignCenter className="size-4" />
                </button>
                <button
                  onClick={() => execCommand('justifyRight')}
                  disabled={!isEditing}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-50"
                  title="Align Right"
                >
                  <AlignRight className="size-4" />
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Lists */}
                <button
                  onClick={() => execCommand('insertUnorderedList')}
                  disabled={!isEditing}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-50"
                  title="Bullet List"
                >
                  <List className="size-4" />
                </button>
                <button
                  onClick={() => execCommand('insertOrderedList')}
                  disabled={!isEditing}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-50"
                  title="Numbered List"
                >
                  <ListOrdered className="size-4" />
                </button>
                <button
                  onClick={() => {
                    const checkbox = '<input type="checkbox" style="margin-right: 8px;" />';
                    execCommand('insertHTML', checkbox);
                  }}
                  disabled={!isEditing}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-50"
                  title="Checklist"
                >
                  <CheckSquare className="size-4" />
                </button>

                <div className="w-px h-6 bg-border mx-1" />

                {/* Headings */}
                <button
                  onClick={() => formatBlock('h1')}
                  disabled={!isEditing}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-50"
                  title="Heading 1"
                >
                  <Heading1 className="size-4" />
                </button>
                <button
                  onClick={() => formatBlock('h2')}
                  disabled={!isEditing}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-50"
                  title="Heading 2"
                >
                  <Heading2 className="size-4" />
                </button>
                <button
                  onClick={() => formatBlock('h3')}
                  disabled={!isEditing}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-50"
                  title="Heading 3"
                >
                  <Heading3 className="size-4" />
                </button>
                <button
                  onClick={() => formatBlock('p')}
                  disabled={!isEditing}
                  className="p-1.5 rounded hover:bg-muted disabled:opacity-50 text-xs font-medium"
                  title="Normal Text"
                >
                  P
                </button>

                {/* Save Button */}
                <div className="ml-auto">
                  {isEditing && (
                    <Button
                      onClick={saveNote}
                      disabled={saving}
                      size="sm"
                      style={{ backgroundColor: BRAND.green }}
                    >
                      {saving ? <Loader2 className="size-4 mr-1 animate-spin" /> : <Save className="size-4 mr-1" />}
                      Save
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
                  style={{
                    color: theme.text,
                    fontSize: '14px',
                    lineHeight: '1.6',
                    minHeight: '100%',
                    cursor: isEditing ? 'text' : 'default'
                  }}
                  dangerouslySetInnerHTML={{ __html: selectedNote.content || '' }}
                  suppressContentEditableWarning={true}
                />
              </div>

              {/* Status Bar */}
              <div className="px-4 py-2 border-t text-xs text-muted-foreground flex justify-between" style={{ borderColor: theme.cardBorder }}>
                <span>{isEditing ? '✏️ Editing - Double-click to edit' : '👁️ View mode - Double-click to edit'}</span>
                <span>Last saved: {new Date(selectedNote.updated_at).toLocaleString()}</span>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <FileText className="size-16 mx-auto mb-4 opacity-20" />
                <p>Select a note or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Note Modal */}
      <Dialog open={showAddModal} onOpenChange={setShowAddModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Plus className="size-5" style={{ color: BRAND.blue }} />
              Create New Note
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm mb-2 block">Note Name</Label>
              <input
                type="text"
                value={newNoteName}
                onChange={(e) => setNewNoteName(e.target.value)}
                placeholder="Enter note name..."
                className="w-full h-10 px-3 border rounded-lg bg-background"
                style={{ borderColor: theme.cardBorder }}
                autoFocus
              />
            </div>
            <div>
              <Label className="text-sm mb-2 block">Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {NOTE_COLORS.map(color => (
                  <button
                    key={color.value}
                    onClick={() => setNewNoteColor(color.value)}
                    className={`h-10 rounded-lg transition-all ${newNoteColor === color.value ? 'ring-2 ring-offset-2 scale-105' : 'hover:scale-105'}`}
                    style={{ 
                      background: getNoteGradient(color.value),
                      borderLeft: `4px solid ${color.value}`,
                      ringColor: color.value
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddModal(false)}>Cancel</Button>
            <Button 
              onClick={createNote} 
              disabled={!newNoteName.trim() || saving}
              style={{ backgroundColor: BRAND.blue }}
            >
              {saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Plus className="size-4 mr-2" />}
              Create Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Note Name Modal */}
      <Dialog open={showEditNameModal} onOpenChange={setShowEditNameModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit3 className="size-5" style={{ color: BRAND.blue }} />
              Edit Note
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <Label className="text-sm mb-2 block">Note Name</Label>
              <input
                type="text"
                value={newNoteName}
                onChange={(e) => setNewNoteName(e.target.value)}
                placeholder="Enter note name..."
                className="w-full h-10 px-3 border rounded-lg bg-background"
                style={{ borderColor: theme.cardBorder }}
                autoFocus
              />
            </div>
            <div>
              <Label className="text-sm mb-2 block">Color</Label>
              <div className="grid grid-cols-5 gap-2">
                {NOTE_COLORS.map(color => (
                  <button
                    key={color.value}
                    onClick={() => setNewNoteColor(color.value)}
                    className={`h-10 rounded-lg transition-all ${newNoteColor === color.value ? 'ring-2 ring-offset-2 scale-105' : 'hover:scale-105'}`}
                    style={{ 
                      background: getNoteGradient(color.value),
                      borderLeft: `4px solid ${color.value}`,
                      ringColor: color.value
                    }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditNameModal(false)}>Cancel</Button>
            <Button 
              onClick={updateNoteName} 
              disabled={!newNoteName.trim() || saving}
              style={{ backgroundColor: BRAND.blue }}
            >
              {saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Save className="size-4 mr-2" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="size-5 text-red-500" />
              Delete Note?
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "<strong>{noteToDelete?.name}</strong>"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={deleteNote}
              disabled={saving}
            >
              {saving ? <Loader2 className="size-4 mr-2 animate-spin" /> : <Trash2 className="size-4 mr-2" />}
              Delete Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Click outside color picker to close */}
      {showColorPicker && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowColorPicker(false)}
        />
      )}
    </div>
  );
};

export default BrewedNotes;
