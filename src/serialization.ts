import { MarkovCoil, MarkovNode } from "./MarkovCoil";

// [weight, [index1, [weight, 0], index2, [weight, 0]]]
type SerializedNode = [ weight: number, children: (number | SerializedNode)[] | 0 ]

function serializeTrie(node: MarkovNode): SerializedNode {
  if (node.children.size === 0) {
    return [node.weight, 0];
  }

  const serializedChildren: (number | SerializedNode)[] = [];
  for (const key of node.children.keys()) {
    serializedChildren.push(key);
    serializedChildren.push(serializeTrie(node.children.get(key)!))
  }
  return [node.weight, serializedChildren];
}

function deserializeTrie(node: SerializedNode): MarkovNode {
  if (node[1] === 0) {
    const result = new MarkovNode()
    result.weight = Number(node[0]);
    result.children = new Map();
    return result;
  }

  const result = new MarkovNode();
  result.weight = Number(node[0]);
  const serializedChildren = node[1] as (number | SerializedNode)[];
  for (let i = 0; i < serializedChildren.length - 1; i += 2) {
    const index = serializedChildren[i] as number;
    const children = deserializeTrie(serializedChildren[i + 1] as SerializedNode);
    result.children.set(index, children);
  }
  return result;
}

export function serialize(markov: MarkovCoil) {
  const encodedRoot = serializeTrie(markov.root);
  return JSON.stringify([markov.depth, markov.vocab.tokens, encodedRoot]);
}

export function deserialize(json: string): MarkovCoil {
  const markov = new MarkovCoil([]);
  const data = JSON.parse(json);
  
  markov.depth = data[0];
  markov.vocab.tokens = data[1];
  markov.vocab.tokens.forEach((token: string, index: number) => {
    markov.vocab.indexes.set(token, index)
  });
  markov.root = deserializeTrie(data[2])
  return markov;
}
