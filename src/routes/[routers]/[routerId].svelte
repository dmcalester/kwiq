<script>
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { collection, doc, addDoc, onSnapshot, query, orderBy } from "firebase/firestore"; 
	import { db } from '../../fb.js'
	
	import  Operation  from '../../components/Operation.svelte';
	
	import '../../css/routers.css';
	
	
	let router = {};
	let operations = [];
	
	let newOperation = {}
	
	let setupTime = 0; /* TODO: Dynamic and at the project level */
	
	// calculate router time
	$: routerTime = (operations.reduce((sum, op) => sum + parseFloat(op.time), 0) + setupTime);
	
	
	const operationsCol = (routerId) => {
	 return collection(db, "routers", routerId, "operations");
	}
	
	// const routerRef = (routerId) => {
	// 	return doc(db, 'routers', routerId);
	// }
	

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
	
	
	/* OPERATION CRUD */
	const addOperation = async() => {		
		const opRef = await addDoc(operationsCol($page.params.routerId), {
			number: newOperation.number,
			description: newOperation.description,
			createdAt: new Date(),
			time: 0,
			order: operations.length + 1,
			elements: []
		});
		
		newOperation = {};
	}
	
</script>

<div id="detail">
	<div class="detail__header">
		<h1>{ #if router.time } {routerTime.toFixed(2) } { /if } | {router.description}</h1>
		<input type="number" bind:value="{setupTime}" />
	</div>
	
	<section id="operations">
	{ #if operations && operations.length }
		<header class="operations__header">
			<h1 class="operations__meta">{operations.length} Operations</h1>
		</header>
			
		<ul class="list">
		<!-- Operation Header //-->
			<li class="line-item list-header list-header--operation">
				<div class="operation__number">#</div>
				<div class="operation__desscription">Description</div>
				<div class="time operation__time">Time</div>
			</li>
	
			<!-- Operations //-->
			{ #each operations as operation }
		
			<Operation  
				id={operation.id}
				bind:time={operation.time}
				bind:number={operation.number}
				bind:description={operation.description}
				bind:elements={operation.elements} />
		
			{ /each }
	
			<!-- New Operation //-->
			<li class="line-item line-item--new">
				<input type="text" class="" bind:value="{newOperation.description}" >
				<button class="action-item" on:click={addOperation}>+</button>
			</li>
		</ul>
	{ /if }

	</section>
</div>