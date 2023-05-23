import { signal } from "@preact/signals";

export const download_loading = signal(false);
export const download_url = signal<null | string>(null);
export const result = signal<
	| 0
	| null
	| undefined
	| {
			tv: string;
			fwid: string;
			content: string;
			_content?: {
				tv: string;
				fwid: string;
			};
	  }
>(undefined);
