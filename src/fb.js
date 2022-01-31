import { variables } from './variables';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseApp = initializeApp({
	apiKey: variables.apiKey,
	authDomain: variables.authDomain,
	projectId: variables.projectId
});

export const db = getFirestore();
