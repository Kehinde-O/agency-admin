import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ 
    success: true, 
    data: { logs: [] },
    message: 'Approval logs endpoint - to be implemented'
  })
}