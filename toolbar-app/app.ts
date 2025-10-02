import { plugins } from "@src/auth/client";
import { defineToolbarApp } from "astro/toolbar";
import { createAuthClient } from "better-auth/client";
import {
  admin,
  user,
  majorBoothStaff,
  registarStaff,
  workshopStaff,
  rewardStaff,
} from "@src/auth/permissions";
import actions from "astro:actions"

async function getCurrentUser(authClient: ReturnType<typeof createAuthClient>) {
  return authClient.getSession().then(({ data }) => data?.user || null);
}

function logout(authClient: ReturnType<typeof createAuthClient>) {
  return authClient.signOut();
}

async function drawUserInfo(
  canvas: HTMLElement,
  user: any,
  authClient: ReturnType<typeof createAuthClient>
) {
  const div = document.createElement("div");
  div.className = "current-user";
  if (!user) {
    div.innerHTML = `
      <p>No user is currently logged in.</p>
      <button id="login-btn">Login with Google One Tap</button>
    `;
    const loginBtn = div.querySelector("#login-btn") as HTMLButtonElement;
    loginBtn.onclick = async () => {};
  } else {
    div.innerHTML = `
      <pre>${JSON.stringify(user, null, 2)}</pre>
      <button id="logout-btn">Logout</button>
    `;
    const logoutBtn = div.querySelector("#logout-btn") as HTMLButtonElement;
    logoutBtparticipantn.onclick = async () => {
      await logout(authClient);
      logoutBtn.disabled = true;
      logoutBtn.textContent = "Logging out...";
      setTimeout(() => {
        location.reload();
      }, 1000);
    };
    div.style.whiteSpace = `pre-wrap`;
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

  .current-user {
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

    const authClient = createAuthClient({
      plugins: plugins,
    });

    const user = await getCurrentUser(authClient);
    const div = document.createElement("div");
    div.className = "app-container";
    await drawUserInfo(div, user, authClient);
    canvas.appendChild(div);
    app.onToggled(({ state }) => {
      if (!state) return;
    });
  },
});
