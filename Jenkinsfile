pipeline {
    agent any

    environment {
        BACKEND_IMAGE = 'dinesh3715/csts-backend:latest'
        FRONTEND_IMAGE = 'dinesh3715/csts-frontend:latest'
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main',
                url: 'https://github.com/DineshDNS/Customer-Support-Ticketing-System.git'
            }
        }

        stage('Build Backend Image') {
            steps {
                dir('BackEnd') {
                    bat 'docker build -t %BACKEND_IMAGE% .'
                }
            }
        }

        stage('Build Frontend Image') {
            steps {
                dir('FrontEnd') {
                    bat 'docker build -t %FRONTEND_IMAGE% .'
                }
            }
        }

        stage('DockerHub Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {

                    bat 'docker login -u %DOCKER_USER% -p %DOCKER_PASS%'
                }
            }
        }

        stage('Push Backend Image') {
            steps {
                bat 'docker push %BACKEND_IMAGE%'
            }
        }

        stage('Push Frontend Image') {
            steps {
                bat 'docker push %FRONTEND_IMAGE%'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {

                bat 'kubectl apply -f k8s/'

                bat 'kubectl rollout restart deployment backend'

                bat 'kubectl rollout restart deployment frontend'
            }
        }

        stage('Verify Kubernetes Pods') {
            steps {
                bat 'kubectl get pods'
            }
        }
    }

    post {

        success {
            echo 'Full CI/CD Kubernetes Deployment Completed Successfully!'
        }

        failure {
            echo 'Pipeline Failed!'
        }
    }
}