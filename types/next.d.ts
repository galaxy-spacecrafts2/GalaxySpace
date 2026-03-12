// Global type declarations for Next.js
declare module 'next/server' {
  export interface NextRequest {
    json(): Promise<any>;
    [key: string]: any;
  }
  
  export class NextResponse {
    static json(data: any, init?: ResponseInit): Response;
  }
}
