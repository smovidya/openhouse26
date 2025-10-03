import { untrack } from "svelte";
import { FormField } from "./field-state.svelte";

export interface FieldConfig<TData> {
  validator: (value: TData | undefined, hasValue: boolean) => (string | undefined | null); // return error string if not none 
  initialValue?: TData;
}

export interface FormConfig<TData extends Record<string, any>> {
  fields: {
    [K in keyof TData]: FieldConfig<TData[K]>
  };
}

export class FormState<TData extends Record<string, any>> {
  #config: FormConfig<TData>;
  #fieldNames: (keyof TData)[];
  #fields: Map<string, FormField<any>>;

  constructor(config: FormConfig<TData>) {
    this.#config = config;
    this.#fieldNames = Object.keys(config.fields);
    this.#fields = new Map();

    for (const key of this.#fieldNames) {
      const f = config.fields[key];
      this.#fields.set(key as string, new FormField(f));
    }
  }

  validateField(name: string) {
    const field = this.#fields.get(name);
    if (!field) {
      return;
    }

    field.validate();

  }

  validate() {
    for (const name of this.#fieldNames) {
      this.validateField(name as any);
    }
  }

  dismissError() {
    for (const field of this.#fields.values()) {
      field.hideError();
    }
  }
}