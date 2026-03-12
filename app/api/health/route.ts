// Mobile placeholder route
export const dynamic = 'force-static';
export const revalidate = false;

export function generateStaticParams() {
  return [];
}

export async function GET() {
  return Response.json({ 
    status: 'mobile-placeholder',
    message: 'API calls are handled by server' 
  });
}