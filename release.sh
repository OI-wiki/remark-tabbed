#!/usr/bin/bash

ver=$(grep -oP '"version": "\K[^"]+' ../package.json)

git add .
git commit -m "chore: release v$ver"
git tag v$ver
git push
git push origin --tags

