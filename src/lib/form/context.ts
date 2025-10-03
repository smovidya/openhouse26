import { getContext, setContext } from "svelte";

export function setFieldName(name: string) {
  setContext("lib:form:field-name", name);
}

export function getFieldName() {
  return getContext("lib:form:field-name") as string;
}


export function setFormState(state) {
  setContext("lib:form:form-state", state);
}

export function getFormState() {
  return getContext("lib:form:form-state") as any;
}
