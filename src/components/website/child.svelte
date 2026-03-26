<script lang="ts">
  import Header from "@src/components/card.svelte";
  const { data } = $props();
  const useData = data[0];
</script>

<div class="flex flex-col items-center">
  <Header class=" -translate-y-17 flex relative">
    <a class="absolute left-4" href="/websites">
      <img src="/nowath/assets/returnArrow.svg" alt="" />
    </a>
    <span class="text-lg text-center px-8">{useData.title}</span>
  </Header>
  <div class=" flex justify-center gap-4 -translate-y-10 flex-col w-full px-4">
    {#each useData.data as item}
      <Header class=" w-full h-60">
        <div class="flex flex-col justify-between items-center w-full h-full">
          <div class="flex flex-col p-2">
            <span class="text-base text-center font-normal"
              >{item.titleEng}</span
            >
            <span class="text-base text-center font-normal">{item.titleTH}</span
            >
          </div>
          <img src={item.img} class="max-w-30" alt="" />
          <a
            href={item.path}
            class=" inset-shadow-sm rounded-full inset-shadow-black/20 text-white px-8 py-2 bg-primary"
            >Click here for more !</a
          >
        </div>
      </Header>
    {/each}
  </div>
</div>
