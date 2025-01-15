# HackSpace

###### !!! Welcome to HackSpace !!!! 
**HackSpace** is a comprehensive hackathon management platform built using the MERN stack (MongoDB, Express.js, React, and Node.js). It streamlines the organization and participation processes for hackathons, providing features like event creation, team registration, project submission, real-time updates, and judging workflows. HackSpace is designed to foster collaboration, enhance participant experience, and simplify administrative tasks for organizers, making it the ultimate hub for hackathon enthusiasts.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Installation

To install this project, follow these steps:

1. Clone the repository:
    ```bash
    git clone https://github.com/SWESH1K/HackSpace.git
    ```
2. Navigate to the project directory:
    ```bash
    cd HackSpace
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```
4. Naviagate to the frontend directory:
    ```bash
    cd frontend
    ```
5. Install the frontend dependencies:
    ```bash
    npm install
    ```

## Usage

##### Set-Up Enivronmental Variables

***NOTE***: To run this website in any environment, you need to first setup some *Environmental_Variables* in `.env` file. The `.env` file should contain the following variables:

*MONGO_URI* = "Uri of the MongoDB Server"
*SECRET* = "Secret key to encrypt while authenication"
*BASEURL* = "Base URL of the website"
*CLIENTID* = "Client ID of the Auth0 authentication"
*ISSUER* = "Issuer link of the Auth0 authentication"

The values of these *Environmental Variables* are not pushed to GitHub to maintain security. Create your own `MongoDB Server` and `Auth0` authenticator and fill the values of the above variables. The website will not run locally if the any of the above `env variables` are not set properly.

To run this project in **Development** environment, follow these steps:

1. Open two terminals:
i, First in the `HackSpace` directory
ii, Second in the `HackSpace/frontend` directory

2. Run the following command in both the terminals.
    ```bash
    npm run dev
    ```

3. Open the link `http://localhost:5173/` in your browser for the frontend.

To run this project in **Production** environment, follow these steps:

1. Open the terminal in `HackSpace` directory.
2. Run the command to build the project.
    ```bash
    npm run build
    ```
3. Run the command to start the project.
    ```bash
    npm run start
    ```
4. Open the link `http://localhost:5000` in your project to view the website.

## Contributing

We welcome contributions! Please follow these steps to contribute:

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature/YourFeature
    ```
3. Make your changes and commit them:
    ```bash
    git commit -m "Add your feature"
    ```
4. Push to the branch:
    ```bash
    git push origin feature/YourFeature
    ```
5. Create a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or suggestions, feel free to contact us at [vagalamsweshikreddy@gmail.com].

Thank you for using HackSpace!