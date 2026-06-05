import os
import json
from anthropic import Anthropic
from dotenv import load_dotenv

load_dotenv()

class LLMService:
    def __init__(self):
        self.api_key = os.getenv("ANTHROPIC_API_KEY")
        if self.api_key:
            self.client = Anthropic(api_key=self.api_key)
        else:
            self.client = None

    def classify_and_reply(self, message: str):
        """
        Classifies the lead based on the message and generates a suggested reply.
        Returns: {classification: 'Hot'|'Warm'|'Cold', suggested_reply: str}
        """
        if not self.client:
            # Mock implementation if API key is missing
            return self._mock_classification(message)

        prompt = f"""
        You are a lead qualification assistant for Founder's Vibe.
        Classify leads based on the user's message text as "Hot", "Warm", or "Cold".
        
        Rules:
        - HOT: Ready to buy, has specific budget/timeline, wants meeting, high urgency.
        - WARM: Interested, researching, asking for brochure/details, curious.
        - COLD: Spam, generic greeting (just "hello"), "unsubscribe", or no clear intent.
        
        Also, generate a 1-2 sentence personalized suggested reply for this lead.
        
        Lead Message: "{message}"
        
        Return ONLY a JSON object with this exact structure:
        {{
            "classification": "Hot" | "Warm" | "Cold",
            "suggested_reply": "string"
        }}
        """

        try:
            response = self.client.messages.create(
                model="claude-3-haiku-20240307",
                max_tokens=1024,
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            content = response.content[0].text
            result = json.loads(content)
            return result
        except Exception as e:
            print(f"Error calling Anthropic API: {e}")
            return self._mock_classification(message)

    def _mock_classification(self, message: str):
        """Simple rule-based fallback if API is unavailable."""
        msg = message.lower()
        if any(word in msg for word in ["budget", "call", "asap", "now", "buy", "onboard"]):
            return {"classification": "Hot", "suggested_reply": "That sounds great! I've scheduled a quick call for us to discuss the details. Are you available tomorrow?"}
        elif any(word in msg for word in ["how", "info", "details", "price", "cost", "more"]):
            return {"classification": "Warm", "suggested_reply": "Thanks for your interest! I'd love to share more details about our automation services. Would you like a brochure?"}
        else:
            return {"classification": "Cold", "suggested_reply": "Hello! Thank you for reaching out. Let us know if you have any questions."}

llm_service = LLMService()
