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
	});	
		
</script>

<section id="routers">
	<h2>Routers</h2>
	{ #if routers && routers.length }
	<ul>
		{ #each routers as router }
		<li>
			<div on:click={() => goto(`/routers/${router.id}`)}>{router.description}</div>
		</li>
		{ /each}
	</ul>
	{ /if }
	
</section>