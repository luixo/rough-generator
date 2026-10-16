import { getLintConfig } from "@luixo/configs";

export default getLintConfig({
	ignorePatterns: ["dist/", "public/"],
	rules: {
		// We use a lot of sensible magic numbers
		"eslint/no-magic-numbers": "off",
		// TODO: remove when updated upstream
		"promise/avoid-new": "off",
		// Project is not translated yet
		"react/jsx-no-literals": "off",
	},
});
