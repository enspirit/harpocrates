SHELL=/bin/bash -o pipefail

# Load them from an optional .env file
-include .env

################################################################################
### Config variables
###

# Specify which docker tag is to be used
VERSION := $(or ${VERSION},${VERSION},latest)
DOCKER_REGISTRY := $(or ${DOCKER_REGISTRY},${DOCKER_REGISTRY},docker.io)
DOCKER_BUILDKIT := 1

TINY = ${VERSION}
MINOR = $(shell echo '${TINY}' | cut -f'1-2' -d'.')
# not used until 1.0
# MAJOR = $(shell echo '${MINOR}' | cut -f'1-2' -d'.')

################################################################################
# Docker images generation rules
#

image:
	docker build -t enspirit/harpocrates .

push-image:
	docker tag enspirit/harpocrates $(DOCKER_REGISTRY)/enspirit/harpocrates:$(TINY)
	docker push $(DOCKER_REGISTRY)/enspirit/harpocrates:$(TINY)
	docker tag enspirit/harpocrates $(DOCKER_REGISTRY)/enspirit/harpocrates:$(MINOR)
	docker push $(DOCKER_REGISTRY)/enspirit/harpocrates:$(MINOR)

################################################################################
# Dependencies and packages
#
node_modules:
	npm install

package: node_modules
	npm run package

release: package
	bin/release
