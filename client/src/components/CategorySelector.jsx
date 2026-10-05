import { useState, useRef, useEffect, useMemo } from "react";
import {
    Tag,
    ChevronDown,
    Check,
    Search,
    Cpu,
    Landmark,
    Briefcase,
    Trophy,
    Film,
    HeartPulse,
    X,
} from "lucide-react";

const getCategoryMeta = (name = "") => {
    const lower = name.toLowerCase();
    if (lower.includes("tech")) {
        return {
            Icon: Cpu,
            textColor: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            badgeClass: "bg-blue-50 text-blue-700 border-blue-200",
        };
    }
    if (lower.includes("politic")) {
        return {
            Icon: Landmark,
            textColor: "text-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200",
            badgeClass: "bg-purple-50 text-purple-700 border-purple-200",
        };
    }
    if (
        lower.includes("business") ||
        lower.includes("finan") ||
        lower.includes("econ")
    ) {
        return {
            Icon: Briefcase,
            textColor: "text-emerald-600",
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-200",
            badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
        };
    }
    if (lower.includes("sport")) {
        return {
            Icon: Trophy,
            textColor: "text-amber-600",
            bgColor: "bg-amber-50",
            borderColor: "border-amber-200",
            badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
        };
    }
    if (
        lower.includes("entertain") ||
        lower.includes("movie") ||
        lower.includes("culture")
    ) {
        return {
            Icon: Film,
            textColor: "text-rose-600",
            bgColor: "bg-rose-50",
            borderColor: "border-rose-200",
            badgeClass: "bg-rose-50 text-rose-700 border-rose-200",
        };
    }
    if (
        lower.includes("health") ||
        lower.includes("well") ||
        lower.includes("fit")
    ) {
        return {
            Icon: HeartPulse,
            textColor: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
            badgeClass: "bg-red-50 text-red-700 border-red-200",
        };
    }
    return {
        Icon: Tag,
        textColor: "text-sky-600",
        bgColor: "bg-sky-50",
        borderColor: "border-sky-200",
        badgeClass: "bg-sky-50 text-sky-700 border-sky-200",
    };
};

