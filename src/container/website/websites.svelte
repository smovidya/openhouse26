<script>
    import Header from "@src/components/card.svelte"
    const stamps = [
        {
            img: "/nowath/stamps/wing/phys.svg",
            path: "/websites/phys"
        },
        {
            img: "/nowath/stamps/wing/bio.svg",
            path: "/websites/bio"
        },
        {
            img: "/nowath/stamps/wing/envi.svg",
            path: "/websites/envi"
        },
        {
            img: "/nowath/stamps/wing/tech.svg",
            path: "/websites/tech"
        },
        {
            img: "/nowath/stamps/wing/inter.svg",
            path: "/websites/inter"
        },
    ]
</script>
<div class="flex flex-col items-center">
    <Header className=" -translate-y-17 ">
        <span class="text-lg text-center">Department Website Compilation</span>
    </Header>
    <div class=" flex flex-wrap justify-center gap-2 -translate-y-8">
       {#each stamps as item}
           <a href={item.path}>
               <img class="w-42" src={item.img} alt={item.img}>
           </a>
       {/each}
    </div>
</div>
