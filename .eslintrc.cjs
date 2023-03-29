/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript'
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
		'vue/no-unused-vars': 'off', //将eslint的无引用检查关掉
		'vue/valid-template-root': 'off',
		'vue/no-unused-components': 'off', //将eslint的无引用检查关掉
		'vue/no-template-key': 'off', //允许将key设置在template上，vue3中template是有效的html
		'vue/no-v-for-template-key': 'off', //允许将key设置在template上，vue3中template是有效的html
		'vue/valid-v-model': 'off', //允许v-model后接属性
		'vue/valid-v-for': 'off',
		'vue/no-v-html': 'off', // 提醒v-html xss攻击
		'block-spacing': [2, 'always'],
		'brace-style': [2, '1tbs', {
			'allowSingleLine': true
		}],
		'camelcase': [0, {
			'properties': 'always'
		}],
		'comma-dangle': [2, 'never'],
		'comma-spacing': [2, {
			'before': false,
			'after': true
		}],
		'comma-style': [2, 'last'],
		'quotes': [2, 'single', {
			'avoidEscape': true,
			'allowTemplateLiterals': true
		}],
		'semi': [2, 'never'],
		'semi-spacing': [2, {
			'before': false,
			'after': true
		}],
		'space-before-function-paren': [2, 'never'],
		'no-trailing-spaces': 2,
		'arrow-spacing': [2, {
			'before': true,
			'after': true
		}],
		'no-multi-spaces': 2,
		'space-unary-ops': [2, {
			'words': true,
			'nonwords': false
		}],
		'no-multiple-empty-lines': [2, {
			'max': 2,
			'maxEOF': 1
		}], // 不允许多个空行(强制最大连续空行数2,强制文件末尾的最大连续空行数1)
		'no-trailing-spaces': 2, // 一行结束后面不要有空格
		'no-console': import.meta.env.NODE_ENV === 'production' ? 1 : 0,
		'no-debugger': import.meta.env.NODE_ENV === 'production' ? 1 : 0
	}
}
