import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { Task } from "@/misc/types";
import { generateID } from "@/utils/generator-id";
import { useCategory, useTask } from "@/hook/hooks";

type SortOrder = { name: string; order: "ASC" | "DESC" };

const createEmptyTask = (): Task => ({
  task_id: "",
  text: "",
  category: "General",
  completed: false,
  createdAt: new Date(),
  completedAt: undefined,
});

const useTodoList = () => {
  const { getTaskBy, insertTask, updateTaskBy, deleteTaskBy } = useTask();
  const { getCategoryBy } = useCategory();

  const [loading, setLoading] = useState<boolean>(true);
  const [show_completed, setShowCompleted] = useState(true);
  const [open_update, setOpenUpdate] = useState(false);
  const [open_manage_category, setOpenManageCategory] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [task, setTask] = useState<Task>(createEmptyTask());
  const [selected_task_id, setSelectedTaskID] = useState("");
  const [search_query, setSearchQuery] = useState<string>("");
  const [sort_order, setSortOrder] = useState<SortOrder>({
    name: "createdAt",
    order: "ASC",
  });
  const [filter_category, setFilterCategory] = useState<string>("All");
  const [task_category_option, setTaskCategoryOption] = useState<string[]>([]);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const { docs: res } = await getTaskBy();
      let filtered_tasks = res;

      if (search_query.trim() !== "") {
        filtered_tasks = filtered_tasks.filter((task) =>
          task.text.toLowerCase().includes(search_query.toLowerCase())
        );
      }

      if (filter_category !== "All") {
        filtered_tasks = filtered_tasks.filter(
          (task) => task.category === filter_category
        );
      }

      filtered_tasks.sort((a, b) => {
        let comparison = 0;
        if (sort_order.name === "createdAt") {
          comparison =
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        return sort_order.order === "DESC" ? -comparison : comparison;
      });

      setTasks(filtered_tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, [filter_category, sort_order, search_query, getTaskBy]);

  const fetchCategory = useCallback(async () => {
    try {
      const { docs: res } = await getCategoryBy();
      const option = res.map((item) => item.category_name);
      setTaskCategoryOption(option);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  }, [getCategoryBy]);

  useEffect(() => {
    fetchCategory();
  }, [fetchCategory]);

  useEffect(() => {
    let isMounted = true;
    const loadTasks = async () => {
      try {
        await fetchTasks();
      } catch (error) {
        if (isMounted) {
          console.error("Error loading tasks:", error);
        }
      }
    };

    loadTasks();
    return () => {
      isMounted = false;
    };
  }, [fetchTasks]);

  const addTask = useCallback(async () => {
    if (!task.text.trim()) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Task description cannot be empty.",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    const isDuplicate = tasks.some(
      (existingTask) =>
        existingTask.text.toLowerCase() === task.text.toLowerCase()
    );

    if (isDuplicate) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "This task already exists!",
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 2000,
      });
      return;
    }

    const data = {
      ...task,
      task_id: generateID(),
      createdAt: new Date(),
    };

    await insertTask(data);
    await fetchTasks();

    Swal.fire({
      icon: "success",
      title: "Task added successfully!",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 2000,
    });

    setTask(createEmptyTask());
  }, [task, tasks, insertTask, fetchTasks]);

  const deleteTask = useCallback(
    async (task_id: string) => {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      });

      if (result.isConfirmed) {
        await deleteTaskBy({ task_id });
        await fetchTasks();
        Swal.fire({
          icon: "success",
          title: "Task deleted successfully!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Cancelled",
          text: "Your task is safe!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    },
    [deleteTaskBy, fetchTasks]
  );

  const toggleTaskCompletion = useCallback(
    async (task_id: string, completed: boolean) => {
      const targetTask = tasks.find((task) => task.task_id === task_id);
      if (targetTask) {
        const data = {
          ...targetTask,
          completed,
          completedAt: new Date(),
        };
        await updateTaskBy(data);
        await fetchTasks();
        Swal.fire({
          icon: "success",
          title: "Task updated successfully!",
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 2000,
        });
      }
    },
    [tasks, updateTaskBy, fetchTasks]
  );

  const handleEdit = useCallback((task_id: string) => {
    setSelectedTaskID(task_id);
    setOpenUpdate(true);
  }, []);

  const toggleSort = useCallback((value: string) => {
    setSortOrder((prevSort) => {
      if (prevSort.name === value) {
        return {
          ...prevSort,
          order: prevSort.order === "ASC" ? "DESC" : "ASC",
        };
      }

      return {
        name: value,
        order: "ASC",
      };
    });
  }, []);

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setFilterCategory("All");
    setSortOrder({
      name: "createdAt",
      order: "ASC",
    });
  }, []);

  const incomplete_tasks = useMemo(
    () => tasks.filter((task) => !task.completed),
    [tasks]
  );
  const completed_tasks = useMemo(
    () => tasks.filter((task) => task.completed),
    [tasks]
  );

  return {
    // state
    loading,
    show_completed,
    open_update,
    open_manage_category,
    tasks,
    task,
    selected_task_id,
    search_query,
    sort_order,
    filter_category,
    task_category_option,
    incomplete_tasks,
    completed_tasks,
    // setters
    setShowCompleted,
    setOpenUpdate,
    setOpenManageCategory,
    setTask,
    setSelectedTaskID,
    setSearchQuery,
    setFilterCategory,
    // handlers
    fetchTasks,
    fetchCategory,
    addTask,
    deleteTask,
    toggleTaskCompletion,
    handleEdit,
    toggleSort,
    clearFilters,
  };
};

export default useTodoList;
