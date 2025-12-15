"use client";
import Dagre from "@dagrejs/dagre";
import React, { useCallback, useEffect, useState, useMemo } from "react";
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
import MindMapChat from "./MindMapChat";
import { apiClient } from "@/lib/api-client";

const nodeTypes = {
  custom: CustomNode,
};
const edgeTypes = {
  custom: CustomEdge,
};

// Convert tree data to nodes/edges with parent-child relationships
function treeToFlow(MindMapData, onAction, onToggleExpand, filename = "File Name") {
  const nodes = [];
  const edges = [];
  const childrenMap = {}; // parentId -> [childIds]
  let idCounter = 0;
  const nextId = () => `n-${idCounter++}`;

  const walk = (node, parentId = null) => {
    const id = nextId();
    const label = (node?.name ?? node?.title ?? node?.text ?? "").toString();
    const children = node?.children || [];
    const hasChildren = children.length > 0;
    
    nodes.push({
      id,
      type: "custom",
      data: { 
        label, 
        onAction, 
        onToggleExpand,
        hasChildren,
        parentId,
      },
      position: { x: 0, y: 0 },
      measured: { width: 160, height: 40 },
    });
    
    if (parentId) {
      edges.push({
        id: `e-${parentId}-${id}`,
        source: parentId,
        target: id,
        type: "custom",
      });
      // Track children
      if (!childrenMap[parentId]) childrenMap[parentId] = [];
      childrenMap[parentId].push(id);
    }
    
    children.forEach((child) => walk(child, id));
    return id;
  };

  const rootIds = [];
  
  // If filename is provided, create a parent node for all MindMapData
  if (filename) {
    const fileRootId = nextId();
    const mindMapRootIds = [];
    
    // First, walk all MindMapData roots as children of the file node
    (MindMapData || []).forEach((root) => {
      const rootId = walk(root, fileRootId);
      mindMapRootIds.push(rootId);
    });
    
    // Create the filename parent node
    nodes.unshift({
      id: fileRootId,
      type: "custom",
      data: { 
        label: filename, 
        onAction, 
        onToggleExpand,
        hasChildren: mindMapRootIds.length > 0,
        parentId: null,
        isFileRoot: true,
      },
      position: { x: 0, y: 0 },
      measured: { width: 200, height: 40 },
    });
    
    // Add children to the file root
    childrenMap[fileRootId] = mindMapRootIds;
    rootIds.push(fileRootId);
  } else {
    // No filename, use original behavior
    (MindMapData || []).forEach((root) => {
      const rootId = walk(root, null);
      rootIds.push(rootId);
    });
  }
  
  // Add childrenMap to node data
  nodes.forEach((n) => {
    n.data.childIds = childrenMap[n.id] || [];
  });
  
  return { nodes, edges, rootIds, childrenMap };
}

const getLayoutedElements = (nodes, edges, options, existingPositions = {}) => {
  if (!nodes.length) return { nodes: [], edges: [] };
  
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options.direction, ranksep: 280, nodesep: 100 });

  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  nodes.forEach((node) =>
    g.setNode(node.id, {
      ...node,
      width: node.measured?.width ?? 160,
      height: node.measured?.height ?? 40,
    })
  );

  Dagre.layout(g);

  // Calculate the offset to keep existing nodes in place
  let offsetY = 0;
  const firstExistingNode = nodes.find(n => existingPositions[n.id]);
  if (firstExistingNode) {
    const newPos = g.node(firstExistingNode.id);
    const oldPos = existingPositions[firstExistingNode.id];
    if (newPos && oldPos) {
      offsetY = oldPos.y - (newPos.y - (firstExistingNode.measured?.height ?? 40) / 2);
    }
  }

  return {
    nodes: nodes.map((node) => {
      const position = g.node(node.id);
      if (!position) return node;
      const x = position.x - (node.measured?.width ?? 160) / 2;
      const y = position.y - (node.measured?.height ?? 40) / 2 + offsetY;
      return { 
        ...node, 
        position: { x, y },
        style: { 
          ...node.style,
          transition: 'transform 0.3s ease-out',
        },
      };
    }),
    edges,
  };
};

