import { useState } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import toast from 'react-hot-toast'
import {
  CalendarDaysIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  TicketIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function EventCard({ event, session, onBooked }) {
  const [loading, setLoading] = useState(false)
  const [seats, setSeats] = useState(event.available_seats)
  const [booked, setBooked] = useState(false)

  const formattedDate = (() => {
    try {
      return format(new Date(event.event_date), 'EEE, MMM d, yyyy • h:mm a')
    } catch {
      return event.event_date
    }
  })()

  const seatsLow = seats < 10
  const soldOut = seats <= 0

  const handleBook = async () => {
    if (!session) {
      toast.error('Please sign in to book a ticket')
      return
    }

    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ event_id: event.id }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.detail || 'Booking failed')
      }

      setSeats((prev) => prev - 1)
      setBooked(true)
      toast.success(`🎉 ${data.message}`)
      if (onBooked) onBooked()
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -6 }}
      className="glass-card overflow-hidden group"
    >
      {/* Image Section */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={event.image_url || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800'}
          alt={event.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0f0b1a] via-[#0f0b1a]/40 to-transparent" />

        {/* Price Badge */}
        <div className="absolute top-4 right-4">
          <div className="glass px-3 py-1.5 rounded-full flex items-center gap-1">
            <CurrencyRupeeIcon className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-semibold text-white">
              {parseFloat(event.price).toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Seats Badge */}
        <div className="absolute top-4 left-4">
          <div
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 text-xs font-semibold ${
              soldOut
                ? 'bg-red-500/80 text-white'
                : seatsLow
                ? 'bg-amber-500/80 text-white seats-low'
                : 'glass text-emerald-300'
            }`}
          >
            <TicketIcon className="w-3.5 h-3.5" />
            {soldOut ? 'Sold Out' : `${seats} seats left`}
          </div>
        </div>

        {/* Booked Overlay */}
        {booked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-emerald-500/20 backdrop-blur-sm flex items-center justify-center"
          >
            <div className="bg-emerald-500/90 text-white px-6 py-3 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/30">
              ✓ Booked!
            </div>
          </motion.div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-5 space-y-4">
        {/* Title */}
        <h3 className="font-heading text-xl font-bold text-white leading-tight line-clamp-2 group-hover:text-indigo-200 transition-colors duration-300">
          {event.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-slate-400 leading-relaxed line-clamp-2">
          {event.description}
        </p>

        {/* Meta Info */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-2.5 text-sm text-slate-300">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
              <CalendarDaysIcon className="w-4 h-4 text-indigo-400" />
            </div>
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-2.5 text-sm text-slate-300">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center flex-shrink-0">
              <MapPinIcon className="w-4 h-4 text-purple-400" />
            </div>
            <span>{event.location}</span>
          </div>
        </div>

        {/* Book Button */}
        <div className="pt-2">
          {booked ? (
            <button
              disabled
              className="w-full py-3 rounded-xl font-semibold text-sm bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 cursor-default"
            >
              ✓ Booking Confirmed
            </button>
          ) : soldOut ? (
            <button
              disabled
              className="w-full py-3 rounded-xl font-semibold text-sm bg-red-500/10 text-red-400 border border-red-500/20 cursor-not-allowed"
            >
              Sold Out
            </button>
          ) : (
            <button
              onClick={handleBook}
              disabled={loading || !session}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all duration-300 ${
                !session
                  ? 'bg-white/5 text-slate-400 border border-white/10 cursor-not-allowed'
                  : 'btn-primary !rounded-xl'
              }`}
              title={!session ? 'Sign in to book tickets' : ''}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <ArrowPathIcon className="w-4 h-4 animate-spin" />
                  Booking...
                </span>
              ) : !session ? (
                '🔒 Sign in to Book'
              ) : (
                'Book Ticket →'
              )}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
