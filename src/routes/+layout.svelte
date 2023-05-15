<script lang="ts">
	import TopAppBar, { Row, Section, Title, AutoAdjust } from "@smui/top-app-bar";
	import IconButton from "@smui/icon-button";

	import Drawer, { AppContent, Content, Header, Title as TitleDrawer, Subtitle, Scrim } from "@smui/drawer";
	import Button, { Label } from "@smui/button";
	import List, { Item, Text, Graphic, Separator, Subheader } from "@smui/list";

	import { page } from "$app/stores";
	import { base } from "$app/paths";

	let open = false;
	let active = "Inbox";

	function setActive(value: string) {
		active = value;
		open = false;
	}

	let topAppBar: TopAppBar;

	import "./styles.css";
</script>

<TopAppBar bind:this={topAppBar} variant="standard" dense>
	<Row>
		<Section>
			<IconButton on:click={() => (open = !open)} class="material-icons">menu</IconButton>
			<Title>Fixed</Title>
		</Section>
		<Section align="end" toolbar>
			<IconButton class="material-icons" aria-label="Download">file_download</IconButton>
			<IconButton class="material-icons" aria-label="Print this page">print</IconButton>
			<IconButton class="material-icons" aria-label="Bookmark this page">bookmark</IconButton>
		</Section>
	</Row>
</TopAppBar>
<Drawer variant="modal" bind:open>
	<Header>
		<TitleDrawer>fota.sh</TitleDrawer>
		<Subtitle>made by: cyan-2048</Subtitle>
	</Header>
	<Content>
		<List>
			<Item href="{base}/" on:click={() => setActive("Inbox")} activated={active === "Inbox"}>
				<Graphic class="material-icons" aria-hidden="true">home</Graphic>
				<Text>Home</Text>
			</Item>
			<Item href="javascript:void(0)" on:click={() => setActive("Star")} activated={active === "Star"}>
				<Graphic class="material-icons" aria-hidden="true">star</Graphic>
				<Text>Star</Text>
			</Item>
			<Item href="javascript:void(0)" on:click={() => setActive("Sent Mail")} activated={active === "Sent Mail"}>
				<Graphic class="material-icons" aria-hidden="true">send</Graphic>
				<Text>Sent Mail</Text>
			</Item>
			<Item href="javascript:void(0)" on:click={() => setActive("Drafts")} activated={active === "Drafts"}>
				<Graphic class="material-icons" aria-hidden="true">drafts</Graphic>
				<Text>Drafts</Text>
			</Item>
		</List>
	</Content>
</Drawer>
<Scrim />
<AutoAdjust {topAppBar}>
	<slot />
</AutoAdjust>
