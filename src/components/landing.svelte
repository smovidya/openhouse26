<script lang="ts">
  import Card from "@src/components/card.svelte";
</script>

{#snippet stampImageLink(
  src: string,
  href: string,
  alt: string,
  disabled = false,
)}
  {#if disabled}
    <div aria-disabled="true" class="relative">
      <img {src} {alt} class="grayscale-100" draggable="false" />
      <span
        class="absolute px-1 rounded-md top-1/2 left-1/2 text-nowrap -rotate-25 bg-white text-dark -translate-1/2"
        >Coming Soon!</span
      >
    </div>
  {:else}
    <a {href} class="hover:scale-105 transition-transform active:scale-95">
      <img {src} {alt} draggable="false" />
    </a>
  {/if}
{/snippet}

<div
  class="w-full h-auto relative flex flex-col overflow-x-hidden overflow-y-auto"
>
  <div
    class=" w-full min-h-dvh h-[calc(100dvh-5rem)] flex items-center flex-col relative overflow-hidden"
  >
    <img src="/nowath/logo/logo2.svg" class="w-80 z-2" alt="" />
    <div class="z-2">
      <Card>
        <p class="text-base md:text-[20px] font-bold">
          28 - 29 March 2026 | 8.00 - 17.00
        </p>
      </Card>
    </div>
    <div class="z-20 flex gap-4 items-center mt-10">
      <div class="flex flex-col items-end gap-4">
        {@render stampImageLink(
          "/nowath/stamps/departmentStamp.svg",
          "/websites",
          "departmentStamp",
        )}
        {@render stampImageLink(
          "/nowath/stamps/recheckStamp.svg",
          "/recheck",
          "recheckStamp",
          false,
        )}
        {@render stampImageLink(
          "/nowath/stamps/merchStamp.svg",
          "/merchs",
          "merchStamp",
          false,
        )}
      </div>
      <div class=" flex flex-col items-start gap-2">
        {@render stampImageLink(
          "/nowath/stamps/workshopStamp.svg",
          "/workshops",
          "workshopStamp",
        )}
        {@render stampImageLink(
          "/nowath/stamps/redeemStamp.svg",
          "/redeem",
          "redeemStamp",
          false,
        )}
      </div>
    </div>
    <div class="absolute top-0 left-0 z-1">
      <img
        src="/nowath/assets/backdropHotel.svg"
        class="w-500 max-w-none -translate-y-50 -translate-x-60 blur-xs"
        alt="backdropHotal"
      />
    </div>
    <div class="absolute bottom-0 left-1/2 -translate-x-1/2 z-1">
      <img
        src="/nowath/assets/hotel.svg"
        class="w-140 max-w-none translate-y-30 brightness-80"
        alt="hotal"
        draggable="false"
      />
    </div>
  </div>
  <div class="z-20 flex flex-col items-center">
    <Card class="w-[calc(100%+2rem)]">
      <p class="text-2xl">Find us here!</p>
    </Card>
    <div
      class="py-10 px-10 w-full bg-token-3 flex flex-col items-center justify-center gap-4"
    >
      <div class="border-4 border-white">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.7110721671347!2d100.52814747551137!3d13.735934486654308!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ed54662d125%3A0x78f74973283617c3!2z4Lit4Liy4LiE4Liy4Lij4Lih4Lir4Liy4Lih4LiB4Li44LiP!5e0!3m2!1sth!2sth!4v1774283404621!5m2!1sth!2sth"
          width="300"
          height="250"
          style="border:0;"
          allow="fullscreen"
          loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"
          title="Google Maps"
        ></iframe>
      </div>
      <span class="text-center text-dark"
        >Mahamakut Building, Faculty of Science, Chulalongkorn University
        Phayathai Road, Wang Mai, Pathumwan Bangkok 10330, Thailand</span
      >
    </div>
  </div>
</div>
