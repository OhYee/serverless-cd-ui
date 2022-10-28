import React, { FC, useEffect } from 'react';
import ReactFlow, {
  Background,
  MarkerType,
  Position,
  Edge,
  useNodesState,
  useEdgesState,
} from 'react-flow-renderer';
import { INode, PipelineProcessNodeProps } from './types';
import Icon from './Icon';

const getData = (nodes: INode[]) => {
  const newNodes = [];
  const newEdges = [];
  let gap = 0;
  let lastNode = {} as INode;
  for (const index in nodes) {
    const node = nodes[index];
    // node
    if (index !== '0') {
      gap += lastNode.className === 'circle' ? 110 : 200;
    }
    const nodeObj: INode = {
      id: index,
      data: {
        label: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {node.status && <Icon type={node.status} />}
            {node.label}
          </div>
        ),
      },
      position: { x: gap, y: node.className === 'circle' ? -10 : 0 },
      draggable: false,
      connectable: false,
      ...node,
    };
    if (index === '0') {
      nodeObj.type = 'input';
      nodeObj.sourcePosition = Position.Right;
    } else if (index === String(nodes.length - 1)) {
      nodeObj.type = 'output';
      nodeObj.targetPosition = Position.Left;
    } else {
      nodeObj.sourcePosition = Position.Right;
      nodeObj.targetPosition = Position.Left;
    }
    newNodes.push(nodeObj);
    // edge
    const edgeObj: Edge = {
      id: index,
      source: index,
      target: String(Number(index) + 1),
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed,
      },
    };
    newEdges.push(edgeObj);
    lastNode = nodeObj;
  }
  console.log('newNodes', newNodes);
  console.log('newEdges', newEdges);
  return { newNodes, newEdges };
};

const PipelineProcessNode: FC<PipelineProcessNodeProps> = (props) => {
  const { nodes: originNodes, refreshIndex, onClick } = props;
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  useEffect(() => {
    const { newNodes, newEdges } = getData(originNodes);
    setNodes(newNodes);
    setEdges(newEdges);
  }, []);
  useEffect(() => {
    if (refreshIndex > 0) {
      setNodes(nodes.map((node) => ({ ...node, selected: false })));
    }
  }, [refreshIndex]);
  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodeClick={(e, node) => onClick && onClick(node)}
      fitView
    >
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  );
};

export default PipelineProcessNode;