<script lang="ts">
  import { roles } from "@src/auth/permissions";
  import { hasOneOfRoleIn } from "@src/auth/utils";
  import { prefetch } from "astro:prefetch";
  import { onMount } from "svelte";

  interface PageOption {
    label: string;
    href: string;
    role: (keyof typeof roles)[];
  }

  const pageOptions: PageOption[] = [
    {
      label: "Staff Home",
      href: "/staff",
      role: [
        "admin",
        "majorBoothStaff",
        "registarStaff",
        "rewardStaff",
        "workshopStaff",
      ],
    },
    {
      label: "ตรวจสถานะผู้เข้าร่วมงาน",
      href: "/staff/check-attendance",
      role: [
        "admin",
        "majorBoothStaff",
        "registarStaff",
        "rewardStaff",
        "workshopStaff",
      ],
    },
    {
      label: "สตาฟบูธ / จุดสะสมคะแนน",
      href: "/staff/check-booth-attendance",
      role: ["admin", "majorBoothStaff"],
    },
    {
      label: "สตาฟเวิร์กช็อป",
      href: "/staff/check-workshop-attendance",
      role: ["admin", "workshopStaff"],
    },
    {
      label: "เช็คอินทะเบียน",
      href: "/staff/check-registration-attendance",
      role: ["admin", "registarStaff"],
    },
    {
      label: "จุดแลกของที่ระลึก",
      href: "/staff/redeem",
      role: ["admin", "rewardStaff"],
    },
  ];

  onMount(() => {
    for (const { href } of pageOptions) {
      prefetch(href);
    }
  });

  const {
    currentPath,
    user,
  }: {
    currentPath: string;
    user: {
      role: string;
      image: string;
    };
  } = $props();
</script>

<div class="not-prose flex flex-row items-center justify-between gap-3">
  <div class="flex flex-row items-center gap-3 flex-1">
    <a class="block" href="/staff" data-astro-prefetch>
      <img src="/logo.png" alt="Logo" width="48" height="48" />
    </a>
    <select
      class="text-xl select flex-1"
      bind:value={
        () => {
          if (import.meta.env.SSR) {
            return currentPath;
          }
          const url = window.location.href;
          const page = pageOptions
            .toReversed()
            .find((it) => url.includes(it.href))!;
          return page.href;
        },
        (value) => {
          window.location.href = value;
        }
      }
    >
      {#each pageOptions as page}
        {#if hasOneOfRoleIn(user, page.role)}
          <option value={page.href}>{page.label}</option>
        {/if}
      {/each}
    </select>
  </div>
  <div class="avatar">
    <div class="rounded-full w-10">
      <img src={user.image} alt="User Avatar" />
    </div>
  </div>
</div>
