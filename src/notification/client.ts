export interface UserEvent {

}

export function onNotify(wsUrl: string, jwt: string, fn: (event: UserEvent) => unknown) {
  if (import.meta.env.SSR) {
    return () => { };
  }

  const ws = new WebSocket(wsUrl)
  const abortController = new AbortController();
  
  ws.addEventListener("open", () => {
    ws.send(jwt)
  }, { once: true });

  ws.addEventListener("message", async (event) => {
    try {
      const data = JSON.parse(event.data);
      fn(data);
    } catch { }
  }, {
    signal: abortController.signal
  });

  return () => abortController.abort();
}

