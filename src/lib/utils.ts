import { primaryCategories } from "@farcaster/miniapp-sdk"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const METADATA = {
  name: "Base Polls",
  description: "Daily Base Polls, Surveys, and Votes on-chain and on Farcaster",
  imageUrl: "https://imgur.com/vvFlKW7",
  bannerImageUrl: 'https://imgur.com/vvFlKW7',
  iconImageUrl: 'https://imgur.com/a/KselwNG',
  homeUrl: process.env.NEXT_PUBLIC_URL ?? "https://base-polls.vercel.app/",
  splashBackgroundColor: "#FFFFFF",
  primaryCategory: ["primaryCategories.social"]
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
