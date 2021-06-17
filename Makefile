SHELL=/bin/bash -o pipefail

# Load them from an optional .env file
-include .env

################################################################################
### Config variables
###

# Specify which docker tag is to be used
VERSION := $(or ${VERSION},${VERSION},latest)
DOCKER_REGISTRY := $(or ${DOCKER_REGISTRY},${DOCKER_REGISTRY},docker.io)

TINY = ${VERSION}
MINOR = $(shell echo '${TINY}' | cut -f'1-2' -d'.')
# not used until 1.0
# MAJOR = $(shell echo '${MINOR}' | cut -f'1-2' -d'.')

################################################################################
# Release helpers
#
clean:
	rm -rf Dockerfile.*.log Dockerfile.*.built Dockerfile.*.pushed

################################################################################
# Docker images generation rules
#

Dockerfile.built: Dockerfile
	docker build -t enspirit/harpocrates . | tee Dockerfile.log
	touch Dockerfile.built

Dockerfile.pushed: Dockerfile.built
	docker tag enspirit/harpocrates $(DOCKER_REGISTRY)/enspirit/harpocrates:$(TINY)
	docker push $(DOCKER_REGISTRY)/enspirit/harpocrates:$(TINY) | tee -a Dockerfile.log
	docker tag enspirit/harpocrates $(DOCKER_REGISTRY)/enspirit/harpocrates:$(MINOR)
	docker push $(DOCKER_REGISTRY)/enspirit/harpocrates:$(MINOR) | tee -a Dockerfile.log
	touch Dockerfile.pushed

images: Dockerfile.built

push-images: Dockerfile.pushed
