import { expect, it } from "vitest";
import { CourseListFetcher } from "../src/fetcher";

it("should fetch the course list in xls", async () => {
	const fetcher = new CourseListFetcher();
	const options = {
		year: 111,
		term: 2,
		deptCode1: "SU47",
	};

	const result = await fetcher.xls(options);

	expect(result).toBeInstanceOf(ArrayBuffer);
	expect(result.byteLength).toBeGreaterThan(0);
});

it("should fetch the course list in json", async () => {
	const fetcher = new CourseListFetcher();
	const options = {
		year: 111,
		term: 2,
		deptCode1: "SU47",
	};

	const result = await fetcher.json(options);

	expect(result).toMatchSnapshot();
});

it("should failed to fetch non-exist course list", async () => {
	const fetcher = new CourseListFetcher();
	const options = {
		year: 1000,
		term: 1,
		deptCode1: "SU47",
	};

	await expect(fetcher.xls(options)).rejects.toThrowError();
});
