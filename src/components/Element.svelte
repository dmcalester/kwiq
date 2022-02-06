<script>
	import { createEventDispatcher } from 'svelte';
	import { dataLibrary } from '$lib/data-library.js';

	export let id;
	export let time;
	export let description;

	const dispatch = createEventDispatcher();

	const updateElement = () => {
		dispatch('update', {
			id: id
		});
	};
</script>

<li class="line-item">
	<div class="line-item row">
		<div
			class="description"
			contenteditable="true"
			bind:innerHTML={description}
			on:change={updateElement}
		/>
		<div>
			<input type="number" min="0" step="0.1" bind:value={time} on:change={updateElement} />
		</div>
		<div class="line-item row">
			<select on:change={updateElement}>
				{#each dataLibrary as menu}
					<option value={menu.value}>{menu.label}</option>
				{/each}
				<option value="directInput">Direct Input</option>
			</select>
		</div>
		<button class="action-item" on:click={dispatch('delete', { id: id })}>×</button>
	</div>
</li>
