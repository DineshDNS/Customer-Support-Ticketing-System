terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

# -----------------------------
# AWS Provider
# -----------------------------
provider "aws" {
  region = "ap-south-1"
}

# -----------------------------
# Get Default VPC
# -----------------------------
data "aws_vpc" "default" {
  default = true
}

# -----------------------------
# Get Subnets in Default VPC
# -----------------------------
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

# -----------------------------
# Key Pair (SSH)
# -----------------------------
resource "aws_key_pair" "devops_key" {
  key_name   = "devops-key-final"
  public_key = file("/home/dp/.ssh/id_rsa.pub")
}

# -----------------------------
# Security Group
# -----------------------------
resource "aws_security_group" "devops_sg" {
  name        = "devops-sg-final"
  description = "Allow SSH and application ports"
  vpc_id      = data.aws_vpc.default.id

  # SSH
  ingress {
    description = "SSH"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # App Ports
  ingress {
    description = "Application Ports"
    from_port   = 3000
    to_port     = 9000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "devops-sg-final"
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true

  owners = ["099720109477"]  # Canonical (Ubuntu)

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }
}

# -----------------------------
# EC2 Instance
# -----------------------------
resource "aws_instance" "devops_server" {
  ami = data.aws_ami.ubuntu.id
  instance_type = "t3.micro"

  key_name = aws_key_pair.devops_key.key_name

  subnet_id                   = data.aws_subnets.default.ids[0]
  vpc_security_group_ids      = [aws_security_group.devops_sg.id]
  associate_public_ip_address = true

  tags = {
    Name = "DevOps-Server"
  }
}

# -----------------------------
# Output Public IP
# -----------------------------
output "public_ip" {
  value = aws_instance.devops_server.public_ip
}