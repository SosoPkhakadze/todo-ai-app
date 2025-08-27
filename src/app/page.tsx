// src/app/page.tsx

"use client"; // REQUIRED for hooks like useState, useEffect

import { useState, useMemo, useEffect } from "react";
import { Brain } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TaskInput } from "@/components/TaskInput";
import { TaskCard, Task } from "@/components/TaskCard";
import { FilterTabs, FilterType } from "@/components/FilterTabs";
import { useToast } from "@/components/ui/use-toast"; // Correct import path
import { supabase } from "@/lib/supabaseClient";

// NOTE: The Task type is now correctly imported from TaskCard.tsx
// Ensure TaskCard.tsx has the updated type with 'is_complete'

export default function HomePage() { // Renamed from Index to HomePage
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const { toast } = useToast();

  useEffect(() => {
    getTasks();
  }, []);

  // This function can remain the same, it fetches via client-side Supabase client
  async function getTasks() {
    try {
      const userIdentifier = "user@example.com";
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_identifier', userIdentifier)
        .order('created_at', { ascending: false });
      if (error) throw error;
      if (data) setTasks(data);
    } catch (error: any) {
      toast({ title: "Error fetching tasks", description: error.message, variant: "destructive" });
    }
  }

  // UPDATED addTask to call our new Next.js API route
  const addTask = async (title: string) => {
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add task');
      }
      const newTask = await response.json();
      setTasks([newTask, ...tasks]);
      toast({ title: "Task added!", description: "Your new task has been created." });
    } catch (error: any) {
      toast({ title: "Error adding task", description: error.message, variant: "destructive" });
    }
  };

  // The other functions (toggle, delete, edit) can remain the same for now,
  // as they interact directly with Supabase via the client-side helper.
  const toggleTask = async (id: string) => {
    const taskToUpdate = tasks.find(task => task.id === id);
    if (!taskToUpdate) return;
    const newStatus = !taskToUpdate.is_complete;
    const { data, error } = await supabase.from('tasks').update({ is_complete: newStatus }).eq('id', id).select().single();
    if (error) {
      toast({ title: "Error updating task", description: error.message, variant: "destructive" });
    } else if (data) {
      setTasks(tasks.map(task => (task.id === id ? data : task)));
      toast({ title: newStatus ? "Task completed! 🎉" : "Task reopened" });
    }
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      toast({ title: "Error deleting task", description: error.message, variant: "destructive" });
    } else {
      setTasks(tasks.filter(task => task.id !== id));
      toast({ title: "Task deleted" });
    }
  };

  const editTask = async (id: string, newTitle: string) => {
    const { data, error } = await supabase.from('tasks').update({ title: newTitle }).eq('id', id).select().single();
    if (error) {
      toast({ title: "Error updating title", description: error.message, variant: "destructive" });
    } else if (data) {
      setTasks(tasks.map(task => (task.id === id ? data : task)));
      toast({ title: "Task updated" });
    }
  };

  const enhanceTask = (id: string) => {
    toast({ title: "AI Enhancement coming soon!" });
  };
  
  const filteredTasks = useMemo(() => {
    if (filter === 'active') return tasks.filter(t => !t.is_complete);
    if (filter === 'completed') return tasks.filter(t => t.is_complete);
    return tasks;
  }, [tasks, filter]);

  const taskCounts = useMemo(() => ({
    all: tasks.length,
    active: tasks.filter(task => !task.is_complete).length,
    completed: tasks.filter(task => task.is_complete).length,
  }), [tasks]);

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          backgroundImage: `url(/hero-bg.jpg)`, // Corrected path for public folder
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-background/95 via-background/90 to-background/95" />
      <div className="relative z-10">
        <header className="sticky top-0 z-20 backdrop-blur-md bg-background/80 border-b border-border/50">
          <div className="container max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-primary to-primary-glow">
                <Brain className="w-6 h-6 text-primary-foreground" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">AI ToDo</h1>
            </div>
            <ThemeToggle />
          </div>
        </header>
        <main className="container max-w-4xl mx-auto px-6 py-12">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent">
              What's on your mind today?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Organize your thoughts, boost your productivity, and let AI help you achieve more.
            </p>
          </div>
          <TaskInput onAddTask={addTask} />
          <FilterTabs activeFilter={filter} onFilterChange={setFilter} taskCounts={taskCounts} />
          <div className="space-y-3">
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onToggle={toggleTask}
                  onDelete={deleteTask}
                  onEdit={editTask}
                  onEnhance={enhanceTask}
                />
              ))
            ) : (
              <div className="text-center py-16">
                 <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                   <Brain className="w-10 h-10 text-muted-foreground" />
                 </div>
                 <p className="text-xl text-muted-foreground mb-2">
                   {filter === "all" ? "No tasks yet!" : `No ${filter} tasks`}
                 </p>
               </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}