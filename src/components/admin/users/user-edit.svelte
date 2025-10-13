<script lang="ts">
  import ResourceTable from "@src/components/common/resource-wrapper.svelte";
  import { resource } from "runed";
  import { authClientSvelte } from "@src/auth/client";
  import { createForm } from "@tanstack/svelte-form";

  const {
    id,
  }: {
    id: string;
  } = $props();

  let dataState = $state({
    roles: "",
  });

  async function setUserRole(roles: string) {
    const { data, error } = await authClientSvelte.admin.updateUser({
      userId: id,
      data: {
        role: roles,
      },
    });
    if (error) return alert(error);
    alert("อัปเดตยศผู้ใช้แล้ว");
    window.location.reload();
  }
</script>

<ResourceTable
  resourceLoader={resource(
    () => id,
    async (id, _, { signal }) => {
      const result = await authClientSvelte.admin.getUser({
        query: { id },
        fetchOptions: {
          signal,
        },
      });

      dataState.roles = result.data.role;

      return result;
    },
  )}
>
  {#snippet children({ data, error })}
    <div class="flex flex-col">
      <span>
        <span> Name: </span>
        <span>
          {data?.name}
        </span>
      </span>
      <label class="flex flex-col">
        <span> สิทธิ์ </span>
        <div class="join join-horizontal">
          <input class="input join-item" bind:value={dataState.roles} />
          <button
            class="btn join-item"
            onclick={() => setUserRole(dataState.roles)}
          >
            ตั้ง
          </button>
        </div>
        <span>
          admin, user, registarStaff, majorBoothStaff, workshopStaff,
          rewardStaff,
        </span>
      </label>
      <!-- {"name":"Patsagorn Yuenyong","email":"manpatsagorny@gmail.com","emailVerified":true,"image":"https://lh3.googleusercontent.com/a/ACg8ocIswIKLBcIBeSkGgwegFLCgqsRm87RYSdGPewBxHNWYnAR4ejPv7g=s96-c","createdAt":"2025-10-03T19:05:05.423Z","updatedAt":"2025-10-04T16:45:39.995Z","role":"user,admin","banned":false,"banReason":null,"banExpires":null,"id":"VFwpYIvrPatAnkP68ycQ7mu92sXeL6QE"} -->
    </div>
  {/snippet}
</ResourceTable>
