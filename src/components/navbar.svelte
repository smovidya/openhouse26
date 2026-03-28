<script lang="ts">
  import clsx from "clsx";
  import { Hamburger } from "svelte-hamburgers";
  import { slide } from "svelte/transition";

  interface Props {
    class?: string;
  }
  let { class: className }: Props = $props();

  let menuOpen = $state(false);
  const menuList = [
    { title: "LOBBY", icon: "/nowath/icon/hotel.svg", path: "/" },
    { title: "WEBSITES", icon: "/nowath/icon/globe.svg", path: "/websites" },
    {
      title: "WORKSHOPS",
      icon: "/nowath/icon/flask-round.svg",
      path: "/workshops",
    },
    { title: "RECHECK", icon: "/nowath/icon/redeem.svg", path: "/recheck" },
    // { title: "REDEEM", icon: "/nowath/icon/file-badge.svg", path: "/" },
    {
      title: "MERCHANDISE",
      icon: "/nowath/icon/shopping-cart.svg",
      path: "/merchs",
    },
  ];
</script>

<nav
  class={clsx(
    "w-full z-100 h-20 shadow-md shadow-black/30 bg-background",
    className,
  )}
>
  <div class="flex justify-between items-center w-full h-full px-4">
    <a href="/" class="z-10">
      <img src={`/nowath/logo/logo1.svg`} alt="logo" />
    </a>
    <div class="flex z-10 relative h-full items-center text-xs font-serif">
      <Hamburger type="slider" bind:open={menuOpen} --color="#F7F5EA" />
    </div>
  </div>
</nav>

{#if menuOpen}
  <div class="fixed w-full max-w-lg z-50" transition:slide={{ duration: 300 }}>
    {#each menuList as item}
      <a
        href={item.path}
        class="flex gap-2 px-4 h-20 items-center bg-token-2 group hover:bg-background transition-all"
      >
        <img
          src={item.icon}
          class="transition-all group-hover:brightness-0 group-hover:invert"
          alt={item.icon.split("/")[-1]}
        />
        <span
          class="group-hover:text-white text-xl text-dark transition-all font-bold"
          >{item.title}</span
        >
      </a>
    {/each}
  </div>
{/if}
