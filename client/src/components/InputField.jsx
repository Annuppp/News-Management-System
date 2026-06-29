function InputField({ label, error, showPassword, onTogglePassword, ...rest }) {
    return (
        <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">
                {label}
            </label>

            <div className="relative">
                <input
                    {...rest}
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none ${
                        error ? "border-red-500" : "border-gray-300"
                    }`}
                />

                {showPassword && (
                    <button
                        type="button"
                        onClick={onTogglePassword}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover: text-gray-700"
                    >
                        {rest.type === "password" ? "👁️" : "👁️‍🗨️"}
                    </button>
                )}
            </div>
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}

export default InputField;
