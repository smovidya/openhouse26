<script lang="ts">
  import ResourceTable from "@src/components/common/resource-wrapper.svelte";
  import { resource } from "runed";
  import { authClientSvelte } from "@src/auth/client";

  const {
    id,
  }: {
    id: string | undefined;
  } = $props();

  const availableRoles = [
    "admin",
    "user",
    "registarStaff",
    "majorBoothStaff",
    "workshopStaff",
    "rewardStaff",
  ] as const;

  function normalizeRoles(value: string) {
    return Array.from(
      new Set(
        value
          .split(",")
          .map((role) => role.trim())
          .filter(Boolean),
      ),
    );
  }

  function syncSelectedRolesFromInput(value: string) {
    const normalized = normalizeRoles(value);
    dataState.selectedRoles = availableRoles.filter((role) =>
      normalized.includes(role),
    );
  }

  function syncInputFromSelectedRoles() {
    dataState.roles = dataState.selectedRoles.join(",");
  }

  function toggleRole(role: (typeof availableRoles)[number]) {
    if (dataState.selectedRoles.includes(role)) {
      dataState.selectedRoles = dataState.selectedRoles.filter(
        (selectedRole) => selectedRole !== role,
      );
    } else {
      dataState.selectedRoles = [...dataState.selectedRoles, role];
    }
    syncInputFromSelectedRoles();
  }

  let dataState = $state({
    roles: "",
    selectedRoles: [] as string[],
    isSaving: false,
    isRevokingSession: false,
  });

  async function setUserRole(roles: string) {
    dataState.isSaving = true;
    const { data, error } = await authClientSvelte.admin.updateUser({
      userId: id,
      data: {
        role: normalizeRoles(roles).join(","),
      },
    });
    dataState.isSaving = false;
    if (error) return alert(error);
    alert("อัปเดตยศผู้ใช้แล้ว");
    window.location.reload();
  }

  async function revokeAllSessions() {
    dataState.isRevokingSession = true;
    const { data, error } = await authClientSvelte.admin.revokeUserSessions({
      userId: id,
    });
    dataState.isRevokingSession = false;
    if (error) return alert(error);
    alert("ลบ session ทั้งหมดของผู้ใช้แล้ว");
  }
</script>

<ResourceTable
  resourceLoader={resource(
    () => id,
    async (id, _, { signal }) => {
      if (!id) return { data: null, error: "No user id provided" };
      const result = await authClientSvelte.admin.getUser({
        query: { id },
        fetchOptions: {
          signal,
        },
      });

      dataState.roles = normalizeRoles(
        (result.data?.role as string) ?? "",
      ).join(",");
      syncSelectedRolesFromInput(dataState.roles);

      return result;
    },
  )}
>
  {#snippet children({ data, error })}
    <div class="flex flex-col gap-3">
      <span>
        <span> Name: </span>
        <span>
          {data?.name}
        </span>
      </span>
      <label class="flex flex-col">
        <span> สิทธิ์ </span>
        <div class="my-2 flex flex-col gap-2">
          {#each availableRoles as role}
            <label
              class="label flex cursor-pointer items-center justify-start gap-3 rounded-box border px-3 py-2"
            >
              <input
                type="checkbox"
                class="checkbox"
                checked={dataState.selectedRoles.includes(role)}
                onchange={() => toggleRole(role)}
              />
              <span>{role}</span>
            </label>
          {/each}
        </div>
        <div class="join join-horizontal">
          <input
            class="input join-item"
            bind:value={dataState.roles}
            oninput={(event) =>
              syncSelectedRolesFromInput(
                (event.currentTarget as HTMLInputElement).value,
              )}
            placeholder="admin,user"
          />
          <button
            class="btn join-item"
            disabled={dataState.isSaving}
            onclick={() => setUserRole(dataState.roles)}
          >
            {dataState.isSaving ? "กำลังบันทึก..." : "ตั้ง"}
          </button>
        </div>
        <span>
          กดเลือกสิทธิ์ด้านบน หรือพิมพ์เป็น comma-separated เช่น admin,user
        </span>
      </label>
      <div>
        <button
          class="btn btn-error"
          disabled={dataState.isRevokingSession}
          onclick={revokeAllSessions}
        >
          {dataState.isRevokingSession
            ? "กำลังลบ session..."
            : "ลบ session ทั้งหมดของผู้ใช้"}
        </button>
      </div>
      {#if error}
        <div class="text-error">{error}</div>
      {/if}
    </div>
  {/snippet}
</ResourceTable>
