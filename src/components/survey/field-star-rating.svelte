<script lang="ts" module>
  import { FieldApi, type AnyFieldApi } from "@tanstack/svelte-form";
  import z from "zod";
</script>

<script lang="ts" generics="T extends AnyFieldApi">
  interface Props {
    title: string;
    starLabels?: string[];
    field: T;
  }

  const {
    title,
    starLabels = [
      "ไม่เห็นด้วยอย่างยิ่ง",
      "ไม่เห็นด้วย",
      "เฉย ๆ",
      "เห็นด้วย",
      "เห็นด้วยอย่างยิ่ง",
    ],
    field: formField,
  }: Props = $props();

  const field = new FieldApi({
    form: formField.form,
    name: formField.name,
    validators: {
      onChange: z.number().min(1, "กรุณาให้คะแนน").max(5, "คะแนนสูงสุดคือ 5"),
    },
  });

  let currentSelect = $state<number | null>(null);

  function handleSelect(e: Event) {
    const target = e.currentTarget as HTMLInputElement;
    const selected = parseInt(target.value, 10);
    currentSelect = selected;
    field.handleChange(selected);
  }

  function handleBlur() {
    field.handleBlur();
  }
</script>

<div
  class="flex flex-col justify-start border p-2 border-base-200/50 rounded-lg sm:flex-row sm:justify-between"
  aria-invalid={field.state.meta.errors.length ? true : false}
>
  <div class="text-lg flex flex-col">
    <span class="text-md font-medium">
      {title}
    </span>
    <span class="text-secondary text-sm">
      {#if currentSelect === null}
        กรุณาคลิกที่ดาวเพื่อให้คะแนน (1 ดาว = {starLabels[0]}, 5 ดาว = {starLabels[4]})
      {:else}
        {starLabels[currentSelect - 1]}
      {/if}
    </span>
    <div>
      {#if field.state.meta.errors}
        <span class="badge-xs text-xs badge badge-error empty:hidden">
          {#each field.state.meta.errors as error}
            <span>{error.message}</span>
          {/each}
        </span>
      {/if}
    </div>
  </div>
  <div class="rating rating-lg my-3 flex gap-1 justify-center">
    {#each Array(5) as _, i (i)}
      <input
        required
        type="radio"
        name={field.name}
        class="mask mask-star-2 bg-orange-300"
        aria-label={starLabels[i] || `${i + 1} ดาว`}
        value={i + 1}
        onchange={handleSelect}
        onblur={handleBlur}
      />
    {/each}
  </div>
</div>
