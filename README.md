# Research Aggregator Scaffold

This project provides a minimal FastAPI application bundled with MindsDB MCP server. The app allows connecting research profile providers and querying data across them.

## Environment Variables

Set these variables in your environment or `.env` before running:

- `ORCID_CLIENT_ID` and `ORCID_CLIENT_SECRET` – OAuth credentials for your ORCID app.
- `ORCID_REDIRECT_URI` – callback URL registered with ORCID.
- `RESEARCHGATE_TOKEN` – scraping token or credentials for ResearchGate.
- `SCHOLAR_QUERY` – author query string for Google Scholar.

## OAuth App Registration

Register applications with each provider and obtain client IDs/secrets.
Refer to their documentation:

- [ORCID OAuth](https://info.orcid.org/documentation/integration-guide/) – create a public client.
- ResearchGate does not offer public OAuth; generate a token manually.
- Google Scholar access uses the `scholarly` package and may require external services like SerpAPI.

## Build and Run

```
docker-compose up --build
```

This command builds the FastAPI image and starts MindsDB and the app on a shared network.
Access the app at <http://localhost:8000>.

## Deploy

To deploy to `aigrantbuddy.com`, push this repository to your CI/CD pipeline
and run the same `docker-compose up --build` on the production server.
Ensure environment variables are provided in your deployment secrets store.
