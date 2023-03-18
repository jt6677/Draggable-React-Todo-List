import { CheckCircleIcon, HandRaisedIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Checkbox, TextareaAutosize } from '@mui/material'
import cn from 'classnames'
import { XYCoord } from 'dnd-core'
import { motion } from 'framer-motion'
import { ChangeEvent, FC, KeyboardEvent, useEffect, useRef } from 'react'
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd'

import { useTodoListStore } from '~/store'
import {
  DraggableSubtaskProps,
  DraggableTodoProps,
  DragItem,
  SubTask,
  SubtaskProps,
  TodoProps,
  TodoType,
} from '~/types'
import { setCursorToEndonFocus, useArrowKeyFocus } from '~/utils'

export const Todo: FC<TodoProps> = ({ todo }) => {
  const { todos, addSubtask, addTodo, deleteTodo, toggleCompleteTodo, updateTodoText } =
    useTodoListStore((state) => ({
      todos: state.todos,
      addSubtask: state.addSubtask,
      addTodo: state.addTodo,
      deleteTodo: state.removeTodo,
      toggleCompleteTodo: state.toggleComplete,
      updateTodoText: state.updateTodoText,
    }))
  const { focusedElement, setFocusedElement } = useArrowKeyFocus()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (focusedElement === todo.id && inputRef.current) {
      inputRef.current.focus()
      setTimeout(() => {
        const valueLength = inputRef.current!.value.length
        inputRef.current!.setSelectionRange(valueLength, valueLength)
      }, 0)
    }
  }, [focusedElement, todo.id])

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    const getKeyIdentifier = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.ctrlKey) return 'Enter'
      if (event.key === 'Enter' && event.ctrlKey && !event.shiftKey) return 'ctrl+Enter'
      if (event.key === 'Backspace' && todo.text === '') return 'Backspace'
      if (event.key === 'Enter' && event.ctrlKey && event.shiftKey) return 'ctrl+shift+Enter'
      return ''
    }

    const keyIdentifier = getKeyIdentifier(e)

    switch (keyIdentifier) {
      case 'Enter':
        e.preventDefault() // Prevent newline
        const currentIndex = todos.findIndex((t) => t.id === todo.id)
        const newIndex = currentIndex + 1

        // Create a new todo
        const newTodo: TodoType = {
          id: Date.now(),
          text: '',
          completed: false,
          subtasks: [],
        }
        addTodo(newTodo, newIndex)
        break

      case 'ctrl+Enter':
        e.preventDefault() // Prevent newline
        const currentIndexCtrl = todos.findIndex((t) => t.id === todo.id)

        // Create a new subtask
        const newSubtask: SubTask = {
          id: Date.now(),
          text: '',
          completed: false,
          parentId: todo.id,
        }
        addSubtask(todo.id, newSubtask)
        break

      case 'Backspace':
        e.preventDefault()
        // Remove the current todo
        deleteTodo(todo.id)
        // Set focus on the previous item, if any
        const allItems = todos.flatMap((todo) => [
          { id: todo.id, parentId: undefined, type: 'todo' },
          ...todo.subtasks.map((subtask) => ({
            id: subtask.id,
            parentId: todo.id,
            type: 'subtask',
          })),
        ])
        const currentIndexBackspace = allItems.findIndex((item) => item.id === todo.id)

        const targetIndex = currentIndexBackspace - 1

        if (targetIndex >= 0) {
          setFocusedElement(allItems[targetIndex].id)
        }
        break

      case 'ctrl+shift+Enter':
        e.preventDefault()
        toggleCompleteTodo(todo.id)
        break

      default:
        // If the key combination doesn't match any case, do nothing
        break
    }
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateTodoText(todo.id, event.target.value)
  }

  const [{ opacity }, drag, preview] = useDrag(() => ({
    type: 'todo',
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),
  }))

  return (
    <motion.div key={todo.id} className="flex flex-1 flex-col items-center py-0.5">
      <div className="flex">
        <Checkbox
          checked={todo.completed}
          onClick={() => toggleCompleteTodo(todo.id)}
          style={{
            display: 'inline-block',
            width: '',
            margin: '0',
            padding: '0',
            color: todo.completed ? 'hsl(223, 100%, 73%)' : 'rgb(148 163 184)',
            verticalAlign: 'center',
          }}
          checkedIcon={<CheckCircleIcon className="h-6" />}
        />

        <div
          className={cn(
            ' ml-1 flex flex-1  border-b-2 border-slate-400 focus-within:border-primaryColor',
            { 'border-slate-300': todo.completed }
          )}>
          <label htmlFor="comment" className="sr-only">
            Add your comment
          </label>
          <TextareaAutosize
            minRows={1}
            maxRows={3}
            ref={inputRef}
            name={`${todo.id}textfield`}
            id={`${todo.id}textfield`}
            value={todo.text}
            autoFocus
            onResize={() => {}}
            onResizeCapture={() => {}}
            disabled={todo.completed}
            onFocus={() => {
              setFocusedElement(todo.id)
            }}
            onChange={handleTextChange}
            onKeyDown={(e) => handleKeyPress(e)}
            className={cn(
              'block w-full resize-none border-0 border-b border-transparent bg-transparent p-0 py-1 px-1 text-xs text-gray-700 focus:border-primaryColor focus:ring-0 md:text-sm',
              { 'cursor-not-allowed text-slate-400': todo.completed }
            )}
          />
        </div>
        <button className="pl-1 md:pl-4" onClick={() => deleteTodo(todo.id)}>
          <TrashIcon className="h-5 w-5 text-gray-500 hover:text-primaryText" />
        </button>

        <HandRaisedIcon className="h-5 w-5 text-gray-500 hover:text-primaryText" ref={drag} />
      </div>
      <div>
        {todo.subtasks.map((subtask, index) => (
          <DraggableSubtask key={subtask.id} parentId={todo.id} subtask={subtask} index={index} />
        ))}
      </div>
    </motion.div>
  )
}

