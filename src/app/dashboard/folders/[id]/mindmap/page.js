const {
  default: MindMapContainer,
} = require("@/components/mindmap/mindMapContainer");

const initialNodes = [
  { id: "n1", position: { x: 0, y: 0 }, data: { label: "جافا سكريبت" } },
  { id: "n2", position: { x: 0, y: 100 }, data: { label: "بايثون" } },
  { id: "n3", position: { x: 100, y: 100 }, data: { label: "HTML" } },
  { id: "n4", position: { x: 100, y: 0 }, data: { label: "CSS" } },
  { id: "n5", position: { x: 200, y: 100 }, data: { label: "Node Js" } },
];
const initialEdges = [
  { id: "n1-n2", source: "n1", target: "n2" },
  { id: "n2-n3", source: "n2", target: "n3" },
  { id: "n3-n4", source: "n3", target: "n4" },
  { id: "n4-n5", source: "n4", target: "n5" },
];
const page = () => {
  return (
    <>
      <MindMapContainer
        initialNodes={initialNodes}
        initialEdges={initialEdges}
      />
    </>
  );
};

export default page;
