import { useCallback, useMemo, useState } from "preact/hooks";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";

import MenuIcon from "@mui/icons-material/Menu";
import DeviceUnknown from "@mui/icons-material/DeviceUnknown";
import HomeIcon from "@mui/icons-material/Home";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import MobileFriendlyIcon from "@mui/icons-material/MobileFriendly";

import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";

import { FormControl, InputLabel, ListItemIcon, MenuItem, Select, Slide, SvgIcon, Tooltip, useScrollTrigger } from "@mui/material";
import { FunctionComponent, JSX } from "preact";
import { ReactElement, useEffect } from "react";

import Devices from "./routes/Devices";
import Home, { check } from "./routes/Home";
import { device, env, themeMode, toggleThemeMode, page, curef, version } from "./lib/shared";
import { showDevice } from "./routes/signals";

const drawerWidth = 240;
const navItems = ["Home", "Devices"];

const HideOnScroll: FunctionComponent = ({ children }) => {
	const trigger = useScrollTrigger();

	return (
		<Slide appear={false} direction="down" in={!trigger}>
			{children as ReactElement<any, any>}
		</Slide>
	);
};

function showTheDevice() {
	showDevice.value = true;
}

function DeviceDetectedButton() {
	const [tooltip, showTooltip] = useState(false);

	useEffect(() => {
		showTooltip(true);
		const timeout = setTimeout(() => {
			showTooltip(false);
		}, 3000);
		return () => clearTimeout(timeout);
	}, [device.value]);

	return (device.value && (
		<IconButton onClick={showTheDevice} color="inherit">
			<Tooltip arrow open={tooltip} title={"Device Detected: " + device.value}>
				<MobileFriendlyIcon />
			</Tooltip>
		</IconButton>
	)) as JSX.Element;
}

export default function App() {
	const [mobileOpen, setMobileOpen] = useState(false);

	const handleDrawerToggle = useCallback(() => {
		setMobileOpen((prevState) => !prevState);
	}, []);

	const inView = useMemo(() => (page.value == "Home" ? <Home /> : <Devices />), [page.value]);

	useEffect(() => {
		const params = new URLSearchParams(location.search);
		// get curef and version from url params
		const c = (curef.value = params.get("curef") || params.get("id") || params.get("cuid") || "");
		const e = (version.value = params.get("version") || params.get("v") || "");

		if (typeof params.get("noCheck") == "string") return;
		if (c && e) check();
	}, []);

	return (
		<Box sx={{ display: "flex" }}>
			<CssBaseline />
			<HideOnScroll>
				<AppBar component="nav">
					<Toolbar variant="dense">
						<IconButton color="inherit" aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2 }}>
							<MenuIcon />
						</IconButton>
						<Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
							{page.value}
						</Typography>
						<DeviceDetectedButton />
						<IconButton color="inherit" href="https://github.com/cyan-2048/fota.sh">
							<SvgIcon viewBox="0 0 24 24">
								<path d="M12 1.27a11 11 0 00-3.48 21.46c.55.09.73-.28.73-.55v-1.84c-3.03.64-3.67-1.46-3.67-1.46-.55-1.29-1.28-1.65-1.28-1.65-.92-.65.1-.65.1-.65 1.1 0 1.73 1.1 1.73 1.1.92 1.65 2.57 1.2 3.21.92a2 2 0 01.64-1.47c-2.47-.27-5.04-1.19-5.04-5.5 0-1.1.46-2.1 1.2-2.84a3.76 3.76 0 010-2.93s.91-.28 3.11 1.1c1.8-.49 3.7-.49 5.5 0 2.1-1.38 3.02-1.1 3.02-1.1a3.76 3.76 0 010 2.93c.83.74 1.2 1.74 1.2 2.94 0 4.21-2.57 5.13-5.04 5.4.45.37.82.92.82 2.02v3.03c0 .27.1.64.73.55A11 11 0 0012 1.27"></path>
							</SvgIcon>
						</IconButton>
						<IconButton color="inherit" onClick={toggleThemeMode}>
							{themeMode.value == "light" ? <Brightness4Icon /> : <Brightness7Icon />}
						</IconButton>
					</Toolbar>
				</AppBar>
			</HideOnScroll>
			<Box component="nav">
				<Drawer
					variant="temporary"
					open={mobileOpen}
					onClose={handleDrawerToggle}
					ModalProps={{
						keepMounted: true, // Better open performance on mobile.
					}}
					sx={{
						"& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
					}}
				>
					<Box sx={{ textAlign: "center" }}>
						<Typography variant="h6" sx={{ my: 2 }}>
							fota.sh
						</Typography>
						<Divider />
						<List>
							{navItems.map((item) => (
								<ListItem key={item} disablePadding>
									<ListItemButton
										onClick={useCallback(() => {
											page.value = item;
											handleDrawerToggle();
										}, [])}
									>
										<ListItemIcon>{item == "Home" ? <HomeIcon /> : <DeviceUnknown />}</ListItemIcon>
										<ListItemText primary={item} />
									</ListItemButton>
								</ListItem>
							))}
						</List>
						<Divider />
						<FormControl sx={{ m: 1, minWidth: 200, marginTop: 2, textAlign: "start" }}>
							<InputLabel id="select-small-label">ENV</InputLabel>
							<Select labelId="select-small-label" id="demo-select-small" value={env.value == "fota" ? "prod" : env.value} label="ENV">
								{["fota", "test", "dev"].map((item) => (
									<MenuItem onClick={() => (env.value = item as any)} value={item == "fota" ? "prod" : item}>
										{item == "fota" ? "prod" : item}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Box>
				</Drawer>
			</Box>
			<Box component="main" sx={{ p: 3, width: "100%" }}>
				<Toolbar />
				{inView}
			</Box>
		</Box>
	);
}
