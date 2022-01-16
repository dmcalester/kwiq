<script>
	import Header from '../components/Header.svelte';	
	import List from '../components/List.svelte';
	
	import '../app.css';
</script>

<div id="app">
	<Header />
	<List />
	<slot></slot>
</div>