import fetch from "cross-fetch";
import debug from "debug";
import { read, utils } from "xlsx";
import { EXPORT_ENDPOINT } from "./constants";
import type { CourseJSON, CourseListFetcherOptions } from "./types";

let count = 0;

export class CourseListFetcher {
	protected log = debug(`ntnu-course-list:fetcher:${count++}`);
	protected endpoint: string;

	constructor(endpoint = EXPORT_ENDPOINT) {
		this.endpoint = endpoint;
		this.log("Initialized with endpoint: %s", endpoint);
	}

	/**
	 * Get course list in xls format.
	 */
	public async xls(opt: CourseListFetcherOptions): Promise<ArrayBuffer> {
		const body = `rpt=cofopdl&acadmYear=${opt.year}&acadmTerm=${opt.term}&deptCode1=${
			opt.deptCode1 ?? ""
		}&zuDeptCode1=${opt.zuDeptCode1 ?? ""}&kind=${opt.kind ?? ""}&generalCore=${
			opt.generalCore ?? ""
		}&chn=&teacher=${opt.teacher ?? ""}&engTeach=${opt.engTeach ?? "N"}&moocs_v=${
			opt.moocs_v ?? "N"
		}&remoteCourse=${opt.remoteCourse ?? "N"}&digital=${opt.digital ?? "N"}&adsl=${
			opt.adsl ?? "N"
		}&classCode=${opt.classCode ?? ""}&language1=${opt.language1 ?? "chinese"}&serial_number=${
			opt.serial_number ?? ""
		}&course_code=${opt.course_code ?? ""}&download=${opt.download ?? "xls"}`;
		this.log("Fetching course list with body: %s", body);

		const res = await fetch(this.endpoint, {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded",
			},
			body,
		});
		if (res.headers.get("content-type")?.includes("text/html")) {
			const text = await res.text();
			this.log(text);
			throw new Error(`Failed to fetch course list: ${text}`);
		}

		const buffer = await res.arrayBuffer();
		return buffer;
	}

	/**
	 * Get course list in json format.
	 */
	public async json(opt: CourseListFetcherOptions): Promise<CourseJSON[]> {
		const xls = await this.xls(opt);
		const workbook = read(xls, { type: "array" });
		const sheet = workbook.Sheets[workbook.SheetNames[0]];
		const json = utils.sheet_to_json<CourseJSON>(sheet, { raw: true });
		return json;
	}

	/**
	 * Toggle debug mode.
	 * @param enabled Whether to enable debug mode.
	 */
	public debug(enabled = true) {
		if (enabled) {
			this.log.enabled = true;
		} else {
			this.log.enabled = false;
		}
	}
}
