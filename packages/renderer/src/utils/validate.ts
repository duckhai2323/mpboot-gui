export const isValidSourceFile = (source: string) => {
  return source.endsWith('.phy');
};

export const isValidTreefile = (treefile: string) => {
  return treefile.endsWith('.treefile');
};
