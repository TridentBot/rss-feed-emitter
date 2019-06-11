workflow "Build and Push" {
  on = "push"
  resolves = ["Push to Master"]
}

action "Install Dependencies" {
  needs = ["Is on Master", "Is Build commit"]
  uses = "actions/npm@master"
  args = "install"
}

action "Build" {
  needs = ["Install Dependencies"]
  uses = "actions/npm@master"
  args = "run build"
}

action "Is on Master" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Is Build commit" {
  uses = "./.github/actions/filter-commit-message"
  args = "^Build"
}

action "Push to Master" {
  uses = "ludeeus/action-push@master"
  env = {
    ACTION_MAIL = "ethoarx@gmail.com"
    ACTION_NAME = "Build System"
    ACTION_BRANCH = "master"
    ACTION_MESSAGE = "Automatic"
  }
  secrets = ["GITHUB_TOKEN"]
  needs = ["Build"]
}

