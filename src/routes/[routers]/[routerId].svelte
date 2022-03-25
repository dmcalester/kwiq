<script>
	import { page } from '$app/stores';
	import { beforeUpdate } from 'svelte';
	import { afterNavigate, beforeNavigate } from '$app/navigation';
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
			var routerPfdTime =
				$_operations.reduce((sum, op) => sum + parseFloat(op.pfdTime), 0) + setupTime;

			if (routerTime !== $_router.time) {
				$_router.time = routerTime;
				$_router.pfdTime = routerPfdTime;
				updateDoc(routerRef($page.params.routerId), {
					time: $_router.time,
					pfdTime: $_router.pfdTime,
					modifiedAt: new Date()
				});
			}
		}, 50);
	});

	const updateRouter = () => {
		updateDoc(routerRef($page.params.routerId), { modifiedAt: new Date(), ...$_router });
	};

	// reset stores to avoid duplicate DB writes
	beforeNavigate(() => {
		$_operations = [];
		$_router = {};
	});

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
		<h1
			class="flex router--description"
			contenteditable="true"
			bind:innerHTML={$_router.description}
			on:blur={updateRouter}
		/>
		<div class="time detail__time">
			{#if $_router.pfdTime}
				<time class="time--pfd">{$_router.pfdTime.toFixed(2)}&nbsp;<span>TMU</span></time>
			{/if}
			{#if $_router.time}
				<time class="time--base">{$_router.time.toFixed(2)}</time>
			{/if}
		</div>
	</div>

	<section id="operations">
		<Operations />
	</section>
</div>
