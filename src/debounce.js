export default function (node, params) {
	let timer;
	return {
		update() {
			clearTimeout(timer);
			timer = setTimeout(params.func, params.duration);
		},
		destroy() {
			clearTimeout(timer);
		}
	};
}
