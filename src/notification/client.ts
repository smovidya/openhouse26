interface WorkshopParticipantCheckinEvent {
  type: "participant-checkin";
  workshopName: string;
}

export type UserEvent = WorkshopParticipantCheckinEvent;

export function onNotify(
  wsUrl: string,
  token: string,
  fn: (event: UserEvent) => unknown,
) {
  if (import.meta.env.SSR) {
    return () => {};
  }

  // TODO: might implement reconnect

  const ws = new WebSocket(wsUrl);
  const abortController = new AbortController();

  ws.addEventListener(
    "open",
    () => {
      // console.log("send", token)
      ws.send(token);
    },
    { once: true },
  );

  ws.addEventListener(
    "message",
    async (event) => {
      try {
        const data = JSON.parse(event.data);
        fn(data);
      } catch {}
    },
    {
      signal: abortController.signal,
    },
  );

  return () => abortController.abort();
}
