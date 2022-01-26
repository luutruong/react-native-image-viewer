#!/bin/bash

set -e

_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" >> /dev/null && pwd)"

yarn build

cp -af "$_dir/dist/src/" "$_dir/demo/components/ImageViewer"