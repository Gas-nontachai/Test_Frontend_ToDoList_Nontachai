"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Sparkles, Wand2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Task } from "@/misc/types";
import { useCategory, useTask } from "@/hook/hooks";

interface UpdateTaskProps {
  onClose: () => void;
  onRefresh: () => void;
  open: boolean;
  task_id: string;
}

const emptyTask: Task = {
  task_id: "",
  text: "",
  category: "General",
  completed: false,
  createdAt: new Date(),
  completedAt: undefined,
};

const UpdateTask: React.FC<UpdateTaskProps> = ({
  onClose,
  open,
  onRefresh,
  task_id,
}) => {
  const { getTaskByID, updateTaskBy } = useTask();
  const { getCategoryBy } = useCategory();

  const [task, setTask] = useState<Task>(emptyTask);
  const [categories, setCategories] = useState<string[]>([]);

  const fetchTask = useCallback(async () => {
    if (!task_id) {
      setTask(emptyTask);
      return;
    }
    try {
      const res = await getTaskByID({ task_id });
      setTask(res);
    } catch (error) {
      console.error("Error fetching task:", error);
    }
  }, [getTaskByID, task_id]);

  const fetchCategories = useCallback(async () => {
    try {
      const { docs } = await getCategoryBy();
      setCategories(docs.map((item) => item.category_name));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }, [getCategoryBy]);

  useEffect(() => {
    if (open) {
      fetchTask();
      fetchCategories();
    }
  }, [open, fetchTask, fetchCategories]);

  const selectedCategory = useMemo(() => {
    if (!task.category) return undefined;
    return categories.includes(task.category) ? task.category : undefined;
  }, [task.category, categories]);

  const handleUpdate = async () => {
    if (!task.text.trim()) {
      toast.error("Please provide a task name");
      return;
    }

    try {
      await updateTaskBy(task);
      toast.success("Task updated successfully!");
      onRefresh();
      onClose();
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("Failed to update task", {
        description: "Please try again in a moment.",
      });
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="max-w-lg rounded-3xl border border-primary/20 bg-white/85 p-0 shadow-2xl backdrop-blur">
        <DialogHeader className="space-y-2 rounded-t-3xl bg-gradient-to-r from-pink-100/80 via-amber-100/70 to-sky-100/70 px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Sparkles className="h-5 w-5 text-primary" />
            Edit task
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            Refresh the wording, switch categories, or mark it complete — perfect
            for tidying both everyday and eccentric tasks.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 px-6 py-5">
          <div className="space-y-2">
            <Label htmlFor="update-task-name">Task name</Label>
            <Input
              id="update-task-name"
              value={task.text}
              onChange={(event) =>
                setTask({ ...task, text: event.target.value })
              }
              maxLength={100}
              className="rounded-2xl border-2 border-primary/10 bg-white/80"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{(task.text ?? "").length}/100 characters</span>
              <span>Keep it punchy and fun!</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="update-task-category">Category</Label>
            <Select
              value={selectedCategory}
              onValueChange={(value) => setTask({ ...task, category: value })}
              disabled={categories.length === 0}
            >
              <SelectTrigger
                id="update-task-category"
                className="rounded-2xl border-2 border-primary/10 bg-white/80"
              >
                <SelectValue placeholder="Choose a category" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl border border-primary/20">
                {categories.length === 0 ? (
                  <SelectItem value="__loading" disabled>
                    No categories available
                  </SelectItem>
                ) : (
                  categories.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
              <span>Currently:</span>
              <Badge variant="pastel" className="bg-secondary/70">
                {task.category || "Uncategorized"}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 rounded-2xl border border-primary/10 bg-white/80 px-4 py-3">
            <Checkbox
              id="update-task-completed"
              checked={task.completed}
              onCheckedChange={(checked) => {
                const isChecked = checked === true;
                setTask({
                  ...task,
                  completed: isChecked,
                  completedAt: isChecked ? new Date() : undefined,
                });
              }}
              className="rounded-lg border-primary/40"
            />
            <div className="flex flex-col">
              <Label htmlFor="update-task-completed" className="text-sm">
                Mark as completed
              </Label>
              <span className="text-xs text-muted-foreground">
                Perfect for celebrating progress or undoing it quickly.
              </span>
            </div>
          </div>

          <Alert variant="info" className="flex items-start gap-3">
            <Wand2 className="mt-0.5 h-4 w-4 text-sky-500" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Sprinkle in the context
              </p>
              <p className="text-sm text-muted-foreground">
                Categories like <span className="font-medium">Brain Dump</span>,{" "}
                <span className="font-medium">Dream Projects</span>, or{" "}
                <span className="font-medium">Someday Ideas</span> keep unusual
                tasks organised without losing their charm.
              </p>
            </div>
          </Alert>
        </div>

        <DialogFooter className="gap-2 rounded-b-3xl bg-white/70 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-full border-primary/20 text-primary hover:bg-primary/10"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleUpdate}
            className="rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 hover:bg-primary/80"
          >
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateTask;
