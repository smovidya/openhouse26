<script lang="ts">
  import ResourceTable from "@src/components/common/resource-wrapper.svelte";
  import { resource } from "runed";
  import { authClientSvelte } from "@src/auth/client";

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

  async function revokeAllSessions() {
    const { data, error } = await authClientSvelte.admin.revokeUserSessions({
      userId: id,
    });
    if (error) return alert(error);
    alert("ลบ session ทั้งหมดของผู้ใช้แล้ว");
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

      // @ts-ignore
      dataState.roles = result.data?.role;

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
      <div>
        <button class="btn btn-error" onclick={revokeAllSessions}>
          ลบ session ทั้งหมดของผู้ใช้
        </button>
      </div>
    </div>
  {/snippet}
</ResourceTable>
