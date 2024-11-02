from pydantic import BaseModel, Field


class PricePoolSchema(BaseModel):
    today: int = Field(description="Today's price pool", title="")
    jackpot: int = Field(description="Jackpot's price pool", title="")