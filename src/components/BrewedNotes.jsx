// BrewedNotes.jsx - Rich Text Notes App using React Quill
import React, { useState, useEffect, useMemo } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { 
  Plus, Trash2, Edit3, Save, FileText, AlertTriangle, Loader2
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

const BrewedNotes = ({ isDark, user }) => {
  const theme = getTheme(isDark);
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [editorContent, setEditorContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditNameModal, setShowEditNameModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [noteToEdit, setNoteToEdit] = useState(null);
  
  const [newNoteName, setNewNoteName] = useState('');
  const [newNoteColor, setNewNoteColor] = useState(NOTE_COLORS[0].value);

  // Quill modules configuration
  const modules = useMemo(() => ({
    toolbar: [
      [{ 'font': [] }],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'align': [] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
      [{ 'header': 1 }, { 'header': 2 }, { 'header': 3 }],
      ['blockquote', 'code-block'],
      ['link', 'image'],
      ['clean']
    ],
  }), []);

  const formats = [
    'font', 'size',
    'bold', 'italic', 'underline', 'strike',
    'color', 'background',
    'align',
    'list', 'bullet', 'check',
    'header',
    'blockquote', 'code-block',
    'link', 'image'
  ];

  useEffect(() => {
    if (user?.id) loadNotes();
  }, [user?.id]);

  useEffect(() => {
    if (selectedNote) {
      setEditorContent(selectedNote.content || '');
    }
  }, [selectedNote?.id]);

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
      if (data?.length > 0 && !selectedNote) {
        setSelectedNote(data[0]);
        setEditorContent(data[0].content || '');
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
      const { data, error } = await supabase.from('brewed_notes').insert([newNote]).select().single();
      if (error) throw error;
      setNotes(prev => [data, ...prev]);
      setSelectedNote(data);
      setEditorContent('');
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
    if (!selectedNote) return;
    try {
      setSaving(true);
      const { error } = await supabase
        .from('brewed_notes')
        .update({ content: editorContent, updated_at: new Date().toISOString() })
        .eq('id', selectedNote.id);
      if (error) throw error;
      setNotes(prev => prev.map(n => n.id === selectedNote.id ? { ...n, content: editorContent, updated_at: new Date().toISOString() } : n));
      setSelectedNote(prev => ({ ...prev, content: editorContent, updated_at: new Date().toISOString() }));
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
        setEditorContent(remaining.length > 0 ? remaining[0].content || '' : '');
      }
      setShowDeleteModal(false);
      setNoteToDelete(null);
    } catch (error) {
      console.error('Error deleting note:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleNoteSelect = async (note) => {
    // Auto-save current note before switching
    if (selectedNote && editorContent !== selectedNote.content) {
      await saveNote();
    }
    setSelectedNote(note);
    setEditorContent(note.content || '');
  };

  const getNoteGradient = (color) => `linear-gradient(135deg, ${color}40 0%, ${color}20 100%)`;

  if (loading) {
    return (
      <div className="p-4 md:p-6 w-full min-h-screen flex items-center justify-center" style={{ backgroundColor: theme.bg }}>
        <Loader2 className="size-8 animate-spin" style={{ color: BRAND.blue }} />
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 w-full min-h-screen" style={{ backgroundColor: theme.bg, fontFamily: FONTS.body }}>
      {/* Custom styles for Quill */}
      <style>{`
        .brewed-notes-editor .ql-toolbar {
          background: ${isDark ? '#1f2937' : '#f9fafb'};
          border-color: ${isDark ? '#374151' : '#e5e7eb'};
          border-radius: 8px 8px 0 0;
        }
        .brewed-notes-editor .ql-container {
          background: ${isDark ? '#111827' : '#ffffff'};
          border-color: ${isDark ? '#374151' : '#e5e7eb'};
          border-radius: 0 0 8px 8px;
          font-size: 15px;
          min-height: 300px;
        }
        .brewed-notes-editor .ql-editor {
          color: ${isDark ? '#f3f4f6' : '#111827'};
          min-height: 300px;
        }
        .brewed-notes-editor .ql-editor.ql-blank::before {
          color: ${isDark ? '#6b7280' : '#9ca3af'};
        }
        .brewed-notes-editor .ql-snow .ql-stroke {
          stroke: ${isDark ? '#9ca3af' : '#374151'};
        }
        .brewed-notes-editor .ql-snow .ql-fill {
          fill: ${isDark ? '#9ca3af' : '#374151'};
        }
        .brewed-notes-editor .ql-snow .ql-picker {
          color: ${isDark ? '#9ca3af' : '#374151'};
        }
        .brewed-notes-editor .ql-snow .ql-picker-options {
          background: ${isDark ? '#1f2937' : '#ffffff'};
          border-color: ${isDark ? '#374151' : '#e5e7eb'};
        }
        .brewed-notes-editor .ql-toolbar button:hover,
        .brewed-notes-editor .ql-toolbar button:focus,
        .brewed-notes-editor .ql-toolbar .ql-picker-label:hover {
          color: ${BRAND.blue};
        }
        .brewed-notes-editor .ql-toolbar button:hover .ql-stroke,
        .brewed-notes-editor .ql-toolbar button:focus .ql-stroke {
          stroke: ${BRAND.blue};
        }
        .brewed-notes-editor .ql-toolbar button:hover .ql-fill,
        .brewed-notes-editor .ql-toolbar button:focus .ql-fill {
          fill: ${BRAND.blue};
        }
        .brewed-notes-editor .ql-snow.ql-toolbar button.ql-active,
        .brewed-notes-editor .ql-snow.ql-toolbar .ql-picker-label.ql-active {
          color: ${BRAND.blue};
        }
        .brewed-notes-editor .ql-snow.ql-toolbar button.ql-active .ql-stroke {
          stroke: ${BRAND.blue};
        }
        .brewed-notes-editor .ql-snow.ql-toolbar button.ql-active .ql-fill {
          fill: ${BRAND.blue};
        }
        .brewed-notes-editor .ql-editor h1 { font-size: 2em; font-weight: bold; margin: 0.5em 0; }
        .brewed-notes-editor .ql-editor h2 { font-size: 1.5em; font-weight: bold; margin: 0.5em 0; }
        .brewed-notes-editor .ql-editor h3 { font-size: 1.17em; font-weight: bold; margin: 0.5em 0; }
        .brewed-notes-editor .ql-editor ul, .brewed-notes-editor .ql-editor ol {
          padding-left: 1.5em;
        }
        .brewed-notes-editor .ql-editor ul[data-checked="true"] > li::before,
        .brewed-notes-editor .ql-editor ul[data-checked="false"] > li::before {
          color: ${BRAND.blue};
        }
      `}</style>

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
        <div className="flex-1 flex flex-col min-h-[500px]" style={{ backgroundColor: theme.cardBg, borderRadius: '12px', border: `1px solid ${theme.cardBorder}` }}>
          {selectedNote ? (
            <>
              {/* Header with Save */}
              <div className="p-3 border-b flex items-center justify-between" style={{ borderColor: theme.cardBorder }}>
                <div>
                  <h2 className="font-semibold" style={{ color: theme.text }}>{selectedNote.name}</h2>
                  <p className="text-xs text-muted-foreground">Last saved: {new Date(selectedNote.updated_at).toLocaleString()}</p>
                </div>
                <Button onClick={saveNote} disabled={saving} size="sm" style={{ backgroundColor: BRAND.green }}>
                  {saving ? <Loader2 className="size-4 mr-1 animate-spin" /> : <Save className="size-4 mr-1" />}
                  Save
                </Button>
              </div>

              {/* Quill Editor */}
              <div className="flex-1 p-3 overflow-hidden brewed-notes-editor">
                <ReactQuill
                  theme="snow"
                  value={editorContent}
                  onChange={setEditorContent}
                  modules={modules}
                  formats={formats}
                  placeholder="Start writing your note..."
                  style={{ height: 'calc(100% - 42px)' }}
                />
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
    </div>
  );
};

export default BrewedNotes;
