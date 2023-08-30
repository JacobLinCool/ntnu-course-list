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
		console.log(`Publishing ${pkg.name}@${pkg.version}...`);

		execSync("npm publish", { cwd: dir, stdio: "inherit" });
	}
}
