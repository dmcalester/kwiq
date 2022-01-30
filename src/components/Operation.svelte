<script>
	
	import { createEventDispatcher } from 'svelte';
	import Elements from './Elements.svelte';

	
	export let id;
	export let description;
	export let number;
	export let time;
	export let elements;
	
	
	
	let pfd = 0.15;
	
	const dispatch = createEventDispatcher();

	$: time = elements.reduce((sum, el) => sum + parseFloat(el.time), 0);
	$: pfdTime = (time * pfd) + time;
	
	/* 
		Utility classes to prevent the default browser behavior of the
		native HTML disclosure element. Essentially ignore the space
		key to prevent toggling and also the click event when clicking
		in to the operation’s number or description
		
	*/
	const disregardSpace = (e) => {
		if(e.keyCode === 32) e.preventDefault();
	}
	
	const disregardAction = (e) => {
		e.preventDefault();
	}
	
	function _deleteOperation(id) {
		dispatch('delete', {
			id: id
		})
	}
	

</script>



<li class="operation">
	
	<details class="operation__detail">
		<summary class="line-item">
			<div contenteditable="true" bind:innerHTML={number} on:click={disregardAction} on:keyup={disregardSpace} class="number operation__number"></div>			
			<div contenteditable="true" bind:innerHTML={description} on:click={disregardAction} on:keyup={disregardSpace} class="description operation__description"></div>
			<div class="time operation__time">{time.toFixed(2)} | { pfdTime.toFixed(2) }</div>
			<button class="action-item action-item--delete" on:click={_deleteOperation(id)}>×</button>
		</summary>
	
		<Elements
			operationId={id}
			bind:elements={elements} />
</details>
</li>

