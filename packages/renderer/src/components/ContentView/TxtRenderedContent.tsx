export type TxtRenderedContentProps = {
  content: string;
  className?: string;
};

export const TxtRenderedContent = (props: TxtRenderedContentProps) => {
  const { content } = props;
  return <pre>{content}</pre>;
};
