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
    return () => { };
  }

  let abortController = new AbortController();
  let ws: WebSocket;

  function connect() {
    if (abortController.signal.aborted) {
      return;
    }

    ws = new WebSocket(wsUrl)

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
        } catch { }
      },
      {
        signal: abortController.signal,
      },
    );

    // reconnect
    ws.addEventListener("close", () => {
      setTimeout(() => {
        connect();
      }, 1000);
    }, { signal: abortController.signal });
  }

  connect();

  return () => abortController.abort();
}
