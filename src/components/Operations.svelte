<script>
	import Operation from './Operation.svelte';
	
	export let operations;
		
		let newOperation = {
			number: '',
			description: ''
		};
		
		
		const addOperation = () => {
			console.log('add op');
		}
	
</script>

{ #if operations && operations.length }
	<header class="operations__header">
		<h1 class="operations__meta">{operations.length} Operations</h1>
	</header>
		
	<ul class="list">
	<!-- Operation Header //-->
		<li class="line-item list-header list-header--operation">
			<div class="operation__number">#</div>
			<div class="operation__desscription">Description</div>
			<div class="time operation__time">Time</div>
		</li>

		<!-- Operations //-->
		{ #each operations as operation }
	
		<Operation  
			id={operation.id}
			bind:time={operation.time}
			bind:number={operation.number}
			bind:description={operation.description}
			bind:elements={operation.elements} />
	
		{ /each }

		<!-- New Operation //-->
		<li class="line-item line-item--new">
			<input type="text" class="" bind:value="{newOperation.description}" >
			<button class="action-item" on:click={addOperation}>+</button>
		</li>
	</ul>
{ /if }