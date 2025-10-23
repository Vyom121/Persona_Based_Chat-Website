from fastapi import FastAPI, Request
from pydantic import BaseModel # define data json shape
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv
from Hitesh import get_response
from Piyush import get_piyush_response

load_dotenv()
PORT=os.getenv("PORT", 5000)

app=FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    role: str
    content:str
    persona:str


@app.post("/chat")
async def chat(request: ChatRequest):
    user_message=request.content
    persona=request.persona
    print(request.persona)
    if persona=="Hitesh Choudhary":
        response=get_response(user_message)
    if persona=="Piyush Garg":
        response=get_piyush_response(user_message)
    return {"message":response}

                