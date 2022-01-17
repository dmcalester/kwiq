<script>
	import { onMount } from 'svelte';
	import { goto, afterNavigate } from '$app/navigation';
	import { collection, doc, getDocs, addDoc, query, onSnapshot, deleteDoc, limit } from "firebase/firestore"; 
	import { db } from '../fb.js'
	
	
	
	let routers = [];
	let newRouterDescription = '';
	
	const routersCol = collection(db, "routers");
	const queryAllRouters = query(routersCol);
	
	onMount(async () => {
		onSnapshot(queryAllRouters, (querySnapshot) => {
			routers = querySnapshot.docs.map(doc => {
				return { id: doc.id, ...doc.data() }
			})
		});
		
		// Get routers once
		// const routerSnapshot = await getDocs(collection(db, "routers"));
		// routers = routerSnapshot.docs.map((doc) => {
		// 	return { id: doc.id, ...doc.data() };
		// })
	})
	
	
	/* CRUD Operations */
	const addRouter = async() => {
		const docRef = await addDoc(collection(db, "routers"), {
			description: newRouterDescription,
			createdAt: new Date()
		}
	)}
		
	/* 
	** TODO 
		Sub-collections can’t be deleted from the web client. If this
		is going to be deployed on Netlify might need to have a Lambda 
		function to actually delete the sub-collection, or perhaps some
		sort of CRON job to delete orphaned sub-collections
	*/
	const deleteRouter = async(docId) => {
		const docRef = await deleteDoc(doc(db, 'routers', docId));
		
		/* Determine if there is an operations subcollection
		const q = query(collection(db, 'routers', docId, 'operations'), limit(1));
		onSnapshot(q, (querySnapshot) => {
			if(querySnapshot.docs.length > 0) {
				console.log('This has')
			}
		})
		*/		
	}
		
		
		
</script>

<section id="routers">
	<h2>Routers</h2>
	<div class="new-item new-item--router">
		<input type="text" bind:value="{newRouterDescription}" />
		<button on:click={addRouter}>Add</button>
	</div>
	{ #if routers && routers.length }
	<ul>
		{ #each routers as router }
		<li>
			<div on:click={() => goto(`/routers/${router.id}`)}>{router.description}</div>
			
			<button on:click={deleteRouter(router.id)}>X</button>
		</li>
		{ /each}
	</ul>
	{ /if }
	
</section>