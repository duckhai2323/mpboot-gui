declare module 'phylotree' {
  export class phylotree {
    constructor(newick: string): phylotree;

    render(options: any): void;

    getNodeByName(name: string): node;

    reroot(n: node, fraction?: number): phylotree;

    getNewick(): string;

    isLeafNode(node: node): boolean;

    getRootNode(): node;

    links: link[];

    max_x: number;
    max_y: number;
    branch_length: number;
    node_order: string[];
    traverse_and_compute: (callback: (node: node) => void) => void;
    getTips(): node[];

    resortChildren: (callback: (a: node, b: node) => number) => void;
    nodes: node;
    parsed_tags: any[];
    selection_attribute_name: 'selected';
    display: any;
  }

  type node = {
    parent: node;
    children: node[];
    collapsed: boolean;
    unique_id: number;
    hidden: boolean;
    data: node_data;
    count_depth: number;
    date_value?: Date;
    decimal_date_value?: number;
  };
  interface node_data {
    abstract_x: number | undefined;
    abstract_y: number | undefined;
    annotation: string;
    attribute: string;
    name: string;
    text_width: number;
  }

  export type link = {
    source: node;
    target: node;
    name?: string;
  };
  export function centerOfTree(
    tree: phylotree,
    power: number?,
  ): {
    location: node;
    breakpoint: number;
    distance: number;
  };

  export function preOrder(
    node: node,
    callback: (n: node) => void,
    backtrack: (n: node) => void,
  ): node;
  export function inOrder(
    node: node,
    callback: (n: node) => void,
    backtrack: (n: node) => void,
  ): node;
  export function postOrder(
    node: node,
    callback: (n: node) => void,
    backtrack: (n: node) => void,
  ): node;

  export function leftChildRightSibling(root: node): link[];

  export function parseFasta(fastaData: string): any[];

  export function sackin(tree: phylotree): number;

  export function clusterPicker(
    tree: phylotree,
    bootstrap_threshold: number,
    diameter_threshold: number,
    root_node: node?,
    missing_bootstrap_value: number?,
  ): boolean;

  export function computeMidpoint(tree: phylotree): {
    location: node;
    breakpoint: number;
  };

  export function extract_dates(
    tree: phylotree,
    date_getter?: (n: node) => string,
    date_converter: (str: string) => Date,
  ): phylotree;

  export function fitRootToTip(tree: phylotree): {
    root: node;
    fit: {
      intercept: number;
      slope: number;
      r2: number;
      ['var (intercept)']: number;
      ['var (slope)']: number;
    };
  };

  export function getDistanceMatrix(seqs: any[]): any;

  export function loadAnnotations(tree: phylotree, label: string, annotations: any): void;
}
