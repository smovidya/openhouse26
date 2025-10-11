<script lang="ts">
    import { actions } from "astro:actions";

    let uid = $state("isei");
    let data = $state('"test"');

    function send() {
        if (!actions.sentStuff) {
            return;
        }
        
        console.log("send", { uid, data });
        actions.sentStuff({
            to: uid,
            data: JSON.parse(data),
        });
    }
</script>

<div class="gap-3 flex flex-col border rounded p-2">
    <h1 class="text-2xl">noti sender</h1>
    <label>
        <span>uid</span>
        <input
            type="text"
            bind:value={uid}
            class="font-mono border rounded p-2 bg-black/30 text-white"
        />
    </label>

    <label>
        <span> Data json </span>
        <textarea
            class="font-mono border rounded p-2 bg-black/30 text-white"
            bind:value={data}
        ></textarea>
    </label>

    <button onclick={send} class="border rounded p-2 cursor-pointer">
        send
    </button>
</div>
