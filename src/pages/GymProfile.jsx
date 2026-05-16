import { useParams, Link } from 'react-router-dom'
import gyms from '../policies.json'
import DifficultyBadge from '../components/DifficultyBadge.jsx'

function InfoRow({ label, value }) {
  if (value == null || value === '') return null
  return (
    <div className="flex justify-between py-2 border-b border-slate-100 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-900 font-medium text-right max-w-xs">{value}</span>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="font-semibold text-slate-900 mb-3">{title}</h2>
      {children}
    </div>
  )
}

export default function GymProfile() {
  const { slug } = useParams()
  const gym = gyms.find(g =>
    (g.slug || g.gym_name?.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '')) === slug
  )

  if (!gym) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12 text-center">
        <p className="text-slate-500">Gym not found.</p>
        <Link to="/" className="text-slate-900 underline mt-2 inline-block">Back to all gyms</Link>
      </main>
    )
  }

  const cancellationMethods = Array.isArray(gym.cancellation_method)
    ? gym.cancellation_method.join(', ')
    : gym.cancellation_method

  const darkPatterns = gym.dark_pattern_flags || []
  const summary = gym.plain_english_summary || []

  return (
    <main className="max-w-2xl mx-auto px-4 py-6">
      <Link to="/" className="text-sm text-slate-500 hover:text-slate-700 inline-flex items-center gap-1 mb-4 no-underline">
        ← All gyms
      </Link>

      {/* Hero */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 mb-4">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{gym.gym_name}</h1>
            {gym.data_confidence && (
              <p className="text-xs text-slate-400 mt-1">
                Data confidence: {gym.data_confidence}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-xs text-slate-400 mb-1">Cancellation difficulty</p>
              <DifficultyBadge score={gym.difficulty_score} />
            </div>
            {gym.transparency_score != null && (
              <div className="text-right">
                <p className="text-xs text-slate-400 mb-1">Transparency</p>
                <span className="text-sm font-medium text-slate-700">{gym.transparency_score}/10</span>
              </div>
            )}
          </div>
        </div>

        {/* Plain English Summary */}
        {summary.length > 0 && (
          <div className="mt-4 bg-slate-50 rounded-lg p-4">
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-2">Plain English Summary</p>
            <ul className="space-y-1">
              {summary.map((line, i) => (
                <li key={i} className="text-sm text-slate-700 flex gap-2">
                  <span className="text-slate-400 mt-0.5">•</span>
                  {line}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Dark patterns */}
      {darkPatterns.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-5 mb-4">
          <h2 className="font-semibold text-red-800 mb-2">⚠️ Dark Patterns Detected</h2>
          <div className="flex flex-wrap gap-2">
            {darkPatterns.map(flag => (
              <span key={flag} className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full">
                {flag.replace(/_/g, ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Pricing */}
        <Section title="Pricing">
          <InfoRow label="Monthly price" value={gym.monthly_price ? `€${gym.monthly_price}` : null} />
          <InfoRow label="Joining fee" value={gym.joining_fee ? `€${gym.joining_fee}` : null} />
          <InfoRow label="Annual fee" value={gym.annual_fee ? `€${gym.annual_fee}` : null} />
          <InfoRow label="Early termination fee" value={gym.early_termination_fee ? `€${gym.early_termination_fee}` : null} />
          <InfoRow label="Pricing visible online" value={gym.pricing_visible_online != null ? (gym.pricing_visible_online ? 'Yes' : 'No') : null} />
        </Section>

        {/* Contract */}
        <Section title="Contract & Lock-in">
          <InfoRow label="Contract type" value={gym.contract_type} />
          <InfoRow label="Minimum term" value={gym.lock_in_months ? `${gym.lock_in_months} months` : null} />
          <InfoRow label="Auto-renewal" value={gym.auto_renewal != null ? (gym.auto_renewal ? 'Yes ⚠️' : 'No') : null} />
          <InfoRow label="Cooling-off period" value={gym.cooling_off_period_days ? `${gym.cooling_off_period_days} days` : null} />
        </Section>

        {/* Cancellation */}
        <Section title="Cancellation">
          <InfoRow label="Notice period" value={gym.notice_period_days ? `${gym.notice_period_days} days` : null} />
          <InfoRow label="Notice type" value={gym.notice_period_type} />
          <InfoRow label="Cancellation method" value={cancellationMethods} />
          <InfoRow label="In-person required" value={gym.in_person_required != null ? (gym.in_person_required ? 'Yes ⚠️' : 'No') : null} />
          <InfoRow label="Cancellation email" value={gym.cancellation_email} />
          <InfoRow label="Cancellation URL" value={gym.cancellation_url} />
          <InfoRow label="Terms easily found" value={gym.terms_easily_found != null ? (gym.terms_easily_found ? 'Yes' : 'No') : null} />
        </Section>

        {/* Freeze */}
        <Section title="Freeze / Pause">
          <InfoRow label="Freeze allowed" value={gym.freeze_allowed != null ? (gym.freeze_allowed ? 'Yes' : 'No') : null} />
          <InfoRow label="Freeze fee" value={gym.freeze_fee ? `€${gym.freeze_fee}` : null} />
          <InfoRow label="Max freeze duration" value={gym.max_freeze_months ? `${gym.max_freeze_months} months` : null} />
        </Section>
      </div>

      <p className="text-xs text-slate-400 text-center mt-6">
        Data extracted automatically from gym websites. Always verify directly with the gym.
      </p>
    </main>
  )
}
