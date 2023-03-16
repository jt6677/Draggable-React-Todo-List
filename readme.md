# Todo List with Zustand, Immer, and React-DnD

This is a simple Todo List app that utilizes Zustand with Immer middleware for state management and React-DnD for drag and drop functionality. The app allows users to create and manage todos and subtasks.

## Features

- Add, edit, and delete todos
- Add, edit, and delete subtasks within todos
- Toggle todo and subtask completion
- Navigate between todos and subtasks using arrow keys
- Automatically updates the parent todo's completion status based on its subtasks
- Drag and drop todos and subtasks to reorder them
- Debounce 6-second delay to upload changes to the server with a fake promise call to simulate async data

## Installation

This project uses [pnpm](https://pnpm.io/) for package management. To install pnpm, run:

```bash
npm install -g pnpm
```

```bash
yarn global add pnpm
```

## Install dependencies:

```bash
pnpm install
```

## Start the development server:

```bash
pnpm dev
```

Now you can open your browser and visit http://localhost:3000 to see the Todo List app in action.

## Build:

```bash
pnpm build
```

## Technologies

- React
- Zustand - Simple and fast state management library
- Immer - Immutable state management made easy
- React-DnD - Flexible drag-and-drop functionality for React applications
- pnpm - Fast and efficient package management

## License

This project is MIT licensed.
