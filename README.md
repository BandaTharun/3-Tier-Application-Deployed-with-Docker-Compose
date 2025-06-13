 

---

🚀 **Successfully Deployed a 3-Tier Architecture Application with Docker Compose!** 🎉


The application consists 💻 of:

1. **Frontend** (React) 🌐:
   - Hosted on port 3000, seamlessly built and served from the Docker container.
   - The frontend communicates with the backend and offers a smooth user experience.

2. **Backend** (Node.js or Django API) 🔗:
   - Running on port 5015, handling all the application’s logic and API requests.
   - It relies on a MySQL database for persistent data storage.

3. **Database** (MySQL) 💾:
   - MySQL database container, securely handling data on port 3306.
   - Data is stored using Docker volumes, ensuring persistence.

Docker Compose made it easy to orchestrate these services, manage dependencies, and network them together with minimal configuration. 🛠️ By defining services in a single YAML file, deployment has never been simpler!

Key takeaways from this deployment:
- Isolated environments for each service.
- Simplified networking with Docker bridge networks.
- Persistent storage for MySQL with Docker volumes.
- Automatic handling of service dependencies using `depends_on`.

---
