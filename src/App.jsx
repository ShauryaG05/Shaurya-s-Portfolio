import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useReducedMotion } from 'motion/react'
import { ArrowUpRight, EnvelopeSimple, GithubLogo, LinkedinLogo, HandWaving } from '@phosphor-icons/react'
import { content as c } from './content'

const ext = { target: '_blank', rel: 'noopener noreferrer' }
const ease = [0.2, 0, 0, 1]
// pill: 40px min hit area, press scale 0.96
const pill = 'inline-flex h-10 items-center gap-2 rounded-full bg-paper px-4 text-sm font-medium text-ink shadow-[0_1px_2px_rgba(10,10,10,.12),0_4px_12px_rgba(10,10,10,.1)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 active:scale-[0.96] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper'

function Avatar({ mx, my }) {
  const reduce = useReducedMotion()
  const [msg, setMsg] = useState(0)
  useEffect(() => { const t = setTimeout(() => setMsg(1), 4200); return () => clearTimeout(t) }, [])
  const spring = { stiffness: 110, damping: 16 }
  const rx = useSpring(useTransform(my, [-1, 1], [5, -5]), spring)
  const ry = useSpring(useTransform(mx, [-1, 1], [-7, 7]), spring)
  return (
    <div className="absolute bottom-0 right-0 w-[62%] max-w-[460px] sm:right-6 sm:w-[44%]">
      <AnimatePresence mode="wait">
        <motion.div key={msg} className="absolute left-[8%] top-0 z-10 flex items-center gap-2 rounded-full bg-paper px-4 py-2.5 text-black text-sm font-semibold shadow-[0_1px_2px_rgba(10,10,10,.15),0_8px_20px_rgba(10,10,10,.18)] sm:text-base"
          initial={{ opacity: 0, scale: 0.85, y: 8, filter: 'blur(4px)' }} animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }} exit={{ opacity: 0, y: -6, filter: 'blur(4px)' }}
          transition={{ type: 'spring', duration: 0.4, bounce: 0, delay: msg === 0 ? 0.9 : 0 }}>
          {msg === 0 ? <><motion.span className="origin-bottom-right text-black" animate={reduce ? {} : { rotate: [0, 18, -8, 18, -4, 0] }} transition={{ duration: 1.4, delay: 1.3, repeat: 2, repeatDelay: 0.8 }}><HandWaving size={20} weight="bold" /></motion.span>Hey,What’s up!</> : 'I’m Shaurya Gupta'}
        </motion.div>
      </AnimatePresence>
      <motion.div style={{ rotateX: rx, rotateY: ry, transformPerspective: 800 }} animate={reduce ? {} : { y: [0, -8, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }} className="mt-14">
        <motion.img src="/avatar.png" alt={c.name} draggable={false} drag dragSnapToOrigin dragElastic={0.3} whileDrag={{ scale: 1.03 }}
          className="w-full cursor-grab select-none active:cursor-grabbing" style={{ touchAction: 'none' }} />
      </motion.div>
    </div>
  )
}

const line = { hidden: { opacity: 0, y: 18 }, show: (i) => ({ opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.1, duration: 0.55, ease } }) }

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
      <Avatar mx={mx} my={my} />
      <h1 className="absolute bottom-6 left-6 z-10 text-[clamp(2.25rem,5.6vw,4.75rem)] leading-[1.02] tracking-[-0.04em] sm:bottom-10 sm:left-10">
        {c.roles.map((r, i) => <motion.span key={r} custom={i} variants={line} initial="hidden" animate="show" className={`block ${i < 2 ? 'font-bold' : 'font-light'}`}>{r}</motion.span>)}
      </h1>
    </section>
  )
}

const Section = ({ id, title, className = '', children }) => (
  <section id={id} className={`rounded-[28px] p-6 sm:p-10 ${className}`}>
    <div className="grid gap-6 md:grid-cols-[160px_1fr] md:gap-10">
      <h2 className="text-sm font-semibold tracking-tight opacity-60">{title}</h2>
      <div>{children}</div>
    </div>
  </section>
)

const themes = [
  { bg: 'repeating-radial-gradient(circle at 78% 22%,transparent 0 14px,rgba(10,10,10,.14) 14px 16px),#ffe98a', dark: false },
  { bg: 'repeating-linear-gradient(135deg,transparent 0 14px,rgba(48,102,228,.35) 14px 16px),#e6ecfb', dark: false },
  { bg: 'radial-gradient(rgba(250,250,245,.3) 1.5px,transparent 1.6px) 0 0/16px 16px,#16384f', dark: true },
]

function ProjectCard({ p, i }) {
  const t = themes[i % themes.length]
  const host = new URL(p.url).hostname
  const move = (e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--x', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--y', `${e.clientY - r.top}px`) }
  return (
    <motion.li initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-60px' }} transition={{ delay: i * 0.1, duration: 0.5, ease }}>
      <a href={p.url} {...ext} onPointerMove={move} aria-label={`${p.name}, opens ${host}`}
        className={`group relative flex aspect-[4/5] flex-col justify-end overflow-hidden rounded-2xl p-5 shadow-[0_1px_2px_rgba(10,10,10,.1),0_12px_32px_rgba(10,10,10,.12)] transition-[transform,box-shadow] duration-300 hover:-translate-y-1 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-azure ${t.dark ? 'text-paper' : 'text-ink'}`}>
        <div aria-hidden className="absolute inset-0 transition-transform duration-700 group-hover:scale-110" style={{ background: t.bg }} />
        <div aria-hidden className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'radial-gradient(220px circle at var(--x,50%) var(--y,50%),rgba(255,255,255,.4),transparent 70%)' }} />
        <div className="relative flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-2xl font-bold tracking-[-0.03em]">{p.name}</h3>
            <p className="truncate text-sm opacity-70">{host}</p>
          </div>
          <span className={`grid size-10 shrink-0 place-items-center rounded-full ${t.dark ? 'bg-paper text-ink' : 'bg-ink text-paper'}`}>
            <ArrowUpRight size={18} weight="bold" className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </span>
        </div>
      </a>
    </motion.li>
  )
}

export default function App() {
  return (
    <div className="flex flex-col gap-3 p-3 sm:p-4">
      <Hero />
      <Section id="work" title="Selected work" className="bg-paper">
        <ul className="grid gap-3 sm:grid-cols-3">{c.projects.map((p, i) => <ProjectCard key={p.name} p={p} i={i} />)}</ul>
      </Section>
      <Section id="tech" title="Technology" className="bg-[#eef1f8]">
        <div>{c.techGroups.map((g, gi) => (
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
