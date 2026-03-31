import { NextResponse } from 'next/server'

export const ok = <T>(data: T, message?: string) =>
  NextResponse.json({ success: true, data, message }, { status: 200 })

export const created = <T>(data: T) =>
  NextResponse.json({ success: true, data }, { status: 201 })

export const badRequest = (error: string) =>
  NextResponse.json({ success: false, error }, { status: 400 })

export const unauthorized = () =>
  NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

export const forbidden = () =>
  NextResponse.json({ success: false, error: 'Forbidden' }, { status: 403 })

export const notFound = (resource = 'Resource') =>
  NextResponse.json({ success: false, error: `${resource} not found` }, { status: 404 })

export const serverError = (error?: unknown) => {
  console.error('[SERVER_ERROR]', error)
  return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
}
