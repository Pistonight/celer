Celer uses submodules to get shared tools such as `base-lint`, also created by iTNTPiston

## Clone submodules while cloning repo
To clone the repo, including submodules, add `--recurse-submodules` flag
```bash
git clone git@github.com:iTNTPiston/celer --recurse-submodules
```

## Clone submodules within existing repo
If you already cloned the repo without submodules, or need to update an old repo, run the following

```bash
git checkout main
git pull
git submodule update --init
```

## Update submodules
Sometimes the tools are updated with an PR. To get the update, run the following

```bash
git checkout main
git pull
cd path_to_submodule     # example: cd scripts/base-lint
git checkout main
git pull
cd back_to_repo_root     # example: cd ../..
git checkout your_branch
git rebase -i main       # or git merge main
```

Consider updating the respective submodule if a command doesn't work
