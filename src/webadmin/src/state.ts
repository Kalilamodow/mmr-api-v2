import { derived, writable, get } from "svelte/store";

let password = "";
const fetchWithPassword = (url: string) => fetch(`${url}?pw=${password}`);

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

  apiStats.set(await response.json());
}
