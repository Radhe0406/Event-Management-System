import os
from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI, BackgroundTasks, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client, Client
from auth import verify_token
from models import BookingRequest
from email_service import send_booking_confirmation

app = FastAPI(title="Event Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_supabase() -> Client:
    return create_client(
        os.getenv("SUPABASE_URL"),
        os.getenv("SUPABASE_SERVICE_ROLE_KEY")
    )

@app.get("/health")
def health():
    return {"status": "ok"}

@app.post("/book")
def book_ticket(
    request: BookingRequest,
    background_tasks: BackgroundTasks,
    payload: dict = Depends(verify_token)
):
    supabase = get_supabase()
    user_id = payload.get("sub")
    user_email = payload.get("email")

    # Fetch event
    event_resp = supabase.table("events").select("*").eq("id", request.event_id).single().execute()
    if not event_resp.data:
        raise HTTPException(status_code=404, detail="Event not found")

    event = event_resp.data
    if event["available_seats"] <= 0:
        raise HTTPException(status_code=400, detail="No seats available")

    # Check for duplicate booking
    existing = supabase.table("bookings") \
        .select("id") \
        .eq("user_id", user_id) \
        .eq("event_id", request.event_id) \
        .execute()
    if existing.data:
        raise HTTPException(status_code=409, detail="You have already booked this event")

    # Decrement available_seats
    supabase.table("events") \
        .update({"available_seats": event["available_seats"] - 1}) \
        .eq("id", request.event_id) \
        .execute()

    # Insert booking record
    supabase.table("bookings").insert({
        "user_id": user_id,
        "event_id": request.event_id,
        "status": "confirmed"
    }).execute()

    # Fetch user profile for name
    profile_resp = supabase.table("profiles").select("full_name").eq("id", user_id).single().execute()
    user_name = profile_resp.data.get("full_name", "Guest") if profile_resp.data else "Guest"

    # Send confirmation email in background
    background_tasks.add_task(
        send_booking_confirmation,
        to_email=user_email,
        user_name=user_name,
        event_title=event["title"],
        event_date=str(event["event_date"]),
        event_location=event["location"]
    )

    return {"message": "Booking confirmed!", "event": event["title"]}

@app.get("/my-bookings")
def get_my_bookings(payload: dict = Depends(verify_token)):
    supabase = get_supabase()
    user_id = payload.get("sub")
    result = supabase.table("bookings") \
        .select("*, events(title, event_date, location, image_url)") \
        .eq("user_id", user_id) \
        .execute()
    return result.data
