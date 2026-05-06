# Salary Management Tool

This repository contains a salary management application with:

- `salary-management-api`: Rails 7 API
- `salary-management-ui`: Next.js frontend

## Local Development

Backend:

```bash
cd salary-management-api
~/.rbenv/shims/bundle install
~/.rbenv/shims/bundle exec rails db:prepare
~/.rbenv/shims/bundle exec rails server -p 3000
```

Frontend:

```bash
cd salary-management-ui
npm install
npm run dev
```

## Default Local URLs

- Frontend: `http://localhost:3001`
- Backend API: `http://localhost:3000`

## Checks

Backend:

```bash
cd salary-management-api
~/.rbenv/shims/bundle exec rspec
```

Frontend:

```bash
cd salary-management-ui
npm run lint
npm test -- --runInBand
npm run build
```
