<script lang="ts">
  import { actions } from "astro:actions";
  import Pagination from "@src/components/common/table/pagination.svelte";
  import ResourceTable from "@src/components/common/table/resource-table.svelte";
  import Search from "@src/components/common/table/search.svelte";
  import {
    competitorTiers,
    type CompetitorTier,
  } from "@src/data/scilympic";
  import { resource } from "runed";

  type Competitor = {
    id: string;
    teamId: string | null;
    email: string | null;
    phone: string | null;
    names: string[] | null;
    tier: CompetitorTier | null;
    onlineRoundScore: number | null;
  };

  type CompetitorMutationInput = {
    teamId: string;
    email: string;
    phone: string;
    namesText: string;
    tier: CompetitorTier;
    onlineRoundScore: number;
  };

  let tableState = $state<{
    limit: number;
    page: number;
    searchQuery: string;
    tierFilter: "" | CompetitorTier;
  }>({
    limit: 20,
    page: 1,
    searchQuery: "",
    tierFilter: "",
  });

  let mutationPending = $state(false);
  let editingId = $state<string | null>(null);

  const emptyDraft = (): CompetitorMutationInput => ({
    teamId: "",
    email: "",
    phone: "",
    namesText: "",
    tier: competitorTiers[0],
    onlineRoundScore: 0,
  });

  let createDraft = $state<CompetitorMutationInput>(emptyDraft());
  let editDraft = $state<CompetitorMutationInput>(emptyDraft());

  const loadedCompetitors = resource(
    [
      () => tableState.limit,
      () => tableState.page,
      () => tableState.searchQuery,
      () => tableState.tierFilter,
    ],
    async ([limit, page, searchQuery, tierFilter]) => {
      const { data, error } = await actions.competition.listCompetitorsAdmin({
        limit,
        page,
        searchQuery,
        tier: tierFilter || undefined,
      });

      if (error) throw error;

      return {
        items: data?.items ?? [],
        total: data?.total ?? 0,
      };
    },
    { debounce: 300 },
  );

  const toNamesText = (names: string[] | null | undefined) =>
    (names ?? []).join("\n");

  const parseNames = (namesText: string) =>
    namesText
      .split("\n")
      .map((name) => name.trim())
      .filter(Boolean);

  const toMutablePayload = (draft: CompetitorMutationInput) => ({
    teamId: draft.teamId.trim(),
    email: draft.email.trim(),
    phone: draft.phone.trim(),
    namesText: draft.namesText,
    tier: draft.tier,
    onlineRoundScore: Number(draft.onlineRoundScore),
  });

  const startEdit = (row: Competitor) => {
    editingId = row.id;
    editDraft = {
      teamId: row.teamId ?? "",
      email: row.email ?? "",
      phone: row.phone ?? "",
      namesText: toNamesText(row.names),
      tier: row.tier ?? competitorTiers[0],
      onlineRoundScore: row.onlineRoundScore ?? 0,
    };
  };

  const cancelEdit = () => {
    editingId = null;
    editDraft = emptyDraft();
  };

  const validateInput = (payload: CompetitorMutationInput) => {
    if (
      !payload.teamId.trim() ||
      !payload.email.trim() ||
      !payload.phone.trim() ||
      parseNames(payload.namesText).length === 0
    ) {
      return "กรุณากรอกข้อมูลให้ครบถ้วน";
    }
    return null;
  };

  const handleCreate = async () => {
    const validationError = validateInput(createDraft);
    if (validationError) {
      alert(validationError);
      return;
    }

    mutationPending = true;
    const { error } = await actions.competition.createCompetitorAdmin(
      toMutablePayload(createDraft),
    );
    mutationPending = false;

    if (error) {
      alert(error.message);
      return;
    }

    createDraft = emptyDraft();
    tableState.page = 1;
    loadedCompetitors.refetch();
  };

  const handleUpdate = async (id: string) => {
    const validationError = validateInput(editDraft);
    if (validationError) {
      alert(validationError);
      return;
    }

    mutationPending = true;
    const { error } = await actions.competition.updateCompetitorAdmin({
      id,
      ...toMutablePayload(editDraft),
    });
    mutationPending = false;

    if (error) {
      alert(error.message);
      return;
    }

    cancelEdit();
    loadedCompetitors.refetch();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("ยืนยันการลบทีมนี้หรือไม่?")) return;

    mutationPending = true;
    const { error } = await actions.competition.deleteCompetitorAdmin({ id });
    mutationPending = false;

    if (error) {
      alert(error.message);
      return;
    }

    if (editingId === id) cancelEdit();
    loadedCompetitors.refetch();
  };
</script>

