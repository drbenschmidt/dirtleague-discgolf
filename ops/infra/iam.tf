data "aws_iam_policy_document" "assume_role_policy" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "role" {
  name               = "cluster_instance_role"
  path               = "/system/"
  assume_role_policy = data.aws_iam_policy_document.assume_role_policy.json
}

data "aws_iam_policy_document" "ec2_policy" {
  statement {
    actions   = ["ec2:*"]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "policy" {
  name        = "cluster_instance_policy"
  description = "EC2 instance policy"

  policy = data.aws_iam_policy_document.ec2_policy.json
}

resource "aws_iam_policy_attachment" "policy_attachment" {
  name       = "policy_attachment"
  roles      = [aws_iam_role.role.name]
  policy_arn = aws_iam_policy.policy.arn
}

resource "aws_iam_policy_attachment" "ssm_policy_attachment" {
  name       = "ssm_policy_attachment"
  roles      = [aws_iam_role.role.name]
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_policy_attachment" "secrets_manager_policy_attachment" {
  name       = "secrets_manager_policy_attachment"
  roles      = [aws_iam_role.role.name]
  policy_arn = "arn:aws:iam::aws:policy/SecretsManagerReadWrite"
}

resource "aws_iam_instance_profile" "instance_profile" {
  name = "cluster_instance_profile"
  role = aws_iam_role.role.name
}