export default class MarkovNode {
  children: Map<number, MarkovNode>;
  weight: number;

  constructor() {
    this.children = new Map();
    this.weight = 0;
  }
}