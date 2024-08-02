import { useEffect, useCallback, useRef, useState } from 'react';

const useInfiniteScroll = (callback: () => void) => {
  const [isFetching, setIsFetching] = useState(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        console.log('Last element is visible');
        setIsFetching(true);
      }
    });
    if (node) observer.current.observe(node);
  }, []);

  useEffect(() => {
    if (!isFetching) return;
    callback();
  }, [isFetching, callback]);

  return { lastElementRef, isFetching, setIsFetching };
};

export default useInfiniteScroll;