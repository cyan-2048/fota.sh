import { FC } from "preact/compat";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import _DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";

import CloseIcon from "@mui/icons-material/Close";
import { curef, device, deviceCurefs } from "../lib/shared";
import { showDevice } from "./signals";
import Grid from "@mui/material/Grid";
import { Box, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Stack } from "@mui/material";
import { useMemo, useRef } from "react";
import { Virtuoso } from "react-virtuoso";
import { check } from "./Home";

function DialogTitle() {
	return (
		<_DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
			{device.value}
			<IconButton
				aria-label="close"
				onClick={handleClose}
				sx={{
					position: "absolute",
					right: 8,
					top: 8,
					color: (theme) => theme.palette.grey[500],
				}}
			>
				<CloseIcon />
			</IconButton>
		</_DialogTitle>
	);
}

const handleClose = () => {
	showDevice.value = false;
};

function DeviceCurefs() {
	const curefs = useMemo(() => deviceCurefs.value?.map((_curef) => <FormControlLabel key={_curef} value={_curef} control={<Radio />} label={_curef} />), [deviceCurefs.value]);
	return (
		<FormControl sx={{ height: "100%" }}>
			<FormLabel id="demo-controlled-radio-buttons-group">Available CUREFS</FormLabel>
			<RadioGroup
				aria-labelledby="demo-controlled-radio-buttons-group"
				name="controlled-radio-buttons-group"
				value={curef.value}
				onChange={(_, value) => {
					curef.value = value;
				}}
			>
				{curefs}
			</RadioGroup>
		</FormControl>
	);
}

function DevicePreview() {
	return <Box sx={{ width: "100%" }}>{device.value}</Box>;
}

export function DeviceDialog() {
	return (
		<Dialog
			sx={{ "& .MuiDialog-paper": { width: "80%", maxHeight: 435 } }}
			maxWidth="xs"
			keepMounted
			onClose={handleClose}
			aria-labelledby="customized-dialog-title"
			open={showDevice.value}
		>
			<DialogTitle />
			<DialogContent dividers>
				<DeviceCurefs />
			</DialogContent>
			<DialogActions>
				<Button
					onClick={() => {
						check();
						showDevice.value = false;
					}}
					autoFocus
				>
					CHECK
				</Button>
			</DialogActions>
		</Dialog>
	);
}

export default (() => {
	return (
		<div>
			<h1>
				Check out, popcorn, and Zero Coke
				<br />
				빠진 건 없지? Come in, 팔짱을 끼고, sit down
				<br />
				곧 터지는 탄성, 아직까진 teaser
				<br />
				Hoot, 기대해, coming soon
				<br />
				벌써 놀라지 마, calm down, down, down
			</h1>
		</div>
	);
}) as FC;
