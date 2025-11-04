"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ConfirmDialogVariant = "default" | "destructive";

type ConfirmDialogOptions = {
  title: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmDialogVariant;
};

type ConfirmDialogContextValue = (
  options: ConfirmDialogOptions
) => Promise<boolean>;

const ConfirmDialogContext = createContext<ConfirmDialogContextValue | null>(
  null
);

type Resolver = (value: boolean) => void;

type PendingDialog = ConfirmDialogOptions & {
  resolve: Resolver;
};

export const ConfirmDialogProvider: React.FC<
  React.PropsWithChildren
> = ({ children }) => {
  const [pendingDialog, setPendingDialog] = useState<PendingDialog | null>(
    null
  );

  const closeDialog = useCallback(
    (value: boolean) => {
      if (pendingDialog) {
        pendingDialog.resolve(value);
        setPendingDialog(null);
      }
    },
    [pendingDialog]
  );

  const confirm = useCallback<ConfirmDialogContextValue>(
    (options) =>
      new Promise<boolean>((resolve) => {
        setPendingDialog({ ...options, resolve });
      }),
    []
  );

  const contextValue = useMemo(() => confirm, [confirm]);

  const open = Boolean(pendingDialog);

  return (
    <ConfirmDialogContext.Provider value={contextValue}>
      {children}
      <AlertDialog open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{pendingDialog?.title}</AlertDialogTitle>
            {pendingDialog?.description ? (
              <AlertDialogDescription>
                {pendingDialog.description}
              </AlertDialogDescription>
            ) : null}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => closeDialog(false)}>
              {pendingDialog?.cancelText ?? "Cancel"}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => closeDialog(true)}
              className={
                pendingDialog?.variant === "destructive"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/80"
                  : undefined
              }
            >
              {pendingDialog?.confirmText ?? "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ConfirmDialogContext.Provider>
  );
};

export const useConfirmDialog = () => {
  const context = useContext(ConfirmDialogContext);
  if (!context) {
    throw new Error(
      "useConfirmDialog must be used within a ConfirmDialogProvider"
    );
  }
  return context;
};

