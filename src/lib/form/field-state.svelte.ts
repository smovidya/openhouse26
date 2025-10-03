import { untrack } from "svelte";
import type { FieldConfig } from "./form-state.svelte";

export class FormField<T> {
  #value?: T = $state();
  #hasValue: boolean = $state(false);
  #error?: string = $state();
  #showError = $state(false);
  config: FieldConfig<T>;

  constructor(config: FieldConfig<T>) {
    this.config = config;

    if ("initialValue" in config) {
      this.#value = config.initialValue;
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
    this.#showError = true;
  }

  get error() {
    return this.#error;
  }

  hideError() {
    this.#showError = false;
  }

  validate() {
    return untrack(() => {
      const error = this.config.validator(this.unsafeGet(), this.#hasValue);
      if (error) {
        this.setError(error);
      }

      return error;
    });
  }
}