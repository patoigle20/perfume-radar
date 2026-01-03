import { X } from 'lucide-react';

export default function MethodologyModal({ isOpen, onClose }) {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" />

            {/* Modal */}
            <div
                className="relative glass-modal max-w-lg w-full p-6 animate-in zoom-in-95 fade-in duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1.5 rounded-lg
                     text-slate-500 dark:text-slate-400
                     hover:bg-slate-100 dark:hover:bg-slate-800
                     transition-all duration-300"
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4">
                    📊 Methodology
                </h2>

                <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                    <p>
                        The radar chart visualizes how suitable each perfume is for different
                        occasions based on season and time of day.
                    </p>

                    <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800">
                        <p className="font-mono text-slate-800 dark:text-slate-200 mb-2">
                            <strong>Axis Value Formula:</strong>
                        </p>
                        <code className="block p-3 bg-slate-200 dark:bg-slate-900 rounded-lg text-xs">
                            Score = (Season% × 0.7) + (TimeOfDay% × 0.3)
                        </code>
                        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                            Normalized to a 0-5 scale for chart display.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                            8 Axes Explained:
                        </h3>
                        <ul className="space-y-1 ml-4 list-disc">
                            <li>
                                <span className="text-amber-500">Summer Day/Night</span> – Warm weather fragrances
                            </li>
                            <li>
                                <span className="text-red-500">Fall Day/Night</span> – Autumn transitional scents
                            </li>
                            <li>
                                <span className="text-blue-500">Winter Day/Night</span> – Cold weather fragrances
                            </li>
                            <li>
                                <span className="text-pink-500">Spring Day/Night</span> – Fresh seasonal scents
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-100 mb-2">
                            Other Metrics:
                        </h3>
                        <ul className="space-y-1 ml-4 list-disc">
                            <li>
                                <span className="text-teal-500">Longevity</span> – How long the fragrance lasts
                            </li>
                            <li>
                                <span className="text-purple-500">Sillage</span> – How far the scent projects
                            </li>
                        </ul>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-700">
                        Data sourced from Fragrantica user votes.
                    </p>
                </div>
            </div>
        </div>
    );
}
