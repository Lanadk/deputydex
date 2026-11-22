"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

export type NotificationVariant = "error" | "warning" | "success" | "info";

export type NotificationInput = {
    message: string;
    variant?: NotificationVariant;
    /** Action proposée (ex. « Réessayer ») ; la notification se ferme après le clic. */
    action?: { label: string; onClick: () => void };
    /** Durée d'affichage en ms (0 : reste jusqu'à fermeture). Par défaut 6 s, 10 s avec une action. */
    duration?: number;
};

export type Notification = Required<Pick<NotificationInput, "message" | "variant">> &
    Pick<NotificationInput, "action"> & { id: number; duration: number };

type NotificationContextValue = {
    notify: (input: NotificationInput) => number;
    dismiss: (id: number) => void;
};

const NotificationContext = createContext<NotificationContextValue>({
    notify: () => -1,
    dismiss: () => {},
});

/** Notifier depuis n'importe quel composant sous `NotificationProvider`. Sans provider : sans effet. */
export const useNotifications = () => useContext(NotificationContext);

export const DEFAULT_NOTIFICATION_DURATION_MS = 6_000;
export const ACTION_NOTIFICATION_DURATION_MS = 10_000;

/**
 * Notification temporaire (« toast ») : un échec en arrière-plan, une
 * confirmation. Pour un contenu qui ne s'affiche pas, préférer ErrorStateLib,
 * à l'endroit du contenu.
 *
 * Accessibilité : zone `aria-live` (assertive pour une erreur, polie sinon) ;
 * la fermeture automatique est suspendue au survol et au focus clavier.
 */
export function NotificationLib({
    notification,
    onDismiss,
}: {
    notification: Notification;
    onDismiss: (id: number) => void;
}) {
    const { id, message, variant, action, duration } = notification;
    const [paused, setPaused] = useState(false);

    useEffect(() => {
        if (duration <= 0 || paused) return;
        const timer = setTimeout(() => onDismiss(id), duration);
        return () => clearTimeout(timer);
    }, [id, duration, paused, onDismiss]);

    return (
        <div
            className={`notification-lib__toast notification-lib__toast--${variant}`}
            role={variant === "error" ? "alert" : "status"}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
        >
            <span className="notification-lib__message">{message}</span>
            {action && (
                <button
                    type="button"
                    className="notification-lib__action"
                    onClick={() => {
                        action.onClick();
                        onDismiss(id);
                    }}
                >
                    {action.label}
                </button>
            )}
            <button
                type="button"
                className="notification-lib__close"
                aria-label="Fermer la notification"
                onClick={() => onDismiss(id)}
            >
                ✕
            </button>
        </div>
    );
}

/** Pile des notifications affichées, en bas à droite de l'écran. */
export function NotificationStackLib({
    notifications,
    onDismiss,
}: {
    notifications: Notification[];
    onDismiss: (id: number) => void;
}) {
    return (
        <div className="notification-lib" aria-live="polite" aria-relevant="additions">
            {notifications.map((n) => (
                <NotificationLib key={n.id} notification={n} onDismiss={onDismiss} />
            ))}
        </div>
    );
}

/** À poser une fois, haut dans l'arbre (layout racine). */
export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const nextId = useRef(1);

    const dismiss = useCallback((id: number) => {
        setNotifications((list) => list.filter((n) => n.id !== id));
    }, []);

    const notify = useCallback((input: NotificationInput) => {
        const id = nextId.current++;
        const duration = input.duration ?? (input.action ? ACTION_NOTIFICATION_DURATION_MS : DEFAULT_NOTIFICATION_DURATION_MS);
        const notification: Notification = {
            id,
            message: input.message,
            variant: input.variant ?? "info",
            action: input.action,
            duration,
        };
        // Pas de doublon : un même message déjà affiché n'est pas empilé une seconde fois.
        setNotifications((list) => (list.some((n) => n.message === notification.message) ? list : [...list, notification]));
        return id;
    }, []);

    const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss]);

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <NotificationStackLib notifications={notifications} onDismiss={dismiss} />
        </NotificationContext.Provider>
    );
}
