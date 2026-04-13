export async function login({ email, password }) {
  if (!email || !password) {
    throw new Error('Debes completar correo y contraseña.');
  }

  const isAdmin = email.toLowerCase().includes('admin');
  const tokenPayload = {
    email,
    role: isAdmin ? 'admin' : 'vet',
    loggedAt: new Date().toISOString(),
  };

  const token = btoa(JSON.stringify(tokenPayload));

  return {
    access_token: token,
    token_type: 'bearer',
    user: {
      name: email.split('@')[0],
      email,
      role: tokenPayload.role,
    },
  };
}
