import { unstable_cache as nextCache } from "next/cache";
import { cache as reactCache } from "react";

// Define a generic type for the callback
type Callback<T, R> = (...args: T[]) => Promise<R>;

// Implement the cache function with explicit generic types
export function cache<T, R>(
  cb: Callback<T, R>,
  keyParts: string[],
  options: { revalidate?: number | false; tags?: string[] } = {}
) {
  // Here we assume reactCache wraps the callback 'cb' and returns a new function
  // You might need to adjust the typing based on the actual behavior of reactCache
  return nextCache(reactCache(cb), keyParts, options);
}