const CategorySelector = ({
    categories = [],
    selectedId = "",
    onSelect,
    required = false,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    // Selected category object
    const selectedCategory = useMemo(() => {
        return categories.find((cat) => cat._id === selectedId) || null;
    }, [categories, selectedId]);

    // Filter categories based on search
    const filteredCategories = useMemo(() => {
        if (!searchTerm.trim()) return categories;
        const q = searchTerm.toLowerCase();
        return categories.filter(
            (cat) =>
                cat.name.toLowerCase().includes(q) ||
                (cat.description && cat.description.toLowerCase().includes(q))
        );
    }, [categories, searchTerm]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    // Close on escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape" && isOpen) {
                setIsOpen(false);
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen]);

    const handleSelect = (categoryId) => {
        onSelect(categoryId);
        setIsOpen(false);
        setSearchTerm("");
    };

    const handleClear = (e) => {
        e.stopPropagation();
        onSelect("");
        setSearchTerm("");
    };

    const selectedMeta = selectedCategory
        ? getCategoryMeta(selectedCategory.name)
        : null;

    return (
        <div className="w-full" ref={dropdownRef}>
            {/* Custom Dropdown Trigger */}
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen((prev) => !prev)}
                    className={`w-full p-3.5 pl-4 pr-11 bg-white text-left rounded-xl border transition-all duration-200 flex items-center justify-between shadow-sm cursor-pointer ${
                        isOpen
                            ? "border-sky-500 ring-2 ring-sky-100"
                            : selectedCategory
                            ? "border-sky-300 hover:border-sky-400"
                            : "border-gray-300 hover:border-gray-400"
                    }`}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        {selectedCategory && selectedMeta ? (
                            <>
                                <span
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center border shrink-0 ${selectedMeta.bgColor} ${selectedMeta.textColor} ${selectedMeta.borderColor}`}
                                >
                                    <selectedMeta.Icon size={18} />
                                </span>
                                <div className="truncate">
                                    <div className="font-semibold text-gray-900 text-sm sm:text-base">
                                        {selectedCategory.name}
                                    </div>
                                    {selectedCategory.description && (
                                        <div className="text-xs text-gray-500 truncate hidden sm:block">
                                            {selectedCategory.description}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100 text-gray-400 shrink-0">
                                    <Tag size={18} />
                                </span>
                                <span className="text-gray-400 font-normal text-sm sm:text-base">
                                    -- Select a category --
                                </span>
                            </>
                        )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                        {selectedCategory && (
                            <span
                                role="button"
                                tabIndex={0}
                                onClick={handleClear}
                                onKeyDown={(e) => e.key === "Enter" && handleClear(e)}
                                title="Clear selection"
                                className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition"
                            >
                                <X size={16} />
                            </span>
                        )}
                        <ChevronDown
                            size={18}
                            className={`text-gray-500 transition-transform duration-200 ${
                                isOpen ? "rotate-180 text-sky-500" : ""
                            }`}
                        />
                    </div>
                </button>

                {/* Hidden input for HTML form validation */}
                <input
                    type="text"
                    tabIndex={-1}
                    required={required}
                    value={selectedId}
                    onChange={() => {}}
                    className="opacity-0 absolute pointer-events-none h-0 w-0"
                />

                {/* Floating Dropdown Panel */}
                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
                        {/* Search header */}
                        {categories.length > 4 && (
                            <div className="p-2.5 border-b border-gray-100 bg-gray-50/70">
                                <div className="relative">
                                    <Search
                                        size={16}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search categories..."
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        autoFocus
                                        className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-800"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Category List */}
                        <div className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                            {filteredCategories.length === 0 ? (
                                <div className="p-6 text-center text-sm text-gray-500">
                                    No categories found matching &quot;{searchTerm}&quot;
                                </div>
                            ) : (
                                filteredCategories.map((cat) => {
                                    const meta = getCategoryMeta(cat.name);
                                    const isSelected = cat._id === selectedId;

                                    return (
                                        <button
                                            key={cat._id}
                                            type="button"
                                            onClick={() => handleSelect(cat._id)}
                                            className={`w-full p-3.5 sm:p-4 text-left flex items-center justify-between transition-colors cursor-pointer ${
                                                isSelected
                                                    ? "bg-sky-50/80 hover:bg-sky-100/70"
                                                    : "hover:bg-gray-50"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3.5 overflow-hidden">
                                                <div
                                                    className={`w-10 h-10 rounded-xl flex items-center justify-center border shrink-0 ${meta.bgColor} ${meta.textColor} ${meta.borderColor}`}
                                                >
                                                    <meta.Icon size={20} />
                                                </div>
                                                <div className="truncate text-left">
                                                    <div className="font-semibold text-gray-900 text-sm sm:text-base">
                                                        {cat.name}
                                                    </div>
                                                    {cat.description && (
                                                        <div className="text-xs text-gray-500 truncate mt-0.5">
                                                            {cat.description}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {isSelected && (
                                                <div className="w-6 h-6 rounded-full bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm ml-2">
                                                    <Check size={14} strokeWidth={2.5} />
                                                </div>
                                            )}
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Quick Pick Visual Cards */}
            {categories.length > 0 && (
                <div className="mt-3">
                    <div className="text-xs font-medium text-gray-500 mb-2 flex items-center justify-between">
                        <span>Quick Pick:</span>
                        {selectedCategory && (
                            <span className="text-sky-600 font-normal">
                                Selected: <strong>{selectedCategory.name}</strong>
                            </span>
                        )}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {categories.map((cat) => {
                            const meta = getCategoryMeta(cat.name);
                            const isSelected = cat._id === selectedId;

                            return (
                                <button
                                    key={cat._id}
                                    type="button"
                                    onClick={() => onSelect(cat._id)}
                                    className={`p-2.5 rounded-xl border text-left transition-all duration-200 cursor-pointer flex items-center gap-2.5 ${
                                        isSelected
                                            ? "border-sky-500 bg-sky-50/70 text-sky-900 shadow-xs ring-1 ring-sky-500"
                                            : "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50"
                                    }`}
                                >
                                    <div
                                        className={`w-7 h-7 rounded-lg flex items-center justify-center border shrink-0 ${
                                            isSelected
                                                ? "bg-sky-500 text-white border-sky-500"
                                                : `${meta.bgColor} ${meta.textColor} ${meta.borderColor}`
                                        }`}
                                    >
                                        <meta.Icon size={14} />
                                    </div>
                                    <span className="font-semibold text-xs sm:text-sm truncate">
                                        {cat.name}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategorySelector;