<ResourceTable resourceLoader={loadedCompetitors}>
  {#snippet header()}
    <div class="flex w-full flex-wrap items-center justify-between gap-2">
      <Search bind:searchQuery={tableState.searchQuery} class="w-72" />
      <label class="flex items-center gap-2 text-sm">
        Tier
        <select
          class="select select-sm"
          bind:value={tableState.tierFilter}
          onchange={() => {
            tableState.page = 1;
          }}
        >
          <option value="">ทั้งหมด</option>
          {#each competitorTiers as tier (tier)}
            <option value={tier}>{tier}</option>
          {/each}
        </select>
      </label>
    </div>
  {/snippet}

  {#snippet table(data)}
    <thead>
      <tr>
        <th>Team ID</th>
        <th>Email</th>
        <th>Phone</th>
        <th>Names</th>
        <th>Tier</th>
        <th>Score</th>
        <th></th>
      </tr>
    </thead>
    <tbody>
      <tr class="bg-base-200/60">
        <td>
          <input
            class="input input-sm w-36"
            bind:value={createDraft.teamId}
            disabled={mutationPending}
          />
        </td>
        <td>
          <input
            class="input input-sm w-56"
            bind:value={createDraft.email}
            disabled={mutationPending}
          />
        </td>
        <td>
          <input
            class="input input-sm w-36"
            bind:value={createDraft.phone}
            disabled={mutationPending}
          />
        </td>
        <td>
          <textarea
            class="textarea textarea-sm h-20 w-56"
            bind:value={createDraft.namesText}
            placeholder="1 บรรทัดต่อ 1 คน"
            disabled={mutationPending}
          ></textarea>
        </td>
        <td>
          <select
            class="select select-sm w-48"
            bind:value={createDraft.tier}
            disabled={mutationPending}
          >
            {#each competitorTiers as tier (tier)}
              <option value={tier}>{tier}</option>
            {/each}
          </select>
        </td>
        <td>
          <input
            type="number"
            class="input input-sm w-28"
            bind:value={createDraft.onlineRoundScore}
            disabled={mutationPending}
          />
        </td>
        <td>
          <button
            class="btn btn-primary btn-sm"
            disabled={mutationPending}
            onclick={handleCreate}
          >
            เพิ่มทีม
          </button>
        </td>
      </tr>

      {#if data.items.length === 0}
        <tr>
          <td colspan="7" class="text-center text-sm opacity-60 py-8">
            ไม่พบข้อมูลทีมแข่งขัน
          </td>
        </tr>
      {/if}

      {#each data.items as row (row.id)}
        <tr>
          {#if editingId === row.id}
            <td>
              <input
                class="input input-sm w-36"
                bind:value={editDraft.teamId}
                disabled={mutationPending}
              />
            </td>
            <td>
              <input
                class="input input-sm w-56"
                bind:value={editDraft.email}
                disabled={mutationPending}
              />
            </td>
            <td>
              <input
                class="input input-sm w-36"
                bind:value={editDraft.phone}
                disabled={mutationPending}
              />
            </td>
            <td>
              <textarea
                class="textarea textarea-sm h-20 w-56"
                bind:value={editDraft.namesText}
                disabled={mutationPending}
              ></textarea>
            </td>
            <td>
              <select
                class="select select-sm w-48"
                bind:value={editDraft.tier}
                disabled={mutationPending}
              >
                {#each competitorTiers as tier (tier)}
                  <option value={tier}>{tier}</option>
                {/each}
              </select>
            </td>
            <td>
              <input
                type="number"
                class="input input-sm w-28"
                bind:value={editDraft.onlineRoundScore}
                disabled={mutationPending}
              />
            </td>
            <td>
              <div class="flex gap-2">
                <button
                  class="btn btn-primary btn-sm"
                  disabled={mutationPending}
                  onclick={() => handleUpdate(row.id)}
                >
                  บันทึก
                </button>
                <button
                  class="btn btn-ghost btn-sm"
                  disabled={mutationPending}
                  onclick={cancelEdit}
                >
                  ยกเลิก
                </button>
              </div>
            </td>
          {:else}
            <td>{row.teamId || "-"}</td>
            <td>{row.email || "-"}</td>
            <td>{row.phone || "-"}</td>
            <td>
              <div class="max-w-60 whitespace-pre-line text-sm">
                {toNamesText(row.names) || "-"}
              </div>
            </td>
            <td>{row.tier || "-"}</td>
            <td>{row.onlineRoundScore ?? "-"}</td>
            <td>
              <div class="flex gap-2">
                <button
                  class="btn btn-ghost btn-sm"
                  disabled={mutationPending}
                  onclick={() => startEdit(row)}
                >
                  แก้ไข
                </button>
                <button
                  class="btn btn-error btn-outline btn-sm"
                  disabled={mutationPending}
                  onclick={() => handleDelete(row.id)}
                >
                  ลบ
                </button>
              </div>
            </td>
          {/if}
        </tr>
      {/each}
    </tbody>
  {/snippet}

  {#snippet footer(data)}
    <Pagination
      total={data.total}
      bind:limit={tableState.limit}
      bind:page={tableState.page}
      onPageChange={(page) => (tableState.page = page)}
      onLimitChange={(limit) => {
        tableState.limit = limit;
        tableState.page = 1;
      }}
    />
  {/snippet}
</ResourceTable>