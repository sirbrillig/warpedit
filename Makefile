NODE_BIN = node_modules/.bin
WATCHIFY = $(NODE_BIN)/watchify
BROWSERIFY = $(NODE_BIN)/browserify
WEBSERVER = $(NODE_BIN)/ws
NPM = npm
NODE ?= node
SRC_JS = src/index.js
BUNDLE_JS = public/js/bundle.js
BABELIFY_PLUGIN = [ babelify --presets [ es2015 react ] ]
BUNDLE_CSS = public/styles/bundle.css

run: node-version install webserver watchify

build: node-version install

node-version:
	@if [ "$(shell $(NODE) --version | sed 's/[^0-9]//g')" -lt 400 ]; then echo "Please upgrade your version of Node.js: https://nodejs.org/"; exit 1; fi

webserver:
	@echo "Starting server..."
	$(WEBSERVER) --port 3000 --directory public --spa index.html&

install:
	@echo "Checking dependencies..."
	@$(NPM) install

build:
	@echo "Running Browserify on your files..."
	@$(BROWSERIFY) $(SRC_JS) -t $(BABELIFY_PLUGIN) -o $(BUNDLE_JS) -p [ parcelify -o $(BUNDLE_CSS) ]
	@echo "All done!"

watchify:
	@echo "Running Browserify on your files and watching for changes... (Press CTRL-C to stop)"
	@$(WATCHIFY) $(SRC_JS) --verbose -d -t $(BABELIFY_PLUGIN) -o $(BUNDLE_JS) -p [ parcelify -wo $(BUNDLE_CSS) ]

.PHONY: build run watchify install node-version
