import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', 'legacy/**', 'data/**', 'js/**'] },
  ...tseslint.configs.recommended
);
