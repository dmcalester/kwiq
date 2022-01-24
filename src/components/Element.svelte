<script>
	import { page } from '$app/stores';
	import { collection, doc, addDoc, getDocs, getDoc, deleteDoc, onSnapshot, query, updateDoc, arrayUnion, arrayRemove, orderBy } from "firebase/firestore"; 
	import { db } from '../fb.js'
	
	import '../css/elements.css';
	
	export let description;
	export let time;
	
	const updateRouterTime = () => {
		console.log('test');
	}
</script>


<li class="element">
	<div><input type="number" min="0" step="0.1" bind:value="{time}" on:change="{updateRouterTime}"/></div>
	<div><input type="text" bind:value="{description}"  /></div>
<!-- 	<button class="element__action element__action-delete" on:click={() => deleteElement(operation.id, element.id)}>X</button> -->
</li>