<script lang="ts">
  import { toSVG } from "@bwip-js/generic";
  import clsx from "clsx";
  interface Props {
    class?: any;
    content: string;
  }

  let { class: className, content }: Props = $props();

  let svg = $derived(
    toSVG({
      text: content,
      bcid: "azteccode",
      // bcid: "azteccodecompact",
    }),
  );
</script>

<div class={clsx("bg-white", className)}>
  {@html svg}
</div>
