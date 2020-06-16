---
title: 'Overview'
category: 'psdb-operator'
---

# Overview: PlanetScaleDB Operator for Vitess

This document describes the purpose of the PlanetScaleDB Operator for Vitess and introduces its usage. To learn more about Vitess, see the [Vitess documentation](https://vitess.io/docs).

## The PlanetScaleDB operator automates the management of Vitess.

Running Vitess on a container platform provides automated deployment. However, this pattern still requires significant maintenance tasks, like planned failover, updates, and resharding. The purpose of the PlanetScaleDB Operator is to automate much of that maintenance work.

The PlanetScaleDB Operator automates tasks like these:

- Deploy any number of Vitess clusters, cells, keyspaces, shards, and tablets to scale both reads and writes either horizontally or vertically;
- Replicate data across multiple Kubernetes clusters in different regions, cloud providers, and on-prem datacenters;
- Execute zero-downtime rolling updates and tablet migrations;
- Deploy overlapping shards for Vitess resharding, allowing zero-downtime resizing of shards;
- Trigger manual planned failover via Kubernetes annotation;
- Replicate data across multiple Availability Zones in a single Kubernetes cluster to support immediate failover of read/write traffic to recover from loss of an Availability Zone;
- Automatically deploy and maintain etcd clusters with quorum across multiple Kubernetes clusters;
- Automatically roll out updates to Vitess-level user credentials;
- Deploy and auto-configure Grafana dashboard for each Vitess cluster.

## Deploy a cluster from a configuration file.

The configuration for your Vitess cluster is recorded in a single configuration file. The operator treats your Vitess configuration as a [custom resource](https://kubernetes.io/docs/concepts/extend-kubernetes/api-extension/custom-resources/). To deploy a cluster, customize the configuration file and apply it with `kubectl`.

## Maintain your Vitess cluster by updating your configuration file.

The operator implements applied changes in the configuration file for your Vitess cluster.