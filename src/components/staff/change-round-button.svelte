<script lang="ts">
  interface Props {
    onclick?: () => unknown;
    title: string;
    subtitle?: string;
  }

  const { onclick, title, subtitle }: Props = $props();
</script>

<button
  class="w-full gap-5 h-12 rounded-full bg-black/40 active:bg-neutral-800/30 border border-white/15 backdrop-blur-2xl flex text-left items-center justify-between px-5 transition-colors"
  {onclick}
>
  <div class="flex flex-col text-sm">
    <span class="line-clamp-1">{title}</span>
    <span class="text-white/60 text-xs">{subtitle}</span>
  </div>
  <span class="rounded-full text-sm text-yellow-500">เปลี่ยน</span>
</button>
