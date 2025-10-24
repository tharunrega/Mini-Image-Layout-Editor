import React, { useEffect } from 'react';
import Toolbar from './components/Toolbar';
import Sidebar from './components/Sidebar';
import CanvasArea from './components/CanvasArea';
import { useDispatch } from 'react-redux';
import { addRect, addImage, loadLocal } from './redux/elementsSlice';

export default function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load saved layout if exists
    dispatch(loadLocal());
    // If still empty, add demo items
    setTimeout(() => {
      // Attempt to ensure there is content for demo
    }, 0);
  }, [dispatch]);

  // Demo header/navigation
  return (
    <div className="min-h-screen p-6">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-blue-600 text-white grid place-items-center font-bold shadow-soft">LC</div>
            <div className="text-lg font-semibold text-gray-800">LayoutCanvas</div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
            <a href="#home" className="hover:text-gray-900">Home</a>
            <a href="#features" className="hover:text-gray-900">Features</a>
            <a href="#pricing" className="hover:text-gray-900">Pricing</a>
            <button className="btn btn-primary">Launch Editor</button>
          </nav>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-[1fr,20rem] gap-4">
        <section className="flex flex-col gap-3">
          <Toolbar />
          <CanvasArea />
        </section>
        <Sidebar />
      </main>
      <footer className="mt-6 text-xs text-gray-400">React + Tailwind + Redux Toolkit + Konva • Demo UI</footer>
    </div>
  );
}
