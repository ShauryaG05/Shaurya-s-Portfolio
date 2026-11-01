import { useCallback, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react'
import { ArrowUpRight, EnvelopeSimple, GithubLogo, LinkedinLogo, HandWaving, X } from '@phosphor-icons/react'
import { content as c } from './content'

const ext = { target: '_blank', rel: 'noopener noreferrer' }
const ease = [0.2, 0, 0, 1]
const circ = [0.7, 0, 0.2, 1]
// pill: 40px min hit area, press scale 0.96
const pill = 'inline-flex h-10 items-center gap-2 rounded-full bg-paper px-4 text-sm font-medium text-ink shadow-[0_1px_2px_rgba(10,10,10,.12),0_4px_12px_rgba(10,10,10,.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper'

// Shared interactive avatar: floats, tilts to cursor, draggable, tap = next message.
function Avatar({ messages, mx, my, className = '' }) {
  const reduce = useReducedMotion()
  const [n, setN] = useState(0)
  useEffect(() => { const t = setTimeout(() => setN(v => (v === 0 ? 1 : v)), 4200); return () => clearTimeout(t) }, [])
  const spring = { stiffness: 110, damping: 16 }
  const rx = useSpring(useTransform(my, [-1, 1], [5, -5]), spring)
  const ry = useSpring(useTransform(mx, [-1, 1], [-7, 7]), spring)
  const m = messages[n % messages.length]
  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        <motion.div key={n} className="absolute left-[8%] top-0 z-10 flex items-center gap-2 rounded-full bg-paper px-4 py-2.5 text-black text-sm font-semibold shadow-[0_1px_2px_rgba(10,10,10,.15),0_8px_20px_rgba(10,10,10,.18)] sm:text-base"
          initial={{ opacity: 0, scale: 0.85, y: 8, filter: 'blur(4px)' }} animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0, delay: n === 0 ? 0.9 : 0 }}>
          {m.wave && <motion.span className="origin-bottom-right text-black" animate={reduce ? {} : { rotate: [0, 18, -8, 18, -4, 0] }} transition={{ duration: 1.4, delay: 1.3, repeat: 2, repeatDelay: 0.8 }}><HandWaving size={20} weight="bold" /></motion.span>}
          {m.text}
        </motion.div>
      </AnimatePresence>
      <motion.div style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }} animate={reduce ? {} : { y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="mt-14">
        <motion.img src="/avatar.png" alt={c.name} draggable={false} drag dragSnapToOrigin dragElastic={0.3} whileDrag={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
          onTap={() => setN(v => (v + 1) % messages.length)}
          className="w-full cursor-grab select-none active:cursor-grabbing" style={{ touchAction: 'none' }} />
      </motion.div>
    </div>
  )
}

const line = { hidden: { opacity: 0, y: 18 }, show: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.1, duration: 0.55, ease } }) }
const heroMsgs = [{ text: 'Hey,What’s up!', wave: true }, { text: 'I’m Shaurya Gupta' }]

function Hero() {
  const mx = useMotionValue(0), my = useMotionValue(0)
  const onMove = (e) => { const r = e.currentTarget.getBoundingClientRect(); mx.set(((e.clientX - r.left) / r.width) * 2 - 1); my.set(((e.clientY - r.top) / r.height) * 2 - 1) }
  return (
    <section onPointerMove={onMove} className="relative h-[clamp(580px,calc(100svh-2rem),820px)] overflow-hidden rounded-[28px] bg-azure p-6 text-paper sm:p-10">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden" style={{ backgroundImage: 'repeating-linear-gradient(90deg,rgba(255,255,255,.12) 0 1px,transparent 1px 8.333%)' }}>
        <div className="sweep absolute inset-y-0 left-0 w-1/5 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
      <div className="relative z-20 flex items-start justify-between">
        <p className="text-base font-semibold tracking-tight">{c.name}</p>
        <a href={`mailto:${c.email}`} className={pill}>Get in touch</a>
      </div>
      <Avatar messages={heroMsgs} mx={mx} my={my} className="absolute bottom-0 right-0 w-[62%] max-w-[460px] sm:right-6 sm:w-[44%]" />
      <h1 className="absolute bottom-6 left-6 z-10 text-[clamp(2.25rem,5.6vw,4.75rem)] leading-[1.02] tracking-[-0.04em] sm:bottom-10 sm:left-10">
        {c.roles.map((r, i) => <motion.span key={r} custom={i} variants={line} initial="hidden" animate="show" className={`block ${i < 2 ? 'font-bold' : 'font-light'}`}>{r}</motion.span>)}
      </h1>
    </section>
  )
}

const Section = ({ id, title, aside, className = '', children }) => (
  <section id={id} className={`rounded-[28px] p-6 sm:p-10 ${className}`}>
    <div className="grid gap-6 md:grid-cols-[160px_1fr] md:gap-10">
      <div><h2 className="text-sm font-semibold tracking-tight opacity-60">{title}</h2>{aside}</div>
      <div>{children}</div>
    </div>
  </section>
)

