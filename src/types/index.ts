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
  focusedElement: number | null
  setFocusedElement: (element: number | null) => void

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
  moveTodo: (dragIndex: number, hoverIndex: number) => void
  moveSubtask: (parentId: number, dragIndex: number, hoverIndex: number) => void
}

export interface DraggableTodoProps {
  todo: TodoType
  index: number
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

export interface DragItem {
  type: 'todo' | 'subtask'
  index: number
  parentId?: number
  id?: number
}

export interface SubtaskProps {
  parentId: number
  subtask: SubTask
  // dragRef: RefObject<HTMLDivElement>
  index: number
}

export interface DraggableSubtaskProps {
  parentId: number
  subtask: SubTask
  index: number
}
