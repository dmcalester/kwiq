import { variables } from './variables';
import { initializeApp } from 'firebase/app';
import {
	getFirestore,
	query,
	collection,
	doc,
	addDoc,
	onSnapshot,
	orderBy,
	enableIndexedDbPersistence
} from 'firebase/firestore';

const firebaseApp = initializeApp({
	apiKey: variables.apiKey,
	authDomain: variables.authDomain,
	projectId: variables.projectId
});

export const db = getFirestore();

enableIndexedDbPersistence(db).catch((err) => {
	if (err.code == 'failed-precondition') {
		// Multiple tabs open, persistence can only be enabled
		// in one tab at a a time.
		// ...

		console.warn('error multiple tabs');
	} else if (err.code == 'unimplemented') {
		// The current browser does not support all of the
		// features required to enable persistence
		// ...
		console.warn('bad browser');
	}
});

/* Operations */
export const operationRef = (routerId, operationId) => {
	return doc(db, 'routers', routerId, 'operations', operationId);
};

export const operationsCol = (routerId) => {
	return collection(db, 'routers', routerId, 'operations');
};

/* Routers */
export const routerRef = (routerId) => {
	return doc(db, 'routers', routerId);
};
export const routersCol = collection(db, 'routers');
export const queryAllRouters = query(routersCol, orderBy('description'));
