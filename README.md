# Lead Automation System

An automated lead qualification platform that ingests leads from various sources, classifies them using AI (Claude), and provides a management dashboard for sales teams.

## Architecture

```text
Google Sheet / CSV / API
        |
        v
      n8n (Automation Workflow)
        |
        v
POST /lead (FastAPI Backend)
        |
        +---- SQLite (Persistence)
        |
        +---- Anthropic Claude API (Classification & Reply Gen)
        |
        v
GET /leads (FastAPI Backend)
        |
        v
Next.js Dashboard (Frontend)
        |
        +---- Filter Leads (Hot/Warm/Cold)
        +---- Mark as Contacted
```

## Features

- **Automated Lead intake**: Connects to Google Sheets via n8n.
- **AI Classification**: Automatically labels leads as **Hot**, **Warm**, or **Cold** based on message intent.
- **Personalized Replies**: Generates 1-2 sentence replies using Claude 3.5.
- **Real-time Dashboard**: A clean Next.js interface to manage and filter leads.
- **Status Tracking**: Mark leads as contacted to manage the sales pipeline.

## Tech Stack

- **Backend**: FastAPI, SQLAlchemy, SQLite, Anthropic SDK.
- **Frontend**: Next.js, Tailwind CSS, Lucide React.
- **Automation**: n8n.
- **AI**: Anthropic Claude 3.5 Haiku.

## How to Run

### 1. Backend
```bash
cd backend
# Create a .env file with your ANTHROPIC_API_KEY
pip install -r requirements.txt
python -m app.main
```

### 2. Frontend
```bash
cd frontend
npm install
npm run dev
```

### 3. Automation
- Import `automation/n8n-workflow.json` into your n8n instance.
- Update the Google Sheet ID and API URL as needed.

## Tradeoffs & Decisions

- **SQLite**: Chosen for its lightness and zero-configuration requirement for this assignment.
- **Claude 3 Haiku**: Used for its speed and cost-effectiveness in classification tasks.
- **CORS**: Enabled for all origins for ease of local development.
- **No-Code + Python**: n8n handles the "messy" ingress logic (polling sheets, webhooks), while Python handles the core business logic and AI, providing a scalable "glue" architecture.

## Future Improvements

- **Authentication**: Add JWT-based login for sales representatives.
- **Email Integration**: Send the suggested reply automatically via SendGrid or SMTP.
- **Analytics**: Add a dashboard showing conversion rates from Cold to Hot.
- **CRM Sync**: Push 'Hot' leads directly into Salesforce or HubSpot.
