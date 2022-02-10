<script>
	import { createEventDispatcher } from 'svelte';
	import { dataLibrary } from '$lib/data-library.js';

	export let id;
	export let description;
	export let time;
	export let distance = 1;
	export let weight = 2;
	export let motion = { type: 'Grasp', option: 'Easy', code: 'A1' };
	export let [frequency, compoundFrequency] = [1, 1];

	let timeRange = [0];
	let directInput = 0;

	const WEIGHT_LIMIT = 2;

	$: motionMenu = dataLibrary.find((el) => el.label === motion.type);
	$: weightTime = weight - WEIGHT_LIMIT > 2 ? weight - WEIGHT_LIMIT : 0;
	$: time =
		((timeRange.find((int) => int >= distance) || timeRange[timeRange.length - 1]) + weightTime) *
		(frequency * compoundFrequency);

	const dispatch = createEventDispatcher();

	const updateDistanceIndex = () => {
		// time = timeRange.find((n) => n >= distance) || timeRange[timeRange.length];
	};

	const updateWeight = () => {
		// TODO: account for imperial measurements, this is metric
	};

	const updateDirectTime = () => {
		timeRange[0] = directInput;
	};

	/* 
		TODO: There should be a more reactive way to handle updating the two 
					select menu elements, but for now this is sufficient
		
		TODO: Need to adapt this to handle an additional nested modified for
		UAS getAndPlace
	*/
	const updateOption = () => {
		const optionMenu = motionMenu.options.find((el) => el.label === motion.option);
		if (optionMenu.values) {
			motion.code = optionMenu.code;
			timeRange = optionMenu.values;
		} else if (optionMenu.modifier) {
			// then do stuff for those edge cases
		}
	};

	const updateMotion = () => {
		if (motion.type === 'Direct Input') {
			motion.code = 'DI';
			delete motion.option;
		} else {
			motion.option = motionMenu.options[0].label;
			motion.code = motionMenu.options[0].code;
			timeRange = motionMenu.options[0].values;
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
		<pre>{JSON.stringify(motion, undefined, 2)}</pre>
		<pre>{timeRange} | {weightTime}</pre>
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
			{#each dataLibrary as motion}
				<option value={motion.label}>{motion.label}</option>
			{/each}
			<option value="Direct Input">Direct Input</option>
		</select>

		<!-- If direct input //-->
		{#if motion.type === 'Direct Input'}
			<input
				type="number"
				min="0"
				step="0.1"
				bind:value={directInput}
				on:change={updateDirectTime}
			/>
			<!-- If not direct input //-->
		{:else}
			<select bind:value={motion.option} on:change={updateOption}>
				{#each motionMenu.options as option}
					<option value={option.label}>{option.label}</option>
				{/each}
			</select>

			<!-- The modified action //-->

			{#if dataLibrary.find((el) => el.label === motion.type).distance}
				<label for="weight">Distance</label>
				<input name="distance" type="number" min="0" step="0.1" bind:value={distance} />
			{/if}
			{#if dataLibrary.find((el) => el.label === motion.type).weight}
				<label for="weight">Weight</label>
				<input name="weight" type="number" min="0" step="0.1" bind:value={weight} />
			{/if}
		{/if}
	</div>
	<button class="action-item" on:click={dispatch('delete', { id: id })}>×</button>
</li>
