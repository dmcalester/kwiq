<script>
	import { page } from '$app/stores';
	import { collection, doc, addDoc, getDocs, getDoc, deleteDoc, onSnapshot, query, updateDoc, arrayUnion, arrayRemove, orderBy } from "firebase/firestore"; 
	import { db } from '../fb.js'

	import Element from './Element.svelte';
	import '../css/operations.css';
	
	export let id;
	export let description;
	export let number;
	export let time;
	export let elements;
	
	
	const operationRef = (operationId) => {
		return doc(db, 'routers', $page.params.routerId, 'operations', operationId);
	}
	
	/* OPERATION CRUD */
	const addOperation = async() => {
		/*
		** 	TODO
				Account for the following additional fields
				- modifiedBy 		// overkill remove
				- createdBy 		// overkill remove
				- massUpdateId 	// create an index for massUpdate
				- order					// integer, auto incremented unless specifically changed
				- time					// auto calculated int/float?
				- setupTime			// int/float?
				- pfd						// int/float?
				- number				// part number should be string, should be id; unique
				- notes					// string
				- customFields	// next version
		*/
		
		const opRef = await addDoc(operationsCol($page.params.routerId), {
			description: newOperation.description,
			createdAt: new Date(),
			time: 0,
			order: operations.length + 1
		});
		
		newOperation = {};
	}
	
	
	const deleteOperation = async(operationId) => {
		const opRef = await deleteDoc(operationRef(operationId));
	}
	
	
</script>
<h1>Elements {elements.length}</h1>
<details class="operation__detail">
	<summary class="operation__summary">
		<div class="operation__number">{number}</div>
		<div class="operation__description">{description}</div>
		<div class="operation__time time">{time}</div>
		<button class="operation__action operation__action-delete" on:click={deleteOperation(id)}>Delete</button>
	</summary>
	{ #if elements && elements.length }
	<ol>
		{ #each elements as element, i }
			<Element 
				time={element.time}
				description={element.description}/>
		{ /each }
	</ol>
	{ /if }
</details>

