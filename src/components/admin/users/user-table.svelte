<script lang="ts">
  import { authClientSvelte } from "@src/auth/client";
  import { cn } from "@src/components/utils";
  import RightArrowIcon from "carbon-icons-svelte/lib/ArrowRight.svelte";
  import Pagination from "@src/components/common/table/pagination.svelte";
  import type { UserWithRole } from "better-auth/plugins";

  let tableState = $state<{
    limit: number;
    page: number;
  }>({
    limit: 20,
    page: 1,
  });

  async function loadUsers({ page = 1, limit = tableState.limit }) {
    const { data, error } = await authClientSvelte.admin.listUsers({
      query: {
        limit,
        offset: (page - 1) * limit,
      },
    });
    if (error) return alert(error.message);
    return {
      users: data.users,
      totalCount: data.total,
      maxPage: Math.ceil(data.total / limit),
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

<div class="overflow-x-auto">
  {#await loadUsers({ limit: tableState.limit, page: tableState.page })}
    Loading...
  {:then users}
    {#if users}
      <table class="table">
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
      </table>
      <div class="flex justify-end">
        <Pagination
          total={users.totalCount}
          limit={tableState.limit}
          page={tableState.page}
          onPageChange={(page) => (tableState.page = page)}
        />
      </div>
    {/if}
  {/await}
</div>
