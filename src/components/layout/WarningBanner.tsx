import { useJob } from '../../app/providers'
import { AlertIcon } from '../ui/icons'

export function WarningBanner() {
  const result = useJob().result
  if (!result) return null
  return <div className="warning-stack">{result.warnings?.map((warning, index) => <div className={`warning ${warning.severity}`} key={`${warning.message}-${index}`}><AlertIcon />{warning.message}</div>)}{result.from_cache && <div className="cache-note">Cached result from {result.generated_at ?? 'an earlier run'}</div>}</div>
}
