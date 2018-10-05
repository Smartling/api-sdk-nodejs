#!groovy

def gitBranch
def gitCommit
def shortCommit

node {
    def nodeJsHome = tool 'NodeJS6'
    env.PATH = "${nodeJsHome}/bin:${env.PATH}"

    stage('Checkout') {
        checkout scm
        gitBranch = sh(returnStdout: true, script: 'git rev-parse --abbrev-ref HEAD').trim()
        gitCommit = sh(returnStdout: true, script: 'git rev-parse HEAD').trim()
        shortCommit = gitCommit.take(6)
    }
    stage('Boostrap') {
        sh "npm install"
    }
    stage('Test') {
       try {
           sh "npm run test"
       } finally {
           junit "**/test-results/*.xml"
       }
   }
    stage('Publish') {
        sh "npm publish"
    }
}
