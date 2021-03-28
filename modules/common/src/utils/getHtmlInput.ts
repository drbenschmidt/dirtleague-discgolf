const getHtmlInput = (
  ref: React.RefObject<HTMLElement | undefined>
): HTMLInputElement | null | undefined =>
  ref?.current?.getElementsByTagName('input').item(0);

export default getHtmlInput;
