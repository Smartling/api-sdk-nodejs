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
            }

            steps {
                junit "**/test-results/*.xml"
            }
        }

        stage('Publish') {
            agent {
                label 'master'
            }

            steps {
                sh 'docker run --rm -w `pwd` -v `pwd`:`pwd` node npm publish'
            }
        }
    }

    post {
        always {
              deleteDir()
        }
    }
}
