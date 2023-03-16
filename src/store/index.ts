import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { SubTask, TodoStore, TodoType } from '~/types'

export const useTodoListStore = create<TodoStore>()(
  immer((set) => ({
    focusedElement: null,
    setFocusedElement: (element: string | null) =>
      set((state) => {
        state.focusedElement = element
      }),
    todos: [],
    addTodo: (todo: TodoType, index?: number) =>
      set((state) => {
        if (index !== undefined && index >= 0 && index < state.todos.length) {
          state.todos.splice(index, 0, todo)
        } else {
          state.todos.push(todo)
        }
      }),
    removeTodo: (id: number) =>
      set((state) => {
        state.todos = state.todos.filter((todo) => todo.id !== id)
      }),
    toggleComplete: (id: number) =>
      set((state) => {
        const todo = state.todos.find((t) => t.id === id)
        if (todo) {
          todo.completed = !todo.completed
          todo.subtasks.forEach((subtask) => {
            subtask.completed = todo.completed
          })
        }
      }),
    updateTodoText: (id: number, text: string) =>
      set((state) => {
        const todo = state.todos.find((t) => t.id === id)
        if (todo) {
          todo.text = text
        }
      }),
    updateTodos: (todos: TodoType[]) =>
      set((state) => {
        state.todos = todos
      }),
    addSubtask: (parentId: number, subtask: SubTask) =>
      set((state) => {
        const todoIndex = state.todos.findIndex((todo) => todo.id === parentId)

        if (todoIndex !== -1) {
          state.todos[todoIndex].subtasks.push(subtask)
        }
      }),
    addTodoAfter: (parentId: number, todo: TodoType) =>
      set((state) => {
        const parentIndex = state.todos.findIndex((t) => t.id === parentId)

        if (parentIndex !== -1) {
          state.todos.splice(parentIndex + 1, 0, todo)
        }
      }),
    removeSubtask: (parentId: number, subtaskId: number) =>
      set((state) => {
        const todo = state.todos.find((t) => t.id === parentId)
        if (todo) {
          todo.subtasks = todo.subtasks.filter((subtask) => subtask.id !== subtaskId)
        }
      }),
    updateSubtaskText: (parentId: number, id: number, text: string) =>
      set((state) => {
        const todo = state.todos.find((t) => t.id === parentId)
        if (todo) {
          const subtask = todo.subtasks.find((st) => st.id === id)
          if (subtask) {
            subtask.text = text
          }
        }
      }),
    toggleCompleteSubtask: (parentId: number, subtaskId: number) =>
      set((state) => {
        const todo = state.todos.find((t) => t.id === parentId)
        if (todo) {
          const subtask = todo.subtasks.find((st) => st.id === subtaskId)
          if (subtask) {
            subtask.completed = !subtask.completed
          }

          // Check if all sub-tasks are completed
          const allSubtasksCompleted = todo.subtasks.every((st) => st.completed)
          todo.completed = allSubtasksCompleted
        }
      }),
  }))
)
