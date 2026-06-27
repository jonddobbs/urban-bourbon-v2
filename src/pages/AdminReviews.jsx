import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

function StarRow({ rating }) {
  return (
    <div className="flex gap-0.5 ml-auto shrink-0">
      {[1, 2, 3, 4, 5].map(s => (
        <svg key={s} viewBox="0 0 24 24" width={14} height={14}>
          <polygon
            points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"
            fill={s <= rating ? '#39FF14' : 'none'}
            stroke={s <= rating ? '#39FF14' : '#2e2e2e'}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ))}
    </div>
  )
}

export default function AdminReviews() {
  const { user, signOut } = useAuth()
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleteError, setDeleteError] = useState(null)

  async function fetchAll() {
    setLoading(true)
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) console.error('[AdminReviews] fetch error:', error)
    setReviews(data ?? [])
    setLoading(false)
  }

  useEffect(() => { fetchAll() }, [])

  async function remove(id) {
    setDeleteError(null)
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id)
    if (error) {
      console.error('[AdminReviews] delete error:', error)
      setDeleteError('Delete failed — check the browser console for details.')
    } else {
      setReviews(prev => prev.filter(r => r.id !== id))
    }
  }

  return (
    <main className="min-h-screen bg-[#0d0d0d] px-5 sm:px-8 py-16">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-start justify-between mb-12 gap-4">
          <div>
            <h1 className="font-['Bebas_Neue'] text-[#39FF14] text-5xl tracking-[3px] leading-none">
              LIVE REVIEWS
            </h1>
            <p className="font-['Barlow_Condensed'] text-white/35 text-sm tracking-[0.2em] uppercase mt-2">
              All published reviews · {user?.email}
            </p>
          </div>
          <button
            onClick={() => signOut()}
            className="shrink-0 font-['Barlow_Condensed'] text-white/35 hover:text-white/70 text-sm tracking-[0.15em] uppercase transition-colors mt-1"
          >
            Sign out
          </button>
        </div>

        {deleteError && (
          <p className="font-['Barlow_Condensed'] text-red-400 text-sm tracking-wider mb-6">
            {deleteError}
          </p>
        )}

        {loading ? (
          <p className="font-['Inter'] text-white/30 text-sm">Loading…</p>
        ) : reviews.length === 0 ? (
          <div className="border border-[#39FF14]/15 px-8 py-14 text-center">
            <p className="font-['Bebas_Neue'] text-white/40 text-3xl tracking-[2px]">NO REVIEWS YET</p>
            <p className="font-['Inter'] text-white/25 text-sm mt-2">No reviews have been submitted yet.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {reviews.map(r => (
              <div key={r.id} className="bg-[#111111] border border-white/8 p-6 flex flex-col gap-4">

                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-['Bebas_Neue'] text-[#39FF14] text-lg tracking-[2px]">
                    {r.customer_name}
                  </span>
                  <span className="font-['Inter'] text-white/35 text-xs">{r.location}</span>
                  {r.product_id && (
                    <span className="font-['Barlow_Condensed'] text-white/25 text-xs tracking-[1px] uppercase">
                      #{r.product_id}
                    </span>
                  )}
                  <StarRow rating={r.rating} />
                </div>

                <p className="font-['Inter'] text-white/70 text-sm leading-relaxed">
                  &ldquo;{r.review_text}&rdquo;
                </p>

                <div className="flex items-center justify-between gap-4 pt-3 border-t border-white/5">
                  <span className="font-['Inter'] text-white/20 text-xs">
                    {new Date(r.created_at).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    })}
                  </span>
                  <button
                    onClick={() => remove(r.id)}
                    className="font-['Barlow_Condensed'] border border-red-500/40 text-red-400 text-sm tracking-[0.15em] uppercase px-6 py-2 rounded-sm hover:border-red-400 hover:text-red-300 transition-all duration-200"
                  >
                    DELETE
                  </button>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  )
}
