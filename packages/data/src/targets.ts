import type { CourseListFetcherOptions } from "ntnu-course-list";

export const targets: CourseListFetcherOptions[] = [
	{
		year: 110,
		term: 1,
	},
	{
		year: 110,
		term: 2,
	},
	{
		year: 110,
		term: 3,
	},
	{
		year: 111,
		term: 1,
	},
	{
		year: 111,
		term: 2,
	},
	{
		year: 111,
		term: 3,
	},
	{
		year: 112,
		term: 1,
	},
	{
		year: 112,
		term: 2,
	},
	{
		year: 112,
		term: 3,
	},
	{
		year: 113,
		term: 1,
	},
	{
		year: 113,
		term: 2,
	},
	{
		year: 113,
		term: 3,
	},
];

export function filter() {
	const filter = process.argv[2];
	if (filter) {
		const [year, term] = filter.split("-").map((x) => parseInt(x));
		if (year && term) {
			for (let i = targets.length - 1; i >= 0; i--) {
				if (targets[i].year !== year || targets[i].term !== term) {
					targets.splice(i, 1);
				}
			}
		} else if (year) {
			for (let i = targets.length - 1; i >= 0; i--) {
				if (targets[i].year !== year) {
					targets.splice(i, 1);
				}
			}
		} else {
			throw new Error("Invalid filter, use format like 112-1 or 112");
		}
	}
}
