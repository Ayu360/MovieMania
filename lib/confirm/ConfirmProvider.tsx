import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';

import ConfirmDialog from '@/components/ConfirmDialog';
import { log } from '@/lib/logger';

export type ConfirmOptions = {
  title: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  /**
   * Optional async work to run when the user confirms. While it runs, the
   * dialog stays open in a loading state and cannot be dismissed. The
   * confirm() promise resolves `true` on success, `false` on cancel. If
   * `onConfirm` rejects, the dialog closes and confirm() rejects with the
   * same error so the caller can surface it.
   */
  onConfirm?: () => Promise<void>;
};

type Resolver = {
  resolve: (value: boolean) => void;
  reject: (err: unknown) => void;
};

type ConfirmContextValue = (opts: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

type InternalState = {
  opts: ConfirmOptions;
  loading: boolean;
};

export const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<InternalState | null>(null);
  const resolverRef = useRef<Resolver | null>(null);

  const confirm = useCallback<ConfirmContextValue>((opts) => {
    log.debug('MODAL', 'open', {
      title: opts.title,
      destructive: !!opts.destructive,
    });
    return new Promise<boolean>((resolve, reject) => {
      resolverRef.current = { resolve, reject };
      setState({ opts, loading: false });
    });
  }, []);

  const closeWith = useCallback(
    (settle: (r: Resolver) => void, result: boolean | 'error') => {
      log.debug('MODAL', 'close', { result });
      const r = resolverRef.current;
      resolverRef.current = null;
      setState(null);
      if (r) settle(r);
    },
    [],
  );

  const handleCancel = useCallback(() => {
    if (state?.loading) return;
    closeWith((r) => r.resolve(false), false);
  }, [closeWith, state?.loading]);

  const handleConfirm = useCallback(async () => {
    if (!state) return;
    const { onConfirm } = state.opts;
    if (!onConfirm) {
      closeWith((r) => r.resolve(true), true);
      return;
    }
    setState((s) => (s ? { ...s, loading: true } : s));
    try {
      await onConfirm();
      closeWith((r) => r.resolve(true), true);
    } catch (err) {
      closeWith((r) => r.reject(err), 'error');
    }
  }, [closeWith, state]);

  const value = useMemo(() => confirm, [confirm]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      <ConfirmDialog
        visible={!!state}
        title={state?.opts.title ?? ''}
        message={state?.opts.message}
        confirmLabel={state?.opts.confirmLabel}
        cancelLabel={state?.opts.cancelLabel}
        destructive={state?.opts.destructive}
        loading={!!state?.loading}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </ConfirmContext.Provider>
  );
};

export function useConfirm(): ConfirmContextValue {
  const ctx = useContext(ConfirmContext);
  if (!ctx) {
    throw new Error('useConfirm must be used within a ConfirmProvider');
  }
  return ctx;
}
