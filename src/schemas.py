from typing import Any, Literal, Type

from pydantic import BaseModel, Field


class TokenPayload(BaseModel):
    user_id: int
    banned: bool


class AdminPayload(BaseModel):
    user_id: int
    level: int


class ErrorData(BaseModel):
    code: int
    message: str

error_description = {400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found"}

def get_error_schema(message: str):
    class ErrorResp(BaseModel):
        detail: str = Field(description=message, title="", examples=[message.split(";")[0]])
    return ErrorResp.schema()

def get_error_responses(
        errors: list[ErrorData]
) -> dict[int, dict[str, str | dict[str, dict[str, Type[BaseModel]]]]]:
    result = dict()
    for error in errors:
        result[error.code] = {
            "description": error_description.get(error.code),
            "content": {"application/json": {"schema": get_error_schema(error.message)}}
        }
    return result