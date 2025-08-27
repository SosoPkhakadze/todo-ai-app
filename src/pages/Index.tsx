// src/pages/Index.tsx

import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Brain } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TaskInput } from "@/components/TaskInput";
import { TaskCard, Task } from "@/components/TaskCard";
import { FilterTabs, FilterType } from "@/components/FilterTabs";
import { useToast } from "@/hooks/use-toast";
import heroBg from "@/assets/hero-bg.jpg";

const Index = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filter, setFilter] = useState<FilterType>("all");
  const { toast } = useToast();

  useEffect(() => {
    getTasks();
  }, []);

  async function getTasks() {
    try {
      const userIdentifier = "user@example.com"; 

      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_identifier', userIdentifier)
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      if (data) {
        setTasks(data);
      }
    } catch (error: any) {
      toast({
        title: "Error fetching tasks",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  // Add new task
  // --- THIS FUNCTION IS NOT YET CONNECTED TO SUPABASE ---
  // --- WE WILL FIX THIS IN THE NEXT STEP ---
  const addTask = async (title: string) => {
    try {
      const userIdentifier = "user@example.com"; // Using the same hardcoded user for now

      // The object we want to insert into the database.
      // Note: We don't need to specify 'id' or 'created_at', the database handles those.
      const newTask = {
        title: title,
        is_complete: false,
        user_identifier: userIdentifier,
      };

      // Call the Supabase client to insert the new task
      const { data, error } = await supabase
        .from('tasks')
        .insert(newTask)
        .select() // This makes Supabase return the newly created row
        .single(); // We expect only one row to be returned

      if (error) {
        throw error; // If there's an error, it will be caught by the catch block
      }
      
      // If the insert is successful, 'data' will contain the new task.
      // We add it to the top of our local state to instantly update the UI.
      if (data) {
        setTasks([data, ...tasks]);
        toast({
          title: "Task added!",
          description: "Your new task has been created successfully.",
        });
      }

    } catch (error: any) {
      toast({
        title: "Error adding task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Toggle task completion
  // --- THIS FUNCTION IS NOT YET CONNECTED TO SUPABASE ---
  const toggleTask = async (id: string) => {
    try {
      // First, find the task in the local state to know its current completion status
      const taskToUpdate = tasks.find(task => task.id === id);
      if (!taskToUpdate) {
        throw new Error("Task not found.");
      }
      
      const newStatus = !taskToUpdate.is_complete;

      // Call the Supabase client to update the specific task
      const { data, error } = await supabase
        .from('tasks')
        .update({ is_complete: newStatus }) // Update the is_complete column
        .eq('id', id) // Find the row where the id matches
        .select() // Return the updated row
        .single(); // We expect only one row back

      if (error) {
        throw error;
      }

      // If the update is successful, update the task in our local state
      // to re-render the UI with the change.
      if (data) {
        setTasks(tasks.map(task => (task.id === id ? data : task)));
        toast({
          title: newStatus ? "Task completed! 🎉" : "Task reopened",
          description: newStatus 
            ? "Great job on finishing this task!" 
            : "Task moved back to active.",
        });
      }

    } catch (error: any) {
      toast({
        title: "Error updating task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Delete task
  // --- THIS FUNCTION IS NOT YET CONNECTED TO SUPABASE ---
  const deleteTask = async (id: string) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete() // The delete command
        .eq('id', id); // Specify which row to delete

      if (error) {
        throw error;
      }

      // If deletion is successful, update the local state to remove the task
      setTasks(tasks.filter(task => task.id !== id));
      toast({
        title: "Task deleted",
        description: "The task has been removed from your list.",
      });

    } catch (error: any) {
      toast({
        title: "Error deleting task",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Edit task
  // --- THIS FUNCTION IS NOT YET CONNECTED TO SUPABASE ---
  const editTask = async (id: string, newTitle: string) => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update({ title: newTitle }) // Update the title column
        .eq('id', id) // Where the id matches
        .select()
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        // Update the local state to reflect the change immediately
        setTasks(tasks.map(task => (task.id === id ? data : task)));
        toast({
          title: "Task updated",
          description: "Your task has been successfully updated.",
        });
      }
    } catch (error: any)      {
      toast({
        title: "Error updating title",
        description: error.message,
        variant: "destructive",
      });
    }
  };


  // AI Enhancement placeholder
  const enhanceTask = (id: string) => {
    const task = tasks.find(t => t.id === id);
    toast({
      title: "AI Enhancement Coming Soon! ✨",
      description: `AI will help improve: "${task?.title}"`,
    });
  };

  // --- CORRECTION START ---
  // Filter tasks - UPDATED to use 'is_complete'
  const filteredTasks = useMemo(() => {
    switch (filter) {
      case "active":
        return tasks.filter(task => !task.is_complete);
      case "completed":
        return tasks.filter(task => task.is_complete);
      default:
        return tasks;
    }
  }, [tasks, filter]);

  // Task counts for filter tabs - UPDATED to use 'is_complete'
  const taskCounts = useMemo(() => ({
    all: tasks.length,
    active: tasks.filter(task => !task.is_complete).length,
    completed: tasks.filter(task => task.is_complete).length,
  }), [tasks]);
  // --- CORRECTION END ---

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div 
        className="absolute inset-0 opacity-30 dark:opacity-20"
        style={{
          backgroundImage: `url(${heroBg})`,
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

          <FilterTabs
            activeFilter={filter}
            onFilterChange={setFilter}
            taskCounts={taskCounts}
          />

          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted/50 flex items-center justify-center">
                  <Brain className="w-10 h-10 text-muted-foreground" />
                </div>
                <p className="text-xl text-muted-foreground mb-2">
                  {filter === "all" ? "No tasks yet!" : `No ${filter} tasks`}
                </p>
                <p className="text-sm text-muted-foreground">
                  {filter === "all" 
                    ? "Add your first task above to get started."
                    : `Switch to "All" to see your other tasks.`
                  }
                </p>
              </div>
            ) : (
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
            )}
          </div>
        </main>

        <footer className="relative z-10 mt-20 border-t border-border/50 bg-card/30 backdrop-blur-sm">
          <div className="container max-w-4xl mx-auto px-6 py-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Powered by <span className="font-medium text-primary">Next.js</span> + 
                <span className="font-medium text-secondary mx-1">Supabase</span> + 
                <span className="font-medium text-success"> N8N</span>
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Built with modern web technologies for the best experience
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;