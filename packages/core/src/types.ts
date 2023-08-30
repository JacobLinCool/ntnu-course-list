export type NumberLike = number | `${number}`;
export type YesNo = "Y" | "N";

export interface CourseListFetcherOptions {
	year: NumberLike;
	term: NumberLike;
	deptCode1?: string;
	zuDeptCode1?: string;
	kind?: string;
	generalCore?: string;
	chn?: string;
	teacher?: string;
	engTeach?: YesNo;
	moocs_v?: YesNo;
	remoteCourse?: YesNo;
	digital?: YesNo;
	adsl?: YesNo;
	classCode?: string;
	language1?: "chinese" | "english";
	serial_number?: NumberLike;
	course_code?: string;
	download?: "xls";
}

export interface CourseJSON {
	開課序號: `${number}`;
	開課代碼: string;
	系所: string;
	組: string;
	年: string;
	班: string;
	全英語: string;
	MOOCS: string;
	限性別: string;
	中文課程名稱: string;
	英文課程名稱: string;
	學分: `${number}.${number}`;
	"必/選": "選" | "必";
	"全/半": "半" | "全";
	教師: string;
	地點時間: string;
	限修人數: `${number}`;
	選修人數: `${number}`;
	限修條件: string;
	備註: string;
}

export enum Day {
	一 = 1,
	二 = 2,
	三 = 3,
	四 = 4,
	五 = 5,
	六 = 6,
	日 = 7,
	None = 0,
}

export type Period = number | "A" | "B" | "C" | "D" | "E" | "F" | "G";

export interface ClassSchedule {
	day: Day;
	period: [start: Period, end: Period];
	location: string;
	classroom: string;
}
