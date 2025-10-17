<script lang="ts" module>
  import { tv, type VariantProps } from "tailwind-variants";

  export const buttonVariants = tv({
    base: "px-4 py-3 rounded-full w-full focus:outline-2 outline-offset-2 disabled:opacity-50",
    variants: {
      variant: {
        primary:
          "bg-yellow-500 active:bg-yellow-600 text-white outline-yellow-500",
        neutral:
          "bg-neutral-200 active:bg-neutral-300 text-black outline-neutral-700",
      },
    },
    defaultVariants: {
      variant: "primary",
    },
  });

  export type ButtonVariant = VariantProps<typeof buttonVariants>["variant"];
</script>

<script lang="ts">
  import { cn } from "@src/components/utils";
  import type { Snippet } from "svelte";
  import type { HTMLButtonAttributes } from "svelte/elements";

  interface Props {
    children?: Snippet;
    variant?: ButtonVariant;
  }

  const {
    children,
    variant = "primary",
    disabled,
    class: clazz,
    ...props
  }: Props & HTMLButtonAttributes = $props();
</script>

<button
  {disabled}
  type="button"
  class={cn(buttonVariants({ variant }), clazz as any)}
  {...props}
>
  {@render children?.()}
</button>
