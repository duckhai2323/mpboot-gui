export const initialContentFileState: ContentFileState = {
  path: '',
  name: '',
};
export type ContentFileState = {
  path: string;
  name: string;
  content?: string;
};
