export async function getWalletFromFID(fid: string): Promise<string | null> {
  try {
    const res = await fetch(`https://api.neynar.com/v2/farcaster/user/bulk?fids=${fid}`, {
      headers: {
        accept: "application/json",
        api_key: process.env.NEXT_PUBLIC_NEYNAR_API_KEY || "",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch user data from Neynar");

    const data = await res.json();
    const wallet = data?.users?.[0]?.verifications?.[0] || null;

    console.log("Resolved wallet from FID:", wallet);
    return wallet;
  } catch (err) {
    console.error("Error resolving wallet from Neynar:", err);
    return null;
  }
}
