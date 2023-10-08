#! /bin/bash

git ls-files | grep '\.js$' | xargs grep $1
