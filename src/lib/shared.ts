import { signal } from "@preact/signals";
import CurefWorker from "../lib/worker.ts?worker";

export const curef = signal("");
export const version = signal("");
export const env = signal<"fota" | "test" | "dev">("fota");

export const device = signal<null | string>(null);

const worker = new CurefWorker();
worker.onmessage = ({ data }: { data: null | string }) => {
	device.value = data;
};
curef.subscribe((curef) => worker.postMessage(curef));

export const themeMode = signal<"light" | "dark">("light");
export function toggleThemeMode() {
	themeMode.value = themeMode.value == "light" ? "dark" : "light";
}

if (localStorage.themeMode) {
	themeMode.value = localStorage.themeMode;
} else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
	localStorage.themeMode = themeMode.value = "dark";
} else {
	localStorage.themeMode = themeMode.value = "light";
}

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (event) => {
	localStorage.themeMode = themeMode.value = event.matches ? "dark" : "light";
});
themeMode.subscribe((themeMode) => {
	localStorage.themeMode = themeMode;
});
