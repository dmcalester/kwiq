<script>
	import { page } from '$app/stores';
	import { goto, afterNavigate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { operationTime, elementTime } from '../../store.js';
	import { collection, doc, addDoc, getDocs, getDoc, deleteDoc, onSnapshot, query, updateDoc, arrayUnion, arrayRemove, orderBy } from "firebase/firestore"; 
	import { db } from '../../fb.js'
	
	import  Operation  from '../../components/Operation.svelte';
	
	import '../../css/routers.css';
	// import '../../css/operations.css';
	import '../../css/elements.css';
	
	let router = {};
	let operations = [];
	
	$: routerTime = operations.reduce((sum, op) => sum + parseFloat(op.time), 0);
	
	$: _operationTime = operationTime;
	

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
	
	
	
	
	
	
	
	
	
	// both the operation and router values should never be manually set
	// always derive value from elements
	const updateRouterTime = async() => {
		
		var time = operations.reduce((sum, op) => sum + parseFloat(op.time), 0);
		router.time = time;
		
		// update router time
		const res = await updateDoc(doc(db, 'routers', router.id), {
			time: router.time
		})	
	}
	
	
	/* OPERATION CRUD */
	const addOperation = async() => {		
		const opRef = await addDoc(operationsCol($page.params.routerId), {
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
		<h1>{ #if router.time } {routerTime } { /if } | { $operationTime } | { $elementTime } |{router.description}</h1>
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
				bind:elements={operation.elements} 
				on:timeupdated={updateRouterTime}/>
		
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