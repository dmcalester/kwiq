<script>
	import Header from '../components/Header.svelte';
	import List from '../components/List.svelte';

	import '../css/app.css';
</script>

<div id="app">
	<Header />
	<List />
	<slot />
</div>
