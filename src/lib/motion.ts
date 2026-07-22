/**
 * Shared motion constants.
 *
 * The built-in CSS easings are too weak to read as intentional, so the site
 * uses one strong ease-out for entrances and one ease-in-out for on-screen
 * movement. Springs are reserved for values that should feel physical: the
 * rating needle and the count-ups in the hero dashboard.
 */

/** Strong ease-out. Entrances, reveals, anything the user is waiting on. */
export const EASE_OUT = [0.23, 1, 0.32, 1] as const;

/** Strong ease-in-out. Elements moving or morphing while already on screen. */
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

/** Apple-style spring: easier to reason about than mass/stiffness/damping. */
export const SPRING_SOFT = { type: "spring", duration: 0.85, bounce: 0.18 } as const;
export const SPRING_SNAPPY = { type: "spring", duration: 0.45, bounce: 0.1 } as const;

/** Stagger between siblings. Long delays make an interface feel slow. */
export const STAGGER = 0.06;
