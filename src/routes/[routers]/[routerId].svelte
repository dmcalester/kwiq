<script>
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { doc, onSnapshot, query, orderBy, updateDoc } from 'firebase/firestore';
	import { db, operationsCol, routerRef } from '$lib/fb.js';
	import { elementTime, _router, _operations } from '../../store.js';

	import Operations from '../../components/Operations.svelte';

	import '../../css/routers.css';

	let setupTime = 0; /* TODO: Dynamic and at the operation level */
	let routerWriteTimer;

	/* NOTE: 
		this may be an anti-pattern essentially though the router time
		and update field are only affected when an element time is updated
	*/
	elementTime.subscribe(() => {
		// Don’t update the time if there are no operations. This may
		// be a hack, but prevents time getting reset to 0 on initial
		// load since operations are loaded after router
		if ($_operations.length) {
			$_router.time = $_operations.reduce((sum, op) => sum + parseFloat(op.time), 0) + setupTime;
			updateDoc(routerRef($page.params.routerId), { time: $_router.time, modifiedAt: new Date() });
		}
	});

	const updateRouter = () => {
		updateDoc(routerRef($page.params.routerId), { modifiedAt: new Date(), ...$_router });
	};

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

	<div class="debug">
		<pre>{JSON.stringify($_router, undefined, 2)}</pre>
		<pre>{JSON.stringify($_operations, undefined, 2)}</pre>
	</div>
</div>
