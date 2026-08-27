"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Plus, Check, Trash2, Edit, X, Circle, CheckCircle, AlertCircle, Loader2, LogOut, ClipboardList } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { staggerContainer } from "@/lib/motion";
import type { FilterType, Todo } from "@/lib/data";

// ─── Supabase client (lazy, null-safe) ───────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SupabaseClientType = any;
let _supabase: SupabaseClientType | null = null;

function getSupabase(): SupabaseClientType | null {
  if (_supabase) return _supabase;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { createClient } = require('@supabase/supabase-js');
    _supabase = createClient(url, key);
    return _supabase;
  } catch {
    return null;
  }
}

// ─── Utility ─────────────────────────────────────────────────────────────────
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

// ─── Variants ────────────────────────────────────────────────────────────────
const listItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, x: -20, transition: { duration: 0.2, ease: "easeIn" } },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.94, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.94, y: 12, transition: { duration: 0.2, ease: "easeIn" } },
};

// ─── Filter tabs ─────────────────────────────────────────────────────────────
const FILTERS: { label: string; value: FilterType }[] = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Completed", value: "completed" },
];

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ filter }: { filter: FilterType }) {
  const messages: Record<FilterType, { title: string; sub: string }> = {
    all: { title: "No tasks yet", sub: "Add your first task above to get started." },
    active: { title: "All caught up!", sub: "No active tasks. Time to relax or add something new." },
    completed: { title: "Nothing completed yet", sub: "Finish a task and it will appear here." },
  };
  const { title, sub } = messages[filter] ?? messages.all;
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent)]/10">
        <ClipboardList className="h-9 w-9 text-[var(--accent)]" />
      </div>
      <h3 className="text-lg font-semibold text-[var(--foreground)]">{title}</h3>
      <p className="mt-1.5 max-w-xs text-sm text-[var(--muted-foreground)]">{sub}</p>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
interface EditModalProps {
  todo: Todo;
  onSave: (id: string, title: string) => Promise<void>;
  onClose: () => void;
}

function EditModal({ todo, onSave, onClose }: EditModalProps) {
  const [editTitle, setEditTitle] = useState(todo?.title ?? "");
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function handleSave() {
    const trimmed = editTitle.trim();
    if (!trimmed || trimmed === (todo?.title ?? "")) { onClose(); return; }
    setSaving(true);
    await onSave(todo.id, trimmed);
    setSaving(false);
    onClose();
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") onClose();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl border border-[var(--border)]"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Edit Task</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--border)] transition-colors"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKey}
          className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition"
          placeholder="Task title…"
        />
        <div className="mt-4 flex gap-2 justify-end">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-medium text-[var(--muted-foreground)] hover:bg-[var(--border)] transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !editTitle.trim()}
            className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white hover:bg-[var(--accent)] disabled:opacity-50 transition-colors"
          >
            {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Todo Item ────────────────────────────────────────────────────────────────
interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string, completed: boolean) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEdit: (todo: Todo) => void;
}

