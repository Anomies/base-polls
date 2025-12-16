import { METADATA } from "../../../lib/utils";

export async function GET() {
  const config = {
    accountAssociation: {
      header:
        "eyJmaWQiOjY2NzM3MSwidHlwZSI6ImF1dGgiLCJrZXkiOiIweEFFQjk5NERlQ2IyZDkzRjMwN0RhRTdFZTdGYWE2MUZkODcxNzJjREMifQ",
      payload: "eyJkb21haW4iOiJiYXNlLXBvbGxzLnZlcmNlbC5hcHAifQ",
      signature:
        "v3yPpnmxDjUmzqE1hjkaP1axBhusiBbeCIT2wqFzLb9LUTyDH5UROaDcLpUEhpWuEUUC5pjRrAB/YtQO3lxGhRs=",
    },
      "frame": {
        "version": "1",
        "name": METADATA.name,
        "iconUrl": METADATA.iconImageUrl,
        "homeUrl": METADATA.homeUrl,
        "imageUrl": METADATA.bannerImageUrl,
        "splashImageUrl": METADATA.iconImageUrl,
        "splashBackgroundColor": METADATA.splashBackgroundColor,
        "description": METADATA.description,
        "ogTitle": METADATA.name,
        "ogDescription": METADATA.description,
        "ogImageUrl": METADATA.bannerImageUrl,
        "requiredCapabilities": [
          "actions.ready",
          "actions.signIn", 
          "actions.openMiniApp",
          "actions.openUrl",
          "actions.sendToken",
          "actions.viewToken", 
          "actions.composeCast",
          "actions.viewProfile",
          "actions.setPrimaryButton",
          "actions.swapToken",
          "actions.close",
          "actions.viewCast",
          "wallet.getEthereumProvider"
        ],
        "requiredChains": [
          "eip155:8453",
          "eip155:10"
        ],
        "canonicalDomain": "https://base-polls.vercel.app/",
        "noindex": false,
        "tags": ["base", "baseapp", "miniapp", "poll", "basepolls"]
      },
      "baseBuilder": {
        "allowedAddresses": ["0x530a7dd97DDFB463bEb8f918852a9870f94d598f"],
      }
  };

  return Response.json(config);
}
