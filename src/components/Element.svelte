<script>
	import { createEventDispatcher } from 'svelte';
	import { dataLibrary } from '$lib/data-library.js';
	import { elementTime } from '../store.js';

	export let time;
	export let description;
	export let index;

	const dispatch = createEventDispatcher();

	const updateTime = () => {
		elementTime.set(time);
	};

	const deleteElement = (index) => {
		dispatch('delete', {
			index: index
		});
	};
</script>

<li class="line-item">
	<div class="line-item row">
		<div class="description" contenteditable="true" bind:innerHTML={description} />
		<div><input type="number" min="0" step="0.1" bind:value={time} on:change={updateTime} /></div>
		<div class="line-item row">
			<select>
				{#each dataLibrary as menu}
					<option value={menu.value}>{menu.label}</option>
				{/each}
				<option value="directInput">Direct Input</option>
			</select>
		</div>
		<button class="action-item" on:click={deleteElement(index)}>×</button>
	</div>
</li>
