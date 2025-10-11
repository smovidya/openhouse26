<script lang="ts">
  interface Props {
    total: number;
    limit: number;
    page: number;
    limitOptions: number[];
    onPageChange: (page: number) => void;
    onLimitChange: (limit: number) => void;
  }

  const {
    total,
    limit,
    page,
    limitOptions = [10, 30, 50, 100, 500],
    onPageChange = () => {},
    onLimitChange = () => {},
  }: Props = $props();
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      onPageChange(newPage);
    }
  };

  const shouldDisabled = (direction: "prev" | "next") => {
    if (direction === "prev") {
      return page === 1;
    } else {
      return page === totalPages;
    }
  };

  const handleLimitChange = (newLimit: number) => {
    if (newLimit > 0) {
      onLimitChange(newLimit);
    }
  };
</script>

<div class="flex w-full justify-center gap-2 items-center">
  <div class="join items-center">
    <button
      class="join-item btn"
      onclick={() => handlePageChange(page - 1)}
      disabled={shouldDisabled("prev")}>«</button
    >
    <span class="join-item p-2 text-sm">Page {page}/{totalPages}</span>
    <button
      class="join-item btn"
      onclick={() => handlePageChange(page + 1)}
      disabled={shouldDisabled("next")}>»</button
    >
  </div>

  <select
    class="select w-44"
    onchange={(event) =>
      handleLimitChange(parseInt((event.target as HTMLSelectElement).value))}
  >
    {#each limitOptions as option (option)}
      <option value={option} selected={option === limit}
        >{option} per page</option
      >
    {/each}
  </select>
</div>
