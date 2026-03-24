<script>
    import Card from "@src/components/card.svelte"
</script>

<div class="w-full h-auto relative flex flex-col overflow-x-hidden overflow-y-auto">
    <div class=" w-full h-[calc(100dvh-5rem)]  flex items-center flex-col relative overflow-hidden">
        <img src="/nowath/logo/logo2.svg" class="w-80 z-2" alt=""/>
        <div class="z-2">
            <Card>
                <p class=" text-base md:text-[20px]">28 - 29 March 2026 | 8.00 - 17.00</p>
            </Card>
        </div>
        <div class="z-20 flex gap-4 items-center mt-10">
            <div class=" flex flex-col items-end gap-4">
                <a href="/websites">
                    <img src="/nowath/stamps/departmentStamp.svg" alt="departmentStamp">
                </a>
                <a href="/">
                    <img src="/nowath/stamps/recheckStamp.svg" alt="recheckStamp">
                </a>
                <a href="/">
                    <img src="/nowath/stamps/merchStamp.svg" alt="merchStamp">
                </a>
            </div>
            <div class=" flex flex-col items-start gap-2">
                <a href="/">
                    <img src="/nowath/stamps/workshopStamp.svg" alt="workshopStamp">
                </a>
                <a href="/">
                    <img src="/nowath/stamps/redeemStamp.svg" alt="redeemStamp">
                </a>
            </div>
        </div>
        <div class="absolute top-0 left-0 z-1">
            <img src="/nowath/assets/backdropHotel.svg" class="w-500 max-w-none -translate-y-50 -translate-x-60 blur-xs" alt="backdropHotal">
        </div>
        <div class="absolute bottom-0 left-1/2 -translate-x-1/2 z-1">
            <img src="/nowath/assets/hotel.svg" class="w-140 max-w-none translate-y-30 brightness-80" alt="hotal">
        </div>
    </div>
    <div class="z-20 flex flex-col items-center">
        <Card className="w-150!">
            <p class="text-2xl">Find us here!</p>
        </Card>
        <div class=" py-10 px-10 w-full bg-(--color-3) flex flex-col items-center justify-center gap-4">
            <div class="border-4 border-white">
               <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3875.7110721671347!2d100.52814747551137!3d13.735934486654308!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30e29ed54662d125%3A0x78f74973283617c3!2z4Lit4Liy4LiE4Liy4Lij4Lih4Lir4Liy4Lih4LiB4Li44LiP!5e0!3m2!1sth!2sth!4v1774283404621!5m2!1sth!2sth" width="300" height="250" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
            <span class=" text-center text-(--text-dark)">Mahamakut Building, Faculty of Science, Chulalongkorn University Phayathai Road, Wang Mai, Pathumwan Bangkok 10330, Thailand</span>
        </div>
    </div>
</div>
