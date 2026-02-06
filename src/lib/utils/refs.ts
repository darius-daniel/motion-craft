/**
 * Merges multiple refs into a single callback ref function
 */
export function mergeRefs<T = any>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return (element: T | null) => {
    refs.forEach(ref => {
      if (!ref) return;

      if (typeof ref === 'function') {
        ref(element);
      } else {
        (ref as React.RefObject<T | null>).current = element;
      }
    });
  };
}
