# Dependency maintenance

Use `npm ci` to reproduce `package-lock.json`. Review minor/patch Dependabot updates and run checks before merging.

The initial installation uses ESLint 9 because the current `eslint-plugin-react` peer range does not support ESLint 10. The registry marks ESLint 9 as unsupported. As of setup, `npm audit` reports moderate `minimatch` denial-of-service advisories in this development-only lint dependency chain. No runtime dependency is affected by this report.

Do not apply `npm audit fix --force`: its proposed downgrades to old ESLint/Next configurations are not an appropriate fix. Do not force minimatch 11 into packages expecting its older API. Revisit once the upstream React/Next lint plugins support the maintained lint stack, or migrate lint tooling deliberately with equivalent checks.

The CI audits production dependencies at the high-severity threshold. Run the full audit periodically as well; the full report must not be described as clean while these development-tool advisories remain.
