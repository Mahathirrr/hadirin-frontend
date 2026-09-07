function bufferToBase64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (const b of bytes) binary += String.fromCharCode(b)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function serializeRegistrationCredential(credential: PublicKeyCredential): Record<string, unknown> {
  const response = credential.response as AuthenticatorAttestationResponse
  return {
    id: credential.id,
    rawId: bufferToBase64url(credential.rawId),
    type: credential.type,
    response: {
      clientDataJSON: bufferToBase64url(response.clientDataJSON),
      attestationObject: bufferToBase64url(response.attestationObject),
    },
  }
}

export async function createPasskey(options: PublicKeyCredentialCreationOptions): Promise<Record<string, unknown>> {
  if (!window.PublicKeyCredential) {
    throw new Error('Browser tidak mendukung WebAuthn/passkey')
  }
  const credential = (await navigator.credentials.create({ publicKey: options })) as PublicKeyCredential | null
  if (!credential) throw new Error('Registrasi passkey dibatalkan')
  return serializeRegistrationCredential(credential)
}
