<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { collection, doc, getDocs, getDoc, onSnapshot } from "firebase/firestore"; 
	import { db } from '../../fb.js'
	
	import '../../app.css';
	
	let router = {};
	let operations = [];
	
	
	
	onMount(async () => {
		const _router = onSnapshot(doc(db, "routers", $page.params.routerId), (doc) => {
				router = { id: doc.id, ...doc.data()};
				console.log(router)
		});
	})
	
	
	
</script>

<input bind:value="{router.description}" />
<h2>What now?</h2>

{ #if router.operation && router.operation.length }
<ul>
	{ #each router.operations as operation }
		<li>{operation.description}</li>
	{ /each }
</ul>
{ /if }

{ $page.params.routerId }