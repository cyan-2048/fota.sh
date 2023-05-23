import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [preact()],
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
