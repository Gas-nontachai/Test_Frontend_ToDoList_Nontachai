"use client";

import React, { useMemo } from "react";
import {
  ArrowDownNarrowWide,
  ArrowUpNarrowWide,
  CheckCircle2,
  Edit2,
  Eye,
  EyeOff,
  Lightbulb,
  Loader2,
  PartyPopper,
  Plus,
  RotateCcw,
  Search,
  Settings2,
  Stars,
  Trash2,
} from "lucide-react";

import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import ManageCategory from "@/app/components/Task/ManageCategory";
import UpdateTask from "@/app/components/Task/Update";
import { useTodoList } from "@/hook/hooks";
import { formatDate } from "@/utils/date-helper";
import { ThemeToggle } from "@/components/ui/theme-toggle";

type Template = { label: string; text: string; category: string };

const cuteTemplates: Template[] = [
  {
    label: "Morning glow-up",
    text: "Stretch, drink water, and review today's wins",
    category: "Self-care",
  },
  {
    label: "Focus sprint",
    text: "Deep work session for priority project",
    category: "Work",
  },
  {
    label: "Tiny tidy",
    text: "Clear the workspace for 10 minutes",
    category: "Home",
  },
  {
    label: "Check-in",
    text: "Send a thoughtful message to a teammate/friend",
    category: "Relationships",
  },
];

const playfulPrompts = [
  "Need to log routines, ideas, or experiments? Create a playful category and go wild.",
  "Have an oddball task? Tag it with 'Weird & Wonderful' so you never lose it.",
  "Use categories like 'Errands', 'Brain dump', or 'Ideas' to support any workflow.",
];

