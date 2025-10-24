export async function GET() {
  const URL =
    (process.env.NEXT_PUBLIC_URL as string) ||
    "https://proofpass-pi.vercel.app/";

  const manifest = {
    accountAssociation: {
      header: "",
      payload: "",
      signature: "",
    },

    baseBuilder: {
      allowedAddresses: [""],
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
