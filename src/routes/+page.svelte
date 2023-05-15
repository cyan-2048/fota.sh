<script lang="ts">
	import LayoutGrid, { Cell } from "@smui/layout-grid";

	import Textfield from "@smui/textfield";
	import Icon from "@smui/textfield/icon";
	import HelperText from "@smui/textfield/helper-text";

	let valueA = "";
	let valueB = "";
	let valueC = "";
	let valueD = "";
</script>

<svelte:head>
	<title>Home</title>
	<meta name="description" content="Svelte demo app" />
</svelte:head>

<LayoutGrid>
	<Cell>
		<Textfield variant="filled" bind:value={valueA} label="Label">
			<HelperText slot="helper">Helper Text</HelperText>
		</Textfield>
		<Textfield variant="filled" bind:value={valueB} label="Leading Icon">
			<Icon class="material-icons" slot="leadingIcon">event</Icon>
			<HelperText slot="helper">Helper Text</HelperText>
		</Textfield>
		<Textfield variant="filled" bind:value={valueC} label="Trailing Icon">
			<Icon class="material-icons" slot="trailingIcon">delete</Icon>
			<HelperText slot="helper">Helper Text</HelperText>
		</Textfield>
		<Textfield invalid variant="filled" bind:value={valueD} label="Invalid">
			<HelperText slot="helper">Helper Text</HelperText>
		</Textfield>
	</Cell>
</LayoutGrid>
