import type { UserEvent } from "@src/notification/client";
import type { SSEWorkerRpc } from "@src/type";

export async function sendEvent(
  binding: Fetcher,
  participantId: string,
  event: UserEvent,
) {
  try {
    const sse = binding as any as SSEWorkerRpc;
    return sse.sendEvent(participantId, JSON.stringify(event));
  } catch {
    return null
  }
}


// not actually jwt
export async function getToken(privateKey: string, participantId: string) {
  const decoded = JSON.parse(atob(privateKey));
  const key = await crypto.subtle.importKey("jwk", decoded, { name: "Ed25519" }, true, ["sign"])

  const signature = await crypto.subtle.sign("ed25519", key, new TextEncoder().encode(participantId))

  const token = {
    signature: btoa(String.fromCharCode(...new Uint8Array(signature))),
    participantId
  }

  return JSON.stringify(token)
}