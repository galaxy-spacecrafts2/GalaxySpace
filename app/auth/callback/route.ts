import { NextResponse } from 'next/server'

export const dynamic = 'force-static'
export const revalidate = false

// Generate static params for the route
export async function generateStaticParams() {
  return []
}

export async function GET() {
  // For static export, redirect to the main website
  return new Response(`
    <!DOCTYPE html>
    <html>
      <head>
        <meta http-equiv="refresh" content="0; url=https://galaxy-spacecrafts.vercel.app/community" />
        <script>
          window.location.href = 'https://galaxy-spacecrafts.vercel.app/community';
        </script>
      </head>
      <body>
        <p>Redirecting to Galaxy Spacecrafts community...</p>
      </body>
    </html>
  `, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}
