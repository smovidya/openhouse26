<script lang="ts">
  import { authClientSvelte } from "@src/auth/client";
  import { cn } from "@src/components/utils";
  import RightArrowIcon from "carbon-icons-svelte/lib/ArrowRight.svelte";
  import Pagination from "@src/components/common/table/pagination.svelte";
  import type { UserWithRole } from "better-auth/plugins";
  import AsyncTable from "@src/components/common/table/async-table.svelte";

  let tableState = $state<{
    limit: number;
    page: number;
    searchQuery: string;
  }>({
    limit: 20,
    page: 1,
    searchQuery: "",
  });

  async function loadUsers({ page = 1, limit = tableState.limit }) {
    throw new Error("test");
    const { data, error } = await authClientSvelte.admin.listUsers({
      query: {
        limit,
        offset: (page - 1) * limit,
        searchField: "email",
        searchOperator: "contains",
        searchValue: tableState.searchQuery,
      },
    });
    if (error) alert(error?.message);
    return {
      users: data?.users,
      totalCount: data?.total,
      maxPage: Math.ceil((data?.total ?? 0) / limit),
    };
  }
</script>

{#snippet roleDisplay(roles: string)}
  {@const splittedRoles = roles.split(",")}
  <div class="flex flex-wrap gap-2">
    {#each splittedRoles as role (role)}
      <span
        class={cn(
          "badge badge-sm",
          role === "admin" && "badge-accent",
          role.startsWith("staff") && "badge-secondary",
        )}>{role}</span
      >
    {/each}
  </div>
{/snippet}

<AsyncTable
  loaderFn={async () =>
    loadUsers({
      limit: tableState.limit,
      page: tableState.page,
    })}
>
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
      total={users.totalCount || 0}
      limit={tableState.limit}
      page={tableState.page}
      onPageChange={(page) => (tableState.page = page)}
      onLimitChange={(limit) => (tableState.limit = limit)}
    />
  {/snippet}
</AsyncTable>
