<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { onSnapshot } from 'firebase/firestore';
	import { queryAllRouters } from '$lib/fb.js';
	import { _router, _operations } from '../store.js';

	import '../css/list.css';

	let routers = [];

	onMount(async () => {
		onSnapshot(queryAllRouters, (querySnapshot) => {
			console.log(querySnapshot);
			routers = querySnapshot.docs.map((doc) => {
				return { id: doc.id, ...doc.data() };
			});
		});
	});

	const loadRouter = (routerId) => {
		goto(`/routers/${routerId}`);
	};
</script>

<section id="list">
	<header class="list--header">
		<h2 class="list--header-h2">Routers</h2>
		<button on:click={() => goto('/routers/new-router')} class="list--header-button">+</button>
	</header>

	{#if routers && routers.length}
		<ul class="list list__routers">
			{#each routers as router}
				<li class="list-router">
					<div on:click={loadRouter(router.id)}>{router.description}</div>
				</li>
			{/each}
		</ul>
	{/if}

	<pre style="color: #fff;">{JSON.stringify($_router, undefined, 2)}</pre>
	<pre style="color: #fff;">{JSON.stringify($_operations, undefined, 2)}</pre>
</section>
