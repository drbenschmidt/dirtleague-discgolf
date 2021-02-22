#!/bin/bash

# AWS SSM Agent
sudo snap install amazon-ssm-agent --classic

# Tools
sudo apt-get update
sudo apt-get -y install net-tools zip
sudo snap install jq

# Install Consul and Nomad
export CONSUL_VERSION="1.9.3"
https://releases.hashicorp.com/consul/${CONSUL_VERSION}/consul_${CONSUL_VERSION}_linux_amd64.zip
unzip consul_${CONSUL_VERSION}_linux_amd64.zip
sudo chown root:root consul
sudo mv consul /usr/local/bin/
sudo mkdir -p /etc/consul.d
sudo mkdir -p /opt/consul
sudo chmod -R 777 /opt/nomad

export NOMAD_VERSION="1.0.1"
curl --silent --remote-name https://releases.hashicorp.com/nomad/${NOMAD_VERSION}/nomad_${NOMAD_VERSION}_linux_amd64.zip
unzip nomad_${NOMAD_VERSION}_linux_amd64.zip
sudo chown root:root nomad
sudo mv nomad /usr/local/bin/
sudo mkdir -p /etc/nomad-server.d
sudo mkdir -p /etc/nomad-client.d
sudo mkdir -p /opt/nomad/server
sudo mkdir -p /opt/nomad/clent
sudo chmod -R 777 /opt/nomad