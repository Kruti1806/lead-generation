from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database.database import engine, Base
from .routes import lead_routes, classify_routes

# Initialize Database
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Lead Automation System API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(lead_routes.router, tags=["Leads"])
app.include_router(classify_routes.router, tags=["Classification"])

@app.get("/")
def read_root():
    return {"message": "Lead Automation System API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
