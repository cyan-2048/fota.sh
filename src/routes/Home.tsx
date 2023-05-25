import { curef, env, version } from "../lib/shared";
import Button from "@mui/lab/LoadingButton";
import { Accordion, AccordionDetails, AccordionSummary, Box, CircularProgress, Divider, Grid, Paper, Skeleton, Stack, TextField, Typography, TypographyProps } from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import InsertDriveFile from "@mui/icons-material/InsertDriveFile";
import DownloadIcon from "@mui/icons-material/Download";

import { MutableRef, useCallback, useEffect, useRef, useState } from "preact/hooks";

// @ts-ignore
import { Light as SyntaxHighlighter } from "react-syntax-highlighter";
// @ts-ignore
import xml from "react-syntax-highlighter/dist/esm/languages/hljs/xml";
// @ts-ignore
import syntaxStyle from "react-syntax-highlighter/dist/esm/styles/hljs/vs2015";
SyntaxHighlighter.registerLanguage("xml", xml);

import { result, download_loading, download_url } from "./signals.ts";
import { Signal, batch } from "@preact/signals";
import { ChangeEvent, useMemo, JSX } from "react";
import { memo } from "preact/compat";
import { Ref } from "preact";

const worker = "https://fota-kaios.cyan-2048.workers.dev/";

const parser = new DOMParser();
const serializer = new XMLSerializer();

async function fetchWorker(params: Record<string, string> = {}) {
	const resp = await fetch(worker + "?" + new URLSearchParams({ version: version.peek(), curef: curef.peek(), env: env.peek(), ...params }).toString());
	const text = await resp.text();
	if (text.includes("html") || text.includes("HTML")) {
		alert("Error: HTML was found in the request, it should only respond with a blank page or XML");
		return null;
	}
	return text ? (parser.parseFromString(text, "text/xml") as XMLDocument) : null;
}

export async function check() {
	batch(() => {
		download_url.value = null;
		download_loading.value = false;

		result.value = null;
	});

	const xml = await fetchWorker({ type: "check" });

	if (!xml) {
		result.value = 0;
		return;
	}
	console.error(xml);
	const fwid = xml.querySelector("FW_ID");
	const tv = xml.querySelector("TV");

	result.value = {
		tv: tv?.innerHTML || "",
		fwid: fwid?.innerHTML || "",
		content: serializer.serializeToString(xml),
		_content: ((tv && fwid) || undefined) && {
			tv: serializer.serializeToString(tv as unknown as any),
			fwid: serializer.serializeToString(fwid as unknown as any),
		},
	};
}

async function download() {
	const _result = result.peek();
	if (!_result) return;

	download_url.value = null;

	download_loading.value = true;
	const xml = await fetchWorker({ type: "download", tv: _result.tv, fwid: _result.fwid });
	download_loading.value = false;

	if (!xml) return;

	const url = xml.querySelector("DOWNLOAD_URL")?.innerHTML;
	const slave = xml.querySelector("SLAVE")?.innerHTML;

	download_url.value = "http://" + slave + url;
}

const SyntaxHighlight = (props: { children: string; height: number }) => {
	return (
		<Box sx={{ p: 0, m: 0, height: props.height, overflow: "auto", position: "relative", "* pre": { margin: 0 } }}>
			<Box sx={{ p: 0, m: 0, height: "100%", width: "100%", position: "absolute", overflow: "auto" }}>
				<SyntaxHighlighter wrapLongLines={true} style={syntaxStyle} language="xml">
					{props.children}
				</SyntaxHighlighter>
			</Box>
		</Box>
	);
};

interface FieldProps {
	error: boolean;
	validate: () => boolean;
}

/**
 * there's a weird bug
 */
function useInputWorkaround(inputRef: MutableRef<HTMLDivElement>, validate: () => boolean, signal: Signal<string>) {
	useEffect(() => {
		const input = inputRef.current?.querySelector("input");

		const emit = () => input?.dispatchEvent(new Event("input", { bubbles: true }));

		if (input) {
			input.value = curef.peek();
			emit();
			input.oninput = (e) => {
				// @ts-ignore
				signal.value = e.target.value;
				validate();
			};
		}

		return signal.subscribe((val) => {
			if (input && input.value !== val) {
				input.value = val;
				emit();
			}
		});
	}, []);
}

const CurefField = memo(function (props: FieldProps) {
	const inputRef = useRef<HTMLDivElement>(null);

	useInputWorkaround(inputRef as any, props.validate, curef);

	useEffect(() => {
		const e = inputRef.current?.querySelector("input");
		e &&
			(e.onkeyup = (e) => {
				if (e.key == "Enter") {
					document.getElementById("input2-with-sx")?.focus();
				}
			});
	}, []);

	return <TextField error={props.error} ref={inputRef} helperText={curef.value == "" ? "Ex. BTS-23BTS70VN00" : null} id="input1-with-sx" label="CUREF" variant="filled" />;
});

