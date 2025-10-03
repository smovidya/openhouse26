import { defineToolbarApp } from "astro/toolbar";
import { createAuthClient } from "better-auth/client";
import { authClient } from "@src/auth/client";
import { roles } from "@src/auth/permissions";

async function getCurrentUser(authClient: ReturnType<typeof createAuthClient>) {
  return authClient.getSession().then(({ data }) => data?.user || null);
}

function logout(authClient: ReturnType<typeof createAuthClient>) {
  return authClient.signOut();
}

function rolesListCheckboxes(currentRole: string) {
  const splitedCurrentRole = currentRole ? currentRole.split(",") : [];
  return `
    ${Object.keys(roles)
      .map(
        (roleKey) => `
      <label style="border: 1px solid #ccc; padding: 0.2rem; margin: 0.2rem; display: inline-block;">
        <input type="checkbox" name="role" value="${roleKey}" ${splitedCurrentRole.includes(roleKey) ? "checked" : ""}>
        ${roleKey}
      </label>
    `
      )
      .join("")}
  `;
}

async function drawUserInfo(canvas: HTMLElement, user: any) {
  const div = document.createElement("div");
  div.className = "current-user";
  if (!user) {
    div.innerHTML = `
      <p>No user is currently logged in.</p>
      <button id="login-btn">Login anonymously</button>
      <button id="login-google-btn">Login with Google</button>
    `;
    const loginBtn = div.querySelector("#login-btn") as HTMLButtonElement;
    loginBtn.onclick = async () => {
      await authClient.signIn.anonymous();
      div.remove();
      const newDiv = document.createElement("div");
      const newUser = await getCurrentUser(authClient);
      await drawUserInfo(newDiv, newUser);
      canvas.appendChild(newDiv);
    };
    const loginGoogleBtn = div.querySelector(
      "#login-google-btn"
    ) as HTMLButtonElement;
    loginGoogleBtn.onclick = async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: window.location.pathname,
      });
    };
  } else {
    div.innerHTML = `
      <h3>Current User Info</h3>
      <pre>${JSON.stringify(user, null, 2)}</pre>
      <p>User Role: <strong>${user.role}</strong></p>
      <details>
        <summary>Change Role</summary>
        <p>Please re-login after changing the role to see the effect.</p>
        <form id="role-form">
          ${rolesListCheckboxes(user.role)}
          <br/>
          <button type="submit">Update Role</button>
        </form>
      </details>
      <br/>
      <button id="logout-btn">Logout</button>
    `;
    const logoutBtn = div.querySelector("#logout-btn") as HTMLButtonElement;
    logoutBtn.onclick = async () => {
      await logout(authClient);
      div.remove();
      const newDiv = document.createElement("div");
      await drawUserInfo(newDiv, null);
      canvas.appendChild(newDiv);
    };
    const form = div.querySelector("#role-form") as HTMLFormElement;
    form.onsubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(form);
      const selectedRoles = formData.getAll("role") as string[];
      const newRole = selectedRoles.join(",");
      if (newRole === user.role) {
        alert("Role is the same as before.");
        return;
      }
      try {
        const res = await fetch("/api/dev/role", {
          method: "POST",
          body: JSON.stringify({ role: newRole }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!res.ok) return alert(await res.text());
        alert("Role updated successfully. Please login again to see the effect.");
      } catch (err: any) {
        alert("Error updating role: " + err.message);
      }
    };
  }
  canvas.appendChild(div);
}

const styles = `
  :root {
    font-size: 14px;
  }
  :host {
    display: block;
    padding: 1rem;
    font-family: system-ui, sans-serif;
    background-color: #f3f4f6;
    position: relative;
    bottom: 0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
    z-index: 1000;
    border: 1px solid #e5e7eb;
    width: 50%;
    margin: 0 auto;
    overflow: auto;
  }

  pre {
    white-space: pre-wrap;
    word-break: break-word;
  }
`;

export default defineToolbarApp({
  async init(canvas, app) {
    const styleEl = document.createElement("style");
    styleEl.textContent = styles;
    canvas.appendChild(styleEl);

    const user = await getCurrentUser(authClient);
    const div = document.createElement("div");
    div.className = "app-container";
    await drawUserInfo(div, user);
    canvas.appendChild(div);
    app.onToggled(({ state }) => {
      if (!state) return;
    });
  },
});
