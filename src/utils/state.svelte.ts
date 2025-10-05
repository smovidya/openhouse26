import { untrack } from "svelte";

export class Debounced<T> {
  #value: T;
  #id = $state(0);
  #timeoutId: any = $state(null);
  debouncedTimeMs: number;

  constructor(initial: T, debouncedTimeMs = 500) {
    this.#value = initial;
    this.debouncedTimeMs = debouncedTimeMs;
  }

  get pending() {
    return !!this.#timeoutId;
  }

  get current() {
    this.#id;
    return this.#value;
  }

  set current(value: T) {
    const timeout = untrack(() => this.#timeoutId);
    if (timeout) {
      clearTimeout(timeout);
    }

    this.#timeoutId = setTimeout(() => {
      this.#id += 1;
      this.#value = value;
      this.#timeoutId = null;
    }, this.debouncedTimeMs);
  }
}

interface DebouncedParams<T> {
  getter: () => T,
  debouncedTimeMs?: number;
}

export function debounced<T>(params: DebouncedParams<T>) {
  const { getter, debouncedTimeMs } = params;
  const d = new Debounced(getter(), debouncedTimeMs);
  $effect(() => {
    d.current = getter();
  });

  return d;
}

