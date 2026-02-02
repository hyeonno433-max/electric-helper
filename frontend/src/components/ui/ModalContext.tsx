"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { X, CheckCircle, AlertTriangle, HelpCircle } from "lucide-react";

type ModalType = "success" | "error" | "info" | "confirm";

interface ModalOptions {
    title?: string;
    message: string;
    type?: ModalType;
    confirmText?: string;
    cancelText?: string;
}

interface ModalContextType {
    openAlert: (options: ModalOptions) => Promise<void>;
    openConfirm: (options: ModalOptions) => Promise<boolean>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [config, setConfig] = useState<ModalOptions>({ message: "" });
    const [resolveRef, setResolveRef] = useState<(value: any) => void>(() => { });

    const openAlert = (options: ModalOptions): Promise<void> => {
        return new Promise((resolve) => {
            setConfig({ ...options, type: options.type || "info" });
            setResolveRef(() => resolve);
            setIsOpen(true);
        });
    };

    const openConfirm = (options: ModalOptions): Promise<boolean> => {
        return new Promise((resolve) => {
            setConfig({ ...options, type: "confirm" });
            setResolveRef(() => resolve);
            setIsOpen(true);
        });
    };

    const handleClose = (result: boolean | void) => {
        setIsOpen(false);
        resolveRef(result);
        // Reset after animation
        setTimeout(() => {
            setConfig({ message: "" });
        }, 300);
    };

    return (
        <ModalContext.Provider value={{ openAlert, openConfirm }}>
            {children}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#15161c] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-6 relative animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${config.type === "success" ? "bg-green-500/20 text-green-400" :
                                    config.type === "error" ? "bg-red-500/20 text-red-400" :
                                        config.type === "confirm" ? "bg-indigo-500/20 text-indigo-400" :
                                            "bg-gray-500/20 text-gray-400"
                                }`}>
                                {config.type === "success" && <CheckCircle className="w-5 h-5" />}
                                {config.type === "error" && <AlertTriangle className="w-5 h-5" />}
                                {config.type === "confirm" && <HelpCircle className="w-5 h-5" />}
                                {config.type === "info" && <HelpCircle className="w-5 h-5" />}
                            </div>
                            <h3 className="text-xl font-bold text-white">
                                {config.title || (config.type === "confirm" ? "확인" : "알림")}
                            </h3>
                        </div>

                        {/* Body */}
                        <p className="text-gray-300 text-sm leading-relaxed mb-8 whitespace-pre-wrap">
                            {config.message}
                        </p>

                        {/* Footer / Actions */}
                        <div className="flex justify-end gap-3">
                            {config.type === "confirm" && (
                                <button
                                    onClick={() => handleClose(false)}
                                    className="px-5 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:bg-white/5 transition-colors font-medium text-sm"
                                >
                                    {config.cancelText || "취소"}
                                </button>
                            )}
                            <button
                                onClick={() => handleClose(true)}
                                className={`px-6 py-2.5 rounded-xl text-white font-bold text-sm shadow-lg transition-all ${config.type === "success" ? "bg-green-600 hover:bg-green-500 shadow-green-500/20" :
                                        config.type === "error" ? "bg-red-600 hover:bg-red-500 shadow-red-500/20" :
                                            "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20"
                                    }`}
                            >
                                {config.confirmText || "확인"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </ModalContext.Provider>
    );
}

export function useModal() {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error("useModal must be used within a ModalProvider");
    }
    return context;
}
