import { render } from "preact";
import App from "./App.tsx";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useMemo } from "preact/hooks";
import { themeMode } from "./lib/shared";
import { DeviceDialog } from "./routes/Devices.tsx";

export default function ToggleColorMode() {
	const mode = themeMode.value;

	const theme = useMemo(
		() =>
			createTheme({
				palette: {
					mode,
				},
			}),
		[mode]
	);

	return (
		<ThemeProvider theme={theme}>
			<App />
			<DeviceDialog />
		</ThemeProvider>
	);
}

render(<ToggleColorMode />, document.getElementById("app") as HTMLElement);

if (import.meta.env.DEV) {
	Promise.all([
		import("./lib/shared"),
		import("./lib/curefs.ts"),
		import("./lib/utils.ts"),
		import("preact"),
		import("preact/compat"),
		// @ts-ignore
		import("https://unpkg.com/htm?module"),
		import("./routes/signals.ts"),
	]).then(([shared, curefs, utils, Preact, React, htm, signals]) => {
		const jsx = htm.default.bind(React.createElement);
		Object.assign(window, { shared, curefs, utils, Preact, React, jsx, signals }, utils);
	});
}
