<script lang="ts">
  import { authClientSvelte } from "@src/auth/client";
  import { cn } from "@src/components/utils";
  import RightArrowIcon from "carbon-icons-svelte/lib/ArrowRight.svelte";
  import Pagination from "@src/components/common/table/pagination.svelte";
  import ResourceTable from "@src/components/common/table/resource-table.svelte";
  import Search from "@src/components/common/table/search.svelte";
  import { resource } from "runed";

  let tableState = $state<{
    limit: number;
    page: number;
    searchQuery: string;
  }>({
    limit: 20,
    page: 1,
    searchQuery: "",
  });

  const loadedUsers = resource(
    [
      () => tableState.limit,
      () => tableState.page,
      () => tableState.searchQuery,
    ],
    async ([limit, page, searchQuery], _, { signal }) => {
      const { data, error } = await authClientSvelte.admin.listUsers({
        query: {
          limit: limit,
          offset: (page - 1) * limit,
          searchField: "email",
          searchOperator: "contains",
          searchValue: searchQuery,
        },
        fetchOptions: {
          signal,
        },
      });
      if (error) throw error;
      return {
        users: data?.users,
        totalCount: data?.total,
        maxPage: Math.ceil((data?.total ?? 0) / limit),
      };
    },
    { debounce: 300 },
  );
</script>

{#snippet roleDisplay(roles: string)}
  {@const splittedRoles = roles.split(",")}
  <div class="flex flex-wrap gap-2">
    {#each splittedRoles as role (role)}
      <span
        class={cn(
          "badge badge-sm",
          role === "admin" && "badge-accent",
          role.endsWith("Staff") && "badge-neutral",
        )}>{role}</span
      >
    {/each}
  </div>
{/snippet}

<ResourceTable resourceLoader={loadedUsers}>
  {#snippet header()}
    <Search bind:searchQuery={tableState.searchQuery} />
  {/snippet}
  {#snippet table(users)}
    <thead>
      <tr>
        <th>Email</th>
        <th>Role</th>
      </tr>
    </thead>
    <tbody>
      {#each users.users as user}
        <tr>
          <td>{user.email}</td>
          <td>{@render roleDisplay(user.role || "")}</td>
          <td>
            <a
              class="btn btn-ghost btn-sm"
              href={`/admin/users/${user.id}/edit`}
            >
              Edit
              <RightArrowIcon size={16} />
            </a>
          </td>
        </tr>
      {/each}
    </tbody>
  {/snippet}
  {#snippet footer(users)}
    <Pagination
      bind:total={users.totalCount}
      bind:limit={tableState.limit}
      bind:page={tableState.page}
      onPageChange={(page) => (tableState.page = page)}
      onLimitChange={(limit) => (tableState.limit = limit)}
    />
  {/snippet}
</ResourceTable>
