NPM_BIN=./node_modules/.bin
HOOKS=./.git/hooks/
LINT_SPEC= *.js ./lib
TEST_SPEC=-S --ui bdd --timeout 5000 --recursive test/ --colors --reporter spec

.PHONY: lint
lint:
	@$(NPM_BIN)/eslint $(LINT_SPEC) --fix

.PHONY: test
test:
	@$(NPM_BIN)/mocha $(TEST_SPEC)

.PHONY: test-ci
test-ci:
	@rm -rf ./coverage && $(NPM_BIN)/istanbul cover $(NPM_BIN)/_mocha --report lcovonly -- $(TEST_SPEC)

.PHONY: coverage
coverage:
	@rm -rf ./coverage && $(NPM_BIN)/istanbul cover $(NPM_BIN)/_mocha -- $(TEST_SPEC)
