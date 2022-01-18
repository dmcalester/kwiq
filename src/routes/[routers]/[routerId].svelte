<script>
	import { page } from '$app/stores';
	import { goto, afterNavigate, beforeNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { collection, doc, addDoc, getDocs, getDoc, deleteDoc, onSnapshot, query, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore"; 
	import { db } from '../../fb.js'
	
	
	let router = {};
	

	let newRouter = {
		createdBy: "Peter Parker"
	};
	
	let newOperation = {}
	let newElement = {}
	
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
			router.operations = querySnapshot.docs.map(doc => {
				return { id: doc.id, ...doc.data() }
			})
		});
	});
	
	/* Router CRUD */
	/*
	**	TODO
			Return created doc
	*/
	const addRouter = async() => {
		const docRef = await addDoc(collection(db, "routers"), {
			description: newRouter.description,
			batch: newRouter.batch,
			createdAt: new Date(),
			createdBy: newRouter.createdBy,
			 time: 0 
		});
	}
	
	const updateRouter = async() => {
		const routerRef = 
		await updateDoc()
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
			time: 0
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
	const updateRouterTime = () => {
		
		
		let routerTime = 0;
		
		// operation value is the sum of the elements value
		router.operations.forEach(op => {
			console.log(op)
			op.time = op.elements.reduce((sum, el) => sum + parseFloat(el.time), 0);
			 routerTime = routerTime + parseFloat(op.time);
		});
		
		console.log('routerTime',routerTime)
		// router value is the sum of the operations value
		router.time = routerTime;
	}
	
</script>

<div id="router">
	<div class="router--details">
		<h1>{router.description}</h1>
		<h2>{ $page.params.routerId }</h2>
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
		
		<div class="new-item new-item--router">
			<h3>Add Router</h3>
			<label>Description</label>
			<input type="text" bind:value="{newRouter.description}" />
			<label>Batch</label>
			<input type="number" bind:value="{newRouter.batch}" />
			
			<button on:click={addRouter}>Add</button>
		</div>
	</div>
	
	<div id="operations">
		
		<div class="new-item new-item--operation">
			<h3>Add Operation</h3>
			<input type="text" bind:value="{newOperation.description}" />
			<button on:click={addOperation}>Add</button>
		</div>
	
	{ #if router.operations && router.operations.length }
		{ #each router.operations as operation }
			<details>

				<summary>
					<div>Desc: {operation.description}</div>
					<div>Time: {operation.time}</div>
					<button on:click={deleteOperation(operation.id)}>X</button>
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
									<div>Desc: {element.description}</div> 
									<div>Time: <input type="number" min="0" step="0.1" bind:value="{element.time}" on:change="{updateRouterTime}"/>
									<button on:click={() => deleteElement(operation.id, element.id)}>X</button></li>
							{ /each }
						</ul>
					</div>
				{ /if }
				
			</details>
		{ /each }
	{ /if }

	</div>
</div>