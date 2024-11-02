from pydantic import BaseModel, Field

from src.system.models import SystemNames


class SystemSchema(BaseModel):
    name: SystemNames = Field(description="The name of the system.", title="")
    value: str = Field(description="The value of the system.", title="")