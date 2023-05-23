import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// @ts-ignore
const production = process.env.NODE_ENV === "production";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [preact()],
	base: production ? "/fota.sh/" : "/",
	server: {
		port: 3000,
	},
	resolve: {
		alias: {
			react: "preact/compat",
			"react-dom": "preact/compat",
		},
	},
	build: {
		cssCodeSplit: false,
		assetsInlineLimit: 0,
		minify: true,
	},
});
