import type { UserEvent } from "@src/notification/client";
import type { SSEWorkerRpc } from "@src/type";

export async function sendEvent(binding: Fetcher, to: string, event: UserEvent) {
    const sse = binding as any as SSEWorkerRpc;
    return sse.sendEvent(to, JSON.stringify(event));
}
