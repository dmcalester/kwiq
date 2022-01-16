<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { collection, doc, getDocs, getDoc, onSnapshot, query } from "firebase/firestore"; 
	import { db } from '../../fb.js'
	
	import '../../app.css';
	
	let router = {};
	let operations = [];
	
	
	
	onMount(async () => {
		onSnapshot(doc(db, "routers", $page.params.routerId), (doc) => {
				router = { id: doc.id, ...doc.data()};
				console.log(router)
		});
		
		const operationsSnapshot = await getDocs(collection(db, "routers", $page.params.routerId, "operations"));
		operations = operationsSnapshot.docs.map((doc) => {
			return { id: doc.id, ...doc.data() };
		})
	})
	
	
	
</script>

<h1>{router.description}</h1>

{ #if operations && operations.length }
<ul>
	{ #each operations as operation }
		<li>{operation.description}</li>
	{ /each }
</ul>
{ /if }

{ $page.params.routerId }