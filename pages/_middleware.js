import { NextResponse } from "next/server"

// This function can be marked `async` if using `await` inside
export function middleware(request) {
    // console.log(request.nextUrl.pathname)
  //return NextResponse.redirect(new URL('/about-2', request.url))
}

// See "Matching Paths" below to learn more
export const config = {
  // matcher: '*',
}