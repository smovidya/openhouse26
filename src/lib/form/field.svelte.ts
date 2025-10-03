export class FormField<T> {
  #value?: T = $state();
  #hasValue: boolean = $state(false);
  #error?: string = $state();
  #showError = $state(false);

  constructor(value?: T) {
    if (arguments.length !== 0) {
      this.#value = value;
      this.#hasValue = true;
    }
  }

  unsafeGet = () => {
    return this.#value;
  };

  get = () => {
    if (!this.#hasValue) {
      throw new Error("empty");
    }
    return this.#value as T;
  };

  set = (v: T) => {
    this.#value = v;
    this.#hasValue = true;
  };

  clear = () => {
    this.#value = undefined;
    this.#hasValue = false;
  };

  setError(e: string) {
    this.#error = e;
  }

  get error() {
    return this.#error;
  }

}