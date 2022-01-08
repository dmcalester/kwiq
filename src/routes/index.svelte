<script>


	const router ={
		name: "Test",
		value: 40,
		operations: [
			{
				name: "Op1",
				value: 30,
				elements: [
					{
						name: "El1.1",
						value: 19,
					},
					{
						name: "El1.2",
						value: 11,
					}
				]
			},
			{
				name: "Op2",
				value: 10,
				elements: [
					{
						name: "El2.1",
						value: 5,
					},
					{
						name: "El2.2",
						value: 5,
					}
				]
			},
		]
	};
	
	
	// both the operation and router values should never be manually set
	// always derive value from elements
	const updateRouterTime = () => {
		let routerVal = 0;
		
		// operation value is the sum of the elements value
		router.operations.forEach(op => {
			op.value = op.elements.reduce((sum, el) => sum + el.value, 0);
			 routerVal = routerVal  + op.value;
		});
		
		// router value is the sum of the operations value
		router.value = routerVal;
	}
	

	
</script>

<div class="app">
<header>KWIQ</header>

<section class="main">
	<div style="display: flex;">
		<div contenteditable="true" bind:innerHTML="{router.name}"> | </div> <div> Time: {router.value}</div>
	</div>
	<ul>
		{#each router.operations as operation}
			<li>
				<div contenteditable="true" bind:innerHTML="{operation.name}"></div>
				<div>Time: {operation.value}</div>
				<ol>
					{#each operation.elements as element}
					<li>
						<div contenteditable="true" bind:innerHTML="{element.name}"></div>
						<input type="number" bind:value="{element.value}" on:change="{updateRouterTime}">	
					</li>
					{/each}
				</ol>
			</li>
		{/each}
	</ul>
	
</section>

</div>