function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleToggle() {
    setToggling(true);
    await onToggle(todo.id, !todo.is_completed);
    setToggling(false);
  }

  async function handleDelete() {
    setDeleting(true);
    await onDelete(todo.id);
    setDeleting(false);
  }

  const createdAt = todo.created_at
    ? new Date(todo.created_at).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })
    : "";

  return (
    <motion.li
      variants={listItem}
      layout
      className={cn(
        "group flex items-start gap-3 rounded-2xl border p-4 transition-all duration-200",
        todo.is_completed
          ? "border-[var(--border)] bg-white/60 opacity-70"
          : "border-[var(--border)] bg-white shadow-sm hover:shadow-md"
      )}
    >
      {/* Toggle */}
      <button
        onClick={handleToggle}
        disabled={toggling}
        className="mt-0.5 flex-shrink-0 text-[var(--primary)] hover:text-[var(--accent)] transition-colors disabled:opacity-50"
        aria-label={todo.is_completed ? "Mark incomplete" : "Mark complete"}
      >
        {toggling ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : todo.is_completed ? (
          <CheckCircle className="h-5 w-5" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-sm font-medium leading-snug break-words",
            todo.is_completed
              ? "line-through text-[var(--muted-foreground)]"
              : "text-[var(--foreground)]"
          )}
        >
          {todo.title ?? ""}
        </p>
        {createdAt && (
          <p className="mt-1 text-xs text-[var(--muted-foreground)]">{createdAt}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(todo)}
          className="rounded-lg p-1.5 text-[var(--muted-foreground)] hover:bg-[var(--border)] hover:text-[var(--primary)] transition-colors"
          aria-label="Edit task"
        >
          <Edit className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="rounded-lg p-1.5 text-[var(--muted-foreground)] hover:bg-red-50 hover:text-[var(--destructive)] transition-colors disabled:opacity-50"
          aria-label="Delete task"
        >
          {deleting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
        </button>
      </div>
    </motion.li>
  );
}

// ─── Main Dashboard Page ──────────────────────────────────────────────────────
export default function DashboardPage() {
  const supabase = getSupabase();

  const [session, setSession] = useState<any>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [newTitle, setNewTitle] = useState("");
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const channelRef = useRef<any>(null);

  // ── Auth ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!supabase) { setLoading(false); return; }

    supabase.auth.getSession().then(({ data }: { data: { session: any } }) => {
      setSession(data?.session ?? null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, sess: any) => setSession(sess ?? null)
    );
    return () => subscription?.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Fetch todos ───────────────────────────────────────────────────────────
  const fetchTodos = useCallback(async () => {
    if (!supabase || !session?.user?.id) return;
    const { data, error: err } = await supabase
      .from("todos")
      .select("*")
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false });
    if (err) { setError(err.message ?? "Failed to load tasks."); return; }
    setTodos(Array.isArray(data) ? data : []);
  }, [supabase, session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id) fetchTodos();
  }, [session?.user?.id, fetchTodos]);

  // ── Realtime ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!supabase || !session?.user?.id) return;

    channelRef.current = supabase
      .channel(`todos:${session.user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "todos", filter: `user_id=eq.${session.user.id}` },
        () => fetchTodos()
      )
      .subscribe();

    return () => {
      if (channelRef.current && supabase) supabase.removeChannel(channelRef.current);
    };
  }, [supabase, session?.user?.id, fetchTodos]);

  // ── CRUD ──────────────────────────────────────────────────────────────────
  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = newTitle.trim();
    if (!trimmed || !supabase || !session?.user?.id) return;
    setAdding(true);
    setError(null);
    const { error: err } = await supabase.from("todos").insert({
      title: trimmed,
      user_id: session.user.id,
      is_completed: false,
    });
    if (err) setError(err.message ?? "Failed to add task.");
    else setNewTitle("");
    setAdding(false);
    fetchTodos();
  }

  async function handleToggle(id: string, completed: boolean) {
    if (!supabase) return;
    const { error: err } = await supabase
      .from("todos")
      .update({ is_completed: completed, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (err) setError(err.message ?? "Failed to update task.");
    else fetchTodos();
  }

  async function handleDelete(id: string) {
    if (!supabase) return;
    const { error: err } = await supabase.from("todos").delete().eq("id", id);
    if (err) setError(err.message ?? "Failed to delete task.");
    else fetchTodos();
  }

  async function handleEdit(id: string, title: string) {
    if (!supabase) return;
    const { error: err } = await supabase
      .from("todos")
      .update({ title, updated_at: new Date().toISOString() })
      .eq("id", id);
    if (err) setError(err.message ?? "Failed to update task.");
    else fetchTodos();
  }

  async function handleSignOut() {
    if (!supabase) return;
    await supabase.auth.signOut();
    setSession(null);
    setTodos([]);
  }

  // ── Derived ───────────────────────────────────────────────────────────────
  const safeTodos: Todo[] = Array.isArray(todos) ? todos : [];
  const filtered = safeTodos.filter((t) => {
    if (filter === "active") return !t.is_completed;
    if (filter === "completed") return t.is_completed;
    return true;
  });
  const activeCount = safeTodos.filter((t) => !t.is_completed).length;
  const completedCount = safeTodos.filter((t) => t.is_completed).length;

  // ── Supabase not configured ───────────────────────────────────────────────
  if (!supabase) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-6">
        <div className="max-w-md w-full rounded-2xl border border-[var(--border)] bg-white p-8 shadow-lg text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-[var(--destructive)]" />
          <h1 className="text-xl font-bold text-[var(--foreground)] mb-2">Supabase Not Configured</h1>
          <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
            Please add{" "}
            <code className="rounded bg-[var(--border)] px-1 py-0.5 text-xs font-mono">NEXT_PUBLIC_SUPABASE_URL</code>{" "}
            and{" "}
            <code className="rounded bg-[var(--border)] px-1 py-0.5 text-xs font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>{" "}
            to your{" "}
            <code className="rounded bg-[var(--border)] px-1 py-0.5 text-xs font-mono">.env.local</code>{" "}
            file and restart the dev server.
          </p>
        </div>
      </div>
    );
  }

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
      </div>
    );
  }

  // ── Not authenticated ─────────────────────────────────────────────────────
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] p-6">
        <div className="max-w-md w-full rounded-2xl border border-[var(--border)] bg-white p-8 shadow-lg text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-[var(--accent)]" />
          <h1 className="text-xl font-bold text-[var(--foreground)] mb-2">Sign in required</h1>
          <p className="text-sm text-[var(--muted-foreground)] mb-6">
            Please sign in to access your dashboard.
          </p>
          <a
            href="/auth"
            className="inline-flex items-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white hover:bg-[var(--accent)] transition-colors"
          >
            Go to Sign In
          </a>
        </div>
      </div>
    );
  }

  // ── Dashboard ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[var(--background)] pb-16">
      {/* Header */}
      <div className="sticky top-16 z-40 border-b border-[var(--border)] bg-white/80 backdrop-blur-xl">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div>
            <p className="text-xs text-[var(--muted-foreground)]">
              {session?.user?.email ?? ""}
            </p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              {activeCount} active &middot; {completedCount} completed
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] px-3 py-1.5 text-xs font-medium text-[var(--muted-foreground)] hover:bg-[var(--border)] transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign out
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-8">
        <Reveal>
          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-1">My Tasks</h1>
          <p className="text-sm text-[var(--muted-foreground)] mb-6">Stay organised, stay focused.</p>
        </Reveal>

        {/* Error banner */}
        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-[var(--destructive)]">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto" aria-label="Dismiss error">
              <X className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Add task form */}
        <form onSubmit={handleAdd} className="mb-6 flex gap-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add a new task…"
            className="flex-1 rounded-xl border border-[var(--border)] bg-white px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--ring)] transition shadow-sm"
          />
          <button
            type="submit"
            disabled={adding || !newTitle.trim()}
            className="flex items-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-3 text-sm font-semibold text-white hover:bg-[var(--accent)] disabled:opacity-50 transition-colors shadow-sm"
          >
            {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
            Add
          </button>
        </form>

        {/* Filter tabs */}
        <div className="mb-6 flex gap-1 rounded-xl border border-[var(--border)] bg-white p-1 shadow-sm">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "flex-1 rounded-lg py-2 text-xs font-semibold transition-all duration-200",
                filter === f.value
                  ? "bg-[var(--primary)] text-white shadow"
                  : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Todo list */}
        <motion.ul
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="flex flex-col gap-3"
        >
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <EmptyState key="empty" filter={filter} />
            ) : (
              filtered.map((todo) => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onDelete={handleDelete}
                  onEdit={(t) => setEditingTodo(t)}
                />
              ))
            )}
          </AnimatePresence>
        </motion.ul>
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editingTodo && (
          <EditModal
            key="edit-modal"
            todo={editingTodo}
            onSave={handleEdit}
            onClose={() => setEditingTodo(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