const Subtask: FC<SubtaskProps> = ({ parentId, subtask, index }) => {
  const {
    todos,
    removeSubtask,
    toggleCompleteSubtask,
    updateSubtaskText,
    addTodoAfter,
    addSubtask,
  } = useTodoListStore((state) => ({
    todos: state.todos,
    removeSubtask: state.removeSubtask,
    toggleCompleteSubtask: state.toggleCompleteSubtask,
    updateSubtaskText: state.updateSubtaskText,
    addTodoAfter: state.addTodoAfter,
    addSubtask: state.addSubtask,
  }))

  const handleTextChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    updateSubtaskText(parentId, subtask.id, event.target.value)
  }

  const { focusedElement, setFocusedElement } = useArrowKeyFocus()
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (focusedElement === subtask.id && inputRef.current) {
      inputRef.current.focus()
      setTimeout(() => {
        const valueLength = inputRef.current!.value.length
        inputRef.current!.setSelectionRange(valueLength, valueLength)
      }, 0)
    }
  }, [focusedElement, subtask.id])

  const handleKeyPress = (e: KeyboardEvent) => {
    const getKeyIdentifier = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.ctrlKey) return 'Enter'
      if (event.key === 'Enter' && event.ctrlKey && !event.shiftKey) return 'ctrl+Enter'
      if (event.key === 'Backspace' && subtask.text === '') return 'Backspace'
      if (event.key === 'Enter' && event.ctrlKey && event.shiftKey) return 'ctrl+shift+Enter'
      return ''
    }

    const keyIdentifier = getKeyIdentifier(e)

    switch (keyIdentifier) {
      case 'Enter':
        e.preventDefault()
        // Add a new todo item right after the parent todo
        const newTodo: TodoType = {
          id: Date.now(),
          text: '',
          completed: false,
          subtasks: [],
        }
        addTodoAfter(subtask.parentId!, newTodo)
        // Set focus to the new todo item
        setTimeout(() => {
          const newTodoElement = document.getElementById(`${newTodo.id}textfield`)
          newTodoElement?.focus()
        }, 0)
        break

      case 'ctrl+Enter':
        e.preventDefault()
        // Add a sibling subtask
        const newSubtask: SubTask = {
          parentId: subtask.parentId,
          id: Date.now(),
          text: '',
          completed: false,
        }
        addSubtask(subtask.parentId!, newSubtask)
        // Set focus to the new subtask
        setTimeout(() => {
          const newSubtaskElement = document.getElementById(
            `${newSubtask.parentId}${newSubtask.id}textfield`
          )
          newSubtaskElement?.focus()
        }, 0)
        break

      case 'Backspace':
        e.preventDefault()
        // Remove the current subtask
        removeSubtask(subtask.parentId!, subtask.id)
        // Set focus on the previous item, if any
        const allItems = todos.flatMap((todo) => [
          { id: todo.id, parentId: undefined, type: 'todo' },
          ...todo.subtasks.map((subtask) => ({
            id: subtask.id,
            parentId: todo.id,
            type: 'subtask',
          })),
        ])
        const currentIndex = allItems.findIndex((item) => item.id === subtask.id)
        const targetIndex = currentIndex - 1
        if (targetIndex >= 0) {
          setFocusedElement(allItems[targetIndex].id)
        }
        break

      case 'ctrl+shift+Enter':
        e.preventDefault()
        toggleCompleteSubtask(subtask.parentId, subtask.id)
        break

      default:
        // If the key combination doesn't match any case, do nothing
        break
    }
  }

  const [{ isDragging }, drag] = useDrag({
    type: 'subtask',
    item: () => {
      return { parentId, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })
  return (
    <motion.div key={subtask.id} className="ml-4 flex flex-1 items-center py-0.5 pl-2">
      <Checkbox
        checked={subtask.completed}
        onClick={() => toggleCompleteSubtask(parentId, subtask.id)}
        style={{
          display: 'inline-block',
          width: '',
          margin: '0',
          padding: '0',
          color: subtask.completed ? 'hsl(223, 100%, 73%)' : 'rgb(148 163 184)',
          verticalAlign: 'center',
        }}
        checkedIcon={<CheckCircleIcon className="h-6" />}
      />

      <div
        className={cn(
          ' ml-1 flex flex-1  border-b-2 border-slate-400 focus-within:border-primaryColor',
          { 'border-slate-300': subtask.completed }
        )}>
        <label htmlFor="comment" className="sr-only">
          Add your comment
        </label>
        <TextareaAutosize
          minRows={1}
          maxRows={3}
          ref={inputRef}
          name={`${subtask.id}textfield`}
          id={`${subtask.parentId}${subtask.id}textfield`}
          value={subtask.text}
          autoFocus
          disabled={subtask.completed}
          onResize={() => {}}
          onResizeCapture={() => {}}
          onChange={handleTextChange}
          onKeyDown={(e) => handleKeyPress(e)}
          onFocus={(e) => {
            setFocusedElement(subtask.id)
            setTimeout(() => {
              setCursorToEndonFocus(e)
            }, 10)
          }}
          className={cn(
            'block w-full resize-none border-0 border-b border-transparent bg-transparent p-0 py-1 px-1 text-xs text-gray-700 focus:border-primaryColor focus:ring-0 md:text-sm',
            { 'cursor-not-allowed text-slate-400': subtask.completed }
          )}
        />
      </div>
      <button className="pl-1 md:pl-4" onClick={() => removeSubtask(parentId, subtask.id)}>
        <TrashIcon className="h-5 w-5 text-gray-500 hover:text-primaryText" />
      </button>
      <HandRaisedIcon className="h-5 w-5 text-gray-500 hover:text-primaryText" ref={drag} />
    </motion.div>
  )
}

export const DraggableSubtask: FC<DraggableSubtaskProps> = ({ parentId, subtask, index }) => {
  const dragRef = useRef<HTMLDivElement>(null) // Create a separate ref for the drag handle

  const { moveSubtask } = useTodoListStore((state) => ({
    moveSubtask: state.moveSubtask,
  }))

  const ref = useRef<HTMLDivElement>(null)

  const [, drop] = useDrop<DragItem, any, any>({
    accept: 'subtask',
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }

      // Check if the dragged subtask belongs to the same parent
      if (item.parentId !== parentId) {
        return
      }

      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current!.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      moveSubtask(parentId, dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'subtask',
    item: () => {
      return { parentId, index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0 : 1,
        cursor: 'move',
      }}>
      <Subtask parentId={parentId} subtask={subtask} index={index} />
    </div>
  )
}

export const DraggableTodo: FC<DraggableTodoProps> = ({ todo, index }) => {
  const { moveTodo } = useTodoListStore((state) => ({
    moveTodo: state.moveTodo,
  }))
  const ref = useRef<HTMLDivElement>(null)

  const [, drop] = useDrop<DragItem, any, any>({
    accept: 'todo',
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      if (dragIndex === hoverIndex) {
        return
      }

      const hoverBoundingRect = ref.current!.getBoundingClientRect()
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2
      const clientOffset = monitor.getClientOffset()
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return
      }

      moveTodo(dragIndex, hoverIndex)
      item.index = hoverIndex
    },
  })

  const [{ isDragging }, drag] = useDrag({
    type: 'todo',
    item: () => {
      return { index }
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  drag(drop(ref))

  return (
    <div
      ref={ref}
      style={{
        opacity: isDragging ? 0 : 1,
        cursor: 'move',
      }}>
      <Todo todo={todo} />
    </div>
  )
}
