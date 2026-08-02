import { derived, writable, get } from "svelte/store";
import { EventSource } from "eventsource";

let password = "";
const passwordHeader = () => `Basic ${btoa(`:${password}`)}`;

export const fetchWithPassword: typeof fetch = (input, init) =>
  fetch(input, {
    ...init,
    headers: { Authorization: passwordHeader(), ...init?.headers },
  });

export const eventSourceWithPassword: (
  ...args: ConstructorParameters<typeof EventSource>
) => EventSource = (url, eventSourceInitDict) =>
  new EventSource(url, { ...eventSourceInitDict, fetch: fetchWithPassword });

type ApiStats = {
  bootstrapped: boolean;
};
export const apiStats = writable<ApiStats | null>(null);
export const isAuthenticated = derived(apiStats, (s) => s !== null);
export async function loadStats(testPassword: string) {
  password = testPassword;
  const response = await fetchWithPassword("./api/stats");
  if (!response.ok) {
    return;
  }

  localStorage.setItem("mmr-api-v2__saved-password", password);
  apiStats.set(await response.json());
}
