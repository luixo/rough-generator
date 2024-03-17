import { randomElement } from "@/utils/array";

const PALETTE = ["#3292ff", "#fba765", "#d8a723", "#bb54a8"];

export const getRandomColor = () => randomElement(PALETTE);
