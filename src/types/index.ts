export interface TodoType {
  id: number
  text: string
  completed: boolean
  subtasks: SubTask[]
}
export interface SubTask {
  parentId: number
  id: number
  text: string
  completed: boolean
}
export interface TodoProps {
  todo: TodoType
}

export type TodoStore = {
  todos: TodoType[]
  focusedElement: string | null
  setFocusedElement: (element: string | null) => void

  addTodo: (todo: TodoType, index?: number) => void
  addTodoAfter: (parentId: number, todo: TodoType) => void
  removeTodo: (id: number) => void
  toggleComplete: (id: number) => void
  updateTodoText: (id: number, text: string) => void
  updateTodos: (todos: TodoType[]) => void
  addSubtask: (parentId: number, subtask: SubTask) => void
  removeSubtask: (parentId: number, subtaskId: number) => void
  toggleCompleteSubtask: (parentId: number, subtaskId: number) => void
  updateSubtaskText: (parentId: number, id: number, text: string) => void
}
export interface DraggableTodoProps {
  todo: TodoType
  index: number
  moveTodo: (dragIndex: number, hoverIndex: number) => void
}

export type FlatTodo =
  | {
      id: number
      text: string
      completed: boolean
      parentId?: undefined
    }
  | {
      id: number
      text: string
      completed: boolean
      parentId: number
    }
