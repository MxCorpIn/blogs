import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import prettier from "eslint-config-prettier";

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    ignores: ["content/**", "public/**", "pnpm-lock.yaml"],
  },
  prettier,
];

export default eslintConfig;
