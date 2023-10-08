#! /bin/bash

git ls-files | grep '\.js$' | xargs wc -l
