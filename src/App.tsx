import { debounce } from 'lodash'
import { FC, useEffect, useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { useTodoListStore } from '~/store'
import { DraggableTodo } from './component/toDoList'

// Import the Todo and DraggableTodo components

import { FlatTodo, TodoType } from './types'
import { flattenTodos, rehydrateTodos } from './utils'

const dummyData = [
  { id: 1678981940132, text: '1', completed: false },
  { id: 1678981944941, text: '2', completed: false },
  { id: 1678981945908, text: '3', completed: false },
  { id: 1678981946980, text: '3a', completed: false, parentId: 1678981945908 },
  { id: 1678981953324, text: '3b', completed: false, parentId: 1678981945908 },
  { id: 1678981949748, text: '4', completed: false },
]
const fetchDummyData = () =>
  new Promise<FlatTodo[]>((resolve) => {
    setTimeout(() => {
      resolve(dummyData)
    }, 1000)
  })
const App: FC = () => {
  const { todos, addTodo, updateTodos, focusedElement } = useTodoListStore((state) => ({
    todos: state.todos,
    addTodo: state.addTodo,
    updateTodos: state.updateTodos,
    focusedElement: state.focusedElement,
    // setFocusedElement: state.setFocusedElement,
  }))
  const [inputValue, setInputValue] = useState('')

  const handleAddTodo = () => {
    addTodo({ id: Date.now(), text: inputValue, completed: false, subtasks: [] })
    setInputValue('')
  }

  useEffect(() => {
    const debouncedUpload = debounce(() => {
      const flattenedTodos = flattenTodos(todos)
      // Convert the flattened todos into a JSON string
      const todosJSON = JSON.stringify(flattenedTodos)

      // Call your UploadToServer function
      UploadToServer(todosJSON)
    }, 6000) // Debounce for 6 seconds

    debouncedUpload()

    return () => {
      debouncedUpload.cancel() // Clean up the debounce function on unmount or when todos change
    }
  }, [todos])

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchDummyData()
      if (data.length > 0) {
        const rehydratedTodos = rehydrateTodos(data)
        updateTodos(rehydratedTodos)
      }
    }

    fetchData()
  }, [updateTodos])
  const UploadToServer = (todosJSON: string) => {
    // Implement the logic to upload the todosJSON to the server
    console.log('Uploading to server:', todosJSON)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flexCenter t1 relative">
        <div>
          <button onClick={handleAddTodo}>Add Todo</button>
        </div>
        <div className="pl-12">
          {todos.map((todo: TodoType, index: number) => (
            <DraggableTodo key={todo.id} todo={todo} index={index} />
          ))}
        </div>
      </div>
      <span>enter to make new to-do, ctl + enter to add subtask</span>
    </DndProvider>
  )
}

export default App
