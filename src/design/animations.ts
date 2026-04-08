/**
 * NOVA OS Animation Variants
 *
 * All Framer Motion variants for the OS.
 * Every transition in the OS must use one of these presets.
 * Never hardcode duration/easing values in components.
 */

import type { Variants, Transition } from 'framer-motion'
import { animation } from './tokens'

// ── Shared transitions ────────────────────────────────────

const transitionOut: Transition = {
  duration: animation.duration.normal,
  ease: animation.ease.out,  // cubic-bezier(0.16, 1, 0.3, 1) — spring feel
}

const transitionIn: Transition = {
  duration: animation.duration.fast,  // exits are faster than enters
  ease: animation.ease.in,
}

const transitionFast: Transition = {
  duration: animation.duration.fast,
  ease: animation.ease.out,
}

const transitionSlow: Transition = {
  duration: animation.duration.slow,
  ease: animation.ease.out,
}

// ── Fade ──────────────────────────────────────────────────

export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: transitionOut },
  exit:    { opacity: 0, transition: transitionIn },
}

export const fadeOut: Variants = {
  initial: { opacity: 1 },
  animate: { opacity: 0, transition: transitionIn },
}

// ── Slide ─────────────────────────────────────────────────

export const slideUp: Variants = {
  initial: { opacity: 0, y: 40 },
  animate: { opacity: 1, y: 0, transition: transitionOut },
  exit:    { opacity: 0, y: 40, transition: transitionIn },
}

export const slideDown: Variants = {
  initial: { opacity: 0, y: -40 },
  animate: { opacity: 1, y: 0, transition: transitionOut },
  exit:    { opacity: 0, y: -40, transition: transitionIn },
}

export const slideLeft: Variants = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: transitionOut },
  exit:    { opacity: 0, x: -40, transition: transitionIn },
}

export const slideRight: Variants = {
  initial: { opacity: 0, x: -40 },
  animate: { opacity: 1, x: 0, transition: transitionOut },
  exit:    { opacity: 0, x: 40, transition: transitionIn },
}

// ── Scale ─────────────────────────────────────────────────

/** App open animation — scales in from slightly smaller */
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.85 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { ...transitionOut, duration: animation.duration.slow },
  },
  exit: {
    opacity: 0,
    scale: 0.85,
    transition: transitionIn,
  },
}

/** Press feedback — subtle scale down on tap */
export const pressScale: Variants = {
  rest:    { scale: 1 },
  pressed: { scale: 0.94, transition: transitionFast },
}

// ── Full screen slide (lock screen unlock) ────────────────

export const slideUpFull: Variants = {
  initial: { y: 0, opacity: 1 },
  exit: {
    y: '-100%',
    opacity: 0,
    transition: transitionSlow,
  },
}

// ── Notification toast (slides in from top) ───────────────

export const toastIn: Variants = {
  initial: { opacity: 0, y: -80, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { ...transitionOut, duration: animation.duration.slow },
  },
  exit: {
    opacity: 0,
    y: -80,
    scale: 0.95,
    transition: transitionIn,
  },
}

// ── Full screen slide-down (notification center) ─────────

export const slideDownFull: Variants = {
  initial: { y: '-100%', opacity: 0 },
  animate: { y: 0, opacity: 1, transition: transitionSlow },
  exit:    { y: '-100%', opacity: 0, transition: transitionSlow },
}

// ── Wiggle (icon edit mode) ───────────────────────────────

export const wiggle: Variants = {
  rest:    { rotate: 0 },
  wiggling: {
    rotate: [-1.5, 1.5, -1.5, 1.5, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      repeatType: 'loop',
      ease: 'easeInOut',
    },
  },
}
