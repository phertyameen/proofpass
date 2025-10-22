export async function GET() {
  const URL: any = process.env.NEXT_PUBLIC_URL;

  const manifest = {
    accountAssociation: {
      header:
        "eyJmaWQiOjExMDg5NjUsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHhGNUJBMTU3QjY1MDM4NDgxRjA2Y2JBMTBkYjU0MTIxQkJBOGVkMGQ2In0",
      payload: "eyJkb21haW4iOiJwcm9vZnBhc3MtcGkudmVyY2VsLmFwcCJ9",
      signature:
        "9waPyf+HI5+zbM6fvkAxKxpbSqEfCXXgx1i9bWfOpWgMKoYkgindPOyIL50MY8CDZAcy9IVlguPM3GT4fir1hhs=",
    },

    baseBuilder: {
      allowedAddresses: ["0x8e4EF324F09A58bd2EB67124927A168Cc964294a"],
    },
    miniapp: {
      version: "1",
      name: "ProofPass",
      homeUrl: URL,
      iconUrl: `${URL}/icon.png`,
      splashImageUrl: `${URL}/splash.png`,
      splashBackgroundColor: "#10b981",
      webhookUrl: `${URL}/api/webhook`,
      subtitle: "Blockchain Event Verification",
      description:
        "A secure way to verify event attendance using blockchain technology. Create events, generate QR codes, and issue verifiable proof of attendance NFTs.",
      screenshotUrls: [
        `${URL}/screenshot1.png`,
        `${URL}/screenshot2.png`,
        `${URL}/screenshot3.png`,
      ],
      primaryCategory: "social",
      tags: ["events", "blockchain", "verification", "nft", "attendance"],
      heroImageUrl: `${URL}/hero.png`,
      tagline: "Verify attendance instantly",
      ogTitle: "ProofPass - Event Verification",
      ogDescription: "Blockchain-based event attendance verification system",
      ogImageUrl: `${URL}/og-image.png`,
      noindex: false,
    },
  };

  return Response.json(manifest);
}
