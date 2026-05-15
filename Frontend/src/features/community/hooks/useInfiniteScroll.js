import { useEffect, useRef, useCallback } from 'react';

export const useInfiniteScroll = (onLoadMore, hasMore, isLoading = false) => {
  const sentinelRef = useRef(null);
  const onLoadMoreRef = useRef(onLoadMore);
  const isLoadingRef = useRef(isLoading);
  const hasMoreRef = useRef(hasMore);
  const loadLockRef = useRef(false);

  useEffect(() => {
    onLoadMoreRef.current = onLoadMore;
  }, [onLoadMore]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
    if (!isLoading) {
      loadLockRef.current = false;
    }
  }, [isLoading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  const handleObserver = useCallback((entries) => {
    const [entry] = entries;
    if (
      !entry.isIntersecting ||
      !hasMoreRef.current ||
      isLoadingRef.current ||
      loadLockRef.current
    ) {
      return;
    }

    loadLockRef.current = true;
    onLoadMoreRef.current();
  }, []);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '120px',
      threshold: 0.1,
    });

    observer.observe(node);
    return () => observer.disconnect();
  }, [handleObserver]);

  return sentinelRef;
};
