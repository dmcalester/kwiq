<script>
	import { page } from '$app/stores';
	import { goto, afterNavigate, beforeNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { collection, doc, addDoc, getDocs, getDoc, deleteDoc, onSnapshot, query, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"; 
	import { db } from '../../fb.js'
	
	
	let router = {};
	let operations = [];
	let newOperationDescription = '';
	let newElementDescription = '';
	
	const operationsCol = (routerId) => {
	 return collection(db, "routers", routerId, "operations");
	}
	
	const docRef = (routerId, operationId) => {
		return doc(db, 'routers', routerId, 'operations', operationId);
	}
	

	afterNavigate(async () => {
		onSnapshot(doc(db, "routers", $page.params.routerId), (doc) => {
				router = { id: doc.id, ...doc.data()};
		});
		
		
		// Subscribes to a live collection of the operations in the sub-collection of the
		// current router
		const queryAllOperations = query(operationsCol($page.params.routerId));
		onSnapshot(queryAllOperations, (querySnapshot) => {
			operations = querySnapshot.docs.map(doc => {
				return { id: doc.id, ...doc.data() }
			})
		});
	})
	
	
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
			description: newOperationDescription,
			createdAt: new Date()
		})
	}
	
	
	const deleteOperation = async(opId) => {
		const opRef = await deleteDoc(docRef(router.id, opId));
	}
	
	
	/* ELEMENT CRUD */
	const addElement = async(elId) => {
		/*
		** 	TODO
				Account for the following additional fields
				- number				// Essentially order, rename and auto increment
				- modifiedBy 		// overkill remove
				- createdBy 		// overkill remove
				- massUpdateId 	// create an index for massUpdate
				- distance			// int/float?
				- typeOption		// ?? int/float?
				- typeOptionModifier // ?? int/float?
				- frequency			// change to array [0,0]
				- compoundFrequency // second vale in frequency array
				- weight				// int/float
				- time					// int/float?? currently a string
				- valueAdd			// string Value Add | Non Value Add | Essential Non Value Add
				- code					// string
				- setup					// bool
				- type					// string
				- directInputVal // float/int
		*/
		
		const elementRef = docRef(router.id, elId);
		
		await updateDoc(elementRef, {
			elements: arrayUnion({
				description: newElementDescription,
				createdAt: new Date()
			})
		});
	}
	
	
	const deleteElement = async(docId, elementId) => {
		
	}
	
</script>

<div id="router">
	<div class="router--details">
		<h1>{router.description}</h1>
		<h2>{ $page.params.routerId }</h2>
	</div>
	
	<div id="operations">
		
		<div class="new-item new-item--operation">
			<input type="text" bind:value="{newOperationDescription}" />
			<button on:click={addOperation}>Add</button>
		</div>
	
	{ #if operations && operations.length }
		{ #each operations as operation }
			<details>

				<summary>{operation.description} <button on:click={deleteOperation(operation.id)}>X</button></summary>
				
				<div class="new-item new-item--element">
					<input type="text" bind:value="{newElementDescription}" />
					<button on:click={addElement(operation.id)}>Add</button>
				</div>
				
				
				{ #if operation.elements && operation.elements.length }
					<div class="elements">
						<ul>
							{ #each operation.elements as element, i }
								<li><span>{element.description}</span> <button on:click={() => deleteElement(operation.id, element.id)}>X</button></li>
							{ /each }
						</ul>
					</div>
				{ /if }
				
			</details>
		{ /each }
	{ /if }

	</div>
</div>