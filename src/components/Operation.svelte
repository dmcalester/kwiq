<script>
	import { page } from '$app/stores';
	import { createEventDispatcher } from 'svelte';
	import { collection, doc, addDoc, getDocs, getDoc, deleteDoc, onSnapshot, query, updateDoc, arrayUnion, arrayRemove, orderBy } from "firebase/firestore"; 
	import { db } from '../fb.js'

	// import Element from './Element.svelte';
	import '../css/operations.css';
	import '../css/elements.css';
	
	export let id;
	export let description;
	// export let number;
	export let time;
	export let elements;
	
	
	let newElement = {}
	
	const operationRef = (operationId) => {
		return doc(db, 'routers', $page.params.routerId, 'operations', operationId);
	}
	
	/* ELEMENT CRUD */
	const addElement = async() => {
	
		// const elementRef = docRef(router.id, elId);
		
		await updateDoc(operationRef(id), {
			elements: arrayUnion({
				description: newElement.description,
				createdAt: new Date(),
				time: newElement.time
			})
		});
		newElement = {};
		updateOperationTime();
	}
	
	
	// const deleteElement = async(docId, elementId) => {
	// 	
	// }
	
	
	const deleteOperation = async(operationId) => {
		const opRef = await deleteDoc(operationRef(operationId));
	}
	
	const dispatch = createEventDispatcher();
	const updateOperationTime = async () => {
		time = elements.reduce((sum, el) => sum + parseFloat(el.time), 0);
		dispatch('timeupdated', {
			time: time
		});	
	
		// update operation time
		const res = await updateDoc(doc(db, 'routers', $page.params.routerId, 'operations', id), {
			time: time,
			elements: elements
		});
	}
	
	
</script>
<details open class="operation__detail">
	<summary class="operation__summary">
<!-- 		<div class="operation__number">{number}</div> -->
		<div class="operation__description">{description}</div>
		<div class="operation__time time">{time.toFixed(2)}</div>
		<button class="operation__action operation__action-delete" on:click={deleteOperation(id)}>Delete</button>
	</summary>
	<ol>
	{ #if elements && elements.length }
	
		{ #each elements as element, i }
			<li class="element">
				<div><input type="number" min="0" step="0.1" bind:value="{element.time}" on:change="{updateOperationTime}"/></div>
				<div><input type="text" bind:value="{element.description}"  /></div>
			<!-- 	<button class="element__action element__action-delete" on:click={() => deleteElement(operation.id, element.id)}>X</button> -->
			</li>
		{ /each }
	{ /if }
	<li>
		<div><input type="number" min="0" step="0.1" bind:value="{newElement.time}" /></div>
		<div><input type="text" bind:value="{newElement.description}"  /></div>
		<button class="operation__action operation__action-add" on:click={addElement}>Add</button>
	</li>
	</ol>
</details>

