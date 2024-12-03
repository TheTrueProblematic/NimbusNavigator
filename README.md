# Nimbus Navigator 🌈

Welcome to **Nimbus Navigator**, an imaginative and engaging weather app designed by **Team 2 Nimbus Labs**. This application goes beyond the basics of weather reporting, offering a fun, interactive experience that makes learning about the weather enjoyable and informative, especially for young learners. Developed by **Logan Moser, Grant Parker, Max McClelland, Cooper Baugh, and Anja Delzell**, this project is focused on enhancing the weather experience with creativity and education at its core.

## Table of Contents

- [About Nimbus Navigator](#about-nimbus-navigator)
- [Features](#features)
- [Contributors](#contributors)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
  - [Running the Application Locally](#running-the-application-locally)
  - [Running Tests](#running-tests)
- [Deployment](#deployment)
- [Communication Plan](#communication-plan)
- [Development Methodology](#development-methodology)
- [Vision Statement](#vision-statement)

## About Nimbus Navigator

Nimbus Navigator offers a rich and dynamic weather experience with features designed for both information and education. Created for children, especially those in grades K-6, Nimbus Navigator is a tool for young learners to explore and understand weather in an engaging way. Through creative imagery and interactive weather features, the app serves as both a weather source and an educational tool for curious minds.

Our **vision** is simple yet impactful:

> "For children to view the forecast while being immersed in a feature-rich environment focused on weather and climate education for adolescents."

## Features

Nimbus Navigator offers a wide array of features, making it not only a functional weather app but also a fun, educational resource:

- **Comprehensive Weather Data**: View temperature, air quality, condition forecast, hourly and 10-day high/low forecasts, precipitation, UV index, wind speeds, sunset time, humidity, visibility, moon phases, and atmospheric pressure.
- **Educational Content**: Information about weather sources and climate topics is accessible for children, making weather education interactive and age-appropriate.
- **Creative Imagery**: Engaging images are displayed based on weather conditions, adding an element of creativity and fun to the app. For devices that cannot generate images, a default set of images will be available.
- **User Authentication**: Secure user registration and login system.
- **Responsive Design**: Optimized for various devices to ensure a seamless user experience.
- **Interactive UI**: Visually appealing and easy-to-navigate interface with custom icons and images.

## Contributors

This project was developed by **Team 2 Nimbus Labs**:

| Team Member        | GitHub Username     | Email Address                |
|--------------------|---------------------|------------------------------|
| Logan Moser        | Lomo8349            | lomo8349@colorado.edu        |
| Grant Parker       | GrantPkr            | Grant.Parker@colorado.edu    |
| Max McClelland     | TheTrueProblematic  | Max.McClelland@colorado.edu  |
| Cooper Baugh       | Cimmerial           | Cooper.Baugh@colorado.edu    |
| Anja Delzell       | anja1051            | Anja.Delzell@colorado.edu    |

## Technology Stack

Nimbus Navigator is built using the following technologies:

- **Frontend**:
  - HTML5
  - CSS3
  - Handlebars.js (templating engine)
- **Backend**:
  - Node.js
  - Express.js (web framework)
- **Database**:
  - PostgreSQL
- **APIs and Libraries**:
  - National Weather Service API
  - FarmSense Moon Phase API
  - Axios (HTTP client)
  - Bcrypt.js (password hashing)
  - Express-Session (session management)
  - Zipcodes (ZIP code to latitude/longitude conversion)
- **Utilities**:
  - Docker (containerization)
  - Docker Compose

## Prerequisites

No prerequisites are needed to run the application locally. Docker will handle all necessary dependencies and configurations.

## Getting Started

### Running the Application Locally

To run Nimbus Navigator on your local machine, follow these steps:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/TheTrueProblematic/NimbusNavigator.git
   ```

2. **Navigate to the Main-Local Branch**

   ```bash
   cd NimbusNavigator
   git checkout main-local
   ```

3. **Start the Docker Containers**

   Ensure Docker is installed and running on your system. Then execute:

   ```bash
   sudo docker compose up
   ```

   This command will build and start the Docker containers defined in the `docker-compose.yml` file.

4. **Access the Application**

   Open your web browser and navigate to:

   ```
   http://localhost:3000
   ```

   You should now see the Nimbus Navigator application running locally.

### Running Tests

The tests are configured to run automatically upon starting the application. When you execute `sudo docker compose up`, the tests will initiate, ensuring that all components are functioning correctly.

## Deployment

Nimbus Navigator is deployed and accessible online. Visit the live application at:

- **[NimbusNavigator.net](https://nimbusnavigator.net)**

## Communication Plan

- **Team Communication**: Our primary method of communication is a **Snapchat group chat** where we discuss plans, ideas, and modifications for the app.
- **Weekly Meetings**: The team meets every **Thursday at noon** with our TA for in-person discussions. This meeting is followed by a team check-in to align our tasks and goals.

## Development Methodology

Nimbus Navigator is built using the **Agile methodology**, specifically following the **Extreme Programming (XP) framework**. Our development practices include:

- **Pair Programming**: Team members work in pairs to improve code quality and problem-solving.
- **Collective Code Ownership**: All team members contribute to the app's codebase, promoting collaboration and shared responsibility.
- **Communication and Collaboration**: Regular standups and discussions help keep development aligned and focused on team goals.

## Vision Statement

> "For children to view the forecast while being immersed in a feature-rich environment focused on weather and climate education for adolescents."