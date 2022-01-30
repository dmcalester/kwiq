<script>
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { collection, doc, addDoc, onSnapshot, query, orderBy } from "firebase/firestore"; 
	import { db } from '../../fb.js'
	
	import  Operations  from '../../components/Operations.svelte';
	
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
	// const addOperation = async() => {		
	// 	const opRef = await addDoc(operationsCol($page.params.routerId), {
	// 		number: newOperation.number,
	// 		description: newOperation.description,
	// 		createdAt: new Date(),
	// 		time: 0,
	// 		order: operations.length + 1,
	// 		elements: []
	// 	});
	// 	
	// 	newOperation = {};
	// }
	
</script>

<div id="detail">
	<div class="detail__header">
		<h1>{ #if router.time } {routerTime.toFixed(2) } { /if } | {router.description}</h1>
		<input type="number" bind:value="{setupTime}" />
	</div>
	
	<section id="operations">
		<Operations 
			bind:operations={operations} />
	</section>
</div>