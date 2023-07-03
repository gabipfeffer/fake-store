import { KeyboardEvent } from "react";

export function formatCCExpDate(event: KeyboardEvent<HTMLInputElement>) {
  const code = event.keyCode;
  const allowedKeys = [8];
  if (allowedKeys.indexOf(code) !== -1) {
    return;
  }
  // @ts-ignore
  event.target.value = event.target.value
    .replace(
      /^([1-9]\/|[2-9])$/g,
      "0$1/" // 3 > 03/
    )
    .replace(
      /^(0[1-9]|1[0-2])$/g,
      "$1/" // 11 > 11/
    )
    .replace(
      /^([0-1])([3-9])$/g,
      "0$1/$2" // 13 > 01/3
    )
    .replace(
      /^(0?[1-9]|1[0-2])([0-9]{2})$/g,
      "$1/$2" // 141 > 01/41
    )
    .replace(
      /^([0]+)\/|[0]+$/g,
      "0" // 0/ > 0 and 00 > 0
    )
    .replace(
      /[^\d\/]|^[\/]*$/g,
      "" // To allow only digits and `/`
    )
    .replace(
      /\/\//g,
      "/" // Prevent entering more than 1 `/`
    );
}

export function formatCCNumber(event: KeyboardEvent<HTMLInputElement>) {
  // @ts-ignore
  const v = event.target.value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || "";
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    // @ts-ignore
    event.target.value = parts.join(" ");
    // return parts.join(" ");
  } else {
    // @ts-ignore
    return event.target.value;
  }
}
