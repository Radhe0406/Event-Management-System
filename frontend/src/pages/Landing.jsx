import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'
import { motion } from 'framer-motion'
import EventCard from '../components/EventCard'
import {
  SparklesIcon,
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline'

export default function Landing() {
  const [events, setEvents] = useState([])
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('event_date', { ascending: true })

      if (error) throw error
      setEvents(data || [])
    } catch (err) {
      console.error('Error fetching events:', err)
    } finally {
      setLoading(false)
    }
  }

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (event.description && event.description.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="min-h-screen relative">
      {/* Floating Orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-indigo-300 mb-8"
          >
            <SparklesIcon className="w-4 h-4" />
            <span>Your gateway to extraordinary experiences</span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6"
          >
            <span className="text-white">Discover & Book</span>
            <br />
            <span className="gradient-text-hero">Amazing Events</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            From tech summits to creative workshops — find your next unforgettable
            experience and secure your spot instantly.
          </motion.p>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="max-w-xl mx-auto relative"
          >
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search events by name, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="glass-input !pl-12 !py-4 !rounded-2xl !text-base"
              />
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
            className="flex items-center justify-center gap-8 mt-12"
          >
            <div className="text-center">
              <div className="text-2xl font-bold text-white font-heading">{events.length}+</div>
              <div className="text-xs text-slate-400 mt-1">Events</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white font-heading">
                {events.reduce((acc, e) => acc + e.total_seats, 0).toLocaleString()}+
              </div>
              <div className="text-xs text-slate-400 mt-1">Total Seats</div>
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-bold text-white font-heading">
                {events.filter((e) => e.available_seats > 0).length}
              </div>
              <div className="text-xs text-slate-400 mt-1">Available</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Events Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-center gap-3 mb-10"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <CalendarDaysIcon className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-white">Upcoming Events</h2>
              <p className="text-sm text-slate-400">
                {filteredEvents.length} event{filteredEvents.length !== 1 ? 's' : ''} found
              </p>
            </div>
          </motion.div>

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="glass-card overflow-hidden animate-pulse">
                  <div className="skeleton h-52 w-full" />
                  <div className="p-5 space-y-4">
                    <div className="skeleton h-6 w-3/4 rounded-lg" />
                    <div className="skeleton h-4 w-full rounded-lg" />
                    <div className="skeleton h-4 w-2/3 rounded-lg" />
                    <div className="space-y-2">
                      <div className="skeleton h-8 w-full rounded-lg" />
                      <div className="skeleton h-8 w-full rounded-lg" />
                    </div>
                    <div className="skeleton h-12 w-full rounded-xl" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Events Grid */}
          {!loading && filteredEvents.length > 0 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredEvents.map((event) => (
                <motion.div key={event.id} variants={itemVariants}>
                  <EventCard
                    event={event}
                    session={session}
                    onBooked={fetchEvents}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && filteredEvents.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card max-w-lg mx-auto p-12 text-center"
            >
              <div className="w-20 h-20 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
                <RocketLaunchIcon className="w-10 h-10 text-indigo-400" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white mb-3">
                {searchTerm ? 'No matching events' : 'No events yet'}
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {searchTerm
                  ? `We couldn't find any events matching "${searchTerm}". Try a different search term.`
                  : 'Check back soon — exciting events are being planned right now!'}
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="btn-secondary mt-6 text-sm"
                >
                  Clear Search
                </button>
              )}
            </motion.div>
          )}
        </div>
      </section>
    </div>
  )
}
