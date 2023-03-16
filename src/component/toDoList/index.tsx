import { CheckCircleIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Checkbox, TextareaAutosize } from '@mui/material'
import cn from 'classnames'
import { XYCoord } from 'dnd-core'
import { motion } from 'framer-motion'
import { FC, useRef } from 'react'
import { DropTargetMonitor, useDrag, useDrop } from 'react-dnd'

import { useTodoListStore } from '~/store'
import { DraggableTodoProps, SubTask, TodoProps, TodoType } from '~/types'
import { setCursorToEndonFocus, useArrowKeyFocus } from '~/utils'
export const Todo: FC<TodoProps> = ({ todo }) => {
  const {
    todos,
    addSubtask,
    addTodo,
    deleteTodo,
    toggleCompleteTodo,
    updateTodoText,
    setFocusedElement,
  } = useTodoListStore((state) => ({
    todos: state.todos,
    addSubtask: state.addSubtask,
    addTodo: state.addTodo,
    deleteTodo: state.removeTodo,
    toggleCompleteTodo: state.toggleComplete,
    updateTodoText: state.updateTodoText,
    setFocusedElement: state.setFocusedElement,
  }))
  // const { setFocusedElement } = useArrowKeyFocus(todos)
  useArrowKeyFocus(todos)
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault() // Prevent newline
      const currentIndex = todos.findIndex((t) => t.id === todo.id)
      const newIndex = currentIndex + 1

      if (e.ctrlKey) {
        // Create a new subtask
        const newSubtask: SubTask = {
          id: Date.now(),
          text: '',
          completed: false,
          parentId: todo.id,
        }
        addSubtask(todo.id, newSubtask)
      } else {
        // Create a new todo
        const newTodo: TodoType = {
          id: Date.now(),
          text: '',
          completed: false,
          subtasks: [],
        }
        addTodo(newTodo, newIndex)
      }
    }
    if (e.key === 'Backspace' && todo.text === '') {
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

      const currentIndex = allItems.findIndex(
        (item) => `${item.parentId ?? ''}${item.id}textfield` === `${todo.id}textfield`
      )

      const targetIndex = currentIndex - 1

      if (targetIndex >= 0) {
        const targetId = allItems[targetIndex].id
        const targetParentId = allItems[targetIndex].parentId
        const targetElement = document.getElementById(`${targetParentId ?? ''}${targetId}textfield`)
        targetElement?.focus()
      }
    }
  }
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateTodoText(todo.id, event.target.value)
  }
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
            name={`${todo.id}textfield`}
            id={`${todo.id}textfield`}
            value={todo.text}
            autoFocus
            onResize={() => {}}
            onResizeCapture={() => {}}
            disabled={todo.completed}
            onFocus={(e) => {
              setCursorToEndonFocus(e)
              setFocusedElement(`${todo.id}textfield`)
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
      </div>
      <div>
        {todo.subtasks.map((subtask) => (
          <Subtask key={subtask.id} parentId={todo.id} subtask={subtask} />
        ))}
      </div>
    </motion.div>
  )
}

interface SubtaskProps {
  parentId: number
  subtask: SubTask
}
const Subtask: FC<SubtaskProps> = ({ parentId, subtask }) => {
  const {
    todos,
    deleteSubtask,
    toggleCompleteSubtask,
    updateSubtaskText,
    addTodoAfter,
    addSubtask,
    setFocusedElement,
  } = useTodoListStore((state) => ({
    todos: state.todos,
    deleteSubtask: state.removeSubtask,
    toggleCompleteSubtask: state.toggleCompleteSubtask,
    updateSubtaskText: state.updateSubtaskText,
    addTodoAfter: state.addTodoAfter,
    addSubtask: state.addSubtask,
    setFocusedElement: state.setFocusedElement,
  }))
  // const { setFocusedElement } = useArrowKeyFocus(todos)
  useArrowKeyFocus(todos)
  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateSubtaskText(parentId, subtask.id, event.target.value)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.ctrlKey) {
      e.preventDefault()
      // Add a new todo item right after the parent todo
      const newTodo: TodoType = {
        id: Date.now(),
        text: '',
        completed: false,
        subtasks: [],
      }
      addTodoAfter(subtask.parentId, newTodo)
      // Set focus to the new todo item
      setTimeout(() => {
        const newTodoElement = document.getElementById(`${newTodo.id}textfield`)
        newTodoElement?.focus()
      }, 0)
    } else if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault()
      // Add a sibling subtask
      const newSubtask: SubTask = {
        parentId: subtask.parentId,
        id: Date.now(),
        text: '',
        completed: false,
      }
      addSubtask(subtask.parentId, newSubtask)
      // Set focus to the new subtask
      setTimeout(() => {
        const newSubtaskElement = document.getElementById(
          `${newSubtask.parentId}${newSubtask.id}textfield`
        )
        newSubtaskElement?.focus()
      }, 0)
    } else if (e.key === 'Backspace' && subtask.text === '') {
      e.preventDefault()

      // Remove the current subtask
      deleteSubtask(subtask.parentId, subtask.id)

      // Set focus on the previous item, if any
      const allItems = todos.flatMap((todo) => [
        { id: todo.id, parentId: undefined, type: 'todo' },
        ...todo.subtasks.map((subtask) => ({
          id: subtask.id,
          parentId: todo.id,
          type: 'subtask',
        })),
      ])

      const currentIndex = allItems.findIndex(
        (item) =>
          `${item.parentId ?? ''}${item.id}textfield` ===
          `${subtask.parentId}${subtask.id}textfield`
      )

      const targetIndex = currentIndex - 1

      if (targetIndex >= 0) {
        const targetId = allItems[targetIndex].id
        const targetParentId = allItems[targetIndex].parentId
        const targetElement = document.getElementById(`${targetParentId ?? ''}${targetId}textfield`)
        targetElement?.focus()
      }
    }
  }

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
            setCursorToEndonFocus(e)
            setFocusedElement(`${subtask.parentId}${subtask.id}}textfield`)
          }}
          className={cn(
            'block w-full resize-none border-0 border-b border-transparent bg-transparent p-0 py-1 px-1 text-xs text-gray-700 focus:border-primaryColor focus:ring-0 md:text-sm',
            { 'cursor-not-allowed text-slate-400': subtask.completed }
          )}
        />
      </div>
      <button className="pl-1 md:pl-4" onClick={() => deleteSubtask(parentId, subtask.id)}>
        <TrashIcon className="h-5 w-5 text-gray-500 hover:text-primaryText" />
      </button>
    </motion.div>
  )
}

interface DragItem {
  type: string
  index: number
}
export const DraggableTodo: FC<DraggableTodoProps> = ({ todo, index, moveTodo }) => {
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
