"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import {
  Plus,
  RotateCcw,
  Trash2,
  Pencil,
  Stars,
  Sparkles,
} from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Category } from "@/misc/types";
import { useCategory } from "@/hook/hooks";
import { generateID } from "@/utils/generator-id";
import { useConfirmDialog } from "@/components/providers/confirm-dialog-provider";

interface UpdateCategoryProps {
  onClose: () => void;
  onRefresh: () => void;
  open: boolean;
}

const emptyCategory: Category = { category_id: "", category_name: "" };

const quickIdeas = [
  "Self-care",
  "Focus sprint",
  "Brain dump",
  "Weird & wonderful",
  "Errands",
  "Study lab",
];

const ManageCategory: React.FC<UpdateCategoryProps> = ({
  onClose,
  open,
  onRefresh,
}) => {
  const { getCategoryBy, insertCategory, updateCategoryBy, deleteCategoryBy } =
    useCategory();
  const confirmDialog = useConfirmDialog();

  const [categories, setCategories] = useState<Category[]>([]);
  const [category, setCategory] = useState<Category>(emptyCategory);

  const isEditMode = useMemo(
    () => category.category_id !== "",
    [category.category_id]
  );

  const fetchCategory = useCallback(async () => {
    try {
      const { docs } = await getCategoryBy();
      setCategories(docs);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  }, [getCategoryBy]);

  useEffect(() => {
    if (open) {
      fetchCategory();
    }
  }, [open, fetchCategory]);

  const resetForm = () => {
    setCategory(emptyCategory);
  };

  const handleSubmit = async () => {
    const name = category.category_name.trim();

    if (!name) {
      toast.error("Please enter a category name");
      return;
    }

    try {
      const { docs: allCategories } = await getCategoryBy();
      const duplicate = allCategories.find(
        (c) =>
          c.category_name.trim().toLowerCase() === name.toLowerCase() &&
          c.category_id !== category.category_id
      );

      if (duplicate) {
        toast.error("Category already exists", {
          description: "Try another playful name.",
        });
        return;
      }

      if (isEditMode) {
        await updateCategoryBy(category);
        toast.success("Category updated successfully!");
      } else {
        await insertCategory({ ...category, category_id: generateID() });
        toast.success("Category added successfully!");
      }

      await fetchCategory();
      onRefresh();
      resetForm();
    } catch (err) {
      console.error("Error saving category:", err);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = await confirmDialog({
      title: "Delete this category?",
      description: "Tasks won't be removed, but they will lose this tag.",
      confirmText: "Delete",
      cancelText: "Keep it",
      variant: "destructive",
    });

    if (!confirmed) {
      toast.info("Deletion cancelled.", {
        description: "Your category is still available.",
      });
      return;
    }

    try {
      await deleteCategoryBy({ category_id: id });
      await fetchCategory();
      onRefresh();
      toast.success("Category deleted successfully!");
    } catch (error) {
      console.error("Error deleting category:", error);
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
      <DialogContent className="max-w-xl rounded-3xl border border-primary/20 bg-white/85 p-0 shadow-xl backdrop-blur">
        <DialogHeader className="space-y-2 rounded-t-3xl bg-gradient-to-r from-pink-100/80 via-amber-100/70 to-sky-100/70 px-6 py-5">
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <Sparkles className="h-5 w-5 text-primary" />
            Manage categories
          </DialogTitle>
          <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
            Keep things flexible: mix practical groups with playful ones so your
            tasks feel at home — even the unexpected ones.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-5 px-6 py-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              <Stars className="h-4 w-4 text-pink-500" />
              Quick ideas
            </div>
            <div className="flex flex-wrap gap-2">
              {quickIdeas.map((idea) => (
                <Button
                  key={idea}
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="rounded-full bg-white/80 px-3 py-1 text-xs text-foreground shadow-sm hover:bg-primary/10"
                  onClick={() =>
                    setCategory({ category_id: "", category_name: idea })
                  }
                >
                  {idea}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category-name">Category name</Label>
            <div className="flex gap-2">
              <Input
                id="category-name"
                value={category.category_name}
                placeholder="e.g. Personal, Work, Shopping"
                onChange={(event) =>
                  setCategory({
                    ...category,
                    category_name: event.target.value,
                  })
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSubmit();
                  }
                }}
                className="rounded-2xl border-2 border-primary/10 bg-white/80"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={resetForm}
                className="rounded-full border-primary/20 text-primary hover:bg-primary/10"
              >
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">Reset</span>
              </Button>
            </div>
          </div>
          <Button
            type="button"
            onClick={handleSubmit}
            className="w-full gap-2 rounded-full shadow-sm"
            variant={isEditMode ? "secondary" : "default"}
          >
            {isEditMode ? (
              <>
                <Pencil className="h-4 w-4" />
                Save changes
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add category
              </>
            )}
          </Button>

          <Alert variant="playful" className="flex items-start gap-3">
            <Sparkles className="mt-0.5 h-4 w-4 text-pink-500" />
            <div className="space-y-1">
              <p className="text-sm font-semibold text-foreground">
                Weird &amp; wonderful welcome
              </p>
              <p className="text-sm text-muted-foreground">
                Add a catch-all category for experiments, ideas, or anything
                that doesn&apos;t fit yet. You can always rename it later.
              </p>
            </div>
          </Alert>

          <Card className="border border-primary/20">
            <CardContent className="p-0">
              <ScrollArea className="max-h-72">
                <div className="divide-y divide-primary/10">
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <div
                        key={cat.category_id}
                        className="flex items-center justify-between gap-3 px-4 py-3"
                      >
                        <span className="text-sm font-medium text-foreground">
                          {cat.category_name}
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setCategory(cat)}
                            className="gap-1 rounded-full border-primary/20 text-primary hover:bg-primary/10"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            onClick={() => handleDelete(cat.category_id)}
                            className="rounded-full"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">
                              Delete {cat.category_name}
                            </span>
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="p-4 text-sm text-muted-foreground">
                      No categories found.
                    </p>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="rounded-b-3xl bg-white/70 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="rounded-full border-primary/20 text-primary hover:bg-primary/10"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManageCategory;
