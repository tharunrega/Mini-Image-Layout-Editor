import { createSlice, nanoid } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  selectedId: null,
  past: [],
  future: []
};

const clamp = (val, min, max) => Math.max(min, Math.min(max, val));

const CANVAS = { width: 900, height: 520, padding: 8 };

const pushHistory = (state) => {
  state.past.push({ items: state.items, selectedId: state.selectedId });
  state.future = [];
};

const elementsSlice = createSlice({
  name: 'elements',
  initialState,
  reducers: {
    hydrate(state, action) {
      return { ...state, ...action.payload, past: [], future: [] };
    },
    addRect: {
      reducer(state, action) {
        pushHistory(state);
        state.items = [...state.items, action.payload];
        state.selectedId = action.payload.id;
      },
      prepare() {
        return {
          payload: {
            id: nanoid(),
            name: 'Rectangle',
            type: 'rect',
            x: 40 + Math.random() * 120,
            y: 40 + Math.random() * 120,
            width: 180,
            height: 140,
            fill: '#cfe8ff'
          }
        };
      }
    },
    addImage: {
      reducer(state, action) {
        pushHistory(state);
        state.items = [...state.items, action.payload];
        state.selectedId = action.payload.id;
      },
      prepare(src) {
        return {
          payload: {
            id: nanoid(),
            name: 'Image',
            type: 'image',
            x: 360 + Math.random() * 120,
            y: 80 + Math.random() * 120,
            width: 200,
            height: 140,
            src
          }
        };
      }
    },
    select(state, action) {
      state.selectedId = action.payload;
    },
    update(state, action) {
      // payload: {id, x,y,width,height}
      const { id, x, y, width, height } = action.payload;
      const idx = state.items.findIndex(it => it.id === id);
      if (idx >= 0) {
        state.items = state.items.map((it, i) => i === idx ? {
          ...it,
          x: clamp(x, 0, CANVAS.width - (width ?? it.width)),
          y: clamp(y, 0, CANVAS.height - (height ?? it.height)),
          width: width ?? it.width,
          height: height ?? it.height
        } : it);
      }
    },
    commit(state) {
      // Push to history after drag/resize is completed
      pushHistory(state);
      state.items = [...state.items];
    },
    deleteSelected(state) {
      if (!state.selectedId) return;
      pushHistory(state);
      state.items = state.items.filter(it => it.id !== state.selectedId);
      state.selectedId = null;
    },
    rename(state, action) {
      const { id, name } = action.payload;
      state.items = state.items.map(it => it.id === id ? { ...it, name } : it);
    },
    undo(state) {
      const prev = state.past.pop();
      if (prev) {
        state.future.push({ items: state.items, selectedId: state.selectedId });
        state.items = prev.items;
        state.selectedId = prev.selectedId;
      }
    },
    redo(state) {
      const next = state.future.pop();
      if (next) {
        state.past.push({ items: state.items, selectedId: state.selectedId });
        state.items = next.items;
        state.selectedId = next.selectedId;
      }
    },
    saveLocal(state) {
      const data = { items: state.items, selectedId: state.selectedId };
      localStorage.setItem('mini-editor-layout', JSON.stringify(data));
    },
    loadLocal(state) {
      const raw = localStorage.getItem('mini-editor-layout');
      if (raw) {
        const parsed = JSON.parse(raw);
        state.items = parsed.items || [];
        state.selectedId = parsed.selectedId || null;
        state.past = [];
        state.future = [];
      }
    }
  }
});

export const {
  hydrate, addRect, addImage, select, update, commit,
  deleteSelected, rename, undo, redo, saveLocal, loadLocal
} = elementsSlice.actions;

export const selectAll = s => s.elements.items;
export const selectSelectedId = s => s.elements.selectedId;
export const selectCanvasSize = () => ({ width: 900, height: 520 });

export default elementsSlice.reducer;
