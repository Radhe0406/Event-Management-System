import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import {
  TicketIcon,
  CalendarDaysIcon,
  MapPinIcon,
  CheckBadgeIcon,
  RocketLaunchIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function MyBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) throw new Error('Not authenticated')

      const res = await fetch(`${API_URL}/my-bookings`, {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      })

      if (!res.ok) {
        throw new Error('Failed to fetch bookings')
      }

      const data = await res.json()
      setBookings(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr) => {
    try {
      return format(new Date(dateStr), 'EEE, MMM d, yyyy • h:mm a')
    } catch {
      return dateStr
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen relative pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      {/* Floating Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />

      <div className="max-w-4xl mx-auto">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25">
              <TicketIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="font-heading text-3xl font-bold text-white">My Bookings</h1>
              <p className="text-sm text-slate-400">
                {bookings.length} booking{bookings.length !== 1 ? 's' : ''} total
              </p>
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="flex gap-5">
                  <div className="skeleton w-24 h-24 rounded-xl flex-shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="skeleton h-6 w-2/3 rounded-lg" />
                    <div className="skeleton h-4 w-1/2 rounded-lg" />
                    <div className="skeleton h-4 w-1/3 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass-card p-8 text-center"
          >
            <p className="text-red-400 mb-4">{error}</p>
            <button onClick={fetchBookings} className="btn-secondary inline-flex items-center gap-2">
              <ArrowPathIcon className="w-4 h-4" />
              Try Again
            </button>
          </motion.div>
        )}

        {/* Bookings List */}
        {!loading && !error && bookings.length > 0 && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {bookings.map((booking) => (
              <motion.div
                key={booking.id}
                variants={itemVariants}
                whileHover={{ y: -2 }}
                className="glass-card p-5 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row gap-5">
                  {/* Event Image */}
                  <div className="relative w-full sm:w-28 h-32 sm:h-28 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={
                        booking.events?.image_url ||
                        'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400'
                      }
                      alt={booking.events?.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0b1a]/60 to-transparent" />
                  </div>

                  {/* Booking Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="space-y-2.5">
                        <h3 className="font-heading text-lg font-bold text-white leading-tight">
                          {booking.events?.title || 'Event'}
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <CalendarDaysIcon className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                          <span>{formatDate(booking.events?.event_date)}</span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-slate-300">
                          <MapPinIcon className="w-4 h-4 text-purple-400 flex-shrink-0" />
                          <span>{booking.events?.location || 'TBD'}</span>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 self-start">
                        <CheckBadgeIcon className="w-4 h-4 text-emerald-400" />
                        <span className="text-sm font-semibold text-emerald-400 capitalize">
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    {/* Booking Meta */}
                    <div className="mt-3 pt-3 border-t border-white/5">
                      <span className="text-xs text-slate-500">
                        Booked on {formatDate(booking.booked_at)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && !error && bookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card max-w-lg mx-auto p-12 text-center"
          >
            <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
              <RocketLaunchIcon className="w-10 h-10 text-indigo-400" />
            </div>
            <h3 className="font-heading text-xl font-bold text-white mb-3">No Bookings Yet</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              You haven't booked any events yet. Explore our upcoming events and find something exciting!
            </p>
            <Link to="/" className="btn-primary inline-flex items-center gap-2">
              Browse Events
              <ArrowPathIcon className="w-4 h-4" />
            </Link>
          </motion.div>
        )}
      </div>
    </div>
  )
}