const VersionField = memo(function (props: FieldProps) {
	const inputRef = useRef<HTMLDivElement>(null);

	useInputWorkaround(inputRef as any, props.validate, version);

	useEffect(() => {
		const e = inputRef.current?.querySelector("input");
		e &&
			(e.onkeyup = (e) => {
				if (e.key == "Enter") {
					if (version.peek() && curef.peek()) check();
				}
			});
	}, []);

	return <TextField ref={inputRef} helperText={version.value == "" ? "Ex. 30.00.17.05" : null} error={props.error} id="input2-with-sx" label="VERSION" variant="filled" />;
});

function FormSubmitButton() {
	return (
		<Button
			loading={result.value === null}
			onClick={useCallback(() => {
				if (!curef.peek() || !version.peek()) return;
				check();
			}, [])}
			loadingPosition="end"
			variant="contained"
			endIcon={<SendIcon />}
		>
			Check
		</Button>
	);
}

function DEVONLYSTUFF() {
	const testbutton = useMemo(
		() => (
			<Button
				onClick={() => {
					curef.value = "CNT-23CNT86RU00";
					version.value = "12.00.17.01";
				}}
				variant="contained"
			>
				insert test curef
			</Button>
		),
		[]
	);

	return (import.meta.env.DEV && (
		<>
			{testbutton}
			<p>
				env: {env.value}; curef: {curef.value}
			</p>
		</>
	)) as JSX.Element;
}

function Form() {
	const [[curefReq, versionReq], setRequired] = useState<boolean[]>([false, false]);

	const validate = useCallback(() => {
		let _curef = curef.peek() == "";
		let _version = version.peek() == "";
		setRequired([_curef, _version]);
		return _curef || _version;
	}, []);

	return (
		<Stack spacing={2}>
			<CurefField validate={validate} error={curefReq} />
			<VersionField validate={validate} error={versionReq} />
			<FormSubmitButton />
			<DEVONLYSTUFF />
		</Stack>
	);
}

function DownloadButton() {
	const download_url_value = download_url.value;

	return (
		<>
			{download_url_value && (
				<Button download="test.zip" href={download_url_value} endIcon={<DownloadIcon />} variant="contained">
					Download
				</Button>
			)}
		</>
	);
}

function GenerateURLButton() {
	return (
		<Button onClick={download} endIcon={<InsertDriveFile />} loading={download_loading.value} loadingPosition="end" variant="contained">
			Generate Download URL
		</Button>
	);
}

function Result() {
	const value = result.value;

	const view = useMemo(
		() =>
			value ? (
				<Stack sx={{ width: "100%" }} spacing={2}>
					<Typography sx={{ color: "#388e3c" }} component="div" variant="h4">
						UPDATE AVAILABLE!
					</Typography>
					<Divider />
					<div>
						<Accordion elevation={2}>
							<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1bh-content" id="panel1bh-header">
								<Typography sx={{ width: "40%", flexShrink: 0 }}>New Version</Typography>
								<Typography sx={{ color: "text.secondary" }}>{value.tv}</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<SyntaxHighlight height={40}>{value._content?.tv || ""}</SyntaxHighlight>
							</AccordionDetails>
						</Accordion>
						<Accordion sx={{ width: "100%" }} elevation={2}>
							<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel3bh-content" id="panel3bh-header">
								<Typography sx={{ width: "40%", flexShrink: 0 }}>Firmware ID</Typography>
								<Typography sx={{ color: "text.secondary" }}>{value.fwid}</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<SyntaxHighlight height={40}>{value._content?.fwid || ""}</SyntaxHighlight>
							</AccordionDetails>
						</Accordion>
						<Accordion elevation={2}>
							<AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel4bh-content" id="panel4bh-header">
								<Typography sx={{ width: "40%", flexShrink: 0 }}>Content</Typography>
							</AccordionSummary>
							<AccordionDetails>
								<SyntaxHighlight height={300}>{value.content}</SyntaxHighlight>
							</AccordionDetails>
						</Accordion>
					</div>
					<GenerateURLButton />
					<DownloadButton />
				</Stack>
			) : value === null ? (
				<CircularProgress />
			) : (
				<Typography component="div" variant="h4">
					{value === 0 ? "fota server returned nothing 😔" : "👐 👀 😉"}
				</Typography>
			),
		[value]
	);

	return (
		<Paper elevation={1} sx={{ p: 2, flexDirection: "column", alignItems: "center", display: "flex" }}>
			{view}
		</Paper>
	);
}

function Home() {
	return (
		<Grid sx={{ justifyContent: "center" }} container spacing={2}>
			<Grid item xs={12} sm={6}>
				<Form />
			</Grid>
			<Grid item xs sm={6}>
				<Result />
			</Grid>
		</Grid>
	);
}

export default Home;
