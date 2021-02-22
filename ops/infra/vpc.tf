

data "aws_vpc" "vpc" {
  default = true
}

data "aws_subnet" "subnet_a" {
  availability_zone = "us-east-1a"
  vpc_id            = data.aws_vpc.vpc.id
}

data "aws_subnet" "subnet_b" {
  availability_zone = "us-east-1b"
  vpc_id            = data.aws_vpc.vpc.id
}

data "aws_subnet" "subnet_c" {
  availability_zone = "us-east-1c"
  vpc_id            = data.aws_vpc.vpc.id
}


resource "aws_security_group" "alb_sg" {
  name        = "alb_sg"
  description = "Allow inbound traffic"
  vpc_id      = data.aws_vpc.vpc.id

  ingress {
    description = "HTTP from World"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "HTTPS from World"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

}

resource "aws_security_group" "cluster_sg" {
  name        = "cluster_sg"
  description = "Allow internal traffic"
  vpc_id      = data.aws_vpc.vpc.id

  ingress {
    description     = "All internal"
    from_port       = 0
    to_port         = 0
    protocol        = "-1"
    security_groups = [aws_security_group.alb_sg.id]
    self            = true
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

}