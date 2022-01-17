<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { afterNavigate } from '$app/navigation';
	import { collection, doc, addDoc, getDocs, getDoc, deleteDoc, onSnapshot, query } from "firebase/firestore"; 
	import { db } from '../../fb.js'
	
	let router = {};
	let operations = [];
	
	let newOperationDescription = '';
	
	
	afterNavigate(async () => {
		onSnapshot(doc(db, "routers", $page.params.routerId), (doc) => {
				router = { id: doc.id, ...doc.data()};
				console.log(router)
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
		
		
		// This does not subscribe to live data. Need to consider the UX and performance
		// implications of the snapshot
		/* const operationsSnapshot = await getDocs(collection(db, "routers", $page.params.routerId, "operations"));
		operations = operationsSnapshot.docs.map((doc) => {
			return { id: doc.id, ...doc.data() };
		}) */
	})
	
	
	const addOperation = async() => {
		const docRef = await addDoc(collection(db, "routers", router.id, "operations"), {
			description: newOperationDescription,
			createdAt: new Date()
		})
	}
	
	
	const deleteOperation = async(docId) => {
		console.log('delete op', router.id, docId);
		const docRef = await deleteDoc(doc(db, 'routers', router.id, 'operations', docId));
		
	}
	
	
	
</script>

<div id="detail">
	<h1>{router.description}</h1>
	<div class="new-item new-item--operation">
		<input type="text" bind:value="{newOperationDescription}" />
		<button on:click={addOperation}>Add</button>
	</div>
{ #if operations && operations.length }
<ul>
	{ #each operations as operation }
		<li>
			<div>{operation.description}</div>
			<button on:click={deleteOperation(operation.id)}>X</button>
		</li>
	{ /each }
</ul>
{ /if }

{ $page.params.routerId }
</div>