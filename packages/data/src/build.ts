import fs from "node:fs";
import path from "node:path";
import { CourseJSON, CourseListFetcher, parse_schedule } from "ntnu-course-list";
import { Parsed } from "../types";
import { filter, targets } from "./targets";

main();

async function main() {
	filter();
	console.log({ targets });

	const tag = "Build Package";
	console.time(tag);

	await prepare();
	console.timeLog(tag, "Prepared");

	await download();
	console.timeLog(tag, "Downloaded");

	await parse();
	console.timeLog(tag, "Parsed");

	await split();
	console.timeLog(tag, "Splitted");

	await pack();
	console.timeLog(tag, "Packaged");
}

async function prepare() {
	const dir = path.join(__dirname, "../_package");
	for (const target of targets) {
		const root = path.join(dir, `${target.year}${target.term}`);
		if (!fs.existsSync(root)) {
			fs.mkdirSync(root, { recursive: true });
		}
	}
}

async function download() {
	for (const target of targets) {
		const file = path.join(__dirname, `../_package/${target.year}${target.term}/raw.json`);
		if (fs.existsSync(file)) {
			console.log(`Skipping ${target.year} ${target.term}`);
			continue;
		}

		const fetcher = new CourseListFetcher();
		fetcher.debug(true);

		const json = await fetcher.json(target);
		fs.writeFileSync(file, JSON.stringify(json));
	}
}

async function parse() {
	for (const target of targets) {
		const json = JSON.parse(
			fs.readFileSync(
				path.join(__dirname, `../_package/${target.year}${target.term}/raw.json`),
				"utf-8",
			),
		) as CourseJSON[];
		let good = 0;
		const parsed = json.map((course) => {
			const parsed = parse_schedule(course["地點時間"]);
			if (parsed.length > 0 || course["地點時間"] === "") {
				good++;
			}
			return { ...course, 地點時間: parsed };
		});
		fs.writeFileSync(
			path.join(__dirname, `../_package/${target.year}${target.term}/all.json`),
			JSON.stringify(parsed),
		);

		console.log(
			`Parsed ${target.year} ${target.term}: ${good} / ${parsed.length} (${(
				(good / parsed.length) *
				100
			).toFixed(2)}%)`,
		);
	}
}

async function split() {
	// split by department
	for (const target of targets) {
		const json = JSON.parse(
			fs.readFileSync(
				path.join(__dirname, `../_package/${target.year}${target.term}/all.json`),
				"utf-8",
			),
		) as Parsed[];

		const depts = new Set(json.map((course) => course.系所));
		for (const dept of depts) {
			const courses = json.filter((course) => course.系所 === dept);
			const dir = path.join(__dirname, `../_package/${target.year}${target.term}/${dept}`);
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir, { recursive: true });
			}
			fs.writeFileSync(path.join(dir, "all.json"), JSON.stringify(courses));
		}

		fs.writeFileSync(
			path.join(__dirname, `../_package/${target.year}${target.term}/depts.json`),
			JSON.stringify([...depts]),
		);
	}
}

async function pack() {
	const base_pkg = JSON.parse(fs.readFileSync(path.join(__dirname, "../package.json"), "utf-8"));
	const base_readme = fs.readFileSync(path.join(__dirname, "../README.md"), "utf-8");
	const types = fs.readFileSync(path.join(__dirname, "../types.d.ts"), "utf-8");

	for (const target of targets) {
		const dir = path.join(__dirname, `../_package/${target.year}${target.term}`);

		// build README.md
		fs.writeFileSync(
			path.join(dir, "README.md"),
			`# NTNU Course List ${target.year} 學年度第 ${target.term} 學期\n\n---\n\n${base_readme}`,
		);

		// build package.json
		const major = 1;
		const revision = (await get_last_revision(major, `${target.year}${target.term}`)) + 1;
		delete base_pkg.scripts;
		delete base_pkg.devDependencies;
		base_pkg.version = `${major}.${target.year}${target.term}.${revision}`;
		base_pkg.description = `NTNU Course List ${target.year} 學年度第 ${target.term} 學期`;
		base_pkg.private = false;
		fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify(base_pkg, null, 4));

		// copy types.d.ts
		fs.writeFileSync(path.join(dir, "types.d.ts"), types);
	}
}

async function get_last_revision(major: number, minor: string) {
	const res = await fetch(`https://registry.npmjs.org/ntnu-course-list-data/${major}.${minor}.*`);
	if (!res.ok) {
		return -1;
	}
	const json = await res.json();
	const revision = parseInt(json.version.split(".")[2]);
	return revision;
}
