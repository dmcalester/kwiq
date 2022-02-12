import { writable } from 'svelte/store';

export const _router = writable({});
export const _operations = writable([]);
export const _elements = writable([]);
export const _motion = writable({});

export const _elementTime = writable(0);
export const _element = writable({});
