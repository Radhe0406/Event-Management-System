from pydantic import BaseModel

class BookingRequest(BaseModel):
    event_id: str
