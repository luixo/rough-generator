import { random } from "@/utils/math";

// oxlint-disable-next-line typescript/no-non-null-assertion
export const randomElement = <T>(array: T[]): T => array[random(array.length)]!;
