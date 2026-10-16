import { getFormatConfig } from "@luixo/configs";

export default getFormatConfig({
	ignorePatterns: ["dist/**", "public/**"],
	imports: {
		customGroups: [
			{ groupName: "react", elementNamePattern: ["react"] },
			{ groupName: "local", elementNamePattern: ["@"] },
		],
		groups: [
			"react",
			{ newlinesBetween: true },
			["type-builtin", "value-builtin", "type-external", "value-external"],
			{ newlinesBetween: true },
			"local",
			["type-internal", "value-internal"],
			{ newlinesBetween: true },
			["type-parent", "value-parent"],
			{ newlinesBetween: true },
			["type-sibling", "value-sibling", "type-index", "value-index"],
			"unknown",
		],
	},
	tailwind: {
		stylesheet: "./src/main.css",
	},
});
