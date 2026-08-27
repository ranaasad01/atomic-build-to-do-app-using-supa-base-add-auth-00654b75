"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Plus, Check, Trash2, Edit, X, Circle, CheckCircle, AlertCircle, Loader2, LogOut, User, ClipboardList } from 'lucide-react';
import { Reveal } from "@/components/Reveal";
import { fadeInUp, staggerContainer, scaleIn } from "@/lib/motion";
import { FilterType, Todo } from "@/lib/data";

// ─── Supabase client ─────────────────────────────────────────────────────────
import { createClient, type SupabaseClient, type Session, type RealtimePostgresChangesPayload } from "@/lib/supabase";

const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  const { title, sub } = messages[filter];
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--accent)]/10">
        <ClipboardList className="h-9 w-9 text-[var(--accent)]" />
      </div>
      <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">{title}</h3>
      <p className="mt-1.5 max-w-xs text-sm text-[hsl(var(--muted-foreground))]">{sub}</p>
    </div>
  );
}

// ─── Edit Modal ───────────────────────────────────────────────────────────────
interface EditModalProps {
  todo: Todo;
  onSave: (id: string, title: string) => Promise<void>;
  onClose: () => void;
}
function EditTaskModal({ todo, onSave, onClose }: EditModalProps) {
  const [value, setValue] = useState(todo.title);
  const [saving, setSaving] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSave = async () => {
    const trimmed = value.trim();
    if (!trimmed || trimmed === todo.title) { onClose(); return; }
    setSaving(true);
    await onSave(todo.id, trimmed);
    setSaving(false);
    onClose();
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
    if (e.key === "Escape") onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Edit task"
    >
      <motion.div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="relative z-10 w-full max-w-md rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] p-6 shadow-[0_8px_40px_rgba(0,0,0,0.18)]"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">Edit Task</h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKey}
          className="w-full rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-3 text-sm text-[hsl(var(--foreground))] outline-none ring-[var(--accent)] transition focus:border-[var(--accent)] focus:ring-2"
          placeholder="Task title"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-xl border border-[hsl(var(--border))] px-4 py-2 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !value.trim()}
            className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Save
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Task Card ────────────────────────────────────────────────────────────────
interface TaskCardProps {
  todo: Todo;
  onToggle: (id: string, current: boolean) => Promise<void>;
  onEdit: (todo: Todo) => void;
  onDelete: (id: string) => void;
}
function TaskCard({ todo, onToggle, onEdit, onDelete }: TaskCardProps) {
  const [toggling, setToggling] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleToggle = async () => {
    setToggling(true);
    await onToggle(todo.id, todo.is_completed);
    setToggling(false);
  };

  return (
    <motion.div
      layout
      variants={listItem}
      className={cn(
        "group flex items-center gap-3 rounded-2xl border px-4 py-3.5 transition-all duration-200",
        "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_4px_12px_-4px_rgba(0,0,0,0.08)]",
        todo.is_completed
          ? "border-[hsl(var(--border))] bg-[hsl(var(--muted))]/40"
          : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:border-[var(--accent)]/40"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={handleToggle}
        disabled={toggling}
        aria-label={todo.is_completed ? "Mark incomplete" : "Mark complete"}
        className="flex-shrink-0 text-[hsl(var(--muted-foreground))] transition-colors hover:text-[var(--accent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      >
        {toggling ? (
          <Loader2 className="h-5 w-5 animate-spin text-[var(--accent)]" />
        ) : todo.is_completed ? (
          <CheckCircle className="h-5 w-5 text-[var(--accent)]" />
        ) : (
          <Circle className="h-5 w-5" />
        )}
      </button>

      {/* Title */}
      <span
        className={cn(
          "flex-1 text-sm leading-relaxed",
          todo.is_completed
            ? "text-[hsl(var(--muted-foreground))] line-through"
            : "text-[hsl(var(--foreground))]"
        )}
      >
        {todo.title}
      </span>

      {/* Actions */}
      <div className={cn(
        "flex items-center gap-1 transition-opacity",
        "opacity-0 group-hover:opacity-100 focus-within:opacity-100"
      )}>
        {!todo.is_completed && (
          <button
            onClick={() => onEdit(todo)}
            aria-label="Edit task"
            className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
          >
            <Edit className="h-3.5 w-3.5" />
          </button>
        )}
        {confirmDelete ? (
          <>
            <button
              onClick={() => onDelete(todo.id)}
              aria-label="Confirm delete"
              className="rounded-lg p-1.5 text-red-500 transition-colors hover:bg-red-50"
            >
              <Check className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              aria-label="Cancel delete"
              className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))]"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            aria-label="Delete task"
            className="rounded-lg p-1.5 text-[hsl(var(--muted-foreground))] transition-colors hover:bg-red-50 hover:text-red-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [input, setInput] = useState("");
  const [adding, setAdding] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Auth ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data }: { data: { session: Session | null } }) => {
      setSession(data.session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event: string, session: Session | null) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // ── Fetch todos ───────────────────────────────────────────────────────────
  const fetchTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("todos")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setTodos((data as unknown as Todo[]) ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load todos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  // ── Realtime ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const channel = supabase
      .channel("todos")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "todos" },
        (payload: RealtimePostgresChangesPayload) => {
          if (payload.eventType === "INSERT") {
            const newTodo = payload.new as unknown as Todo;
            setTodos((prev) => [newTodo, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            const updatedTodo = payload.new as unknown as Todo;
            setTodos((prev) =>
              prev.map((t) => (t.id === updatedTodo.id ? updatedTodo : t))
            );
          } else if (payload.eventType === "DELETE") {
            const deletedTodo = payload.old as unknown as Todo;
            setTodos((prev) => prev.filter((t) => t.id !== deletedTodo.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // ── CRUD ──────────────────────────────────────────────────────────────────
  const addTodo = async () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setAdding(true);
    try {
      const { error } = await supabase.from("todos").insert({
        title: trimmed,
        is_completed: false,
        user_id: session?.user?.id ?? "anonymous",
      });
      if (error) throw error;
      setInput("");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to add todo");
    } finally {
      setAdding(false);
    }
  };

  const toggleTodo = async (id: string, current: boolean) => {
    try {
      const { error } = await supabase
        .from("todos")
        .update({ is_completed: !current, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update todo");
    }
  };

  const editTodo = async (id: string, title: string) => {
    try {
      const { error } = await supabase
        .from("todos")
        .update({ title, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to edit todo");
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const { error } = await supabase.from("todos").delete().eq("id", id);
      if (error) throw error;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to delete todo");
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  // ── Derived ───────────────────────────────────────────────────────────────
  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.is_completed;
    if (filter === "completed") return t.is_completed;
    return true;
  });

  const completedCount = todos.filter((t) => t.is_completed).length;
  const totalCount = todos.length;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") addTodo();
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">
      {/* Header */}
      <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--card))]/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--accent)]">
              <ClipboardList className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-[hsl(var(--foreground))] leading-none">My Tasks</h1>
              <p className="mt-0.5 text-xs text-[hsl(var(--muted-foreground))]">
                {completedCount}/{totalCount} completed
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {session && (
              <div className="flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--muted))] px-3 py-1.5">
                <User className="h-3.5 w-3.5 text-[hsl(var(--muted-foreground))]" />
                <span className="text-xs text-[hsl(var(--muted-foreground))] max-w-[120px] truncate">
                  {session.user?.email}
                </span>
              </div>
            )}
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 rounded-full border border-[hsl(var(--border))] px-3 py-1.5 text-xs text-[hsl(var(--muted-foreground))] transition-colors hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">
        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{error}</span>
              <button onClick={() => setError(null)} className="rounded p-0.5 hover:bg-red-100">
                <X className="h-3.5 w-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Add input */}
        <Reveal>
          <div className="mb-6 flex gap-2">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add a new task…"
              className="flex-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] px-4 py-3 text-sm text-[hsl(var(--foreground))] outline-none ring-[var(--accent)] placeholder:text-[hsl(var(--muted-foreground))] transition focus:border-[var(--accent)] focus:ring-2"
            />
            <button
              onClick={addTodo}
              disabled={adding || !input.trim()}
              className="flex items-center gap-2 rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-black transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {adding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
              Add
            </button>
          </div>
        </Reveal>

        {/* Filters */}
        <div className="mb-6 flex gap-1 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--muted))] p-1">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={cn(
                "flex-1 rounded-lg py-1.5 text-xs font-semibold transition-all duration-200",
                filter === f.value
                  ? "bg-[hsl(var(--card))] text-[hsl(var(--foreground))] shadow-[0_1px_4px_rgba(0,0,0,0.08)]"
                  : "text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Task list */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--accent)]" />
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState filter={filter} />
        ) : (
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-2"
          >
            <AnimatePresence initial={false}>
              {filtered.map((todo) => (
                <TaskCard
                  key={todo.id}
                  todo={todo}
                  onToggle={toggleTodo}
                  onEdit={setEditingTodo}
                  onDelete={deleteTodo}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Clear completed */}
        {completedCount > 0 && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={async () => {
                const ids = todos.filter((t) => t.is_completed).map((t) => t.id);
                try {
                  const { error } = await supabase
                    .from("todos")
                    .delete()
                    .in("id", ids);
                  if (error) throw error;
                } catch (e) {
                  setError(e instanceof Error ? e.message : "Failed to clear completed");
                }
              }}
              className="text-xs text-[hsl(var(--muted-foreground))] transition-colors hover:text-red-500"
            >
              Clear completed ({completedCount})
            </button>
          </div>
        )}
      </div>

      {/* Edit modal */}
      <AnimatePresence>
        {editingTodo && (
          <EditTaskModal
            todo={editingTodo}
            onSave={editTodo}
            onClose={() => setEditingTodo(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
