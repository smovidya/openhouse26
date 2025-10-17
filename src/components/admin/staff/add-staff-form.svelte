<script lang="ts">
  import { actions } from "astro:actions";
  import { createForm } from "@tanstack/svelte-form";
  import { roles } from "@src/auth/permissions";
  import Checkbox from "@src/components/registration/checkboxes.svelte";
  import WarningDiamond from "carbon-icons-svelte/lib/WarningDiamond.svelte";

  const form = createForm(() => ({
    defaultValues: {
      name: "",
      studentId: "",
      email: "",
      phone: "",
      booth: "",
      requestedRole: ["user"] as string[],
    },
    onSubmit: async ({ value }) => {
      const { data, error } = await actions.adminAddStaff({
        boothName: value.booth,
        emails: value.email.split("\n").map((it) => it.trim()),
        name: value.name,
        phone: value.phone,
        requestedRole: value.requestedRole,
        studentId: value.studentId,
      });
      if (error) return alert(error);
      window.location.href = `/admin`;
    },
  }));

  const possibleRoles = Object.keys(roles);
</script>

{#snippet fieldError(message: string)}
  {#if message}
    <span class="text-error-content bg-error/50 rounded-md p-1 label">
      <WarningDiamond size={16} />
      {message}
    </span>
  {/if}
{/snippet}

<form
  onsubmit={(e) => {
    e.preventDefault();
    e.stopPropagation();
    form.handleSubmit();
  }}
  class="flex flex-col gap-2"
>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">ชื่อ สกุล</legend>
    <form.Field name="name">
      {#snippet children(field)}
        <input
          type="text"
          class="input"
          name={field.name}
          value={field.state.value}
          onblur={field.handleBlur}
          oninput={(e) => field.handleChange(e.currentTarget.value)}
        />
        {@render fieldError(
          field.state.meta.errors
            .map((it: any) => it?.message ?? "")
            .join(", "),
        )}
      {/snippet}
    </form.Field>
  </fieldset>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">รหัสนิสิต (ถ้ามี)</legend>
    <form.Field name="studentId">
      {#snippet children(field)}
        <input
          type="text"
          class="input"
          name={field.name}
          value={field.state.value}
          onblur={field.handleBlur}
          oninput={(e) => field.handleChange(e.currentTarget.value)}
        />
        {@render fieldError(
          field.state.meta.errors
            .map((it: any) => it?.message ?? "")
            .join(", "),
        )}
      {/snippet}
    </form.Field>
  </fieldset>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">อีเมล</legend>
    <form.Field name="email">
      {#snippet children(field)}
        <textarea
          class="input"
          name={field.name}
          value={field.state.value}
          onblur={field.handleBlur}
          oninput={(e) => field.handleChange(e.currentTarget.value)}
        ></textarea>
        <p class="label">บรรทัดละ 1 อีเมล</p>
        {@render fieldError(
          field.state.meta.errors
            .map((it: any) => it?.message ?? "")
            .join(", "),
        )}
      {/snippet}
    </form.Field>
  </fieldset>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">เบอร์โทรศัพท์</legend>
    <form.Field name="phone">
      {#snippet children(field)}
        <input
          type="tel"
          class="input"
          name={field.name}
          value={field.state.value}
          onblur={field.handleBlur}
          oninput={(e) => field.handleChange(e.currentTarget.value)}
        />
        {@render fieldError(
          field.state.meta.errors
            .map((it: any) => it?.message ?? "")
            .join(", "),
        )}
      {/snippet}
    </form.Field>
  </fieldset>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">บูธที่ประจำ</legend>
    <form.Field name="booth">
      {#snippet children(field)}
        <input
          type="text"
          class="input"
          name={field.name}
          value={field.state.value}
          onblur={field.handleBlur}
          oninput={(e) => field.handleChange(e.currentTarget.value)}
        />
        {@render fieldError(
          field.state.meta.errors
            .map((it: any) => it?.message ?? "")
            .join(", "),
        )}
      {/snippet}
    </form.Field>
  </fieldset>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">ตำแหน่งที่ต้องการ</legend>
    <form.Field name="requestedRole" defaultValue={["user"]}>
      {#snippet children(field)}
        <Checkbox
          options={[
            {
              label: "ทุกคน",
              value: "user",
            },
            {
              label: "สตาฟบูธ / จุดสะสมคะแนน",
              value: "majorBoothStaff",
            },
            {
              label: "สตาฟเวิร์กช็อป",
              value: "workshopStaff",
            },
            {
              label: "สตาฟทะเบียน",
              value: "registarStaff",
            },
            {
              label: "สตาฟของที่ระลึก",
              value: "rewardStaff",
            },
            {
              label: "ผู้ดูแลระบบ",
              value: "admin",
            },
          ]}
          bind:selected={
            () => field.state.value, (value) => field.handleChange(value)
          }
          class="text-base-content"
        />
        {@render fieldError(
          field.state.meta.errors
            .map((it: any) => it?.message ?? "")
            .join(", "),
        )}
      {/snippet}
    </form.Field>
  </fieldset>

  <button class="btn btn-primary" type="submit"> บันทึก </button>
</form>
