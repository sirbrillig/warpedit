WATCHIFY = ./node_modules/.bin/watchify
BROWSERIFY = ./node_modules/.bin/browserify
NPM = npm
NODE ?= node
SRC_JS = src/index.js
BUNDLE_JS = public/js/bundle.js
BABELIFY_PLUGIN = [ babelify --presets [ react ] ]
BUNDLE_CSS = public/styles/bundle.css

run: node-version npm install webserver watchify

build: node-version npm install build

node-version:
	@if [ "$(shell $(NODE) --version | sed 's/[^0-9]//g')" -lt 400 ]; then echo "Please upgrade your version of Node.js: https://nodejs.org/"; exit 1; fi

webserver:
	@$(NODE) index.js&

npm:
	@echo "Checking for npm..."
	@command -v npm >/dev/null 2>&1 || { echo >&2 "Please install Node.js: https://nodejs.org/"; exit 1; }

install:
	@echo "Checking dependencies..."
	@$(NPM) install

build:
	@echo "Running Browserify on your files..."
	@$(BROWSERIFY) $(SRC_JS) -d -t $(BABELIFY_PLUGIN) -o $(BUNDLE_JS) -p [ parcelify -o $(BUNDLE_CSS) ]
	@echo "All done!"

watchify:
	@echo "Running Browserify on your files and watching for changes... (Press CTRL-C to stop)"
	@$(WATCHIFY) $(SRC_JS) --verbose -d -t $(BABELIFY_PLUGIN) -o $(BUNDLE_JS) -p [ parcelify -wo $(BUNDLE_CSS) ]

.PHONY: build run watchify build install npm node-version