const themes = [
  { bg: 'repeating-radial-gradient(circle at 78% 22%,transparent 0 14px,rgba(10,10,10,.14) 14px 16px),#ffe98a', solid: '#ffe98a', dark: false },
  { bg: 'repeating-linear-gradient(135deg,transparent 0 14px,rgba(48,102,228,.35) 14px 16px),#e6ecfb', solid: '#c9d8fb', dark: false },
  { bg: 'radial-gradient(rgba(250,250,245,.3) 1.5px,transparent 1.6px) 0 0/16px 16px,#16384f', solid: '#16384f', dark: true },
]

function ProjectCard({ p, i, onOpen }) {
  const t = themes[i % themes.length]
  const host = new URL(p.url).hostname
  const move = (e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`) }
  return (
    <motion.li initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.1, duration: 0.5, ease }}>
      <button type="button" aria-haspopup="dialog" onClick={(e) => onOpen(i, e)} onPointerMove={move} aria-label={`Open ${p.name}`}
        className={`card group relative flex aspect-[4/5] w-full cursor-pointer flex-col justify-end overflow-hidden rounded-2xl p-5 text-left shadow-[0_1px_2px_rgba(10,10,10,.1),0_12px_32px_rgba(10,10,10,.12)] transition-[transform,box-shadow,opacity] duration-300 hover:-translate-y-1 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure ${t.dark ? 'text-paper' : 'text-ink'}`}>
        <div aria-hidden className="absolute inset-0 transition-transform duration-700 group-hover:scale-110" style={{ background: t.bg }} />
        <div aria-hidden className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'radial-gradient(220px circle at var(--x,50%) var(--y,50%),rgba(255,255,255,.4),transparent 70%)' }} />
        <div className="relative flex w-full items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-2xl font-bold tracking-[-0.03em]">{p.name}</h3>
            <p className="truncate text-sm opacity-70">{host}</p>
          </div>
          <span className={`grid size-10 shrink-0 place-items-center rounded-full ${t.dark ? 'bg-paper text-ink' : 'bg-ink text-paper'}`}>
            <ArrowUpRight size={18} weight="bold" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </button>
    </motion.li>
  )
}

// Full-screen project view. Circle grows from the avatar badge (origin), like the reference.
function Overlay({ p, t, origin, onClose }) {
  const reduce = useReducedMotion()
  const mx = useMotionValue(0), my = useMotionValue(0)
  const host = new URL(p.url).hostname
  const R = Math.hypot(window.innerWidth, window.innerHeight)
  const from = `circle(28px at ${origin.x}px ${origin.y}px)`, to = `circle(${R}px at ${origin.x}px ${origin.y}px)`
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', k); document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [onClose])
  const onMove = (e) => { mx.set((e.clientX / window.innerWidth) * 2 - 1); my.set((e.clientY / window.innerHeight) * 2 - 1) }
  const rise = (d) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { delay: d, duration: 0.5, ease } })
  const msgs = [{ text: `This is ${p.name}.`, wave: true }, { text: 'Want to see it live?' }]
  return (
    <motion.div role="dialog" aria-modal="true" aria-label={p.name} onPointerMove={onMove}
      className={`fixed inset-0 z-50 overflow-y-auto ${t.dark ? 'text-paper' : 'text-ink'}`} style={{ background: t.solid }}
      initial={reduce ? { opacity: 0 } : { clipPath: from }} animate={reduce ? { opacity: 1 } : { clipPath: to }}
      exit={reduce ? { opacity: 0 } : { clipPath: from, transition: { duration: 0.5, ease: circ } }} transition={{ duration: 0.7, ease: circ }}>
      <div className="mx-auto flex min-h-full max-w-[1280px] flex-col p-6 sm:p-10">
        <motion.h2 {...rise(0.35)} className="text-[clamp(2.5rem,7vw,6rem)] font-bold leading-none tracking-[-0.045em]">{p.name}</motion.h2>
        <motion.dl {...rise(0.42)} className="mt-4 text-sm"><dt className="opacity-60">Link</dt><dd className="font-medium">{host}</dd></motion.dl>
        <div className="mt-8 grid flex-1 gap-6 lg:grid-cols-[1fr_380px]">
          <motion.div {...rise(0.5)} className="relative min-h-[320px] overflow-hidden rounded-2xl shadow-[0_1px_2px_rgba(10,10,10,.12),0_16px_40px_rgba(10,10,10,.18)]" style={{ background: t.bg }}>
            {p.shareUrl && <iframe src={p.shareUrl} title={`${p.name} knowledge share`} loading="lazy" className="absolute inset-0 size-full bg-paper" />}
            <a href={p.shareUrl || p.url} {...ext} className={`${pill} absolute ${p.shareUrl ? 'bottom-4 left-4' : 'left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hover:-translate-y-[calc(50%+2px)]'}`}>{p.shareUrl ? 'Open in new tab' : `Visit ${host}`}<ArrowUpRight size={16} weight="bold" /></a>
          </motion.div>
          <div className="relative -mb-6 min-h-[340px] sm:-mb-10">
            <motion.div initial={{ y: '60%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5, duration: 0.7, ease }} className="absolute inset-0">
              <Avatar messages={msgs} mx={mx} my={my} className="absolute bottom-0 right-0 w-full max-w-[360px]" />
            </motion.div>
          </div>
        </div>
      </div>
      <button type="button" autoFocus onClick={onClose} aria-label="Close project"
        className="fixed bottom-4 right-4 z-10 grid size-12 place-items-center rounded-full bg-ink text-paper shadow-[0_4px_16px_rgba(10,10,10,.3)] transition-transform duration-200 hover:scale-105 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure sm:bottom-6 sm:right-6">
        <X size={20} weight="bold" />
      </button>
    </motion.div>
  )
}

function Work() {
  const [open, setOpen] = useState(null)
  const badge = useRef(null), trig = useRef(null)
  const launch = (i, e) => { trig.current = e.currentTarget; const r = badge.current.getBoundingClientRect(); setOpen({ i, x: r.left + r.width / 2, y: r.top + r.height / 2 }) }
  const close = useCallback(() => { setOpen(null); trig.current?.focus() }, [])
  const aside = (
    <div ref={badge} aria-hidden className="mt-4 size-14 overflow-hidden rounded-full bg-paper shadow-[0_1px_2px_rgba(10,10,10,.15),0_6px_16px_rgba(10,10,10,.14)]">
      <img src="/avatar.png" alt="" className="size-full origin-[50%_22%] scale-[1.9] object-cover object-[50%_10%]" />
    </div>
  )
  return (
    <>
      <Section id="work" title="Selected work" aside={aside} className="bg-paper">
        <ul className="grid gap-3 sm:grid-cols-3 [&:hover_.card:not(:hover)]:opacity-50">{c.projects.map((p, i) => <ProjectCard key={p.name} p={p} i={i} onOpen={launch} />)}</ul>
      </Section>
      <AnimatePresence>{open && <Overlay key={open.i} p={c.projects[open.i]} t={themes[open.i % themes.length]} origin={open} onClose={close} />}</AnimatePresence>
    </>
  )
}

export default function App() {
  return (
    <div className="flex flex-col gap-3 p-3 sm:p-4">
      <Hero />
      <Work />
      <Section id="tech" title="Technology" className="bg-[#eef1f8]">
        <div>{c.techGroups.map((g) => (
          <div key={g.title} className="grid gap-3 py-5 shadow-[inset_0_1px_0_rgba(10,10,10,.08)] first:pt-0 first:shadow-none last:pb-0 sm:grid-cols-[150px_1fr] sm:gap-6">
            <h3 className="pt-2.5 text-sm font-semibold tracking-tight">{g.title}</h3>
            <ul className="flex flex-wrap gap-2">{g.items.map((t, i) => (
              <motion.li key={t} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ delay: i * 0.04, duration: 0.35, ease }}
                className="inline-flex h-10 items-center rounded-full bg-paper px-4 text-sm font-medium shadow-[0_1px_2px_rgba(10,10,10,.1)] transition-[background-color,color,transform] duration-200 hover:-translate-y-0.5 hover:bg-azure hover:text-paper">{t}</motion.li>))}
            </ul>
          </div>))}
        </div>
      </Section>
      <Section id="experience" title="Experience" className="bg-navy text-paper">
        <ul>{c.experience.map(e => (
          <li key={e.role} className="py-5 shadow-[inset_0_1px_0_rgba(250,250,245,.18)] first:pt-0 first:shadow-none">
            <p className="text-xl font-semibold tracking-tight sm:text-2xl">{e.role}</p>
            <p className="mt-1 text-base opacity-70">{e.org || e.description}</p>
          </li>))}
        </ul>
      </Section>
      <footer id="contact" className="rounded-[28px] bg-azure p-6 text-paper sm:p-10">
        <div className="grid gap-6 md:grid-cols-[160px_1fr] md:gap-10">
          <h2 className="text-sm font-semibold tracking-tight opacity-70">Contact</h2>
          <div>
            <a href={`mailto:${c.email}`} className="block break-all text-[clamp(1.5rem,3.6vw,2.75rem)] font-bold leading-tight tracking-[-0.03em] underline-offset-8 hover:underline focus-visible:underline">{c.email}</a>
            <ul className="mt-6 flex flex-wrap gap-2">
              <li><a href={`mailto:${c.email}`} className={pill}><EnvelopeSimple size={18} weight="bold" />Email</a></li>
              {c.links.map(l => <li key={l.label}><a href={l.url} {...ext} className={pill}>{l.label === 'GitHub' ? <GithubLogo size={18} weight="bold" /> : <LinkedinLogo size={18} weight="bold" />}{l.label}</a></li>)}
            </ul>
            <p className="mt-10 text-sm opacity-70">© {new Date().getFullYear()} {c.name}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
