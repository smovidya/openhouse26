<script lang="ts">
  import { actions } from "astro:actions";
  import { createForm } from "@tanstack/svelte-form";
  import { roles } from "@src/auth/permissions";
  import Checkbox from "@src/components/registration/checkboxes.svelte";

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
      console.log(value);
      // const { data, error } = await actions.adminAddStaff(value);
      // if (error) return alert(error);
      // window.location.href = `/admin/staff/${data.id}`;
    },
  }));

  const possibleRoles = Object.keys(roles);
</script>

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
          oninput={(e) => field.handleChange(e.target?.value)}
        />
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
          oninput={(e) => field.handleChange(e.target?.value)}
        ></textarea>
        <p class="label">บรรทัดละ 1 อีเมล</p>
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
          oninput={(e) => field.handleChange(e.target?.value)}
        />
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
          oninput={(e) => field.handleChange(e.target?.value)}
        />
      {/snippet}
    </form.Field>
  </fieldset>
  <fieldset class="fieldset">
    <legend class="fieldset-legend">ตำแหน่งที่ต้องการ</legend>
    <form.Field name="requestedRole" mode="array">
      {#snippet children(field)}
        <Checkbox
          options={possibleRoles.map((v) => ({
            value: v,
            label: v,
          }))}
          bind:selected={
            () => field.state.value, (value) => field.handleChange(value)
          }
          class="text-base-content"
        />
      {/snippet}
    </form.Field>
  </fieldset>

  <button class="btn btn-primary" type="submit"> บันทึก </button>
</form>
