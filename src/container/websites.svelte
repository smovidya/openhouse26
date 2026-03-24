<script>
    import Header from "@src/components/card.svelte"
    const stamps = [
        {
            img: "/nowath/stamps/wing/phys.svg",
            path: "/"
        },
        {
            img: "/nowath/stamps/wing/bio.svg",
            path: "/"
        },
        {
            img: "/nowath/stamps/wing/envi.svg",
            path: "/"
        },
        {
            img: "/nowath/stamps/wing/tech.svg",
            path: "/"
        },
        {
            img: "/nowath/stamps/wing/inter.svg",
            path: "/"
        },
    ]
</script>
<div class="flex flex-col items-center">
    <Header className=" -translate-y-6 ">
        <span class="text-lg text-center">Department Website Compilation</span>
    </Header>
    <div class=" flex flex-wrap justify-center gap-2">
       {#each stamps as item}
           <a href="/">
               <img class="w-42" src={item.img} alt={item.img}>
           </a>
       {/each}
    </div>
</div>
