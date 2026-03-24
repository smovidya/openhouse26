<script>
  const { className, children } = $props();
</script>

<div
  class={`w-auto min-h-10 bg-(--header-card) text-(--background) flex p-1.5 items-center justify-center rounded-2xl  ${className}`}
>
  <div
    class="w-full h-full flex items-center ring-(--border-1) ring-2 rounded-xl p-2 justify-center px-4 shadow-md"
  >
    {@render children()}
  </div>
</div>
