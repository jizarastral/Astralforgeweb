/** @type {import("eslint").Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      "AppData/**",
      "OneDrive/**",
      "Documents/**",
      "Downloads/**",
      "ai_studio/**",
      "langflow/**",
      "langflow_env/**",
      "node_modules/**",
      ".next/**",
      ".grok/**",
      ".vscode/**",
      "py-metatrader/**",
      "dev/**",
      "dist/**",
      "build/**",
    ],
  },
];

export default eslintConfig;
