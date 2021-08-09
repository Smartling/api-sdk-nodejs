#!groovy

pipeline {
    agent any

    stages {
        stage('Run unit tests') {
            agent {
                label 'master'
            }

            steps {
                  sh 'docker run --rm -w `pwd` -v `pwd`:`pwd` node:12.16.1 npm install'
                  sh 'docker run --rm -w `pwd` -v `pwd`:`pwd` node:12.16.1 npm test'
                  junit 'test-results.xml'
            }
        }

        stage('Sonar') {
            agent {
                label 'master'
            }

            steps {
                script {
                    String scannerHome = tool name: 'sonar-next', type: 'hudson.plugins.sonar.SonarRunnerInstallation';
                    withSonarQubeEnv('sonar-next') {
                        sh "${scannerHome}/bin/sonar-scanner \
                         -Dsonar.sources=api \
                         -Dsonar.javascript.lcov.reportPaths=coverage/lcov.info \
                         -Dsonar.projectKey=\"smartling-api-sdk-nodejs\" \
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
                sh 'rm -rf built coverage .nyc_output node_modules test-results.xml package-lock.json .npmrc'
                sh 'docker run --rm -w `pwd` -v `pwd`:`pwd` node:12.16.1 npm install --production'
                sh 'docker run --rm -w `pwd` -v `pwd`:`pwd` node:12.16.1 npm run build'

                withCredentials([file(credentialsId: 'node-npmrc-public-file', variable: 'FILE')]) {
                sh 'docker run --rm -w `pwd` -v `pwd`:`pwd` -v $FILE:`pwd`/.npmrc node:12.16.1 ls -lah `pwd`'
                    sh 'docker run --rm -w `pwd` -v `pwd`:`pwd` -v $FILE:`pwd`/.npmrc node:12.16.1 cat `pwd`/.npmrc'
                    sh 'docker run --rm -w `pwd` -v `pwd`:`pwd` -v $FILE:`pwd`/.npmrc node:12.16.1 npm publish --access public'
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
