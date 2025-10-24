# Mini Image Layout Editor (React + Tailwind + Redux Toolkit + Konva)

A small canvas editor with rectangles and images. Drag, resize, delete. Sidebar lists elements. Undo/redo and save/load.

## Getting Started
```bash
npm install
npm start
```
> Created for a frontend assignment. Built to run on Create React App with Tailwind.

## Features
- Add Rectangle / Image / Upload custom image
- Drag & Resize (Konva Transformer)
- Delete selected item
- Sidebar with name, type, position
- Select in sidebar highlights on canvas
- Undo / Redo
- Save / Load layout (localStorage)
- Prevent drag outside via clamping in reducer

## Structure
- `src/components/CanvasArea.jsx`
- `src/components/Toolbar.jsx`
- `src/components/Sidebar.jsx`
- `src/redux/elementsSlice.js`
- `src/redux/store.js`

## Notes
- No third-party editor libraries; only `react-konva` for canvas primitives.
- State persisted in Redux; history for undo/redo.
- Tailwind used for modern, light, rounded UI.
```

