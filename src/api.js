import { collection, doc, addDoc, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './fb.js';

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
