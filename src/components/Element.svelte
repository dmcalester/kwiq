<script>
	import { elementTime } from '../store.js';
	import '../css/elements.css';
	
	export let time;
	export let description;
	
	const updateTime = () => {
		elementTime.set(time);
	}
	
	const deleteElement = () => {
		console.log('delete element');
	}
</script>


<li class="line-item">
	<div>{description}</div>
	<div class="description" contenteditable="true" bind:innerHTML={description}></div>
	<div><input type="number" min="0" step="0.1" bind:value={time} on:change={updateTime} /></div>
	<button class="action-item">×</button>
</li>


