import { MutableRefObject, useRef } from "react";

/*
 * Count renders of current component in hook.
 */
export function useRendersCount(): number {
  const rendersCount: MutableRefObject<number> = useRef(0);

  rendersCount.current += 1;

  return rendersCount.current;
}
