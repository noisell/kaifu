from datetime import datetime, UTC, timedelta
from decimal import Decimal, ROUND_FLOOR


def split_and_add(number: str, system_bank: str) -> tuple[int, float]:
  number_dec = Decimal(number)
  other_number_dec = Decimal(system_bank)
  integer_part = number_dec.quantize(Decimal("1"), rounding=ROUND_FLOOR)
  fractional_part = number_dec - integer_part
  return int(integer_part), float(other_number_dec + fractional_part)


def get_next_30_days():
  utc_now = datetime.now(UTC)
  return [(utc_now + timedelta(days=i)).date() for i in range(30)]