function extractMindMapData(json) {
  // Try to extract filename from various possible locations
  let filename = null;
  
  // Check for filename in different places
   filename = json.data.fileName;
  // Also check in nested data array
  if (!filename && Array.isArray(json?.data)) {
    const first = json.data[0];
    if (first?.fileName) filename = first.fileName;
    else if (first?.originalName) filename = first.originalName;
    else if (first?.name) filename = first.name;
  }
  
  // Extract MindMapData roots
  let roots = null;
  if (Array.isArray(json?.data?.MindMapData)) roots = json.data.MindMapData;
  else if (Array.isArray(json?.MindMapData)) roots = json.MindMapData;
  else if (Array.isArray(json?.data)) {
    const combined = json.data.flatMap((it) =>
      Array.isArray(it?.MindMapData) ? it.MindMapData : []
    );
    if (combined.length) roots = combined;
  }
  const nested = json?.data?.data;
  if (!roots && Array.isArray(nested)) {
    const combined = nested.flatMap((it) =>
      Array.isArray(it?.MindMapData) ? it.MindMapData : []
    );
    if (combined.length) roots = combined;
  }
  
  return { roots, filename };
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
      data: { skeleton: true, label: "", hasChildren: false },
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

// Create skeleton once outside component
const SKELETON_GRAPH = makeSkeletonGraph();

// Get all descendant node IDs recursively
function getDescendants(nodeId, childrenMap, result = new Set()) {
  const children = childrenMap[nodeId] || [];
  children.forEach((childId) => {
    result.add(childId);
    getDescendants(childId, childrenMap, result);
  });
  return result;
}

const MindMapContent = ({ initialNodes, initialEdges, fileId }) => {
  const { fitView } = useReactFlow();
  
  // Use static skeleton to avoid recreating on every render
  const skeleton = SKELETON_GRAPH;
  
  // Chat and active node state
  const [chatOpen, setChatOpen] = useState(false);
  const [activeNode, setActiveNode] = useState(null);
  
  // All nodes and edges (complete graph)
  const [allNodes, setAllNodes] = useState([]);
  const [allEdges, setAllEdges] = useState([]);
  const [childrenMap, setChildrenMap] = useState({});
  const [rootIds, setRootIds] = useState([]);
  
  // Expanded nodes set
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  
  // Toggle expand/collapse for a node
  const handleToggleExpand = useCallback((nodeId) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);
  
  // Handle node action (from context menu)
  const handleNodeAction = useCallback((actionId, nodeId, nodeData) => {
    console.log("Action:", actionId, "Node:", nodeId, "Data:", nodeData);
    if (actionId === "ask-ai") {
      setActiveNode({ id: nodeId, label: nodeData?.label });
      setChatOpen(true);
    }
  }, []);
  
  // Handle chat message send
  const handleSendMessage = useCallback((message, node) => {
    console.log("Chat message:", message, "About node:", node);
  }, []);

  // Compute visible nodes based on expanded state
  const visibleNodes = useMemo(() => {
    if (!allNodes.length) return skeleton.nodes;
    
    const visible = new Set(rootIds);
    
    // Add children of expanded nodes
    const addVisibleChildren = (nodeId) => {
      if (expandedNodes.has(nodeId)) {
        const children = childrenMap[nodeId] || [];
        children.forEach((childId) => {
          visible.add(childId);
          addVisibleChildren(childId);
        });
      }
    };
    
    rootIds.forEach((rootId) => addVisibleChildren(rootId));
    
    return allNodes
      .filter((n) => visible.has(n.id))
      .map((n) => ({
        ...n,
        data: {
          ...n.data,
          isExpanded: expandedNodes.has(n.id),
          onToggleExpand: handleToggleExpand,
          onAction: handleNodeAction,
        },
      }));
  }, [allNodes, expandedNodes, childrenMap, rootIds, handleToggleExpand, handleNodeAction]);

  // Compute visible edges
  const visibleEdges = useMemo(() => {
    if (!allEdges.length) return skeleton.edges;
    
    const visibleNodeIds = new Set(visibleNodes.map((n) => n.id));
    return allEdges.filter(
      (e) => visibleNodeIds.has(e.source) && visibleNodeIds.has(e.target)
    );
  }, [allEdges, visibleNodes]);

  // Layout visible nodes
  const [nodes, setNodes] = useState(skeleton.nodes);
  const [edges, setEdges] = useState(skeleton.edges);
  
  // Track previous visible node IDs for entrance animation
  const prevVisibleIdsRef = React.useRef(new Set());
  const nodePositionsRef = React.useRef({});
  const allNodesMapRef = React.useRef({});
  const isAnimatingRef = React.useRef(false);
  
  // Store all nodes map for parent lookup
  useEffect(() => {
    const map = {};
    allNodes.forEach(n => { map[n.id] = n; });
    allNodesMapRef.current = map;
  }, [allNodes]);
  
  // Layout visible nodes when they change  
  useEffect(() => {
    if (!allNodes.length) return;
    if (isAnimatingRef.current) return;
    
    const currentIds = new Set(visibleNodes.map(n => n.id));
    const prevIds = prevVisibleIdsRef.current;
    
    // Find nodes being removed
    const removedNodeIds = [...prevIds].filter(id => !currentIds.has(id));
    
    // If nodes are being removed, animate them out first
    if (removedNodeIds.length > 0) {
      isAnimatingRef.current = true;
      
      // Animate removed nodes to their parent position
      setNodes(prev => prev.map(node => {
        if (removedNodeIds.includes(node.id)) {
          const parentId = node.data?.parentId;
          const parentPos = nodePositionsRef.current[parentId] || { x: 0, y: 0 };
          
          return {
            ...node,
            position: parentPos,
            style: {
              ...node.style,
              opacity: 0,
              transition: 'transform 0.3s ease-in, opacity 0.2s ease-in',
            },
          };
        }
        return node;
      }));
      
      // After animation, update to new layout
      setTimeout(() => {
        if (visibleNodes.length) {
          const layouted = getLayoutedElements(visibleNodes, visibleEdges, {
            direction: "LR",
          }, nodePositionsRef.current);
          setNodes(layouted.nodes);
          setEdges(layouted.edges);
          
          // Store positions
          const currentPositions = {};
          layouted.nodes.forEach(n => {
            currentPositions[n.id] = n.position;
          });
          nodePositionsRef.current = currentPositions;
        }
        prevVisibleIdsRef.current = currentIds;
        isAnimatingRef.current = false;
      }, 300);
      
      return;
    }
    
    // Normal flow: entrance animation for new nodes
    if (visibleNodes.length) {
      const layouted = getLayoutedElements(visibleNodes, visibleEdges, {
        direction: "LR",
      }, nodePositionsRef.current);
      
      // Find newly added nodes
      const newNodeIds = new Set([...currentIds].filter(id => !prevIds.has(id)));
      
      // Get current positions
      const currentPositions = {};
      layouted.nodes.forEach(n => {
        currentPositions[n.id] = n.position;
      });
      
      // For new nodes, place at parent position first
      const nodesWithEntrance = layouted.nodes.map(node => {
        if (newNodeIds.has(node.id) && node.data?.parentId) {
          const parentPos = currentPositions[node.data.parentId] || 
                           nodePositionsRef.current[node.data.parentId] ||
                           { x: 0, y: 0 };
          
          return {
            ...node,
            position: { ...parentPos },
            style: {
              ...node.style,
              opacity: 0,
              transition: 'none',
            },
          };
        }
        return node;
      });
      
      setNodes(nodesWithEntrance);
      setEdges(layouted.edges);
      
      // Animate new nodes to final position
      if (newNodeIds.size > 0) {
        setTimeout(() => {
          setNodes(prev => prev.map(node => {
            if (newNodeIds.has(node.id)) {
              const finalPos = currentPositions[node.id];
              return {
                ...node,
                position: finalPos,
                style: {
                  ...node.style,
                  opacity: 1,
                  transition: 'transform 0.4s ease-out, opacity 0.3s ease-out',
                },
              };
            }
            return node;
          }));
          
          // Center viewport on the newly expanded nodes after animation
          setTimeout(() => {
            const newNodeIdsArray = [...newNodeIds];
            if (newNodeIdsArray.length > 0) {
              fitView({ 
                nodes: newNodeIdsArray.map(id => ({ id })),
                duration: 400,
                padding: 0.8,
              });
            }
          }, 400);
        }, 50);
      }
      
      nodePositionsRef.current = currentPositions;
      prevVisibleIdsRef.current = currentIds;
    }
  }, [visibleNodes, visibleEdges, allNodes.length]);
  
  // Load data
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        // Show skeleton while loading
        const skLayout = getLayoutedElements(skeleton.nodes, skeleton.edges, {
          direction: "LR",
        });
        setNodes([...skLayout.nodes]);
        setEdges([...skLayout.edges]);
        
        const url = fileId
          ? `/api/ai/mind-maps?fileId=${encodeURIComponent(fileId)}`
          : `/api/ai/mind-maps`;
        const res = await apiClient(url);
        const json = await res.json().catch(() => null);
        const { roots, filename } = extractMindMapData(json);
        if (!Array.isArray(roots) || !roots.length || cancelled) return;
        
        const mapped = treeToFlow(roots, handleNodeAction, handleToggleExpand, filename);
        
        setAllNodes(mapped.nodes);
        setAllEdges(mapped.edges);
        setChildrenMap(mapped.childrenMap);
        setRootIds(mapped.rootIds);
        
        // Start with roots expanded
        setExpandedNodes(new Set(mapped.rootIds));
        
      } catch (e) {
        console.error("Error loading mind map:", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [fileId, handleNodeAction, handleToggleExpand, skeleton.nodes, skeleton.edges]);
  
  const onLayout = useCallback(
    (direction) => {
      const layouted = getLayoutedElements(visibleNodes, visibleEdges, { direction });
      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);
      setTimeout(() => fitView({ duration: 300 }), 50);
    },
    [visibleNodes, visibleEdges, fitView]
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
    <>
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
        nodesDraggable={true}
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
      
      {/* Mind Map Chat Interface */}
      <MindMapChat
        isOpen={chatOpen}
        onClose={() => setChatOpen(false)}
        activeNode={activeNode}
        onSendMessage={handleSendMessage}
      />
    </>
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

