<script>
	import { db } from '../fb.js'
	import { collection, query, orderBy, onSnapshot, addDoc, doc, deleteDoc, getDoc } from "firebase/firestore"; 
	
	
	
	// routers array
	let routers = [];
	const routersCol = collection(db, 'routers');
	const queryAllRouters = query(routersCol);

	// might just want to get for the list of routers
	const listenCol = onSnapshot(queryAllRouters, (querySnapshot) => {
		// routers = querySnapshot.docs.map(doc => {
		// 	return { id: doc.id, ...doc.data() }
		// });
	});
		
	routers = routersCol.docs.map(doc => {
		return { id: doc.id, ...doc.data() }
	})
	
	


	async function getOperations(routerId) {
		console.log("routerID",routerId);
		
		const docRef = doc(routersCol, routerId);
		const docSnap = await getDoc(docRef);
		
		if (docSnap.exists()) {
		  console.log("Document data:", docSnap.data());
		  
		} else {
		  // doc.data() will be undefined in this case
		  console.log("No such document!");
		}
		
	}
	
	// both the operation and router values should never be manually set
	// always derive value from elements
	const updateRouterTime = () => {
		let routerVal = 0;
		
		// operation value is the sum of the elements value
		_router.operations.forEach(op => {
			op.value = op.elements.reduce((sum, el) => sum + el.value, 0);
			 routerVal = routerVal  + op.value;
		});
		
		// router value is the sum of the operations value
		_router.value = routerVal;
	}
	
	const _router ={
		name: "Test",
		value: 40,
		operations: [
			{
				name: "Op1",
				value: 30,
				elements: [
					{
						name: "El1.1",
						value: 19,
					},
					{
						name: "El1.2",
						value: 11,
					}
				]
			},
			{
				name: "Op2",
				value: 10,
				elements: [
					{
						name: "El2.1",
						value: 5,
					},
					{
						name: "El2.2",
						value: 5,
					}
				]
			},
		]
	};
	

	
</script>

<div class="app">


<section class="main">
	<h1>Test</h1>
	<div style="display: flex;">
		<div contenteditable="true" bind:innerHTML="{_router.name}"> | </div> <div> Time: {_router.value}</div>
	</div>
	
	<ul>
		{ #each routers as router }
			<li on:click="{getOperations(router.id)}">{router.description} | {router.time} </li>
		{ /each }
	</ul>
	
	<ul>
		{#each _router.operations as operation}
			<li>
				<div contenteditable="true" bind:innerHTML="{operation.name}"></div>
				<div>Time: {operation.value}</div>
				<ol>
					{#each operation.elements as element}
					<li>
						<div contenteditable="true" bind:innerHTML="{element.name}"></div>
						<input type="number" bind:value="{element.value}" on:change="{updateRouterTime}">	
					</li>
					{/each}
				</ol>
			</li>
		{/each}
	</ul>
	
</section>

</div>