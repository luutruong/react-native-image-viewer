#!/bin/bash

set -e

_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" >> /dev/null && pwd)"

cp -af "$_dir/src/" "$_dir/demo/components/ImageViewer"