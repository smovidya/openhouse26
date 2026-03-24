<script lang="ts">
    import QrIcon from "@src/assets/icons/qrcode.svg";
    import LogoNoCircle from "@src/assets/logo-no-circle.png";
    import clsx from "clsx";
    import { Hamburger } from 'svelte-hamburgers';

    interface Props {
        class?: string;
    }
    let { class: className }: Props = $props();

    let menuOpen = $state(false);
    const menuList = [
        {title:"LOBBY",icon:"/nowath/icon/hotel.svg"},
        {title:"WEBSITES",icon:"/nowath/icon/globe.svg"},
        {title:"WORKSHOPS",icon:"/nowath/icon/flask-round.svg"},
        {title:"RECHECK",icon:"/nowath/icon/redeem.svg"},
        {title:"REDEEM",icon:"/nowath/icon/file-badge.svg"},
    ]
</script>

<nav class={clsx("w-full z-100 h-20 relative shadow-md shadow-black/30 bg-(--background)", className)}>
    <div class="flex justify-between items-center w-full h-full px-4">
        <a href="/" class="z-10">
            <img src={`/nowath/logo/logo1.svg`} alt="logo" />
        </a>
        <div class="flex z-10 relative h-full items-center text-xs font-serif">
            <Hamburger  type="slider" bind:open={menuOpen} onclick={() => console.log("fawd")} --color="#F7F5EA" />
        </div>
    </div>
</nav>

{#if menuOpen}
    <div class="fixed w-full max-w-125 z-99">
        {#each menuList as item}
            <a href="/" class="flex gap-2 px-4 h-20 items-center bg-(--color-2) group hover:bg-(--background) transition-all">
                <img
                    src={item.icon}
                    class=" transition-all"
                    alt={item.icon.split("/")[-1]}
                >
                <span class="group-hover:text-(--text-white) text-(--text-dark) transition-all">{item.title}</span>
            </a>
        {/each}
    </div>
{/if}


<style>
.group:hover img {
    filter: brightness(0) invert(1);
}
</style>
