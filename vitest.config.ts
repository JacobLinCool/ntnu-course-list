import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		coverage: {
			provider: "v8",
		},
		// browser: {
		// 	provider: "playwright",
		// 	enabled: true,
		// 	name: "chromium",
		// 	headless: true,
		// },
	},
});
