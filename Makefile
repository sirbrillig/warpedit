WATCHIFY = ./node_modules/.bin/watchify
BROWSERIFY = ./node_modules/.bin/browserify
NPM = npm
NODE ?= node

run: npm install webserver watchify

build: npm install build

webserver:
	@$(NODE) index.js&

npm:
	@echo "Checking for npm..."
	@command -v npm >/dev/null 2>&1 || { echo >&2 "Please install Node.js: https://nodejs.org/"; exit 1;  }

install:
	@echo "Checking dependencies..."
	@$(NPM) install

build:
	@echo "Running Browserify on your files..."
	@$(BROWSERIFY) src/index.js -t babelify -o public/js/bundle.js
	@echo "All done!"

watchify:
	@echo "Running Browserify on your files and watching for changes... (Press CTRL-C to stop)"
	@$(WATCHIFY) --verbose -o public/js/bundle.js -- src/index.js

.PHONY: build run watchify build install npm
