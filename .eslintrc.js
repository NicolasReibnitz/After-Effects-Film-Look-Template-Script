module.exports = {
	root: true,
	extends: ['@das.laboratory/eslint-config-interactive-ts'],
	rules: {
		'@typescript-eslint/triple-slash-reference': 'off',
		'no-undef': 'off',
		'no-unused-vars': 'off',
		'@typescript-eslint/no-namespace': 'off',
		'@typescript-eslint/no-unused-vars': [
			'error',
			{
				args: 'all',
				argsIgnorePattern: '^_',
				caughtErrors: 'all',
				caughtErrorsIgnorePattern: '^_',
				destructuredArrayIgnorePattern: '^_',
				varsIgnorePattern: '^_|FilmFX|Utils',
				ignoreRestSiblings: true
			}
		]
	}
	// extends: ['@das.laboratory/eslint-config-interactive']
};
