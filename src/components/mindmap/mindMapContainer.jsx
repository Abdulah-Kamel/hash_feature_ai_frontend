"use client";
import Dagre from "@dagrejs/dagre";
import React, { useCallback, useEffect, useState } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  Background,
  Controls,
  Panel,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import CustomNode from "./CustomNode";
import CustomEdge from "./CustomEdge";
import { apiClient } from "@/lib/api-client";

const nodeTypes = {
  custom: CustomNode,
};
const edgeTypes = {
  custom: CustomEdge,
};

function treeToFlow(MindMapData) {
  const nodes = [];
  const edges = [];
  let idCounter = 0;
  const nextId = () => `n-${idCounter++}`;

  const addNode = (label) => {
    const id = nextId();
    nodes.push({
      id,
      type: "custom",
      data: { label },
      position: { x: 0, y: 0 },
      measured: { width: 160, height: 40 },
    });
    return id;
  };

  const walk = (node, parentId = null) => {
    const id = addNode(
      (node?.name ?? node?.title ?? node?.text ?? "").toString()
    );
    if (parentId) {
      edges.push({
        id: `e-${parentId}-${id}`,
        source: parentId,
        target: id,
        type: "custom",
      });
    }
    (node?.children || []).forEach((child) => walk(child, id));
  };

  (MindMapData || []).forEach((root) => walk(root, null));
  return { nodes, edges };
}

const getLayoutedElements = (nodes, edges, options) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options.direction });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 0,
      height: node.measured?.height ?? 0,
    })
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      const x = position.x - (node.measured?.width ?? 0) / 2;
      const y = position.y - (node.measured?.height ?? 0) / 2;
      return { ...node, position: { x, y } };
    }),
    edges,
  };
};

function extractMindMapRoots(json) {
  if (Array.isArray(json?.data?.MindMapData)) return json.data.MindMapData;
  if (Array.isArray(json?.MindMapData)) return json.MindMapData;
  if (Array.isArray(json?.data)) {
    const combined = json.data.flatMap((it) =>
      Array.isArray(it?.MindMapData) ? it.MindMapData : []
    );
    if (combined.length) return combined;
  }
  const nested = json?.data?.data;
  if (Array.isArray(nested)) {
    const combined = nested.flatMap((it) =>
      Array.isArray(it?.MindMapData) ? it.MindMapData : []
    );
    if (combined.length) return combined;
  }
  return null;
}

function makeSkeletonGraph() {
  const nodes = [];
  const edges = [];
  let idCounter = 0;
  const nextId = () => `s-${idCounter++}`;
  const addNode = () => {
    const id = nextId();
    nodes.push({
      id,
      type: "custom",
      data: { skeleton: true, label: "" },
      position: { x: 0, y: 0 },
      measured: { width: 160, height: 40 },
    });
    return id;
  };
  const root = addNode();
  for (let i = 0; i < 6; i++) {
    const child = addNode();
    edges.push({
      id: `s-e-${root}-${child}`,
      source: root,
      target: child,
      type: "custom",
      data: { solid: false },
    });
  }
  return { nodes, edges };
}

const MindMapContent = ({ initialNodes, initialEdges, fileId }) => {
  const { fitView } = useReactFlow();
  const skeleton = makeSkeletonGraph();
  const [nodes, setNodes] = useState(() =>
    initialNodes && initialNodes.length
      ? initialNodes.map((n) => ({ ...n, type: "custom" }))
      : skeleton.nodes
  );
  const [edges, setEdges] = useState(
    initialEdges && initialEdges.length ? initialEdges : skeleton.edges
  );
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // show skeleton nodes while loading
        {
          const skNodes = [];
          const skEdges = [];
          const addNode = () => {
            const id = `sk-${skNodes.length}`;
            skNodes.push({
              id,
              type: "custom",
              data: { label: "", skeleton: true },
              position: { x: 0, y: 0 },
              measured: { width: 160, height: 40 },
            });
            return id;
          };
          const root = addNode();
          for (let i = 0; i < 6; i++) {
            const child = addNode();
            skEdges.push({
              id: `sk-e-${i}`,
              source: root,
              target: child,
              type: "custom",
              data: { solid: false },
            });
          }
          const skLayout = getLayoutedElements(skNodes, skEdges, {
            direction: "LR",
          });
          setNodes([...skLayout.nodes]);
          setEdges([...skLayout.edges]);
        }
        const url = fileId
          ? `/api/ai/mind-maps?fileId=${encodeURIComponent(fileId)}`
          : `/api/ai/mind-maps`;
        const res = await apiClient(url);
        const json = await res.json().catch(() => null);
        const roots = extractMindMapRoots(json);
        if (!Array.isArray(roots) || !roots.length || cancelled) return;
        const mapped = treeToFlow(roots);
        const layouted = getLayoutedElements(mapped.nodes, mapped.edges, {
          direction: "LR",
        });
        setNodes([...layouted.nodes]);
        setEdges([...layouted.edges]);
        window.requestAnimationFrame(() => {
          fitView();
        });
      } catch {}
    })();
    return () => {
      cancelled = true;
    };
  }, [fileId, fitView]);
  const onLayout = useCallback(
    (direction) => {
      const layouted = getLayoutedElements(nodes, edges, { direction });
      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);
      window.requestAnimationFrame(() => {
        fitView();
      });
    },
    [nodes, edges, fitView]
  );
  const onNodesChange = useCallback(
    (changes) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );
  return (
    <ReactFlow
      proOptions={{
        connectionLineType: "smoothstep",
        hideAttribution: true,
      }}
      style={{ color: "#000" }}
      nodes={nodes}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
    >
      <Panel position="top-right" className="space-x-2">
        <button
          onClick={() => onLayout("TB")}
          className="text-black bg-white px-2 py-1 rounded-md cursor-pointer"
        >
          vertical layout
        </button>
        <button
          onClick={() => onLayout("LR")}
          className="text-black bg-white px-2 py-1 rounded-md cursor-pointer"
        >
          horizontal layout
        </button>
      </Panel>
      <Controls />
      <Background />
    </ReactFlow>
  );
};

const MindMapContainer = (props) => {
  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ReactFlowProvider>
        <MindMapContent {...props} />
      </ReactFlowProvider>
    </div>
  );
};

export default MindMapContainer;
