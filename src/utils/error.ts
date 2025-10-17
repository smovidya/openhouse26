export async function tryPromise<T>(p: Promise<T>) {
  try {
    const data = await p;
    return {
      ok: true,
      data,
      error: null,
    } as const;
  } catch (e) {
    return {
      ok: false,
      data: null,
      error: e,
    } as const;
  }
}
