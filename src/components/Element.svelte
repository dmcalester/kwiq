<script>
	import { createEventDispatcher } from 'svelte';
	import { dataLibrary } from '$lib/data-library.js';

	export let id;
	export let description;
	export let time;
	export let distance = 1;
	export let weight = 1;
	export let motion = { type: 'Grasp', option: 'Easy' };
	export let [frequency, compoundFrequency] = [1, 1];

	let directTime = 0;
	let options = {};

	// let _weight;
	// let ephemeralTime = time;

	// derived time
	// $: time = ephemeralTime * (frequency * compoundFrequency) + _weight;
	$: time = time;
	$: motionMenu = dataLibrary.find((el) => el.label === motion.type);

	const dispatch = createEventDispatcher();

	const updateDistanceIndex = () => {
		// ephemeralTime = dataLibrary[motion.type].options[motion.option].values.find(
		// 	(n) => n > distance
		// );
	};

	const updateWeight = () => {
		// TODO: account for imperial measurements, this is metric
		// TODO: remove magic number of 2
		// _weight = weight - 2;
	};

	const updateMotion = () => {
		if (motion.type !== 'Direct Input') {
			motion.option = motionMenu.options[0].label;
		}
	};

	const updateElement = () => {
		dispatch('update', {
			id: id
		});
	};
</script>

<li class="line-item">
	<div class="line-item row">
		<pre>{JSON.stringify(motion.option, undefined, 2)}</pre>
	</div>
	<div class="line-item row">
		<div
			class="description"
			contenteditable="true"
			bind:innerHTML={description}
			on:change={updateElement}
		/>
		<input type="number" min="1" bind:value={frequency} />
		<input type="number" min="1" bind:value={compoundFrequency} />
		<time class="element__time">{time.toFixed(2).padEnd(2, 0)}</time>
	</div>

	<div class="line-item row">
		<!-- The primary action type //-->

		<select bind:value={motion.type} on:change={updateMotion}>
			{#each dataLibrary as menu}
				<option value={menu.label}>{menu.label}</option>
			{/each}
			<option value="Direct Input">Direct Input</option>
		</select>

		<!-- If direct input //-->
		{#if motion.type === 'directInput'}
			<input type="number" min="0" step="0.1" bind:value={directTime} on:change={updateElement} />
			<!-- If not direct input //-->
		{:else}
			<select bind:value={motion.option}>
				{#each motionMenu.options as option}
					<option value={option.label}>{option.label}</option>
				{/each}
			</select>

			<!-- The modified action //-->

			<!-- distance if //-->
			<label for="weight">Distance</label>
			<input
				name="distance"
				type="number"
				min="0"
				step="0.1"
				bind:value={distance}
				on:change={updateDistanceIndex}
			/>

			<!-- weight if //-->
			<label for="weight">Weight</label>
			<input
				name="weight"
				type="number"
				min="0"
				step="0.1"
				bind:value={weight}
				on:change={updateWeight}
			/>
		{/if}
	</div>
	<button class="action-item" on:click={dispatch('delete', { id: id })}>×</button>
</li>
