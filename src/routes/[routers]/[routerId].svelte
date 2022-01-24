<script>
	import { page } from '$app/stores';
	import { goto, afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { collection, doc, addDoc, getDocs, getDoc, deleteDoc, onSnapshot, query, updateDoc, arrayUnion, arrayRemove, orderBy } from "firebase/firestore"; 
	import { db } from '../../fb.js'
	
	import  Operation  from '../../components/Operation.svelte';
	
	import '../../css/routers.css';
	// import '../../css/operations.css';
	import '../../css/elements.css';
	
	let router = {};
	let operations = [];
	
	let newOpDesc = "";

	
	let newOperation = {
		description: ""
	}
	let newElement = {}
	
	const operationsCol = (routerId) => {
	 return collection(db, "routers", routerId, "operations");
	}
	
	/* TODO: change this to operation ref */
	
	
	const routerRef = (routerId) => {
		return doc(db, 'routers', routerId);
	}
	

	afterNavigate(async () => {
		onSnapshot(doc(db, "routers", $page.params.routerId), (doc) => {
				router = { id: doc.id, ...doc.data()};
		});
		
		// Subscribes to a live collection of the operations in the sub-collection of the
		// current router
		const queryAllOperations = query(operationsCol($page.params.routerId), orderBy("order"));
		onSnapshot(queryAllOperations, (querySnapshot) => {
			operations = querySnapshot.docs.map(doc => {
				return { id: doc.id, ...doc.data() }
			})
		});
	});
	
	/* Router CRUD */
	/*
	**	TODO
			Return created doc
	*/
	
	
	// const updateRouter = async() => {
	// 	const routerRef = 
	// 	await updateDoc()
	// }
	
	
	
	
	
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
				description: newElement.description,
				createdAt: new Date(),
				time: 0
			})
		});
	}
	
	
	const deleteElement = async(docId, elementId) => {
		
	}
	
	
	
	
	
	
	// both the operation and router values should never be manually set
	// always derive value from elements
	const updateRouterTime = async() => {
	
		let routerTime = 0;
		
		// operation value is the sum of the elements value
		operations.forEach((op, i) => {
			if(op.elements && op.elements.length) {
				op.time = op.elements.reduce((sum, el) => sum + parseFloat(el.time), 0);
				routerTime = routerTime + parseFloat(op.time);
		 	}
		});
		
		// update router time
		const res = await updateDoc(doc(db, 'routers', router.id), {
			time: routerTime
		})
		
	}
	
</script>

<div id="detail">
	<div class="detail__header">
		<h1>{router.time} | {router.description}</h1>
	</div>
	
	<section id="operations">
	{ #if operations && operations.length }
	<header class="operations__header">
		<h1 class="operations__meta">{operations.length} Operations</h1>
	</header>
	<ul class="list operations__list">
		
		<!-- Operation Header //-->
		<li class="operation operation__header">
			<div class="operation__number">#</div>
			<div class="operation__description">Time</div>
			<div class="operation__time">Description</div>
		</li>
		
		<!-- Operations //-->
		{ #each operations as operation }
			<li class="operation">
				<Operation  
					id={operation.id}
					number={operation.number}
					time={operation.time}
					description={operation.description}
					elements={operation.elements} />
			</li>
		{ /each }
		
		<!-- New Operation //-->
		<li class="operation operations__new">
			<details>
			<summary class="operation__summary">
				<input type="text" class="operation__description operations__description-new" bind:value="{newOperation.description}" >
				<div class="operation__time time">0</div>
				<button class="operation__action operation__action-add" on:click={addOperation}>Add</button>
			</summary>
			
			</details>
		</li>
	</ul>
	{ /if }

	</section>
</div>