const TodoListPage: React.FC = () => {
  const {
    loading,
    show_completed,
    setShowCompleted,
    open_update,
    setOpenUpdate,
    open_manage_category,
    setOpenManageCategory,
    task,
    setTask,
    selected_task_id,
    search_query,
    setSearchQuery,
    sort_order,
    filter_category,
    setFilterCategory,
    task_category_option,
    incomplete_tasks,
    completed_tasks,
    fetchTasks,
    fetchCategory,
    addTask,
    deleteTask,
    toggleTaskCompletion,
    handleEdit,
    toggleSort,
    clearFilters,
  } = useTodoList();

  const selectedCategory = useMemo(() => {
    if (!task.category) return undefined;
    return task_category_option.includes(task.category)
      ? task.category
      : undefined;
  }, [task.category, task_category_option]);

  const filterSelectedCategory = useMemo(() => {
    if (!filter_category || filter_category === "All") return "All";
    return task_category_option.includes(filter_category)
      ? filter_category
      : "All";
  }, [filter_category, task_category_option]);

  const quickFilters = useMemo(() => {
    const base = ["All"];
    const uniqueCategories = Array.from(new Set(task_category_option)).slice(
      0,
      6
    );
    return [...base, ...uniqueCategories];
  }, [task_category_option]);

  const showCategoryReminder = task_category_option.length === 0;

  const handleTemplateClick = (template: Template) => {
    const fallbackCategory =
      task_category_option[0] ?? task.category ?? template.category;
    const categoryToUse = task_category_option.includes(template.category)
      ? template.category
      : fallbackCategory;
    setTask((prev) => ({
      ...prev,
      text: template.text,
      category: categoryToUse,
    }));
  };

  return (
    <main className="min-h-screen pb-16 pt-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 md:px-8">
        <div className="flex w-full justify-end">
          <ThemeToggle />
        </div>
        <section className="relative overflow-hidden rounded-3xl border border-white/50 bg-gradient-to-r from-pink-100/90 via-amber-100/80 to-sky-100/80 p-6 shadow-xl md:p-10">
          <div className="absolute -right-16 -top-20 h-48 w-48 rounded-full bg-white/40 blur-3xl" />
          <div className="absolute -bottom-16 right-10 h-56 w-56 rounded-full bg-pink-200/30 blur-3xl" />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-4">
              <Badge variant="pastel" className="bg-white/70 backdrop-blur">
                Sweet &amp; focused productivity
              </Badge>
              <h1 className="text-3xl font-semibold text-foreground drop-shadow-sm md:text-4xl">
                Organise every kind of task with a cheerful flow ✨
              </h1>
              <p className="max-w-lg text-sm leading-relaxed text-muted-foreground md:text-base">
                Capture reminders, plan adventures, or log experiments. TeamZ
                Tasks flexes for personal to-do&apos;s, team standups, or even
                your weirdest edge cases. Colourful, responsive, and kind to your
                brain.
              </p>
              <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-3 py-1">
                  <PartyPopper className="h-3.5 w-3.5 text-pink-500" />
                  Bright &amp; friendly UI
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/60 px-3 py-1">
                  <Stars className="h-3.5 w-3.5 text-amber-500" />
                  Built for many workflows
                </span>
              </div>
            </div>
            <div className="flex flex-col items-start gap-3 rounded-3xl bg-white/70 p-5 shadow-lg backdrop-blur">
              <p className="text-sm font-medium text-foreground">
                Try a quick template
              </p>
              <div className="grid gap-2">
                {cuteTemplates.map((template) => (
                  <Button
                    key={template.label}
                    type="button"
                    variant="secondary"
                    onClick={() => handleTemplateClick(template)}
                    className="justify-start gap-2 rounded-full bg-white/90 text-foreground shadow-md transition hover:bg-primary/20 hover:text-primary"
                  >
                    <Stars className="h-4 w-4 text-pink-500" />
                    <span className="text-sm font-semibold">
                      {template.label}
                    </span>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <Card className="border-primary/15 bg-white/80 backdrop-blur">
              <CardHeader className="space-y-1 pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Plus className="h-5 w-5 text-primary" />
                  Create something delightful
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Keep descriptions short and sweet. Categories help you group
                  different use cases — routines, study, errands, anything.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="new-task">Task name</Label>
                  <Input
                    id="new-task"
                    placeholder="Add something you need to get done…"
                    value={task.text}
                    maxLength={100}
                    onChange={(event) =>
                      setTask({ ...task, text: event.target.value })
                    }
                    onKeyUp={(event) => {
                      if (event.key === "Enter") {
                        addTask();
                      }
                    }}
                    className="rounded-2xl border-2 border-primary/10 bg-white/70 focus-visible:border-primary/40 focus-visible:ring-primary/40"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{(task.text ?? "").length}/100 characters</span>
                    {task.text.length >= 100 ? (
                      <span className="text-destructive">
                        You have reached the limit
                      </span>
                    ) : (
                      <span>Press Enter to add quickly</span>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="task-category">Category</Label>
                    <Select
                      value={selectedCategory}
                      onValueChange={(value) =>
                        setTask((prev) => ({ ...prev, category: value }))
                      }
                      disabled={task_category_option.length === 0}
                    >
                      <SelectTrigger
                        id="task-category"
                        className="rounded-2xl border-2 border-primary/10 bg-white/80"
                      >
                        <SelectValue
                          placeholder={
                            task_category_option.length === 0
                              ? "Add a category below"
                              : "Choose a category"
                          }
                        />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border border-primary/20">
                        {task_category_option.length === 0 ? (
                          <SelectItem value="__loading" disabled>
                            No categories available
                          </SelectItem>
                        ) : (
                          task_category_option.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      type="button"
                      className="w-full gap-2 rounded-full bg-primary text-primary-foreground shadow-md shadow-primary/30 transition hover:bg-primary/80 sm:w-auto"
                      onClick={addTask}
                    >
                      <Plus className="h-4 w-4" />
                      Add task
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Quick category picks:
                  </span>
                  {quickFilters.map((option) => (
                    <Button
                      key={option}
                      type="button"
                      variant={option === filterSelectedCategory ? "default" : "secondary"}
                      size="sm"
                      className={`rounded-full px-3 py-1 text-xs ${
                        option === filterSelectedCategory
                          ? "bg-primary text-primary-foreground shadow"
                          : "bg-white/70 text-foreground shadow-sm hover:bg-primary/10"
                      }`}
                      onClick={() => setFilterCategory(option)}
                    >
                      {option}
                    </Button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setOpenManageCategory(true)}
                  className="w-full justify-center gap-2 rounded-full border-primary/30 bg-white/80 text-primary hover:bg-primary/10"
                >
                  <Settings2 className="h-4 w-4" />
                  Manage categories
                </Button>

                {showCategoryReminder ? (
                  <Alert variant="playful" className="flex items-start gap-3">
                    <Lightbulb className="mt-0.5 h-4 w-4 text-amber-500" />
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground">
                        Heads up! No categories yet.
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Create a few like <span className="font-medium">Study</span>,{" "}
                        <span className="font-medium">Chores</span>, or{" "}
                        <span className="font-medium">Fun ideas</span> so you can
                        filter different use cases with ease.
                      </p>
                    </div>
                  </Alert>
                ) : null}
              </CardContent>
            </Card>

            <Card className="border-primary/10 bg-white/80 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Search className="h-5 w-5 text-primary" />
                  Find &amp; organise
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="task-search">Search</Label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                      id="task-search"
                      placeholder="Type keywords then press Enter"
                      value={search_query}
                      onChange={(event) => setSearchQuery(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          fetchTasks();
                        }
                      }}
                      className="flex-1 rounded-2xl border-2 border-primary/10 bg-white/70"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={fetchTasks}
                      className="gap-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20 sm:w-auto"
                    >
                      <Search className="h-4 w-4" />
                      Search
                    </Button>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="category-filter">Filter by category</Label>
                    <Select
                      value={filterSelectedCategory}
                      onValueChange={(value) => setFilterCategory(value)}
                    >
                      <SelectTrigger className="rounded-2xl border-2 border-primary/10 bg-white/80">
                        <SelectValue placeholder="All categories" />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border border-primary/20">
                        <SelectItem value="All">All</SelectItem>
                        {task_category_option.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Sort</Label>
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="secondary"
                            className="flex-1 gap-2 rounded-full bg-white/80 text-foreground shadow-sm hover:bg-primary/10"
                          >
                            Sort by date
                            {sort_order.order === "ASC" ? (
                              <ArrowUpNarrowWide className="h-4 w-4" />
                            ) : (
                              <ArrowDownNarrowWide className="h-4 w-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-52 rounded-2xl border border-primary/15"
                        >
                          <DropdownMenuItem
                            onSelect={() => toggleSort("createdAt")}
                            className="flex items-center justify-between rounded-xl"
                          >
                            Created date
                            {sort_order.order === "ASC" ? (
                              <ArrowUpNarrowWide className="h-4 w-4 text-primary" />
                            ) : (
                              <ArrowDownNarrowWide className="h-4 w-4 text-primary" />
                            )}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={clearFilters}
                        className="rounded-full shadow-sm"
                      >
                        <RotateCcw className="h-4 w-4" />
                        <span className="sr-only">Reset filters</span>
                      </Button>
                    </div>
                  </div>
                </div>

                <Alert variant="info" className="flex items-start gap-3">
                  <Stars className="mt-0.5 h-4 w-4 text-sky-500" />
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">
                      Pro tip for edge cases
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Use whimsical categories like{" "}
                      <span className="font-medium">Brain Dump</span> or{" "}
                      <span className="font-medium">Someday Maybe</span> and keep
                      the data — even if it feels weird now, it&apos;s searchable
                      later.
                    </p>
                  </div>
                </Alert>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-primary/10 bg-white/85 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  Playful prompts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {playfulPrompts.map((tip) => (
                  <div
                    key={tip}
                    className="rounded-2xl border border-primary/15 bg-white/70 p-3 leading-relaxed"
                  >
                    {tip}
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-primary/15 bg-white/85 backdrop-blur">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                  <PartyPopper className="h-5 w-5 text-pink-500" />
                  Celebrate progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Alert variant="success" className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-500" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      Tip: Keep history visible
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Toggle completed tasks to relive wins or reopen something
                      quirky without recreating it.
                    </p>
                  </div>
                </Alert>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <Card className="flex flex-col border-primary/15 bg-white/85 backdrop-blur">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Stars className="h-5 w-5 text-primary" />
                Active tasks
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              {loading ? (
                <div className="flex min-h-[220px] items-center justify-center">
                  <Loader2 className="h-7 w-7 animate-spin text-primary" />
                </div>
              ) : incomplete_tasks.length > 0 ? (
                <ScrollArea className="h-full max-h-[520px] pr-3">
                  <div className="space-y-4">
                    {incomplete_tasks.map((t) => (
                      <div
                        key={t.task_id}
                        className="flex flex-col gap-4 rounded-3xl border border-primary/15 bg-white/85 p-4 shadow-sm transition hover:border-primary/40 hover:shadow-md sm:flex-row sm:items-start sm:gap-5"
                      >
                        <Checkbox
                          checked={t.completed}
                          onCheckedChange={(checked) =>
                            toggleTaskCompletion(t.task_id, Boolean(checked))
                          }
                          className="mt-1 h-5 w-5 rounded-lg border-primary/40"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <h3
                              className="text-base font-semibold text-foreground"
                              title={t.text}
                            >
                              <span className="line-clamp-2 break-words">
                                {t.text}
                              </span>
                            </h3>
                            <Badge variant="pastel" className="bg-secondary/70">
                              {t.category || "Uncategorized"}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                            <span>
                              Created: {formatDate(t.createdAt, "dd/MM/yyyy HH:mm:ss")}
                            </span>
                            {t.text.length > 60 ? (
                              <span>We kept this neat for easier scanning ✨</span>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-start">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(t.task_id)}
                            aria-label={`Edit ${t.text}`}
                            className="rounded-full hover:bg-primary/10"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTask(t.task_id)}
                            aria-label={`Delete ${t.text}`}
                            className="rounded-full hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                  <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                  <p className="text-sm md:text-base">
                    {search_query.trim() !== ""
                      ? "No tasks match the current filters. Try switching categories or clear filters above."
                      : "Nothing pending — add a new task or try a playful template to spark ideas!"}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="flex flex-col border-primary/15 bg-white/85 backdrop-blur">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                Completed tasks
              </CardTitle>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setShowCompleted(!show_completed)}
                className="gap-2 rounded-full bg-white/80 text-foreground hover:bg-primary/10"
              >
                {show_completed ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    Hide
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    Show
                  </>
                )}
              </Button>
            </CardHeader>
            <CardContent className="flex-1">
              {show_completed && completed_tasks.length > 0 ? (
                <ScrollArea className="max-h-[520px] pr-3">
                  <div className="space-y-4">
                    {completed_tasks.map((t) => (
                      <div
                        key={t.task_id}
                        className="flex flex-col gap-4 rounded-3xl border border-emerald-100 bg-emerald-50/80 p-4 shadow-sm transition hover:border-emerald-200 sm:flex-row sm:items-start sm:gap-5"
                      >
                        <Checkbox
                          checked={t.completed}
                          onCheckedChange={(checked) =>
                            toggleTaskCompletion(t.task_id, Boolean(checked))
                          }
                          className="mt-1 h-5 w-5 rounded-lg border-emerald-300 bg-white"
                        />
                        <div className="flex-1 space-y-2">
                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <h3
                              className="text-base font-semibold text-emerald-900 line-through"
                              title={t.text}
                            >
                              <span className="line-clamp-2 break-words">
                                {t.text}
                              </span>
                            </h3>
                            <Badge variant="pastel" className="bg-white/80 text-emerald-800">
                              {t.category || "Uncategorized"}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-emerald-700">
                            <span>
                              Created: {formatDate(t.createdAt, "dd/MM/yyyy HH:mm:ss")}
                            </span>
                            {t.completedAt ? (
                              <span>
                                Completed:{" "}
                                {formatDate(t.completedAt, "dd/MM/yyyy HH:mm:ss")}
                              </span>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 self-end sm:self-start">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => deleteTask(t.task_id)}
                            aria-label={`Delete ${t.text}`}
                            className="rounded-full text-emerald-800 hover:bg-emerald-200/60"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 text-center text-muted-foreground">
                  <Stars className="h-10 w-10 text-emerald-300" />
                  <p className="text-sm md:text-base">
                    {completed_tasks.length === 0
                      ? "No completed tasks yet — mark something done to celebrate!"
                      : "Completed tasks are hidden. Toggle them above to relive the wins."}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        <UpdateTask
          open={open_update}
          onClose={() => setOpenUpdate(false)}
          onRefresh={fetchTasks}
          task_id={selected_task_id}
        />

        <ManageCategory
          open={open_manage_category}
          onClose={() => {
            fetchCategory();
            setOpenManageCategory(false);
          }}
          onRefresh={fetchTasks}
        />
      </div>
    </main>
  );
};

export default TodoListPage;
