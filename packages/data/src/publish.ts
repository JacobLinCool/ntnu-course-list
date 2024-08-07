import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { filter, targets } from "./targets";

main();

async function main() {
	filter();
	console.log({ targets });

	for (const target of targets) {
		const dir = path.join(__dirname, "../_package", `${target.year}${target.term}`);
		if (!fs.existsSync(dir)) {
			throw new Error(`Directory ${dir} does not exist`);
		}
		if (!fs.existsSync(path.join(dir, "package.json"))) {
			throw new Error(`File ${path.join(dir, "package.json")} does not exist`);
		}
		const pkg = JSON.parse(fs.readFileSync(path.join(dir, "package.json"), "utf-8"));
		if (!pkg.name || !pkg.version) {
			throw new Error(`Invalid package.json in ${dir}`);
		}
		if (await published(pkg.version)) {
			console.log(`Skipping ${pkg.name}@${pkg.version}, already published`);
			continue;
		}
		console.log(`Publishing ${pkg.name}@${pkg.version}...`);

		execSync("npm publish", { cwd: dir, stdio: "inherit" });
	}
}

async function published(version: string) {
	const res = await fetch(`https://registry.npmjs.org/ntnu-course-list-data/${version}`);
	return res.status !== 404;
}
