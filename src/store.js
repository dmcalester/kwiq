import { writable } from 'svelte/store';

export const _router = writable({});
export const _operation = writable({});
export const elementTime = writable(0);
export const operationTime = writable(0);
