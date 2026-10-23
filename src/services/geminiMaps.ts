export interface CampusGuideResponse {
  text: string;
  mapLinks: Array<{ title: string; uri: string }>;
  error?: string;
}

export async function askCampusGuide(
  query: string,
  userLocation?: { latitude: number; longitude: number }
): Promise<CampusGuideResponse> {
  try {
    const res = await fetch('/api/campus-explore', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, userLocation }),
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Server responded with ${res.status}`);
    }

    return await res.json();
  } catch (err: any) {
    console.error('Campus guide error:', err);
    return {
      text: 'IET DAVV is situated on Khandwa Road, Indore. Academic blocks include M-Block (Main Block with LT1-4), E-Block (Computer & Electronics departments), Computer Center, Workshop, and the Central Library.',
      mapLinks: [
        {
          title: 'IET DAVV on Google Maps',
          uri: 'https://maps.google.com/?q=IET+DAVV+Indore',
        },
      ],
      error: err.message,
    };
  }
}
