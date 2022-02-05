import { writable } from 'svelte/store';

export const _router = writable({ time: 0 });
export const _operations = writable([]);

export const routerTime = writable(0);
export const elementTime = writable(0);
export const operationTime = writable(0);
