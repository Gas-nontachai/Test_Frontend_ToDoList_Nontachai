"use client";
import React, { useState } from "react";
import {
  CircularProgress,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  IconButton,
  Checkbox,
  Box,
  Select,
  Menu,
  MenuItem,
  Collapse,
  InputAdornment
} from "@mui/material";
import {
  Category,
  Delete,
  Edit,
  Sort,
  Clear,
  Add,
  Visibility,
  VisibilityOff,
  Search,
  ArrowDownward,
  ArrowUpward,
  AssignmentTurnedIn
} from "@mui/icons-material";
import { formatDate } from "@/utils/date-helper"
import { useTodoList } from "@/hook/hooks";
import UpdateTask from "@/app/components/Task/Update";
import ManageCategory from "@/app/components/Task/ManageCategory";
import CompletedTask from "@/app/components/Task/CompletedTask";

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
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const maxLength = 100;

  return (
    <Box className="flex flex-col w-full min-h-screen p-4 bg-gray-100">
      <Typography variant="h4" className="text-2xl font-bold mb-4 text-gray-800">To-Do List</Typography>
      <Box className="flex items-center gap-2 mb-4">
        <TextField
          label="New Task"
          variant="outlined"
          value={task.text}
          onChange={(e) => setTask({ ...task, text: e.target.value })}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              addTask();
            }
          }}
          className="w-80"

          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "999px",
              paddingRight: "8px",
            },
          }}
          inputProps={{ maxLength }}
          helperText={
            task.text.length >= maxLength
              ? "You have reached the maximum length"
              : `${task.text.length}/${maxLength} characters`
          }
          error={task.text.length >= maxLength}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Select
                  value={task.category || ""}
                  onChange={(e) => setTask({ ...task, category: e.target.value })}
                  displayEmpty
                  variant="standard"
                  sx={{ minWidth: "100px", marginRight: "8px" }}
                  renderValue={(selected) =>
                    selected === "" ? (
                      <em>{task_category_option.length === 0 ? "Loading..." : "Select category"}</em>
                    ) : (
                      selected
                    )
                  }
                  disabled={task_category_option.length === 0}
                >
                  {task_category_option.length > 0 ? (
                    task_category_option.map((option) => (
                      <MenuItem key={option} value={option}>
                        {option}
                      </MenuItem>
                    ))
                  ) : (
                    <MenuItem disabled value="">
                      <em>No categories available</em>
                    </MenuItem>
                  )}
                </Select>
                <IconButton
                  onClick={addTask}
                  sx={{
                    backgroundColor: "green",
                    color: "white",
                    borderRadius: "50%",
                    width: "40px",
                    height: "40px",
                    "&:hover": {
                      backgroundColor: "darkgreen",
                    },
                  }}
                >
                  <Add />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        <Button variant="outlined" onClick={() => setOpenManageCategory(!open_manage_category)}>
          <Category />
          <Typography sx={{ marginX: 2 }}>Manage category</Typography>
        </Button>
      </Box>

      <Box className="flex items-center gap-2 mb-4">
        <TextField
          label="Search"
          variant="outlined"
          value={search_query}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              fetchTasks();
            }
          }}
          className="w-full"
          size="small"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "999px",
              fontSize: "14px",
            },
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={fetchTasks} sx={{ color: "#4F46E5" }}>
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <Select
          value={filter_category}
          onChange={(e) => setFilterCategory(e.target.value)}
          displayEmpty
          className="w-28"
          sx={{
            borderRadius: "999px",
            height: "40px",
            fontSize: "14px",
            backgroundColor: "#F3F4F6",
            "& .MuiSelect-select": {
              padding: "8px 12px",
            },
          }}
        >
          <MenuItem value="All">All</MenuItem>
          {task_category_option.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>

        <IconButton
          onClick={(event) => setAnchorEl(event.currentTarget)}
          sx={{
            backgroundColor: "#1E3A8A",
            color: "white",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            "&:hover": { backgroundColor: "#1D4ED8" },
          }}
        >
          <Sort fontSize="small" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => setAnchorEl(null)}
        >
          <MenuItem onClick={() => toggleSort("createdAt")}>
            Sort by Date
            {sort_order.name === "createdAt" && (
              sort_order.order === "ASC" ? <ArrowUpward fontSize="small" /> : <ArrowDownward fontSize="small" />
            )}
          </MenuItem>
        </Menu>

        <IconButton
          onClick={clearFilters}
          sx={{
            backgroundColor: "#EF4444",
            color: "white",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            "&:hover": { backgroundColor: "#DC2626" },
          }}
        >
          <Clear fontSize="small" />
        </IconButton>
      </Box>
      {
        loading == true ? (
          <Box style={{ display: "flex", justifyContent: "center", margin: "20px 0" }}>
            <CircularProgress />
          </Box>
        ) : incomplete_tasks.length > 0 ? (
          <>
            {incomplete_tasks.map((t, index) => (
              <List className="w-full max-w-lg bg-white " key={index}>
                <ListItem
                  key={index}
                  secondaryAction={
                    <>
                      <IconButton edge="end" aria-label="edit" onClick={() => { handleEdit(t.task_id) }}>
                        <Edit />
                      </IconButton>
                      <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(t.task_id)}>
                        <Delete />
                      </IconButton>
                    </>
                  }
                >
                  <Checkbox checked={t.completed} onChange={() => toggleTaskCompletion(t.task_id, true)} />
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" className="font-bold text-gray-800">
                      {t.text}
                    </Typography>
                    <Box >
                      <Typography variant="body2" color="textSecondary">
                        Category: {t.category}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Created: {formatDate(t.createdAt, "dd/MM/yyyy HH:mm:ss")}
                      </Typography>
                    </Box>
                  </Box>
                </ListItem>
              </List>
            ))}
          </>
        ) : (
          <Box display="flex" flexDirection="column" alignItems="center" mt={4}>
            <AssignmentTurnedIn sx={{ fontSize: 48, color: "#9CA3AF" }} />
            <Typography variant="h6" color="textSecondary" sx={{ fontWeight: "500", mt: 1 }}>
              {search_query.trim() !== "" && incomplete_tasks.length === 0
                ? "No results found"
                : "No pending tasks"}
            </Typography>
          </Box>
        )
      }

      {
        completed_tasks.length > 0 && (
          <>
            <Box className="flex justify-between items-center mb-4 mt-8">
              <Typography variant="h6" className="font-bold text-gray-800">
                ✅ Completed Tasks
              </Typography>

              <Button
                variant="contained"
                onClick={() => setShowCompleted(!show_completed)}
                startIcon={show_completed ? <VisibilityOff /> : <Visibility />}
                size="small"
                sx={{
                  backgroundColor: show_completed ? "#f87171" : "#3b82f6",
                  color: "white",
                  "&:hover": {
                    backgroundColor: show_completed ? "#dc2626" : "#2563eb",
                  },
                  paddingX: "12px",
                  borderRadius: "10px",
                  textTransform: "none",
                  marginLeft: "10px",
                }}
              >
                {show_completed ? "Hide" : "Show"}
              </Button>
            </Box>
            <Collapse in={show_completed} className="w-full max-w-md bg-white  " >
              <CompletedTask completedTasks={completed_tasks} deleteTask={deleteTask} toggleTaskCompletion={toggleTaskCompletion} />
            </Collapse>
          </>
        )
      }

      <UpdateTask
        open={open_update}
        onClose={() => setOpenUpdate(false)}
        onRefresh={fetchTasks}
        task_id={selected_task_id}
      />

      <ManageCategory
        open={open_manage_category}
        onClose={() => {
          fetchCategory()
          setOpenManageCategory(false)
        }}
        onRefresh={fetchTasks}
      />

    </Box >
  );
};

export default TodoListPage;
