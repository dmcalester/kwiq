export const dataLibrary = [
	{
		label: 'Grasp',
		value: 'getPrecise',
		weight: true,
		distance: true,
		options: [
			{ label: 'Easy', code: 'A1', values: [3, 6, 9, 13, 17] },
			{ label: 'Normal', code: 'A2', values: [7, 10, 14, 18, 23] },
			{ label: 'Difficult', code: 'A3', values: [14, 19, 23, 27, 32] }
		]
	},
	{
		label: 'Place',
		value: 'putPrecise',
		weight: true,
		distance: true,
		options: [
			{ label: 'Easy', code: 'B1', values: [3, 6, 11, 15, 20] },
			{ label: 'Normal', code: 'B2', values: [10, 15, 19, 24, 30] },
			{ label: 'Difficult', code: 'B3', values: [21, 26, 30, 36, 41] }
		]
	},
	{
		label: 'Body Motions',
		value: 'bodyMotions',
		options: [
			{ label: 'Walk', code: 'C1', values: [18] },
			{ label: 'Bend & Arise', code: 'C2', values: [62] },
			{ label: 'Sit & Stand', code: 'C3', values: [110] }
		]
	},
	{
		label: 'Inspect',
		value: 'inspect',
		options: [
			{ label: 'Inspect', code: 'D1', values: [14] },
			{ label: 'Read', code: 'D2', values: [6] },
			{ label: 'Write', code: 'D3', values: [115] }
		]
	}
];
