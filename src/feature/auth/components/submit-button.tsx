import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

export default function SubmitButton({
  loading,
  children,
}: {
  loading: boolean
  children: React.ReactNode
}) {
  return (
    <Button
      type="submit"
      size="lg"
      disabled={loading}
      className="h-11 w-full text-sm font-semibold"
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}
