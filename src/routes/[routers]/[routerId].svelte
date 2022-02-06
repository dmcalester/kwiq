<script>
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { doc, onSnapshot, query, orderBy, updateDoc } from 'firebase/firestore';
	import { db, operationsCol, routerRef } from '$lib/fb.js';
	import { _router, _operations } from '../../store.js';
	import Operations from '../../components/Operations.svelte';

	import '../../css/routers.css';

	let timer;
	let setupTime = 0; /* TODO: Dynamic and at the operation level */

	_operations.subscribe(() => {
		// debounce router time change to account for loading of elements
		// and off flash of time update.
		clearTimeout(timer);
		timer = setTimeout(() => {
			var routerTime = $_operations.reduce((sum, op) => sum + parseFloat(op.time), 0) + setupTime;
			if (routerTime !== $_router.time) {
				console.log(routerTime);
				$_router.time = routerTime;
				updateDoc(routerRef($page.params.routerId), {
					time: $_router.time,
					modifiedAt: new Date()
				});
			}
		}, 50);
	});

	const updateRouter = () => {
		updateDoc(routerRef($page.params.routerId), { modifiedAt: new Date(), ...$_router });
	};

	/* Load a Router and its operations */
	afterNavigate(async () => {
		onSnapshot(doc(db, 'routers', $page.params.routerId), (doc) => {
			var router = { id: doc.id, ...doc.data() };
			$_router = router;
		});

		// Subscribes to a live collection of the operations in the
		// sub-collection of the current router
		const queryAllOperations = query(operationsCol($page.params.routerId), orderBy('order'));
		onSnapshot(queryAllOperations, (querySnapshot) => {
			var operations = querySnapshot.docs.map((doc) => {
				return { id: doc.id, ...doc.data() };
			});
			$_operations = operations;
		});
	});
</script>

<div id="detail">
	<div class="detail__header">
		<h1>
			{#if $_router.time} {$_router.time.toFixed(2)} {/if} |
			<div contenteditable="true" bind:innerHTML={$_router.description} on:blur={updateRouter} />
		</h1>
		<input type="number" bind:value={setupTime} />
	</div>

	<section id="operations">
		<Operations />
	</section>

	<!--
	<div class="debug">
		<pre>{JSON.stringify($_router, undefined, 2)}</pre>
		<pre>{JSON.stringify($_operations, undefined, 2)}</pre>
	</div>
	//-->
</div>
