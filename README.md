# Gaby's Burgers — Customer Frontend

Gaby's Burgers' public landing page, a web platfrom to consult the menu, and make  
orders for fast delivery burgers and other kinds of food

## Features
- Dynamic menu that consumes a REST API
- Products ordered by categories
- Dynamic products and extras
- Dynamic delivery locations
- Order form
- Form validation
- Stock control
- Whatsapp integration
- Responsive design
- Basic accesibility
- Animations and reduced-motion
- Loading, error and empty states
- Automatic unit testing for utils pricing functions

## Tech Stack
- React
- Vite
- Tailwind CSS
- TanStack Query
- React Hook Form
- Framer Motion

## Architecture

The web is organized by responsibilities:

src/
|--- api/
|--- assets/
|--- components/
|--- config/
|--- contexts/
|--- data/
|--- hooks/
|--- utils/
|--- tests/

### Data flow

The customer frontend consumes products, extras, and delivery locations from the backend through implementing TanStack Query.

React Hook Form handles the order form state and validation.

The backend is responsible of persisting state and handling business logic.

## Environment Variables

Create a ".env" file based on ".env.example"

Example:

VITE_API_URL = 
VITE_CURRENCY = 
VITE_LOCALE = 

## Getting Started

### Requirements

- Node.js
- pnpm

### Installation

```bash
pnpm install
```

### Development 

```bash
pnpm dev
```
### Production build

```bash
pnpm build
```
### Preview

```bash
pnpm preview
```

### Testing

```bash
pnpm run test
```

## Known Limitations

- More unit tests could be further implemented.
- Typescript migration is planned.
- Production observability is limited.

## Live Demo

Customer Website: (pending screenshots)