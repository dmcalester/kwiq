<script>
	import { page } from '$app/stores';
	import { addDoc, deleteDoc } from 'firebase/firestore';
	import { operationsCol, operationRef } from '$lib/fb.js';
	import { _operations } from '../store.js';

	import '../css/operations.css';
	import Operation from './Operation.svelte';

	// export let operations;

	/* TODO add the ability to create an operation prefix */
	let newOperation = {
		number: '',
		description: ''
	};

	/* 
		OPERATION CruD
		Create and Delete operations exist here, update is
		in the operation itself to simplify passing data
		back up via an event dispatched
	*/
	const addOperation = async () => {
		await addDoc(operationsCol($page.params.routerId), {
			description: newOperation.description,
			number: newOperation.number,
			createdAt: new Date(),
			time: 0,
			order: $_operations.length + 1,
			elements: []
		});
		newOperation = {};
	};

	const deleteOperation = async (message) => {
		await deleteDoc(operationRef($page.params.routerId, message.detail.id));
	};
</script>

<!-- <header class="operations__header">
	<h1 class="operations__meta">{$_operations.length} Operations</h1>
</header> -->

<ol class="list">
	<!-- Operation Header //-->
	<li class="list-header--operation list-header line-item">
		<div class="fixed operation__number"><abbr title="Operation Number">Op #</abbr></div>
		<div class="flex operation__desscription">Description</div>
		<div class="fixed operation__time">Time</div>
	</li>
	{#if $_operations && $_operations.length}
		<!-- Operations //-->
		{#each $_operations as operation}
			<Operation
				id={operation.id}
				bind:time={operation.time}
				bind:pfdTime={operation.pfdTime}
				bind:number={operation.number}
				bind:description={operation.description}
				bind:elements={operation.elements}
				on:delete={deleteOperation}
			/>
		{/each}
	{/if}
	<!-- New Operation //-->
	<li class="line-item line-item--new">
		<input type="text" class="" bind:value={newOperation.number} />
		<input type="text" class="" bind:value={newOperation.description} />
		<button class="action-item" on:click={addOperation}>+</button>
	</li>
</ol>
