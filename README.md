# Bioskop Udilovic

A comprehensive movie management application created by Jovan Udilovic.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 16.x or higher)
- npm (Node Package Manager)
- Angular CLI (`npm install -g @angular/cli`)

## Project Setup

1. Clone the repository:
```bash
git clone [repository-url]
cd bioskop-udilovic
```

2. Install dependencies:
```bash
npm install
```

If you encounter any peer dependency issues, use the legacy peer deps flag:
```bash
npm install --legacy-peer-deps
```

## Development server

To start a local development server, run:

```bash
ng serve
```

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload when you make changes to the source files.

## Build

To build the project for production:

```bash
ng build
```

The build artifacts will be stored in the `dist/` directory.

## Testing

### Running unit tests

Execute unit tests via [Karma](https://karma-runner.github.io):

```bash
ng test
```

### Running end-to-end tests

Run end-to-end tests:

```bash
ng e2e
```

Note: You'll need to set up an e2e testing framework of your choice.

## Common Issues and Solutions

1. Peer Dependency Issues:
   - If you encounter peer dependency conflicts, use:
   ```bash
   npm install --legacy-peer-deps
   ```

2. Angular CLI Issues:
   - Try clearing npm cache:
   ```bash
   npm cache clean --force
   ```
   - Reinstall Angular CLI:
   ```bash
   npm uninstall -g @angular/cli
   npm install -g @angular/cli
   ```

## Project Structure

- `src/app/` - Main application code
- `src/assets/` - Static assets (images, icons, etc.)
- `src/environments/` - Environment configuration files

## Features

- Movie browsing and search
- User authentication
- Movie details and information
- Responsive design


## Technologies Used

- Angular 19.2.1
- TypeScript
- Bootstrap

## Jovan Udilovic

Created by Jovan Udilovic

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support or questions, please [create an issue](repository-issues-url) or contact the maintainer.
