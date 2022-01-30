<script>
	import { page } from '$app/stores';
	// import { createEventDispatcher } from 'svelte';
	import { operationTime } from '../store.js';
	import { doc, deleteDoc, updateDoc, arrayUnion } from "firebase/firestore"; 
	import { db } from '../fb.js'

	import Element from './Element.svelte';
	import '../css/operations.css';
	import '../css/elements.css';
	
	export let id;
	export let description;
	export let number;
	export let time;
	export let elements;
	
	
	let newElement = {};
	let pfd = 0.15;

	$: time = elements.reduce((sum, el) => sum + parseFloat(el.time), 0);
	$: pfdTime = (time * pfd) + time;
	
	
	const operationRef = (operationId) => {
		return doc(db, 'routers', $page.params.routerId, 'operations', operationId);
	}
	
	/* ELEMENT CRUD */
	const addElement = async() => {	
		await updateDoc(operationRef(id), {
			elements: arrayUnion({
				description: newElement.description,
				createdAt: new Date(),
				time: newElement.time
			})
		});
		newElement = {};
	}
	
	
	/* OPERATION CRUD */
	// const addOperation = async() => {		
	// 	const opRef = await addDoc(operationsCol($page.params.routerId), {
	// 		description: newOperation.description,
	// 		createdAt: new Date(),
	// 		time: 0,
	// 		order: operations.length + 1,
	// 		elements: []
	// 	});
	// 	
	// 	newOperation = {};
	// }
	
	const deleteElement = async(elementIndex) => {
		elements.splice(elementIndex, 1);	
	}
	
	
	const deleteOperation = async(operationId) => {
		const opRef = await deleteDoc(operationRef(operationId));
	}
	
	const disregardSpace = (e) => {
		if(e.keyCode === 32) e.preventDefault();
	}
	
	const disregardAction = (e) => {
		e.preventDefault();
	}
</script>



<li class="operation">
	
	<details class="operation__detail">
		<summary class="line-item">
			<div contenteditable="true" bind:innerHTML={number} on:click={disregardAction} on:keyup={disregardSpace} class="number operation__number"></div>			
			<div contenteditable="true" bind:innerHTML={description} on:click={disregardAction} on:keyup={disregardSpace} class="description operation__description"></div>
			<div class="time operation__time">{time.toFixed(2)} | { pfdTime.toFixed(2) }</div>
			<button class="action-item action-item--delete" on:click={deleteOperation(id)}>×</button>
		</summary>
	
		<ol class="list elements">
		{ #if elements && elements.length }
			<li class="list-header line-item">
				<div class="element__description">Description</div>
				<div class="element__frequency">Frequency</div>
				<div class="element__time">Time</div>
			</li>
			{ #each elements as element }
				<Element
					bind:time={element.time}
					bind:description={element.description} />
			{ /each }
		{ /if }
	
		<li class="line-item line-item--new">
			<div><input type="number" min="0" step="0.1" bind:value="{newElement.time}" /></div>
			<div><input type="text" bind:value="{newElement.description}"  /></div>
			<button class="action-item" on:click={addElement}>+</button>
		</li>
	</ol>
</details>
</li>

