import React, { useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addRect, addImage, deleteSelected, undo, redo, saveLocal, loadLocal, selectSelectedId } from '../redux/elementsSlice';

export default function Toolbar() {
  const dispatch = useDispatch();
  const selectedId = useSelector(selectSelectedId);
  const fileRef = useRef(null);

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    dispatch(addImage(url));
    e.target.value = '';
  };

  return (
    <div className="toolbar">
      <button className="btn" onClick={() => dispatch(addRect())} title="Add Rectangle">
        <span className="i">▭</span>
        Add Rectangle
      </button>
      <button className="btn" onClick={() => dispatch(addImage('/assets/sample1.png'))} title="Add Image">
        <span className="i">🖼️</span>
        Add Image
      </button>
      <button className="btn" onClick={() => fileRef.current?.click()} title="Upload Custom Image">
        <span className="i">⤴</span>
        Upload
      </button>
      <input ref={fileRef} className="hidden" type="file" accept="image/*" onChange={handleUpload} />

      <div className="mx-2 h-6 w-px bg-gray-200" />

      <button className={"btn " + (!selectedId ? 'opacity-60 pointer-events-none' : '')} onClick={() => dispatch(deleteSelected())} title="Delete Selected">
        <span className="i">🗑️</span>
        Delete Item
      </button>

      <div className="mx-2 h-6 w-px bg-gray-200" />

      <button className="btn" onClick={() => dispatch(undo())} title="Undo">↶ Undo</button>
      <button className="btn" onClick={() => dispatch(redo())} title="Redo">↷ Redo</button>

      <div className="ml-auto" />

      <button className="btn" onClick={() => dispatch(saveLocal())} title="Save Layout">💾 Save Layout</button>
      <button className="btn" onClick={() => dispatch(loadLocal())} title="Load Layout">📂 Load</button>
    </div>
  );
}
