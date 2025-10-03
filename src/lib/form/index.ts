import { FormState, type FormConfig } from "./form-state.svelte";

export function createForm<T extends Record<string, any>>(config: FormConfig<T>): FormState<T> {
  return new FormState(config);
}

