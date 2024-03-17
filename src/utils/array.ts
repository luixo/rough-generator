import { random } from "@/utils/math";

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const randomElement = <T>(array: T[]): T => array[random(array.length)]!;
