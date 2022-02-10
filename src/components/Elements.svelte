<script>
	import { page } from '$app/stores';
	import { updateDoc, arrayUnion } from 'firebase/firestore';
	import { operationRef } from '$lib/fb.js';
	import Element from './Element.svelte';

	import '../css/elements.css';

	export let operationId;
	export let elements;

	let newElement = {};

	/* ELEMENT CRUD */
	const addElement = async () => {
		await updateDoc(operationRef($page.params.routerId, operationId), {
			elements: arrayUnion({
				description: newElement.description,
				time: newElement.time,
				createdAt: new Date()
			})
		});
		newElement = {};
	};

	const updateElement = async () => {
		console.log('ELEMENTS update elements', $page.params.routerId);
		await updateDoc(operationRef($page.params.routerId, operationId), {
			elements: elements
		});
	};

	const deleteElement = async (e) => {
		elements = elements.filter((el, index) => index !== e.detail.id);
		updateDoc(operationRef($page.params.routerId, operationId), {
			elements: elements
		});
	};
</script>

<ol class="list elements">
	{#if elements && elements.length}
		<li class="list-header line-item">
			<div class="element__description">Description</div>
			<div class="element__frequency">Frequency</div>
			<div class="element__time">Time</div>
		</li>
		<!-- TODO replace with elements as element(id) //-->
		{#each elements as element, i}
			<Element
				id={i}
				bind:time={element.time}
				bind:description={element.description}
				bind:motion={element.motion}
				bind:frequency={element.frequency}
				on:delete={deleteElement}
				on:update={updateElement}
			/>
		{/each}
	{/if}

	<li class="line-item line-item--new">
		<div><input type="number" min="0" step="0.1" bind:value={newElement.time} /></div>
		<div><input type="text" bind:value={newElement.description} /></div>
		<button class="action-item" on:click={addElement}>+</button>
	</li>
</ol>
