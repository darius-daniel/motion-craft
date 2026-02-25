/**
 * Merges multiple React refs into a single callback ref function
 *
 * This utility is useful when you need to forward a ref from a parent component
 * while also maintaining an internal ref for your own use.
 *
 * @template T - The type of the element being referenced
 * @param {...Array<React.Ref<T> | undefined>} refs - Variable number of refs to merge
 * @returns {React.RefCallback<T>} A callback ref that updates all provided refs
 *
 * @example
 * ```tsx
 * const MyComponent = React.forwardRef((props, forwardedRef) => {
 *   const internalRef = useRef(null);
 *   const mergedRef = mergeRefs(forwardedRef, internalRef);
 *
 *   return <div ref={mergedRef}>Content</div>;
 * });
 * ```
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
