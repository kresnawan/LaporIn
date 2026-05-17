function Button({ children, className, variant, ...props }) {
    if (variant === "filled") {
        return (
            <button {...props}
                className={` bg-[#4a7ce7] cursor-pointer rounded-sm text-white text-sm p-2 ${className}`}>
                {children}
            </button>
        )
    } else if (variant === "outlined") {
        return (
            <button {...props}
                className={`border-2 border-[#4a7ce7] rounded-sm cursor-pointer text-sm text-[#4a7ce7] p-2 ${className}`}>
                {children}
            </button>
        )
    }
}

export default Button