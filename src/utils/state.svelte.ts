export class Debounced<T> {
  #value: T = $state() as T;
  #timeoutId: any;
  debouncedTimeMs: number;

  constructor(initial: T, debouncedTimeMs = 500) {
    this.#value = initial;
    this.debouncedTimeMs = debouncedTimeMs;
  }

  get current() {
    return this.#value;
  }

  set current(value: T) {

    if (this.#timeoutId) {
      clearTimeout(this.#timeoutId);
    }

    this.#timeoutId = setTimeout(() => {
      this.#value = value;
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