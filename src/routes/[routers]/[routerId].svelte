<script>
	import { page } from '$app/stores';
	import { afterNavigate } from '$app/navigation';
	import { doc, onSnapshot, query, orderBy, updateDoc } from 'firebase/firestore';
	import { db, operationsCol, routerRef } from '$lib/fb.js';
	import { elementTime } from '../../store.js';

	import Operations from '../../components/Operations.svelte';

	import '../../css/routers.css';

	let router = {};
	let operations = [];

	let setupTime = 0; /* TODO: Dynamic and at the operation level */

	/* NOTE: 
		this may be an anti-pattern 
	*/
	elementTime.subscribe(() => {
		// Don’t update the time if there are no operations. This may
		// be a hack, but prevents time getting reset to 0 on initial
		// load since operations are loaded after router
		if (operations.length) {
			var time = operations.reduce((sum, op) => sum + parseFloat(op.time), 0) + setupTime;
			updateDoc(routerRef($page.params.routerId), { time: time });
		}
	});

	afterNavigate(async () => {
		onSnapshot(doc(db, 'routers', $page.params.routerId), (doc) => {
			router = { id: doc.id, ...doc.data() };
		});

		// Subscribes to a live collection of the operations in the
		// sub-collection of the current router
		const queryAllOperations = query(operationsCol($page.params.routerId), orderBy('order'));
		onSnapshot(queryAllOperations, (querySnapshot) => {
			operations = querySnapshot.docs.map((doc) => {
				return { id: doc.id, ...doc.data() };
			});
		});
	});
</script>

<div id="detail">
	<div class="detail__header">
		<h1>
			{#if router.time} {router.time.toFixed(2)} {/if} | {router.description}
		</h1>
		<input type="number" bind:value={setupTime} />
	</div>

	<section id="operations">
		<Operations bind:operations />
	</section>

	<div class="debug">
		<pre>{JSON.stringify(router, undefined, 2)}</pre>
		<pre>{JSON.stringify(operations, undefined, 2)}</pre>
	</div>
</div>
