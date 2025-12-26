export const runtime = 'edge';

const twitchClientId = process.env.TWITCH_CLIENT_ID;
const twitchClientSecret = process.env.TWITCH_CLIENT_SECRET;
const twitchUserLogin = process.env.TWITCH_USER_LOGIN;

async function fetchAccessToken() {
  if (!twitchClientId || !twitchClientSecret) {
    throw new Error('Missing Twitch credentials');
  }

  const response = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${twitchClientId}&client_secret=${twitchClientSecret}&grant_type=client_credentials`,
    {
      method: 'POST',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch Twitch token');
  }

  const data = (await response.json()) as { access_token: string };
  return data.access_token;
}

export async function GET() {
  if (!twitchUserLogin) {
    return Response.json({ online: false });
  }

  try {
    const token = await fetchAccessToken();
    const streamResponse = await fetch(
      `https://api.twitch.tv/helix/streams?user_login=${twitchUserLogin}`,
      {
        headers: {
          'Client-Id': twitchClientId ?? '',
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!streamResponse.ok) {
      throw new Error('Failed to fetch Twitch status');
    }

    const data = (await streamResponse.json()) as {
      data: Array<{ title: string; user_name: string }>;
    };

    if (!data.data || data.data.length === 0) {
      return Response.json({ online: false });
    }

    const stream = data.data[0];
    return Response.json({
      online: true,
      title: stream.title,
      userName: stream.user_name,
    });
  } catch (error) {
    console.error(error);
    return Response.json({ online: false });
  }
}
