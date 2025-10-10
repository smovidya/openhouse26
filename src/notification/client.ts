export interface UserEvent {

}

export function onNotify(wsUrl: string, fn: (event: UserEvent) => unknown) {
  const ws = new WebSocket(wsUrl);
  const abortController = new AbortController();

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

