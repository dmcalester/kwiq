<script>
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import { updateDoc } from 'firebase/firestore';
	import { operationRef } from '$lib/fb.js';
	import { disregardSpace, disregardAction } from '$lib/utilities.js';
	import debounce from '../debounce.js';
	import { _elements } from '../store.js';
	import Elements from './Elements.svelte';

	export let id;
	export let description;
	export let number;
	export let time;
	export let elements;

	const dispatch = createEventDispatcher();

	let pfd = 0.15;

	/* TODO: Add memory for open/closed on details */

	$: time = elements.reduce((sum, el) => sum + parseFloat(el.time), 0);
	$: pfdTime = time * pfd + time;

	const updateOperation = async () => {
		console.log('update operations');
		await updateDoc(operationRef($page.params.routerId, id), {
			description: description,
			number: number,
			time: time,
			elements: elements
		});
	};
</script>

<li class="operation">
	<details class="operation__detail">
		<summary class="line-item">
			<div
				contenteditable="true"
				bind:innerHTML={number}
				on:click={disregardAction}
				on:keyup={disregardSpace}
				use:debounce={{ number, func: updateOperation, duration: 500 }}
				class="number operation__number"
			/>
			<div
				contenteditable="true"
				bind:innerHTML={description}
				on:click={disregardAction}
				on:keyup={disregardSpace}
				use:debounce={{ description, func: updateOperation, duration: 500 }}
				class="description operation__description"
			/>

			<time class="operation__time"
				>{time.toFixed(2).padEnd(2, 0)} | {pfdTime.toFixed(2).padEnd(2, 0)}</time
			>
			<button class="action-item action-item--delete" on:click={dispatch('delete', { id: id })}
				>×</button
			>
		</summary>

		<Elements operationId={id} bind:elements />
	</details>
</li>
