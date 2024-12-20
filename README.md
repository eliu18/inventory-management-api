# Inventory Management System API

## Table of Contents

- [Introduction](#introduction)
- [Installation Instructions](#installation-instructions)
- [API Documentation](#api-documentation)
- [Technical Decisions](#technical-decisions)
- [Architecture Diagram](#architecture-diagram)
- [Local Deployment with Docker Compose](#local-deployment-with-docker-compose)
- [Cloud Deployment Instructions](#cloud-deployment-instructions)

---

## Introduction

This project is an inventory management system designed for managing products and stock across multiple stores. It provides functionality to create, update, retrieve, and delete products, as well as manage stock movements and monitor low inventory levels.

---

## Installation Instructions

### Prerequisites

- **Node.js**: v16 or later
- **Docker**: v20 or later
- **Docker Compose**: v2.0 or later
- **PostgreSQL**: (via Docker)
- **Git**

### Steps

1. **Clone the Repository**

   ```bash
   git clone https://github.com/eliu18/inventory-management-api.git
   cd inventory-management-api
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory based on the `.env.example` file:

   ```bash
   cp .env.example .env
   ```

   Update the database and other configurations as necessary.

4. **Start Services**
   Use Docker Compose to start the PostgreSQL database:

   ```bash
   docker compose -f "tools/docker-compose.yml" up -d --build
   ```

5. **Run the Application**
   Start the NestJS server:

   ```bash
   npm run start:dev
   ```

6. **Run Tests**
   Execute unit and integration tests:
   ```bash
   npm run test:all
   ```

---

## API Documentation

The API includes the following main endpoints:

### Products

- **GET /products**: Retrieves the list of products.
- **POST /products**: Creates a new product.
- **PUT /products/:id**: Updates an existing product.
- **DELETE /products/:id**: Deletes a product.

### Inventory

- **POST /inventory/transfer**: Handles inventory movements.
- **GET /inventory/alerts**: Retrieves products with low stock.
- **GET /stores/:id/inventory**: Retrieves inventory by store.

Refer to the Postman collection included in the repository for detailed usage examples.

## Technical Decisions

- **NestJS**: Chosen for its modularity and TypeScript support.
- **TypeORM**: For relational database management.
- **PostgreSQL**: A robust and scalable database.
- **Docker**: For containerization and consistent deployment.
- **Jest**: For unit and integration testing.
- **Artillery**: For load testing.
- **Clean Architecture**: To maintain clear and maintainable code structure.

---

## Architecture Diagram

```plaintext
[Frontend]
    |
    v
[API Gateway (NestJS)] --> [Application Layer]
    |                            |
    v                            v
[Use Cases]                [Infrastructure Layer]
    |                            |
    v                            v
[Domain Layer]          [PostgreSQL + TypeORM]
```

This layered architecture separates concerns, making the system modular and scalable.

---

### Local Deployment with Docker Compose

1. Build and run the services:

   ```bash
   docker-compose up --build
   ```

2. Access the application at `http://localhost:3000`.

---

### Cloud Deployment Instructions

1. **Provision Infrastructure**:

   - Use your cloud provider’s services to provision infrastructure capable of running containers. This could include:
     - Virtual machines (e.g., AWS EC2, GCP Compute Engine, Azure Virtual Machines).
     - Managed container services (e.g., AWS ECS, Google GKE, Azure AKS, or DigitalOcean App Platform).

2. **Fetch the Container Image**:

   - Configure your infrastructure or container service to pull the Docker image from the registry.
   - Ensure appropriate permissions are set for accessing the container registry.

3. **Deploy the Application**:

   - Run the container using the pulled image.
   - Specify environment variables, ports, and resource limits as needed.

   Generic Docker run example:

   ```bash
   docker run -d -p 3000:3000 --name inventory-management-api <your-registry-url>/inventory-management-api:latest
   ```

4. **Networking and Security**:
   - Configure firewalls or security groups to allow inbound traffic to your application.
   - If using a load balancer, integrate it with your container instances.
