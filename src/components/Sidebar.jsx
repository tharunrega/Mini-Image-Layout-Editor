import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { select, selectAll, selectSelectedId, rename } from '../redux/elementsSlice';

export default function Sidebar() {
  const items = useSelector(selectAll);
  const selectedId = useSelector(selectSelectedId);
  const dispatch = useDispatch();

  return (
    <aside className="card p-4 w-80">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-700">Elements</h3>
      </div>
      <ul className="space-y-2">
        {items.map(it => (
          <li key={it.id}>
            <button
              onClick={() => dispatch(select(it.id))}
              className={`w-full text-left p-3 rounded-xl border transition ${
                selectedId === it.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium text-gray-800">{it.name}</div>
                <span className="text-xs text-gray-500">{it.type}</span>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                x:{Math.round(it.x)} y:{Math.round(it.y)} w:{Math.round(it.width)} h:{Math.round(it.height)}
              </div>
            </button>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-xs text-gray-500 p-2">No elements yet.</li>
        )}
      </ul>
      <div className="mt-4 text-xs text-gray-400">Tip: Click an item to select it on the canvas.</div>
    </aside>
  );
}
