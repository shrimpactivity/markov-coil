import { MarkovCoil } from "./MarkovCoil";
import { decode } from "@msgpack/msgpack";

export function deserialize(
  data:
    | Uint8Array
    | string
    | ArrayBufferLike
    | ArrayLike<number>
    | ArrayBufferView<ArrayBufferLike>
): MarkovCoil {
  return decode(data as ArrayBufferLike) as MarkovCoil;
}
