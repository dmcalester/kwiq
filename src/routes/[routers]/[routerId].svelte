<script>
	import { page } from '$app/stores';
	import { goto, afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { collection, doc, addDoc, getDocs, getDoc, deleteDoc, onSnapshot, query, updateDoc, arrayUnion, arrayRemove, orderBy } from "firebase/firestore"; 
	import { db } from '../../fb.js'
	
	import '../../css/router.css';
	
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
	const docRef = (routerId, operationId) => {
		return doc(db, 'routers', routerId, 'operations', operationId);
	}
	
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
<!-- 		<h2>{router.createdBy} on {router.createdAt}</h2> -->
<!-- 		<h2>{ $page.params.routerId }</h2> 
		<dl>
			<dt>Batch</dt>
			<dd>{router.description}</dd>
			<dt>Created at</dt>
			<dd>{router.createdAt}</dd>
			<dt>Author</dt>
			<dd>{router.createdBy}</dd>
			<dt>time</dt>
			<dd>{router.time}</dd>
		</dl>
		-->

	</div>
	
	<section id="operations">
	{ #if operations && operations.length }
	<header class="operations__header">
		<h1 class="operations__meta">{operations.length} Operations</h1>
<!-- 		<button class="operations__new">New Operation</button> -->
	</header>
	<ul class="list operations__list">
		<li class="operation operation__header">
			<div class="operation__number">#</div>
			<div class="operation__description">Time</div>
			<div class="operation__time">Description</div>
		
		</li>
		{ #each operations as operation }
			<li class="operation">
				<details class="operation__detail">
					<summary class="operation__summary">
						<div class="operation__number">{operation.number}</div>
						<div class="operation__description">{operation.description}</div>
						<div class="operation__time time">{operation.time}</div>
						<button class="operation__action operation__action-delete" on:click={deleteOperation(operation.id)}>Delete</button>
					</summary>
				
					
					<div class="new-item new-item--element">
						<input type="text" bind:value="{newElement.description}" />
						<button on:click={addElement(operation.id)}>Add</button>
					</div>
	
					{ #if operation.elements && operation.elements.length }
						<div class="elements">
							
								
							<ul>
								{ #each operation.elements as element, i }
									<li>
										<div><input type="number" min="0" step="0.1" bind:value="{element.time}" on:change="{updateRouterTime}"/></div>
										<div><input type="text" bind:value="{element.description}"  /></div>
										<button on:click={() => deleteElement(operation.id, element.id)}>X</button>
									</li>
								{ /each }
								
							</ul>
						</div>
					{ /if }
					
				</details>
			</li>
			
		{ /each }
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