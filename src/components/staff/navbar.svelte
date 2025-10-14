<script lang="ts">
  import { roles } from "@src/auth/permissions";
  import { hasOneOfRoleIn } from "@src/auth/utils";

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
      href: "/staff/check-participant-attendance",
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
      label: "เช็คอินทะเบียน (WIP)",
      href: "/staff/check-registration-attendance",
      role: ["admin", "registarStaff"],
    },
    {
      label: "จุดแลกของที่ระลึก (WIP)",
      href: "/staff/redeem",
      role: ["admin", "rewardStaff"],
    },
  ];

  const {
    currentPath,
    user,
  }: {
    currentPath: string;
    user: {
      role: string;
    };
  } = $props();
</script>

<div class="flex flex-row items-center justify-between">
  <div class="flex flex-row items-center gap-3">
    <div class="">
      <img src="/logo.png" alt="Logo" width="48" height="48" />
    </div>
    <select
      class="text-2xl select"
      onchange={(e) => {
        if (!e || !e.target || !e.target?.value) return;
        window.location.href = e.target.value;
      }}
    >
      {#each pageOptions as page}
        {#if hasOneOfRoleIn(user, page.role)}
          <option value={page.href} selected={page.href === currentPath}
            >{page.label}</option
          >
        {/if}
      {/each}
    </select>
  </div>
  <div class="size-10 rounded-full bg-red-500"></div>
</div>
