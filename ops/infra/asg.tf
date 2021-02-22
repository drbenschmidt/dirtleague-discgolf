data "aws_ami" "hashi_ami" {
  most_recent = true

  filter {
    name   = "tag:ImageName"
    values = ["Hashi"]
  }
  owners = ["self"]
}



resource "aws_launch_configuration" "launch_config" {
  name_prefix                 = "hashi-cluster-launch-config-"
  image_id                    = data.aws_ami.hashi_ami.id
  instance_type               = "t2.micro"
  iam_instance_profile        = aws_iam_instance_profile.instance_profile.arn
  security_groups             = [aws_security_group.cluster_sg.id]
  associate_public_ip_address = true

  user_data = <<-EOF
                #!/bin/bash
                export IP_ADDR=$(curl http://169.254.169.254/latest/meta-data/local-ipv4)
                cat > /etc/consul.d/consul.json <<EOL
                ${templatefile("${path.module}/config/consul.json.template", { acl_enabled = false })}
                EOL
                cat > /etc/systemd/system/consul.service <<EOL
                ${file("${path.module}/config/consul.service")}
                EOL
                cat > /etc/nomad-server.d/nomad-server.json <<EOL
                ${templatefile("${path.module}/config/nomad-server.json.template", { acl_enabled = false })}
                EOL
                cat > /etc/systemd/system/nomad-server.service <<EOL
                ${file("${path.module}/config/nomad-server.service")}
                EOL
                cat > /etc/nomad-client.d/nomad-client.json <<EOL
                ${templatefile("${path.module}/config/nomad-client.json.template", { acl_enabled = false })}
                EOL
                cat > /etc/systemd/system/nomad-client.service <<EOL
                ${file("${path.module}/config/nomad-client.service")}
                EOL
                systemctl daemon-reload
                service consul restart
                service nomad-server restart
                service nomad-client restart
                EOF

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "cluster" {
  name                 = "cluster-asg"
  launch_configuration = aws_launch_configuration.launch_config.name
  min_size             = 3
  max_size             = 3
  vpc_zone_identifier  = [data.aws_subnet.subnet_a.id, data.aws_subnet.subnet_b.id, data.aws_subnet.subnet_c.id]
  target_group_arns    = [aws_lb_target_group.nomad.arn, aws_lb_target_group.consul.arn]
  tag {
    key                 = "Role"
    value               = "Hashi_Cluster"
    propagate_at_launch = true
  }
  tag {
    key                 = "Name"
    value               = "cluster"
    propagate_at_launch = true
  }

  lifecycle {
    create_before_destroy = true
  }
}