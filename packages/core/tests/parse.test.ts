import { describe, expect, it } from "vitest";
import { parse_schedule } from "../src/parse";
import { Day } from "../src/types";

describe("parse_schedule", () => {
	it("should return an empty array when given an empty string", () => {
		const raw = "";
		const result = parse_schedule(raw);
		expect(result).toEqual([]);
	});

	it("should parse a valid schedule string with one class and return an array with one object", () => {
		const raw = "三 7-9 公館 Ｂ101";
		const result = parse_schedule(raw);
		expect(result).toEqual([
			{
				day: Day.三,
				period: [7, 9],
				location: "公館",
				classroom: "Ｂ101",
			},
		]);
	});

	it("should parse a valid schedule string with multiple classes and return an array with multiple objects", () => {
		const raw = "二 2 公館 Ｅ101, 五 8-B 公館 Ｅ101";
		const result = parse_schedule(raw);
		expect(result).toEqual([
			{
				day: Day.二,
				period: [2, 2],
				location: "公館",
				classroom: "Ｅ101",
			},
			{
				day: Day.五,
				period: [8, "B"],
				location: "公館",
				classroom: "Ｅ101",
			},
		]);
	});

	it("should parse a valid schedule string with no location data", () => {
		const raw = "一 3-4 公衛209";
		const result = parse_schedule(raw);
		expect(result).toEqual([
			{
				day: Day.一,
				period: [3, 4],
				location: "",
				classroom: "公衛209",
			},
		]);
	});

	it("should parse a valid schedule string with only time data", () => {
		const raw = "四,1030-四,1220";
		const result = parse_schedule(raw);
		expect(result).toEqual([
			{
				day: Day.四,
				period: [1030, 1220],
				location: "",
				classroom: "",
			},
		]);
	});

	it("should parse a valid schedule string with only time (period) data", () => {
		const raw = "二 10 , 二 8-9";
		const result = parse_schedule(raw);
		expect(result).toEqual([
			{
				day: Day.二,
				period: [10, 10],
				location: "",
				classroom: "",
			},
			{
				day: Day.二,
				period: [8, 9],
				location: "",
				classroom: "",
			},
		]);
	});

	it("should parse a valid schedule string with only one string", () => {
		const raw = "◎密集課程";
		const result = parse_schedule(raw);
		expect(result).toEqual([
			{
				day: 0,
				period: [0, 0],
				location: "",
				classroom: "◎密集課程",
			},
		]);
	});
});
