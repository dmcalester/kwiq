<script>
	import { createEventDispatcher, onMount, beforeUpdate, afterUpdate } from 'svelte';
	import { dataLibrary } from '$lib/data-library.js';

	export let id;
	export let description;
	export let time;
	export let motion;
	export let frequency = [1, 1];

	let directInput = 0;
	let timer;

	const WEIGHT_LIMIT = 2;
	const DEFAULT_WEIGHT = 1;
	const DEFAULT_DISTANCE = 1;

	// the time added by weight is applied if the weight is over the weight threshold
	// weight threshold should be set dynamically and support both imperial and metric
	// "weightTime" is 1 TMU per pound
	// TODO: Account for metric
	$: weightTime = motion.weight - WEIGHT_LIMIT > 2 ? motion.weight - WEIGHT_LIMIT : 0;
	$: motionMenu = dataLibrary.find((el) => el.label === motion.type);
	$: optionMenu = motionMenu.options.find((el) => el.label === motion.option);
	$: timeRange = optionMenu ? optionMenu.values : motionMenu.options[0].values;
	$: compoundFrequency = frequency.reduce((product, factor) => product * factor);
	$: time =
		((timeRange.find((int) => int >= motion.distance) || timeRange[timeRange.length - 1]) +
			weightTime) *
		compoundFrequency;

	const dispatch = createEventDispatcher();

	const updateDirectTime = () => {
		timeRange[0] = directInput;
		updateElement();
	};

	onMount(async () => {
		console.log('time', motion.type);
	});

	/*
		Gets the motion code and time ranges from the selected option
	*/
	const updateOption = () => {
		if (optionMenu.values) {
			motion.code = optionMenu.code;
			timeRange = optionMenu.values;
		} else if (optionMenu.modifier) {
			// then do stuff for those edge cases of UAS with its tertiary modifier options
		}
		updateElement();
	};

	/*
	Gets the options for the selected motion, resets the motion option menu
	resets the motion code option and time. Unless a direct input
	*/
	const updateMotion = () => {
		motion.option = motionMenu.options[0].label;
		motion.code = motionMenu.options[0].code;
		timeRange = motionMenu.options[0].values;

		if (!motionMenu.weight) {
			delete motion.weight;
		} else {
			motion.weight = DEFAULT_WEIGHT;
		}
		if (!motionMenu.distance) {
			delete motion.distance;
		} else {
			motion.distance = DEFAULT_DISTANCE;
		}

		updateElement();
	};

	const updateElement = () => {
		dispatch('update', {
			id: id
		});
	};
</script>

<li class="line-item">
	<!-- 	<div class="line-item row">
		<pre>{JSON.stringify(motion, undefined, 2)}</pre>
	</div> -->
	<div class="line-item row">
		<div
			class="description"
			contenteditable="true"
			bind:innerHTML={description}
			on:change={updateElement}
		/>
		<input type="number" min="1" bind:value={frequency[0]} on:change={updateElement} />
		<input type="number" min="1" bind:value={frequency[1]} on:change={updateElement} />
		<time class="element__time">{time.toFixed(2)}</time>
	</div>

	<div class="line-item row">
		<!-- The primary action type //-->

		<select bind:value={motion.type} on:change={updateMotion}>
			{#each dataLibrary as motion}
				<option value={motion.label}>{motion.label}</option>
			{/each}
		</select>

		<!-- If direct input //-->
		{#if motion.type === 'Direct Input'}
			<input type="number" min="1" bind:value={timeRange[0]} on:change={updateDirectTime} />
			<!-- If not direct input //-->
		{:else}
			<select bind:value={motion.option} on:change={updateOption}>
				{#each motionMenu.options as option}
					<option value={option.label}>{option.label}</option>
				{/each}
			</select>

			<!-- The modified action //-->

			{#if motionMenu.distance}
				<label for="weight">Distance</label>
				<input name="distance" type="number" min="0" step="0.1" bind:value={motion.distance} />
			{/if}
			{#if motionMenu.weight}
				<label for="weight">Weight</label>
				<input name="weight" type="number" min="0" step="0.1" bind:value={motion.weight} />
			{/if}
		{/if}
	</div>
	<button class="action-item" on:click={dispatch('delete', { id: id })}>×</button>
</li>
