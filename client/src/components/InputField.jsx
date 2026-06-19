// InputField.jsx
function InputField({ label, ...rest }) {
    return (
        <div className="mb-4">
            <label className="block text-gray-600 text-sm font-medium mb-2">
                {label}
            </label>
            <input
                {...rest}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none"
            />
        </div>
    );
}

export default InputField;
