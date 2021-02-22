# TODO
* Create and test MySQL Nomad job
* Nomad CSI

# Infrastructure
This folder contains all of the infrastructure automation to support the application.

The terraform will create:
* EC2 instances in an Autoscaling group
* Load balancer and certificate to offload SSL and target the EC2 instances
* DNS names to point to load balancer
* IAM policies and roles for the EC2 instances
* VPC resources such as security groups

The result of this infrastructure is:
* Consul server cluster
* Nomad server cluster
* Nomad client cluster

Which are accessible through the load balancer at:
* consul.(domain)
* nomad.(domain)

Jobs can be run on the cluster by submitting through the API.

## ACL System
ACL are disabled on first launch but enabled in the system to control access.
Automating the bootstrap process is relaly cumbersome and from experience not worth the effort.

ACL tokens are stored in AWS Secrets Manager.

# Deploy
The infrastructure is created with Terraform. State is stored remotely on S3. 

Possible configuration to deploy in another configuration:
* backend.tf - change the backend state bucket
* terraform.auto.tfvars - change the domain/hosted zone

Only AWS authentication is needed to create the infrastructure. 
Supply AWS access keys either in environment variables or in ~/.aws/credentials.

```
terraform init
terraform apply
```

# Build AMI
The base AMI is created with Packer.
This AMI contains some general tools, Consul/Nomad binaries, and some supporting directories.

```
cd build
packer build packer.json
```
