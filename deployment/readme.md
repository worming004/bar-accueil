# Setup

Ce projet fonctionne sur kubernetes. Bien que ça ne soit pas nécessaire, il y a ici toute la documentation pour setup ce projet sur kubenernetes.

# Postgres

L'opérateur de Zalando est ici utilisé pour construire un cluster postgres en production. https://github.com/zalando/postgres-operator/

## Installation

### Installer les chartes

```bash
POSTGRES_NAMESPACE=postgres-operator
helm repo add  postgres-operator-charts https://opensource.zalando.com/postgres-operator/charts/postgres-operator
helm repo add postgres-operator-ui-charts https://opensource.zalando.com/postgres-operator/charts/postgres-operator-ui
kubectl create namespace $POSTGRES_NAMESPACE
helm install postgres-operator postgres-operator-charts/postgres-operator -n $POSTGRES_NAMESPACE
helm install postgres-operator-ui postgres-operator-ui-charts/postgres-operator-ui -n $POSTGRES_NAMESPACE
```

### Start initial cluster

```yaml
kind: "postgresql"
apiVersion: "acid.zalan.do/v1"

metadata:
  name: "default-cluster"
  namespace: "default"
  labels:
    team: acid

spec:
  teamId: "acid"
  postgresql:
    version: "16"
  numberOfInstances: 3
  enableMasterLoadBalancer: true
  enableReplicaLoadBalancer: true
  enableReplicaConnectionPooler: true
  enableReplicaPoolerLoadBalancer: true
  volume:
    size: "50Gi"
  users:
    worming: []
  databases:
    baraccueil: worming
  allowedSourceRanges:
    # IP ranges to access your cluster go here
  
  resources:
    requests:
      cpu: 1000m
      memory: 2000Mi
    limits:
      cpu: 5000m
      memory: 10000Mi
```
