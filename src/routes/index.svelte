<script>
	import {routers} from "../routers.js";
	import "../app.css";
	
	
	// both the operation and router values should never be manually set
	// always derive value from elements
	const updateRouterTime = () => {
		let routerTime = 0;
		
		// operation value is the sum of the elements value
		routers.operations.forEach(op => {
			op.time = op.elements.reduce((sum, el) => sum + parseFloat(el.time), 0);
			 routerTime = routerTime + parseFloat(op.time);
		});
		
		// router value is the sum of the operations value
		routers.time = routerTime;
	}
	
	
</script>


<section id="app">
	<section id="list">
		<ul>
			<li>{routers.description}</li>
		</ul>
	</section>
	<section id="detail">
		<header class="router-detail">
			<h1>{routers.description}</h1>
			<h2>{routers.createdBy}</h2>
			<output>{routers.time}</output>
		</header>
		<section class="operations">
			{ #each routers.operations as operation }
			<details class="operation">
				<summary>
					<span>{operation.number}</span> |
					<span>{operation.description}</span> |
					<output>{operation.time}</output> |
					<span>{operation.elements.length}</span>
				</summary>
				
				<!-- Additional Operation details //-->
				
				<div class="opertaion--details">
					<span>{operation.setupTime}</span> | 
					<span>{operation.personalFatigueAndDelay}</span>
					<span>{operation.notes}</span>
				</div>
				
				<ol class="elements">
				{ #each operation.elements as element }
					<li>
						<div>
							<span>{element.description}</span> |
							<input type="number" min="0" step="0.1" on:change="{updateRouterTime}" bind:value="{element.time}">
						</div>
						<div>
							<span>{element.frequency} x {element.compoundFrequency}</span> |
							<span>{element.weight}</span> |
							<span>{element.distance}</span> |
							<span>{element.valueAdd}</span>
						</div>
					</li>
					
				{ /each }
				</ol>
			</details>
			{/each}
		</section>
	</section>
</section>