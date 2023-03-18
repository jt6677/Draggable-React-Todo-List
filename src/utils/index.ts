import { FocusEvent, useEffect } from 'react'
import { useTodoListStore } from '~/store'
import { TodoType } from '~/types'

interface FlatTodo {
  id: number
  text: string
  completed: boolean
  parentId?: number
}

export function flattenTodos(todos: TodoType[]): FlatTodo[] {
  const flattened: FlatTodo[] = []

  todos.forEach((todo) => {
    flattened.push({ id: todo.id, text: todo.text, completed: todo.completed })

    todo.subtasks.forEach((subtask) => {
      flattened.push({
        id: subtask.id,
        text: subtask.text,
        completed: subtask.completed,
        parentId: todo.id,
      })
    })
  })

  return flattened
}

export function rehydrateTodos(flatTodos: FlatTodo[]): TodoType[] {
  const todos: TodoType[] = []

  flatTodos.forEach((flatTodo) => {
    if (flatTodo.parentId === undefined) {
      todos.push({
        id: flatTodo.id,
        text: flatTodo.text,
        completed: flatTodo.completed,
        subtasks: [],
      })
    } else {
      const parentTodo = todos.find((todo) => todo.id === flatTodo.parentId)
      if (parentTodo) {
        parentTodo.subtasks.push({
          id: flatTodo.id,
          text: flatTodo.text,
          completed: flatTodo.completed,
          parentId: flatTodo.parentId,
        })
      }
    }
  })

  return todos
}
// useArrowNavigation.ts
export const useArrowKeyFocus = () => {
  const { focusedElement, setFocusedElement, todos } = useTodoListStore((state) => ({
    focusedElement: state.focusedElement,
    setFocusedElement: state.setFocusedElement,
    todos: state.todos,
  }))

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
        const allItems = todos.flatMap((todo) => [
          { id: todo.id, parentId: undefined, type: 'todo' },
          ...todo.subtasks.map((subtask) => ({
            id: subtask.id,
            parentId: todo.id,
            type: 'subtask',
          })),
        ])

        const currentIndex = allItems.findIndex((item) => item.id === focusedElement)

        let targetIndex = -1
        if (event.key === 'ArrowUp' && currentIndex > 0) {
          targetIndex = currentIndex - 1
        } else if (event.key === 'ArrowDown' && currentIndex < allItems.length - 1) {
          targetIndex = currentIndex + 1
        }

        if (targetIndex !== -1) {
          const targetId = allItems[targetIndex].id
          setFocusedElement(targetId)
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [todos, focusedElement, setFocusedElement])

  return { focusedElement, setFocusedElement }
}
const setCaretToEnd = (element: HTMLTextAreaElement | HTMLInputElement) => {
  const valueLength = element.value.length
  element.setSelectionRange(valueLength, valueLength)
}

export const setCursorToEndonFocus = (e: FocusEvent<HTMLTextAreaElement>) => {
  if (e.currentTarget) {
    e.currentTarget.setSelectionRange(e.currentTarget.value.length, e.currentTarget.value.length)
  }
}
