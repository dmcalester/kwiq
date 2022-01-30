<script>
	import { page } from '$app/stores';
	import { updateDoc, arrayUnion } from "firebase/firestore"; 
	import { operationRef } from '../api.js';
	import Element from './Element.svelte';
	
	import '../css/elements.css';
	
	export let operationId;
	export let elements;
	
	let newElement = {};
	
	/* ELEMENT CRUD */
	const addElement = async() => {	
		await updateDoc(operationRef($page.params.routerId, operationId), {
			elements: arrayUnion({
				description: newElement.description,
				time: newElement.time,
				createdAt: new Date()
			})
		});
		newElement = {};
	}
	
	const deleteElement = async(e) => {
		elements = elements.filter((el, index) => index !== e.detail.index);
		await updateDoc(operationRef($page.params.routerId, operationId), {
			elements: elements
		});
	}
	
</script>

<ol class="list elements">
	{ #if elements && elements.length }
		<li class="list-header line-item">
			<div class="element__description">Description</div>
			<div class="element__frequency">Frequency</div>
			<div class="element__time">Time</div>
		</li>
		{ #each elements as element, i }
			<Element
				index={i}
				bind:time={element.time}
				bind:description={element.description}
				on:delete={deleteElement} />
		{ /each }
	{ /if }

	<li class="line-item line-item--new">
		<div><input type="number" min="0" step="0.1" bind:value="{newElement.time}" /></div>
		<div><input type="text" bind:value="{newElement.description}"  /></div>
		<button class="action-item" on:click={addElement}>+</button>
	</li>
</ol>