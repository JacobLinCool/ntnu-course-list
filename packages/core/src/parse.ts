import type { ClassSchedule, Period } from "./types";
import { Day } from "./types";

const NORMAL_FORMAT =
	/(\p{Script=Han})\s+([\dABCDEFG]+(-[\dABCDEFG]+)?)\s+((\p{Script=Han}+?)\s+)?([^\s,]+)/gu;
const TIME_ONLY_FORMAT_1 = /(\p{Script=Han}),(\d+)-\p{Script=Han},(\d+)/gu;
const TIME_ONLY_FORMAT_2 = /(\p{Script=Han})\s+(\d+(-\d+)?)/gu;

/**
 * Parse the normal schedule format.
 */
function parse_1(raw: string): ClassSchedule[] {
	const result: ClassSchedule[] = [];
	let match: RegExpExecArray | null;

	while ((match = NORMAL_FORMAT.exec(raw)) !== null) {
		if (match.length !== 7) {
			continue;
		}

		const day = Day[match[1] as keyof typeof Day];
		const period_raw = match[2].split("-");
		const start = period_raw[0],
			end = period_raw[1] || period_raw[0];
		const period: [Period, Period] = [
			/[ABCDEFG]/.test(start) ? (start as Period) : parseInt(start),
			/[ABCDEFG]/.test(end) ? (end as Period) : parseInt(end),
		];
		const location = match[5] || "";
		const classroom = match[6];

		result.push({
			day,
			period,
			location,
			classroom,
		});
	}

	return result;
}

/**
 * Parse the time only format 1.
 */
function parse_2(raw: string): ClassSchedule[] {
	const result: ClassSchedule[] = [];
	let match: RegExpExecArray | null;

	while ((match = TIME_ONLY_FORMAT_1.exec(raw)) !== null) {
		const day = Day[match[1] as keyof typeof Day];
		const period: [Period, Period] = [
			/[ABCDEFG]/.test(match[2]) ? (match[2] as Period) : parseInt(match[2]),
			/[ABCDEFG]/.test(match[3]) ? (match[3] as Period) : parseInt(match[3]),
		];

		result.push({
			day,
			period,
			location: "",
			classroom: "",
		});
	}

	return result;
}

/**
 * Parse the time only format 2.
 */
function parse_3(raw: string): ClassSchedule[] {
	const result: ClassSchedule[] = [];
	let match: RegExpExecArray | null;

	while ((match = TIME_ONLY_FORMAT_2.exec(raw)) !== null) {
		const day = Day[match[1] as keyof typeof Day];
		const period_raw = match[2].split("-");
		const start = period_raw[0],
			end = period_raw[1] || period_raw[0];
		const period: [Period, Period] = [
			/[ABCDEFG]/.test(start) ? (start as Period) : parseInt(start),
			/[ABCDEFG]/.test(end) ? (end as Period) : parseInt(end),
		];

		result.push({
			day,
			period,
			location: "",
			classroom: "",
		});
	}

	return result;
}

/**
 * Parse the single string format.
 */
function parse_4(raw: string): ClassSchedule[] {
	raw = raw.trim();
	if (raw && !raw.includes(" ")) {
		return [
			{
				day: Day.None,
				period: [0, 0],
				location: "",
				classroom: raw,
			},
		];
	}
	return [];
}

/**
 * Parse the schedule string into an array of {@link ClassSchedule}.
 * @param raw The schedule string. e.g. "三 7-9 公館 Ｂ101" or "二 2 公館 Ｅ101, 五 8-9 公館 Ｅ101"
 */
export function parse_schedule(raw: string): ClassSchedule[] {
	let result = parse_1(raw);
	if (result.length === 0) {
		result = parse_2(raw);
	}
	if (result.length === 0) {
		result = parse_3(raw);
	}
	if (result.length === 0) {
		result = parse_4(raw);
	}

	return result;
}
