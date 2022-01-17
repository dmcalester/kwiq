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
	
	// before or after navigate?
	afterNavigate(async () => {
		onSnapshot(doc(db, "routers", $page.params.routerId), (doc) => {
				router = { id: doc.id, ...doc.data()};
		});
		
		
		// This DOES subscribe to live data. Need to consider the UX and performance
		// implications of the snapshot
		const operationsCol = collection(db, "routers", $page.params.routerId, "operations");
		const queryAllOperations = query(operationsCol);
		onSnapshot(queryAllOperations, (querySnapshot) => {
			operations = querySnapshot.docs.map(doc => {
				return { id: doc.id, ...doc.data() }
			})
		});
	})
	
	
	/* OPERATION CRUD */
	const addOperation = async() => {
		const docRef = await addDoc(collection(db, "routers", router.id, "operations"), {
			description: newOperationDescription,
			createdAt: new Date()
		})
	}
	
	
	const deleteOperation = async(docId) => {
		const docRef = await deleteDoc(doc(db, 'routers', router.id, 'operations', docId));
	}
	
	
	/* ELEMENT CRUD */
	const addElement = async(docId) => {
		
		const elementRef = doc(db, "routers", router.id, 'operations', docId);
		
		await updateDoc(elementRef, {
			elements: arrayUnion({
				description: newElementDescription,
				createdAt: new Date()
			})
		})
	}
	
	
	const deleteElement = async(docId, elementId) => {
		console.log('delete element', elementId)
		
		const elementRef = doc(db, "routers", router.id, 'operations', docId);
		
		await updateDoc(elementRef, {
			elements: arrayRemove(elementId)	
		})
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
								<li><span>{element.id}</span> <button on:click={() => deleteElement(operation.id, element.id)}>X</button></li>
							{ /each }
						</ul>
					</div>
				{ /if }
				
			</details>
		{ /each }
	{ /if }

	</div>
</div>