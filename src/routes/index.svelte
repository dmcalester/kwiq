<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { collection, getDocs } from "firebase/firestore"; 
	import { db } from '../fb.js'
	import '../app.css';
	
	
	let routers = [];
	
	onMount(async () => {
		const routerSnapshot = await getDocs(collection(db, "routers"));
		routers = routerSnapshot.docs.map((doc) => {
			return { id: doc.id, ...doc.data() };
		})
	})
	

	const doSomething = () => {
		console.log('doing something');
	}

</script>

<div id="app">
	<header id="menu">
		<h1>KWIQ</h1>
	</header>
	
	<section id="routers">
		<h2>Routers</h2>
		
		{ #if routers && routers.length }
		<ul>
			{ #each routers as router }
			<li on:click={() => goto(`/routers/${router.id}`)}>{router.description}</li>
			{ /each}
		</ul>
		{ /if }
		
	</section>
	<section id="detail">
		<h2>Router</h2>
	</section>

</div>