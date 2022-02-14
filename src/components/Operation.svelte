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
	export let time = 0;
	export let pfd = 1;
	export let pfdTime = 0;
	export let elements;

	const dispatch = createEventDispatcher();

	/* TODO: Add memory for open/closed on details */

	$: time = elements.reduce((sum, el) => sum + parseFloat(el.time), 0);
	$: pfdTime = time + time * (pfd / 100);

	const updateOperation = async () => {
		console.log('update operations');
		await updateDoc(operationRef($page.params.routerId, id), {
			description: description,
			number: number,
			time: time,
			pfdTime: pfdTime,
			elements: elements
		});
	};
</script>

<li class="operation row">
	<details open class="operation__detail">
		<summary class="line-item">
			<div
				contenteditable="true"
				bind:innerHTML={number}
				on:click={disregardAction}
				on:keyup={disregardSpace}
				use:debounce={{ number, func: updateOperation, duration: 500 }}
				class="fixed id"
			/>
			<div
				contenteditable="true"
				bind:innerHTML={description}
				on:click={disregardAction}
				on:keyup={disregardSpace}
				use:debounce={{ description, func: updateOperation, duration: 500 }}
				class="flex"
			/>
			{#if pfdTime}
				<time class="fixed time"><b>{pfdTime.toFixed(2).padEnd(2, 0)}</b></time>
			{/if}

			<!-- 				
				<div
					contenteditable="true"
					bind:innerHTML={number}
					on:click={disregardAction}
					on:keyup={disregardSpace}
					use:debounce={{ number, func: updateOperation, duration: 500 }}
					class="fixed"
				/>
				<div
					contenteditable="true"
					bind:innerHTML={description}
					on:click={disregardAction}
					on:keyup={disregardSpace}
					use:debounce={{ description, func: updateOperation, duration: 500 }}
					class="flex"
				/>

				{#if pfdTime}
					<time class="fixed">{pfdTime.toFixed(2).padEnd(2, 0)}</time>
				{/if} -->
			<!-- 				<button class="action-item action-item--delete" on:click={dispatch('delete', { id: id })}>×</button> -->
		</summary>

		<Elements operationId={id} bind:elements />
	</details>
</li>
