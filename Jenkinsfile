pipeline {
    agent any

    environment {
        DOCKERHUB_USER = 'dinesh3715'
        EC2_IP = '13.203.193.23'
    }

    stages {

        stage('Clean Workspace') {
            steps { deleteDir() }
        }

        stage('Clone Code') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/DineshDNS/Customer-Support-Ticketing-System.git'
            }
        }

        // ✅ FIX 1: LOGIN BEFORE BUILD
        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat '''
                    docker logout

                    echo %DOCKER_PASS% > pass.txt
                    type pass.txt | docker login --username %DOCKER_USER% --password-stdin
                    del pass.txt

                    docker info
                    '''
                }
            }
        }

        stage('Build Docker Images') {
            steps {
                bat """
                docker build -t %DOCKERHUB_USER%/csts-backend:%BUILD_NUMBER% ./BackEnd
                docker build -t %DOCKERHUB_USER%/csts-backend:latest ./BackEnd

                docker build -t %DOCKERHUB_USER%/csts-frontend:%BUILD_NUMBER% ./FrontEnd
                docker build -t %DOCKERHUB_USER%/csts-frontend:latest ./FrontEnd
                """
            }
        }

        stage('Push Docker Images') {
            steps {
                bat """
                docker push %DOCKERHUB_USER%/csts-backend:%BUILD_NUMBER%
                docker push %DOCKERHUB_USER%/csts-backend:latest

                docker push %DOCKERHUB_USER%/csts-frontend:%BUILD_NUMBER%
                docker push %DOCKERHUB_USER%/csts-frontend:latest
                """
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    bat """
                    ssh -tt -o StrictHostKeyChecking=no ubuntu@%EC2_IP% ^
                    "docker stop backend frontend postgres || true && ^
                     docker rm backend frontend postgres || true && ^
                     docker network create app-network || true && ^
                     docker run -d --name postgres --network app-network ^
                        -e POSTGRES_DB=ticketing_db ^
                        -e POSTGRES_USER=postgres ^
                        -e POSTGRES_PASSWORD=667254 ^
                        -p 5432:5432 postgres && ^
                     docker pull %DOCKERHUB_USER%/csts-backend:latest && ^
                     docker pull %DOCKERHUB_USER%/csts-frontend:latest && ^
                     docker run -d --name backend --network app-network -p 8000:8000 %DOCKERHUB_USER%/csts-backend:latest && ^
                     docker run -d --name frontend --network app-network -p 3000:3000 %DOCKERHUB_USER%/csts-frontend:latest"
                    """
                }
            }
        }

        stage('Verify Deployment') {
            steps {
                sshagent(['ec2-ssh-key']) {
                    bat """
                    ssh -o StrictHostKeyChecking=no ubuntu@%EC2_IP% docker ps
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ CI/CD + Auto Deployment Successful!'
        }
        failure {
            echo '❌ Pipeline Failed! Check logs.'
        }
    }
}