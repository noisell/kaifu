from typing import Annotated, Literal

from fastapi import Depends, HTTPException
from fastapi.security import APIKeyHeader
from fastapi.security.utils import get_authorization_scheme_param
from starlette.status import HTTP_401_UNAUTHORIZED, HTTP_400_BAD_REQUEST, HTTP_403_FORBIDDEN
from jwt import PyJWTError, ExpiredSignatureError, InvalidTokenError, DecodeError, InvalidSignatureError

from src.auth.service import decode_jwt
from src.schemas import get_error_responses, ErrorData, TokenPayload, AdminPayload
from src.uow import IUnitOfWork, UnitOfWork

UOWDepends = Annotated[IUnitOfWork, Depends(UnitOfWork)]
oauth2_scheme = APIKeyHeader(name="Authorization", scheme_name="JWTToken", auto_error=False)
error_description = {
    400: "Incorrect data.",
    401: "Unauthorized, all possible errors:\n\n"
         "1. The token is missing.\n"
         "2. The token has expired.\n"
         "3. Invalid token: invalid signature.\n"
         "4. Invalid token: decoding error.\n"
         "5. Invalid token: error unknown.\n"
         "6. The authentication scheme is incorrect. Bearer is required.\n",
        403: "Forbidden",
    404: "Not Found"
}

def responses(*errors: int | dict[int, str]):
    result = list()
    for error in errors:
        if type(error) is not dict:
            result.append(ErrorData(code=error, message=error_description.get(error)))
        else:
            result.append(*[ErrorData(code=code, message=message) for code, message in error.items()])
    return get_error_responses(result)


def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> TokenPayload:
    if token is None:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="The token is missing.")
    try:
        scheme, value = get_authorization_scheme_param(token)
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=HTTP_401_UNAUTHORIZED,
                detail="The authentication scheme is incorrect. Bearer is required."
            )
        if not value:
            raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="The token is missing.")
        payload = decode_jwt(value)
        if payload.get("user_id") is None or payload.get("banned") is None:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Incorrect data.")
        token_data = TokenPayload(**payload)
    except ExpiredSignatureError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="The token has expired.")
    except InvalidSignatureError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid token: invalid signature.")
    except DecodeError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid token: decoding error.")
    except InvalidTokenError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Invalid token: error unknown.")
    except PyJWTError:
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Forbidden")
    return token_data


def get_current_admin(token: Annotated[str, Depends(oauth2_scheme)]) -> AdminPayload:
    if token is None:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Отсутствует токен!")
    try:
        scheme, value = get_authorization_scheme_param(token)
        if scheme.lower() != "bearer":
            raise HTTPException(
                status_code=HTTP_401_UNAUTHORIZED,
                detail="Неправильная схема аутентификации. Требуется Bearer."
            )
        if not value:
            raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Отсутствует токен!")
        payload = decode_jwt(value)
        if payload.get("user_id") is None or payload.get("level") is None:
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Некорректные данные!")
        token_data = AdminPayload(**payload)
    except ExpiredSignatureError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Срок действия токена истек!")
    except InvalidSignatureError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Недопустимый токен: неправильная подпись")
    except DecodeError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Недопустимый токен: ошибка декодирования")
    except InvalidTokenError:
        raise HTTPException(status_code=HTTP_401_UNAUTHORIZED, detail="Недопустимый токен: ошибка неизвестна")
    except PyJWTError:
        raise HTTPException(status_code=HTTP_403_FORBIDDEN, detail="Отказано в доступе!")
    return token_data


class AdminLevelChecker:
    def __init__(self, required_level: int):
        self.required_level = required_level

    async def __call__(self, admin: Annotated[AdminPayload, Depends(get_current_admin)]):
        if admin.level < self.required_level:
            raise HTTPException(
                status_code=HTTP_403_FORBIDDEN,
                detail="Вам не доступна данная функция!"
            )
        return admin
