import { useState } from "react";
import { Edit, Trash2, Check, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

interface Task {
  id: string;
  title: string;
  is_complete: boolean; // Renamed from 'completed'
  created_at: string;   // Type changed to string for now
  user_identifier: string; // Add this new field
}

interface TaskCardProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newTitle: string) => void;
  onEnhance: (id: string) => void;
}

export function TaskCard({ task, onToggle, onDelete, onEdit, onEnhance }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);

  const handleEdit = () => {
    if (editTitle.trim() && editTitle !== task.title) {
      onEdit(task.id, editTitle.trim());
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEdit();
    } else if (e.key === "Escape") {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const handleToggle = () => {
    onToggle(task.id);
  };

  return (
    <div className={`task-enter group relative bg-card/80 backdrop-blur-sm rounded-xl border border-border/50 p-4 transition-all duration-300 hover:shadow-lg hover:border-border hover:bg-card-hover/80 ${task.is_complete ? 'opacity-75' : ''}`}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/2 to-secondary/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
      
      <div className="relative flex items-center gap-3">
        {/* Checkbox */}
        <div className="relative">
          <Checkbox
            checked={task.is_complete}
            onCheckedChange={handleToggle}
            className="h-5 w-5 rounded-lg transition-all duration-300 data-[state=checked]:bg-success data-[state=checked]:border-success data-[state=checked]:text-success-foreground"
          />
          {task.is_complete && (
            <div className="task-complete">
              <Check className="absolute inset-0 h-5 w-5 text-success-foreground pointer-events-none" />
            </div>
          )}
        </div>

        {/* Task Content */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleEdit}
              className="h-8 text-sm border-none bg-transparent p-0 focus:ring-0 font-medium"
              autoFocus
            />
          ) : (
            <p className={`font-medium transition-all duration-300 ${
              task.is_complete 
                ? 'line-through text-muted-foreground' 
                : 'text-card-foreground'
            }`}>
              {task.title}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {new Date(task.created_at).toLocaleDateString()}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* AI Enhancement Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEnhance(task.id)}
            className="h-8 w-8 p-0 hover:bg-secondary/20 hover:text-secondary transition-colors duration-200"
            title="Enhance with AI"
          >
            <Sparkles className="h-4 w-4" />
          </Button>

          {/* Edit Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setIsEditing(true);
              setEditTitle(task.title);
            }}
            className="h-8 w-8 p-0 hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
          >
            <Edit className="h-4 w-4" />
          </Button>

          {/* Delete Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(task.id)}
            className="h-8 w-8 p-0 hover:bg-destructive/20 hover:text-destructive transition-colors duration-200"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export type { Task };