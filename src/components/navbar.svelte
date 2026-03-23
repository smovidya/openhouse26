<script lang="ts">
    import QrIcon from "@src/assets/icons/qrcode.svg";
    import LogoNoCircle from "@src/assets/logo-no-circle.png";
    import clsx from "clsx";
    // import { Hamburger } from 'svelte-hamburgers';

    interface Props {
        class?: string;
    }
    let { class: className }: Props = $props();

    let menuOpen = $state(false);
</script>

<nav class={clsx("w-full z-100 h-20 relative shadow-md shadow-black/30 bg-(--background)", className)}>
    <div class="flex justify-between items-center w-full h-full px-4">
        <a href="/" class="z-10">
            <img src={`/nowath/logo/logo1.svg`} alt="logo" />
        </a>
        <div class="flex z-10 relative h-full items-center text-white/80 text-xs font-serif">
            <!-- <Hamburger type="3dx" bind:open={menuOpen} /> -->
            <button type="button" onclick={() => console.log("fawdwd")}>awdwf</button>
        </div>
    </div>
</nav>
