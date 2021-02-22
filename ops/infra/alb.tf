

resource "aws_lb_target_group" "nomad" {
  name     = "nomad-tg"
  port     = 4646
  protocol = "HTTP"
  vpc_id   = data.aws_vpc.vpc.id
}

resource "aws_lb_target_group" "consul" {
  name     = "consul-tg"
  port     = 8500
  protocol = "HTTP"
  vpc_id   = data.aws_vpc.vpc.id
  health_check {
    path    = "/ui/"
    matcher = "200"
  }
}

resource "aws_lb" "alb" {
  name               = "alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb_sg.id]
  subnets            = [data.aws_subnet.subnet_a.id, data.aws_subnet.subnet_b.id, data.aws_subnet.subnet_c.id]

  enable_deletion_protection = true
}

resource "aws_lb_listener" "redirect_http" {
  load_balancer_arn = aws_lb.alb.arn
  port              = "80"
  protocol          = "HTTP"

  default_action {
    type = "redirect"

    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_301"
    }
  }
}

resource "aws_lb_listener" "front_end" {
  load_balancer_arn = aws_lb.alb.arn
  port              = "443"
  protocol          = "HTTPS"
  ssl_policy        = "ELBSecurityPolicy-2016-08"
  certificate_arn   = aws_acm_certificate.cert.arn


  default_action {
    type = "fixed-response"

    fixed_response {
      content_type = "text/plain"
      message_body = "Try something else"
      status_code  = "404"
    }
  }
}

resource "aws_lb_listener_rule" "consul" {
  listener_arn = aws_lb_listener.front_end.arn

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.consul.arn
  }

  condition {
    host_header {
      values = ["consul.${var.domain}"]
    }
  }
}

resource "aws_route53_record" "consul" {
  zone_id = var.zone_id
  name    = "consul"
  type    = "CNAME"
  ttl     = "120"
  records = [aws_lb.alb.dns_name]
}

resource "aws_lb_listener_rule" "nomad" {
  listener_arn = aws_lb_listener.front_end.arn

  action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.nomad.arn
  }

  condition {
    host_header {
      values = ["nomad.${var.domain}"]
    }
  }
}

resource "aws_route53_record" "nomad" {
  zone_id = var.zone_id
  name    = "nomad"
  type    = "CNAME"
  ttl     = "120"
  records = [aws_lb.alb.dns_name]
}