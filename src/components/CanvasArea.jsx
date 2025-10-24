import React, { useEffect, useMemo, useRef, forwardRef } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage, Transformer } from 'react-konva';
import useImage from 'use-image'; // ✅ from the installed 'use-image' package
import { useDispatch, useSelector } from 'react-redux';
import { selectAll, selectSelectedId, select, update, commit, selectCanvasSize } from '../redux/elementsSlice';

const KImage = forwardRef(({ item, isSelected, onSelect, onChange }, ref) => {
  const [img] = useImage(item.src, 'anonymous');

  return (
    <KonvaImage
      image={img}
      x={item.x}
      y={item.y}
      width={item.width}
      height={item.height}
      ref={ref}
      onClick={onSelect}
      onTap={onSelect}
      draggable
      onDragMove={(e) => onChange({ x: e.target.x(), y: e.target.y() })}
      onDragEnd={() => onChange({}, true)}
      onTransformEnd={(e) => {
        const node = ref.current;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange(
          {
            x: node.x(),
            y: node.y(),
            width: Math.max(30, node.width() * scaleX),
            height: Math.max(30, node.height() * scaleY),
          },
          true
        );
      }}
      stroke={isSelected ? '#3b82f6' : ''}
      strokeWidth={isSelected ? 2 : 0}
      cornerRadius={8}
    />
  );
});

function SelectionTransformer({ selectedShapeRef }) {
  const trRef = useRef();
  useEffect(() => {
    if (selectedShapeRef.current) {
      trRef.current.nodes([selectedShapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [selectedShapeRef]);
  return <Transformer ref={trRef} rotateEnabled={false} borderStroke="#3b82f6" />;
}

export default function CanvasArea() {
  const items = useSelector(selectAll);
  const selectedId = useSelector(selectSelectedId);
  const dispatch = useDispatch();
  const stageRef = useRef();
  const selectedRef = useRef();
  const canvasSize = useMemo(() => selectCanvasSize(), []);

  const handleSelect = (id) => dispatch(select(id));

  const handleChange = (id, attrs, commitChange = false) => {
    const current = items.find((i) => i.id === id);
    if (!current) return;
    const payload = {
      id,
      x: attrs.x ?? current.x,
      y: attrs.y ?? current.y,
      width: attrs.width ?? current.width,
      height: attrs.height ?? current.height,
    };
    dispatch(update(payload));
    if (commitChange) dispatch(commit());
  };

  const handleStageMouseDown = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) dispatch(select(null));
  };

  return (
    <div className="card p-3 flex-1">
      <Stage
        width={canvasSize.width}
        height={canvasSize.height}
        className="konva-container bg-white rounded-xl border border-gray-200"
        onMouseDown={handleStageMouseDown}
        ref={stageRef}
      >
        <Layer>
          {/* Optional subtle grid */}
          {[...Array(40)].map((_, i) => (
            <Rect
              key={'grid-h-' + i}
              x={0}
              y={i * 13}
              width={canvasSize.width}
              height={1}
              fill="#f1f5f9"
            />
          ))}
          {[...Array(70)].map((_, i) => (
            <Rect
              key={'grid-v-' + i}
              x={i * 13}
              y={0}
              width={1}
              height={canvasSize.height}
              fill="#f1f5f9"
            />
          ))}

          {items.map((item) => {
            const isSelected = item.id === selectedId;
            const commonProps = {
              x: item.x,
              y: item.y,
              width: item.width,
              height: item.height,
              onClick: () => handleSelect(item.id),
              onTap: () => handleSelect(item.id),
              draggable: true,
              onDragMove: (e) => handleChange(item.id, { x: e.target.x(), y: e.target.y() }),
              onDragEnd: () => handleChange(item.id, {}, true),
            };

            if (item.type === 'rect') {
              return (
                <React.Fragment key={item.id}>
                  <Rect
                    {...commonProps}
                    cornerRadius={12}
                    fill={item.fill || '#cfe8ff'}
                    stroke={isSelected ? '#3b82f6' : '#93c5fd'}
                    strokeWidth={isSelected ? 2.5 : 1}
                    ref={isSelected ? selectedRef : null}
                  />
                  {isSelected && <SelectionTransformer selectedShapeRef={selectedRef} />}
                </React.Fragment>
              );
            }

            if (item.type === 'image') {
              return (
                <React.Fragment key={item.id}>
                  <KImage
                    item={item}
                    isSelected={isSelected}
                    onSelect={() => handleSelect(item.id)}
                    onChange={(attrs, commitChange) =>
                      handleChange(item.id, attrs, commitChange)
                    }
                    ref={isSelected ? selectedRef : null}
                  />
                  {isSelected && <SelectionTransformer selectedShapeRef={selectedRef} />}
                </React.Fragment>
              );
            }

            return null;
          })}
        </Layer>
      </Stage>
    </div>
  );
}
