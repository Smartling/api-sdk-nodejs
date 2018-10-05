#!groovy

pipeline {
    agent any

    stages {
        stage('Bootstrap') {
            agent {
                label 'master'
            }

            steps {
                sh 'docker run --rm -w `pwd` -v `pwd`:`pwd` node npm install'
            }
        }

        stage('Test') {
            agent {
                label 'master'
            }

            steps {
                sh 'docker run --rm -w `pwd` -v `pwd`:`pwd` node npm run test'
                junit "**/test-results/*.xml"
            }
        }

        stage('Publish') {
            agent {
                label 'master'
            }

            steps {
                withCredentials([file(credentialsId: 'node-npmrc-file', variable: 'FILE')]) {
                    sh 'docker run --rm -w `pwd` -v `pwd`:`pwd` -v $FILE:/root/.npmrc node npm publish'
                }
            }
        }
    }

    post {
        always {
              deleteDir()
        }
    }
}
