import { NextRequest, NextResponse } from "next/server";
// Next.js middleware (like middleware.ts) runs on the Edge Runtime, which doesn't support jsonwebtoken. That's why jose is the recommended library for JWT in middleware.
import { jwtVerify } from "jose";


const jsonSecret = new TextEncoder().encode(process.env.ACCESS_TOKEN_SECRET);

async function verifyJWT(token?: string) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, jsonSecret);
    if (!payload) return null;
    return payload;
  } catch (error) {
    return null;
  }
}

export async function proxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;


  // Try to get next-auth token for o-auth user

  const accessToken = req.cookies.get("accessToken")?.value;
  
  if(!accessToken){
    const refreshToken = req.cookies.get("refreshToken")?.value;
    
    
    if(refreshToken) return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_SERVER_URI}/auth/refresh-tokens`))
  }

  const userIsAuthenticated = await verifyJWT(accessToken);
    


  const publicRoutes = [
    "/login",
    "/register",
  ];

  const protectedRoutes = [
    "/dashboard",
    "/tasks",
    "/projects",
    "/notes",
  ];

  function matchesRoute(list: string[], path: string) {
    return list.some((r) => path === r || path.startsWith(r + "/"));
  }

  const isPublic = matchesRoute(publicRoutes, pathname);
  const isProtected = matchesRoute(protectedRoutes, pathname);

  if (userIsAuthenticated && isPublic) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!userIsAuthenticated && isProtected) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
 
  
  return NextResponse.next();
}

export const config = {
  // "These are exception routes it also includes "/" or homepage of the application"
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|/|$).*)"],
}