<script lang="ts">
  interface Props {
    onclick?: () => unknown;
    title: string;
    subtitle?: string;
  }

  const { onclick, title, subtitle }: Props = $props();
</script>

<button
  class="w-full h-12 rounded-full bg-black/40 active:bg-neutral-800/30 border border-white/15 backdrop-blur-2xl flex text-left items-center justify-between px-5 transition-colors"
  {onclick}
>
  <div class="leading-4 text-sm">
    <p class="line-clamp-1">{title}</p>
    <p class="text-white/60">{subtitle}</p>
  </div>
  <p class="rounded-full text-sm text-yellow-500">เปลี่ยน</p>
</button>
