import globals from "globals"
import pluginJs from "@eslint/js"
import tseslint from "typescript-eslint"
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js"
import { fixupConfigRules } from "@eslint/compat"

export default [
  {

    languageOptions: {
      globals: { ...globals.browser, ...globals.node }
    }
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    settings: { react: { version: "detect" } },
    rules: {
      // "no-unused-vars": ["error"],
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-unused-vars": [
        "warn"
      ]
    }
  },
  ...fixupConfigRules(pluginReactConfig),
]
