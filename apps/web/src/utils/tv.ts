import { createTV } from "tailwind-variants";
export type { VariantProps, ClassValue } from "tailwind-variants";

import { twMergeConfig } from "@/lib/utils";

export const tv = createTV({
  twMergeConfig,
});
