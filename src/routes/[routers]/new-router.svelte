<script>
	import { goto } from '$app/navigation';
	import { collection, addDoc } from 'firebase/firestore';
	import { db } from '$lib/fb.js';

	/*
	 ** TODO
	 ** created by should be set by a user reference ID
	 */
	let newRouter = {
		createdBy: 'Peter Parker',
		batch: 1
	};

	/* Router CRUD */
	/*
**	TODO
		Return created doc
*/
	const addRouter = async () => {
		const docRef = await addDoc(collection(db, 'routers'), {
			description: newRouter.description,
			batch: newRouter.batch,
			createdAt: new Date(),
			createdBy: newRouter.createdBy,
			time: 0
		});
		console.log(docRef.id);
		goto(`/routers/${docRef.id}`);
	};
</script>

<section>
	<div>
		<label for="router-description">Description</label>
		<input name="router-description" type="text" bind:value={newRouter.description} />
	</div>
	<label for="router-batch">Batch</label>
	<input name="router-batch" type="number" bind:value={newRouter.batch} />
	<button style="margin-left: auto;" on:click={addRouter}>Add</button>
</section>
