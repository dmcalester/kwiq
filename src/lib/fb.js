import { variables } from './variables';
import { initializeApp } from 'firebase/app';
import {
	getFirestore,
	query,
	collection,
	doc,
	addDoc,
	onSnapshot,
	orderBy
} from 'firebase/firestore';

const firebaseApp = initializeApp({
	apiKey: variables.apiKey,
	authDomain: variables.authDomain,
	projectId: variables.projectId
});

export const db = getFirestore();

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
