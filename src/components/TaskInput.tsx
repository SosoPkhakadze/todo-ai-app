import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TaskInputProps {
  onAddTask: (title: string) => void;
}

export function TaskInput({ onAddTask }: TaskInputProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAddTask(title.trim());
      setTitle("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 mb-8">
      <div className="flex-1 relative group">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What's next?"
          className="h-12 text-base bg-card/50 backdrop-blur-sm border-border/50 rounded-xl px-6 transition-all duration-300 focus:ring-2 focus:ring-primary/20 focus:border-primary/30 focus:bg-card group-hover:border-border"
        />
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </div>
      <Button
        type="submit"
        size="lg"
        className="h-12 px-6 rounded-xl bg-gradient-to-r from-primary to-primary-glow hover:from-primary-glow hover:to-primary text-primary-foreground font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
      >
        <Plus className="w-5 h-5 mr-2" />
        Add Task
      </Button>
    </form>
  );
}