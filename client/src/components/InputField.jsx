function InputField({ label, error, ...rest }) {
    return (
        <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">
                {label}
            </label>
            <input
                {...rest}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-sky-500 outline-none ${
                    error ? "border-red-500" : "border-gray-300"
                }`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}

export default InputField;
