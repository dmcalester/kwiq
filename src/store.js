import { writable } from 'svelte/store';

export const _router = writable({});
export const _operations = writable([]);
export const _elements = writable([]);

export const _elementTime = writable();
export const _element = writable({});
