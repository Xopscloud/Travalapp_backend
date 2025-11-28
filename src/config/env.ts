import 'dotenv/config';

function required(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable ${name}`);
  }
  return value;
}

export const env = {
  port: Number(process.env.PORT ?? 4000),
  mongoUri: required('MONGODB_URI'),
  jwtSecret: required('JWT_SECRET'),
  adminEmail: required('ADMIN_EMAIL').toLowerCase(),
  adminPassword: required('ADMIN_PASSWORD'),
  uploadRoot: process.env.UPLOAD_ROOT ?? '../Travalapp_frontend/public/uploads'
};
