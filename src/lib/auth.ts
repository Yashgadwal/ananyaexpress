const JWT_SECRET = process.env.JWT_SECRET || 'ananya-secret-key-change-in-production-12345';

function encode(str: string) {
  return new TextEncoder().encode(str);
}

function base64url(arr: Uint8Array) {
  return btoa(String.fromCharCode(...arr))
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64urlDecode(str: string) {
  let s = str.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  const binary = atob(s);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function signJWT(payload: any, secret = JWT_SECRET): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64url(encode(JSON.stringify(header)));
  // Add expiration (default 24 hours if not set)
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 24 * 60 * 60; // 24 hours
  const fullPayload = { ...payload, iat, exp };
  
  const encodedPayload = base64url(encode(JSON.stringify(fullPayload)));
  const tokenInput = `${encodedHeader}.${encodedPayload}`;
  
  const key = await crypto.subtle.importKey(
    'raw',
    encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encode(tokenInput)
  );
  
  const encodedSignature = base64url(new Uint8Array(signature));
  return `${tokenInput}.${encodedSignature}`;
}

export async function verifyJWT(token: string, secret = JWT_SECRET): Promise<any | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const tokenInput = `${encodedHeader}.${encodedPayload}`;
    
    const key = await crypto.subtle.importKey(
      'raw',
      encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const signatureBytes = base64urlDecode(encodedSignature);
    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      signatureBytes,
      encode(tokenInput)
    );
    
    if (!isValid) return null;
    
    const payloadStr = new TextDecoder().decode(base64urlDecode(encodedPayload));
    const payload = JSON.parse(payloadStr);
    
    // Check expiration
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      return null;
    }
    
    return payload;
  } catch (error) {
    return null;
  }
}
