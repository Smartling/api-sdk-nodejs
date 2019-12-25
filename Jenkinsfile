#!groovy

pipeline {
    agent any

    stages {
        stage('Bootstrap') {
            agent {
                label 'master'
            }

            steps {
                sh 'docker run --rm -w `pwd` -v `pwd`:`pwd` node:12.14.0 npm install'
            }
        }

        stage('Test') {
            agent {
                label 'master'
            }

            steps {
                sh 'docker run --rm -w `pwd` -v `pwd`:`pwd` node:12.14.0 npm run test'
                junit "**/test-results/*.xml"
            }
        }

        stage('Sonar') {
            agent {
                label 'master'
            }

            steps {
                script {
                    String scannerHome = tool name: 'sonar', type: 'hudson.plugins.sonar.SonarRunnerInstallation';
                    withSonarQubeEnv('sonar') {
                        sh "${scannerHome}/bin/sonar-scanner \
                         -Dsonar.javascript.lcov.reportPath=coverage/lcov.info \
                         -Dsonar.sources=api \
                         -Dsonar.exclusions=node_modules/**,test/**,.eslintrc.js,.nyc_output/**,coverage/**,build/** \
                         -Dsonar.projectKey=\"api-sdk-nodejs\" \
                         -Dsonar.projectName=\"API SDK nodejs\" \
                         -Dsonar.projectVersion=${env.BUILD_NUMBER}"
                    }
                }
            }
        }

        stage("Quality Gate") {
            steps {
                script {
                    try {
                        timeout(time: 5, unit: 'MINUTES') {
                            def qg = waitForQualityGate()
                            if (qg.status != 'OK') {
                                error "Pipeline aborted due to quality gate failure"
                            }
                        }
                    }
                    catch (err) {
                        // Catch timeout exception but not Quality Gate.
                        String errorString = err.getMessage();

                        if (errorString == "Pipeline aborted due to quality gate failure") {
                            error errorString
                        }
                    }
                }
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
