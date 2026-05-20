'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Stage, Layer, Rect, Circle, Line } from 'react-konva';
import type Konva from 'konva';
import type { KonvaEventObject } from 'konva/lib/Node';
import { getChats } from '@/lib/api';
import { getToken } from '@/lib/auth';
import {
  Shape,
  ShapeType,
  RectShape,
  CircleShape,
  DiamondShape,
  LineShape,
} from '@/lib/types';

const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:4002';
const STROKE_COLOR = '#ffffff';
const STROKE_WIDTH = 2;

let idCounter = 0;
const genId = () => `s_${Date.now()}_${idCounter++}`;

interface CanvasProps {
  roomId: string;
  onBack?: () => void;
}

export default function Canvas({ roomId, onBack }: CanvasProps) {
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [tool, setTool] = useState<ShapeType>('rect');
  const [strokeColor, setStrokeColor] = useState(STROKE_COLOR);
  const [strokeWidth] = useState(STROKE_WIDTH);
  const isDrawing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const activeShapeId = useRef<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const stageRef = useRef<Konva.Stage>(null);
  const [connected, setConnected] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const shapesRef = useRef<Shape[]>([]);
  const historyRef = useRef<Shape[][]>([]);
  const futureRef = useRef<Shape[][]>([]);
  const preDrawSnapshot = useRef<Shape[]>([]);

  // Resize canvas to fill container
  useEffect(() => {
    const update = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight - 56, // subtract toolbar height
      });
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Keep shapesRef in sync so history callbacks always see current shapes
  useEffect(() => {
    shapesRef.current = shapes;
  }, [shapes]);

  // Load existing shapes from chat history
  useEffect(() => {
    getChats(roomId)
      .then((data) => {
        const messages: { message: string }[] = data.messages || [];
        const loaded: Shape[] = [];
        for (const m of messages) {
          try {
            const s = JSON.parse(m.message) as Shape;
            if (s && s.type && s.id) loaded.push(s);
          } catch {
            // skip non-shape messages
          }
        }
        setShapes(loaded.reverse()); // oldest first
      })
      .catch(() => {
        /* room may not have chats yet */
      });
  }, [roomId]);

  // WebSocket connection
  useEffect(() => {
    const token = getToken();
    if (!token) return;

    const ws = new WebSocket(`${WS_URL}?token=${token}`);
    wsRef.current = ws;

    ws.onopen = () => {
      setConnected(true);
      ws.send(JSON.stringify({ type: 'join_room', roomId }));
    };

    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'chat' && data.roomId === roomId) {
          try {
            const shape = JSON.parse(data.message) as Shape;
            if (shape && shape.type && shape.id) {
              setShapes((prev) => {
                // avoid duplicates from own sends
                if (prev.find((s) => s.id === shape.id)) return prev;
                return [...prev, shape];
              });
            }
          } catch {
            // not a shape message
          }
        }
      } catch {
        // ignore non-JSON messages (initial "something")
      }
    };

    return () => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'leave_room', room: roomId }));
      }
      ws.close();
    };
  }, [roomId]);

  const sendShape = useCallback(
    (shape: Shape) => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: 'chat',
            roomId,
            message: JSON.stringify(shape),
          }),
        );
      }
    },
    [roomId],
  );

  const getPointerPos = (stage: Konva.Stage) => {
    const pos = stage.getPointerPosition();
    return pos ?? { x: 0, y: 0 };
  };

  const startDraw = (x: number, y: number) => {
    if (tool === 'select') return;
    isDrawing.current = true;
    startPos.current = { x, y };
    preDrawSnapshot.current = [...shapesRef.current];
    const id = genId();
    activeShapeId.current = id;
    let newShape: Shape;
    if (tool === 'rect') {
      newShape = {
        id,
        type: 'rect',
        x,
        y,
        width: 0,
        height: 0,
        stroke: strokeColor,
        strokeWidth,
      };
    } else if (tool === 'circle') {
      newShape = {
        id,
        type: 'circle',
        x,
        y,
        radius: 0,
        stroke: strokeColor,
        strokeWidth,
      };
    } else if (tool === 'diamond') {
      newShape = {
        id,
        type: 'diamond',
        x,
        y,
        width: 0,
        height: 0,
        stroke: strokeColor,
        strokeWidth,
      };
    } else {
      newShape = {
        id,
        type: 'line',
        points: [x, y, x, y],
        stroke: strokeColor,
        strokeWidth,
      };
    }
    setShapes((prev) => [...prev, newShape]);
  };

  const moveDraw = (x: number, y: number) => {
    if (!isDrawing.current || tool === 'select') return;
    const id = activeShapeId.current;
    setShapes((prev) =>
      prev.map((shape) => {
        if (shape.id !== id) return shape;
        if (shape.type === 'rect') {
          return {
            ...shape,
            x: Math.min(x, startPos.current.x),
            y: Math.min(y, startPos.current.y),
            width: Math.abs(x - startPos.current.x),
            height: Math.abs(y - startPos.current.y),
          } as RectShape;
        }
        if (shape.type === 'circle') {
          const dx = x - startPos.current.x;
          const dy = y - startPos.current.y;
          const radius = Math.sqrt(dx * dx + dy * dy) / 2;
          return {
            ...shape,
            x: (x + startPos.current.x) / 2,
            y: (y + startPos.current.y) / 2,
            radius,
          } as CircleShape;
        }
        if (shape.type === 'diamond') {
          return {
            ...shape,
            x: Math.min(x, startPos.current.x),
            y: Math.min(y, startPos.current.y),
            width: Math.abs(x - startPos.current.x),
            height: Math.abs(y - startPos.current.y),
          } as DiamondShape;
        }
        if (shape.type === 'line') {
          return {
            ...shape,
            points: [startPos.current.x, startPos.current.y, x, y],
          } as LineShape;
        }
        return shape;
      }),
    );
  };

  const handleMouseDown = (e: KonvaEventObject<MouseEvent>) => {
    if (tool === 'select') return;
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = getPointerPos(stage);
    startDraw(pos.x, pos.y);
  };

  const handleMouseMove = (e: KonvaEventObject<MouseEvent>) => {
    if (!isDrawing.current || tool === 'select') return;
    const stage = e.target.getStage();
    if (!stage) return;
    const pos = getPointerPos(stage);
    moveDraw(pos.x, pos.y);
  };

  const handleMouseUp = () => {
    if (!isDrawing.current) return;
    isDrawing.current = false;

    const id = activeShapeId.current;
    activeShapeId.current = null;

    setShapes((prev) => {
      const shape = prev.find((s) => s.id === id);
      if (shape) {
        // Only send shapes with some size
        const hasSize =
          (shape.type === 'rect' && (shape.width > 2 || shape.height > 2)) ||
          (shape.type === 'circle' && shape.radius > 2) ||
          (shape.type === 'diamond' && (shape.width > 2 || shape.height > 2)) ||
          (shape.type === 'line' && shape.points.length >= 4);

        if (hasSize) {
          sendShape(shape);
          historyRef.current.push(preDrawSnapshot.current);
          futureRef.current = [];
          setCanUndo(true);
          setCanRedo(false);
        } else {
          // Remove tiny accidental shapes
          return prev.filter((s) => s.id !== id);
        }
      }
      return prev;
    });
  };

  const handleClear = () => {
    if (shapesRef.current.length === 0) return;
    historyRef.current.push([...shapesRef.current]);
    futureRef.current = [];
    setShapes([]);
    setCanUndo(true);
    setCanRedo(false);
  };

  const handleUndo = useCallback(() => {
    if (historyRef.current.length === 0) return;
    const prevState = historyRef.current.pop()!;
    futureRef.current.push([...shapesRef.current]);
    setShapes(prevState);
    setCanUndo(historyRef.current.length > 0);
    setCanRedo(true);
  }, []);

  const handleRedo = useCallback(() => {
    if (futureRef.current.length === 0) return;
    const nextState = futureRef.current.pop()!;
    historyRef.current.push([...shapesRef.current]);
    setShapes(nextState);
    setCanUndo(true);
    setCanRedo(futureRef.current.length > 0);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if (
        e.ctrlKey &&
        (e.key === 'y' || (e.shiftKey && e.key === 'z'))
      ) {
        e.preventDefault();
        handleRedo();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleUndo, handleRedo]);

  const renderShape = (shape: Shape) => {
    const commonProps = {
      key: shape.id,
      stroke: shape.stroke,
      strokeWidth: shape.strokeWidth,
      fill: 'transparent',
      listening: tool === 'select',
    };

    if (shape.type === 'rect') {
      return (
        <Rect
          {...commonProps}
          x={shape.x}
          y={shape.y}
          width={shape.width}
          height={shape.height}
        />
      );
    }
    if (shape.type === 'circle') {
      return (
        <Circle
          {...commonProps}
          x={shape.x}
          y={shape.y}
          radius={shape.radius}
        />
      );
    }
    if (shape.type === 'diamond') {
      // Diamond as 4-sided polygon rotated 45°
      const cx = shape.x + shape.width / 2;
      const cy = shape.y + shape.height / 2;
      const hw = shape.width / 2;
      const hh = shape.height / 2;
      const points = [cx, cy - hh, cx + hw, cy, cx, cy + hh, cx - hw, cy];
      return <Line {...commonProps} points={points} closed />;
    }
    if (shape.type === 'line') {
      return <Line {...commonProps} points={shape.points} />;
    }
    return null;
  };

  const tools: { id: ShapeType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'select',
      label: 'Select',
      icon: (
        <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
          <path
            d='M4 2 L4 12 L7 9 L9 13 L11 12 L9 8 L13 8 Z'
            stroke='currentColor'
            strokeWidth='1.3'
            strokeLinejoin='round'
            fill='none'
          />
        </svg>
      ),
    },
    {
      id: 'rect',
      label: 'Rectangle',
      icon: (
        <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
          <rect
            x='2'
            y='4'
            width='12'
            height='8'
            rx='1'
            stroke='currentColor'
            strokeWidth='1.5'
            fill='none'
          />
        </svg>
      ),
    },
    {
      id: 'circle',
      label: 'Circle',
      icon: (
        <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
          <circle
            cx='8'
            cy='8'
            r='5.5'
            stroke='currentColor'
            strokeWidth='1.5'
            fill='none'
          />
        </svg>
      ),
    },
    {
      id: 'diamond',
      label: 'Diamond',
      icon: (
        <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
          <polygon
            points='8,2 14,8 8,14 2,8'
            stroke='currentColor'
            strokeWidth='1.5'
            fill='none'
          />
        </svg>
      ),
    },
    {
      id: 'line',
      label: 'Line',
      icon: (
        <svg width='16' height='16' viewBox='0 0 16 16' fill='none'>
          <line
            x1='3'
            y1='13'
            x2='13'
            y2='3'
            stroke='currentColor'
            strokeWidth='1.5'
            strokeLinecap='round'
          />
        </svg>
      ),
    },
  ];

  const colors = [
    '#ffffff',
    '#6c63ff',
    '#ff6b6b',
    '#4ecdc4',
    '#ffd93d',
    '#a8e6cf',
    '#ff8c94',
  ];

  return (
    <div className='flex flex-col h-screen bg-[#0d0d0d] overflow-hidden'>
      {/* Toolbar */}
      <div className='flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] border-b border-[#2e2e2e] h-14 shrink-0'>
        {/* Tools */}
        <div className='flex items-center gap-1 bg-[#242424] rounded-lg p-1'>
          {tools.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              title={t.label}
              className={`p-2 rounded-md transition-colors ${
                tool === t.id
                  ? 'bg-[#6c63ff] text-white'
                  : 'text-[#888] hover:text-white hover:bg-[#2e2e2e]'
              }`}
            >
              {t.icon}
            </button>
          ))}
        </div>

        <div className='w-px h-6 bg-[#2e2e2e] mx-1' />

        {/* Color picker */}
        <div className='flex items-center gap-1'>
          {colors.map((c) => (
            <button
              key={c}
              onClick={() => setStrokeColor(c)}
              title={c}
              style={{ backgroundColor: c }}
              className={`w-5 h-5 rounded-full transition-transform ${
                strokeColor === c
                  ? 'ring-2 ring-offset-1 ring-offset-[#1a1a1a] ring-white scale-110'
                  : 'hover:scale-110'
              }`}
            />
          ))}
          <input
            type='color'
            value={strokeColor}
            onChange={(e) => setStrokeColor(e.target.value)}
            title='Custom color'
            className='w-5 h-5 rounded-full cursor-pointer bg-transparent border-0 p-0 overflow-hidden'
            style={{ appearance: 'none' }}
          />
        </div>

        <div className='flex-1' />

        {/* Status & actions */}
        <div className='flex items-center gap-3'>
          <span className='text-xs text-[#555] font-mono hidden sm:block'>
            {roomId.slice(0, 8)}…
          </span>
          <span
            className={`text-xs flex items-center gap-1.5 ${connected ? 'text-emerald-400' : 'text-[#888]'}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-400' : 'bg-[#555]'}`}
            />
            {connected ? 'Live' : 'Offline'}
          </span>
          <button
            onClick={handleUndo}
            disabled={!canUndo}
            title='Undo (Ctrl+Z)'
            className='text-xs text-[#666] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-1.5 rounded-lg border border-[#2e2e2e] hover:border-[#444] disabled:hover:text-[#666] disabled:hover:border-[#2e2e2e]'
          >
            ↩
          </button>
          <button
            onClick={handleRedo}
            disabled={!canRedo}
            title='Redo (Ctrl+Y)'
            className='text-xs text-[#666] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors px-3 py-1.5 rounded-lg border border-[#2e2e2e] hover:border-[#444] disabled:hover:text-[#666] disabled:hover:border-[#2e2e2e]'
          >
            ↪
          </button>
          <button
            onClick={handleClear}
            className='text-xs text-[#666] hover:text-red-400 transition-colors px-3 py-1.5 rounded-lg border border-[#2e2e2e] hover:border-red-400/30'
          >
            Clear
          </button>
          {onBack && (
            <button
              onClick={onBack}
              className='text-xs text-[#666] hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-[#2e2e2e] hover:border-[#444]'
            >
              ← Back
            </button>
          )}
        </div>
      </div>

      {/* Canvas */}
      <div
        className='flex-1 overflow-hidden cursor-crosshair'
        style={{ cursor: tool === 'select' ? 'default' : 'crosshair' }}
      >
        <Stage
          ref={stageRef}
          width={dimensions.width}
          height={dimensions.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={(e) => {
            const touch = e.evt.touches[0];
            if (!touch || !stageRef.current) return;
            const rect = stageRef.current.container().getBoundingClientRect();
            startDraw(touch.clientX - rect.left, touch.clientY - rect.top);
          }}
          onTouchMove={(e) => {
            const touch = e.evt.touches[0];
            if (!touch || !stageRef.current) return;
            const rect = stageRef.current.container().getBoundingClientRect();
            moveDraw(touch.clientX - rect.left, touch.clientY - rect.top);
          }}
          onTouchEnd={handleMouseUp}
          style={{ background: '#111111' }}
        >
          <Layer>{shapes.map(renderShape)}</Layer>
        </Stage>
      </div>
    </div>
  );
}
