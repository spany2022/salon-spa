'use client';

import { createContext, useCallback, useContext, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { branches, business, categories, timeSlots } from '@/lib/data';
import { useSmoothScroll } from './SmoothScroll';

type BookingCtx = { open: (categoryId?: string) => void; close: () => void; isOpen: boolean };
const Ctx = createContext<BookingCtx>({ open: () => {}, close: () => {}, isOpen: false });
export const useBooking = () => useContext(Ctx);

type Form = {
  category: string;
  service: string;
  branch: string;
  date: string;
  time: string;
  name: string;
  phone: string;
};

const empty: Form = { category: '', service: '', branch: branches[0].id, date: '', time: '', name: '', phone: '' };
const ease: [number, number, number, number] = [0.22, 1, 0.36, 1];

export default function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [form, setForm] = useState<Form>(empty);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const { stop, start } = useSmoothScroll();

  const open = useCallback((categoryId?: string) => {
    setForm((f) => ({ ...f, category: categoryId ?? f.category, service: categoryId && categoryId !== f.category ? '' : f.service }));
    setSent(false);
    setError('');
    setOpen(true);
  }, []);
  const close = useCallback(() => setOpen(false), []);

  const wasOpen = useRef(false);
  useEffect(() => {
    if (isOpen) {
      stop();
      document.body.style.overflow = 'hidden';
    } else if (wasOpen.current) {
      start();
      document.body.style.overflow = '';
    }
    wasOpen.current = isOpen;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, stop, start]);

  const cat = categories.find((c) => c.id === form.category);
  const branch = branches.find((b) => b.id === form.branch);
  const today = new Date().toISOString().split('T')[0];
  const set = (k: keyof Form) => (e: { target: { value: string } }) =>
    setForm((f) => ({ ...f, [k]: e.target.value, ...(k === 'category' ? { service: '' } : {}) }));

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !/^[+\d\s-]{8,}$/.test(form.phone.trim())) {
      setError('Please add your name and a valid phone number so we can confirm your appointment.');
      return;
    }
    setError('');
    const lines = [
      `Hello Aabha, I'd like to request an appointment.`,
      `Name: ${form.name}`,
      `Phone: ${form.phone}`,
      `Service: ${cat ? cat.title : 'Not sure yet'}${form.service ? ` — ${form.service}` : ''}`,
      `Branch: ${branch?.name ?? ''}`,
      `Preferred: ${form.date || 'Any day'} ${form.time ? `at ${form.time}` : ''}`,
    ];
    if (business.whatsapp) {
      window.open(`https://wa.me/${business.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
    }
    // TODO: optionally POST `form` to your own endpoint / CRM here.
    setSent(true);
  };

  return (
    <Ctx.Provider value={{ open, close, isOpen }}>
      {children}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="booking"
            className="fixed inset-0 z-[90] flex items-stretch justify-end"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
            data-lenis-prevent
          >
            <button aria-label="Close booking" className="absolute inset-0 bg-espresso/60 backdrop-blur-[6px]" onClick={close} />
            <motion.div
              className="relative h-full w-full max-w-[620px] overflow-y-auto bg-ivory text-charcoal grain"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.85, ease }}
            >
              <div className="px-6 pb-16 pt-8 sm:px-12 sm:pt-12">
                <div className="flex items-start justify-between">
                  <p className="eyebrow text-rose">Book your experience</p>
                  <button onClick={close} className="group -mr-2 -mt-2 p-2 text-sm uppercase tracking-[0.2em]" aria-label="Close">
                    <span className="inline-block transition-transform duration-500 group-hover:rotate-90">✕</span>
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {!sent ? (
                    <motion.form
                      key="form"
                      onSubmit={submit}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0, transition: { delay: 0.25, duration: 0.7, ease } }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-8"
                    >
                      <h2 id="booking-title" className="font-serif text-5xl font-light leading-[0.95] sm:text-6xl">
                        Reserve your <em className="text-rose">moment</em>.
                      </h2>
                      <p className="mt-4 max-w-md text-sm leading-relaxed text-charcoal/70">
                        Tell us what you’d like and when. This is a request — our team will contact you to confirm the time.
                      </p>

                      <fieldset className="mt-10">
                        <legend className="field-label">Experience</legend>
                        <div className="mt-3 flex flex-wrap gap-2">
                          {categories.map((c) => (
                            <button
                              type="button"
                              key={c.id}
                              onClick={() => setForm((f) => ({ ...f, category: c.id, service: '' }))}
                              className={`chip ${form.category === c.id ? 'chip-active' : ''}`}
                              aria-pressed={form.category === c.id}
                            >
                              {c.title}
                            </button>
                          ))}
                        </div>
                      </fieldset>

                      <AnimatePresence initial={false}>
                        {cat && (
                          <motion.label
                            className="field mt-6 block"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.5, ease }}
                          >
                            <span className="field-label">Preferred service</span>
                            <select value={form.service} onChange={set('service')} className="field-input">
                              <option value="">Not sure yet — advise me</option>
                              {cat.services.map((s) => (
                                <option key={s}>{s}</option>
                              ))}
                            </select>
                          </motion.label>
                        )}
                      </AnimatePresence>

                      <fieldset className="mt-8">
                        <legend className="field-label">Branch</legend>
                        <div className="mt-3 grid gap-2 sm:grid-cols-2">
                          {branches.map((b) => (
                            <button
                              type="button"
                              key={b.id}
                              onClick={() => setForm((f) => ({ ...f, branch: b.id }))}
                              className={`branch-opt ${form.branch === b.id ? 'branch-opt-active' : ''}`}
                              aria-pressed={form.branch === b.id}
                            >
                              <span className="block font-serif text-xl">{b.name}</span>
                              <span className="mt-1 block text-[11px] uppercase tracking-[0.2em] opacity-60">{b.tag}</span>
                            </button>
                          ))}
                        </div>
                      </fieldset>

                      <div className="mt-8 grid gap-6 sm:grid-cols-2">
                        <label className="field">
                          <span className="field-label">Preferred date</span>
                          <input type="date" min={today} value={form.date} onChange={set('date')} className="field-input" />
                        </label>
                        <label className="field">
                          <span className="field-label">Preferred time</span>
                          <select value={form.time} onChange={set('time')} className="field-input">
                            <option value="">Any time</option>
                            {timeSlots.map((t) => (
                              <option key={t}>{t}</option>
                            ))}
                          </select>
                        </label>
                        <label className="field">
                          <span className="field-label">Your name</span>
                          <input value={form.name} onChange={set('name')} autoComplete="name" className="field-input" placeholder="Full name" />
                        </label>
                        <label className="field">
                          <span className="field-label">Phone number</span>
                          <input value={form.phone} onChange={set('phone')} type="tel" autoComplete="tel" inputMode="tel" className="field-input" placeholder="+91" />
                        </label>
                      </div>

                      {error && <p className="mt-6 text-sm text-rose" role="alert">{error}</p>}

                      <button type="submit" className="btn-primary mt-10 w-full justify-center">
                        <span>Request Appointment</span>
                      </button>
                      <p className="mt-4 text-center text-[11px] uppercase tracking-[0.2em] text-charcoal/45">
                        Subject to availability · We’ll call to confirm
                      </p>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="sent"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease } }}
                      className="mt-16"
                    >
                      <p className="font-script text-5xl text-gold">Thank you,</p>
                      <h2 className="mt-2 font-serif text-5xl font-light leading-none">{form.name.split(' ')[0]}.</h2>
                      <p className="mt-6 max-w-md leading-relaxed text-charcoal/75">
                        Your request for <strong className="font-medium">{cat ? cat.title : 'a visit'}</strong>
                        {form.service ? ` (${form.service})` : ''} at our <strong className="font-medium">{branch?.name}</strong> branch has been noted.
                        {business.whatsapp
                          ? ' We’ve opened WhatsApp with your details — just press send.'
                          : ' Our team will call you to confirm the time.'}
                      </p>
                      {business.phone && (
                        <p className="mt-4 text-sm text-charcoal/60">
                          Prefer to call? <a className="link-underline" href={`tel:${business.phone.replace(/\s/g, '')}`}>{business.phone}</a>
                        </p>
                      )}
                      <button onClick={close} className="btn-ghost mt-10">
                        <span>Return to Aabha</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
