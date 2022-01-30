<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { onSnapshot } from "firebase/firestore"; 
	import { queryAllRouters } from '../api.js'
	
	import '../css/list.css';
	
	
	let routers = [];
	
	
	
	
	
	onMount(async () => {
		onSnapshot(queryAllRouters, (querySnapshot) => {
			routers = querySnapshot.docs.map(doc => {
				return { id: doc.id, ...doc.data() }
			})
		});
	});
	
	const loadRouter = (routerId) => {
		goto(`/routers/${routerId}`);
	}
		
</script>

<section id="list">
	<header class="list--header">
		<h2 class="list--header-h2">Routers</h2>
		<button on:click={() => goto('new-router')} class="list--header-button">+</button>
		
		<!-- 
			TODO:
			
			if(projects.length > 1) then display project list	
			
			<select>
				<option selected value="project-1">Edwards Life Science</option>
				<option value="project-2">Project 2</option>
			</select>
			
		//-->
		
	</header>
	
	
	{ #if routers && routers.length }
	<ul class="list list__routers">
		{ #each routers as router }
		<li class="list-router">
			<div on:click={loadRouter(router.id)}>{router.description}</div>
		</li>
		{ /each}
	</ul>
	{ /if }
	
</section>