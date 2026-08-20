import Hashids from 'hashids'

export function generateId(index: number): string {
  const hashids = new Hashids(
    process.env.HASH_SECRET_KEY!,
    4,
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz',
  )

  const id = hashids.encode(index)

  return id
}
