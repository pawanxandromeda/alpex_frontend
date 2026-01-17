import React, { useState, useEffect, useRef } from 'react'

const AutoComplete = ({ suggestions, placeholder = 'Search...', onSelect }) => {
    const [inputValue, setInputValue] = useState('')
    const [filteredSuggestions, setFilteredSuggestions] = useState([])
    const [isOpen, setIsOpen] = useState(false)
    const [highlightedIndex, setHighlightedIndex] = useState(-1)
    const inputRef = useRef(null)
    const suggestionsRef = useRef(null)

    // Filter suggestions based on input
    useEffect(() => {
        if (inputValue) {
            const filtered = suggestions.filter((suggestion) =>
                suggestion.toLowerCase().includes(inputValue.toLowerCase())
            )
            setFilteredSuggestions(filtered)
        } else {
            setFilteredSuggestions(suggestions.slice(0, 5)) // Show top 5 suggestions when empty
        }
        setHighlightedIndex(-1)
    }, [inputValue, suggestions])

    // Handle clicks outside component
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (
                inputRef.current &&
                !inputRef.current.contains(e.target) &&
                suggestionsRef.current &&
                !suggestionsRef.current.contains(e.target)
            ) {
                setIsOpen(false)
            }
        }

        document.addEventListener('mousedown', handleOutsideClick)
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick)
        }
    }, [])

    const handleChange = (e) => {
        setInputValue(e.target.value)
        if (!isOpen) setIsOpen(true)
    }

    const handleSuggestionClick = (suggestion) => {
        setInputValue(suggestion)
        setIsOpen(false)
        if (onSelect) onSelect(suggestion)
    }

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
        if (!isOpen && inputRef.current) {
            inputRef.current.focus()
        }
    }

    const handleKeyDown = (e) => {
        // Arrow down
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            if (!isOpen) {
                setIsOpen(true)
            } else {
                setHighlightedIndex((prev) =>
                    prev < filteredSuggestions.length - 1 ? prev + 1 : prev
                )
            }
        }
        // Arrow up
        else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : 0))
        }
        // Enter
        else if (e.key === 'Enter') {
            e.preventDefault()
            if (isOpen && highlightedIndex >= 0) {
                handleSuggestionClick(filteredSuggestions[highlightedIndex])
            } else {
                toggleDropdown()
            }
        }
        // Escape
        else if (e.key === 'Escape') {
            setIsOpen(false)
        }
    }

    return (
        <div className="relative w-full max-w-md">
            <div className="flex">
                <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder={placeholder}
                    className="w-full rounded-l border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label={placeholder}
                    aria-autocomplete="list"
                    aria-controls="suggestions-list"
                    aria-expanded={isOpen}
                />
                <button
                    type="button"
                    onClick={toggleDropdown}
                    className="rounded-r border border-l-0 border-gray-300 bg-gray-100 px-3 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Toggle dropdown"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 16 16"
                        className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    >
                        <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                    </svg>
                </button>
            </div>

            {isOpen && (
                <ul
                    ref={suggestionsRef}
                    id="suggestions-list"
                    className="absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded border border-gray-300 bg-white shadow-lg"
                    role="listbox"
                >
                    {filteredSuggestions.length > 0 ? (
                        filteredSuggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() =>
                                    handleSuggestionClick(suggestion)
                                }
                                className={`cursor-pointer px-4 py-2 hover:bg-gray-100 ${
                                    index === highlightedIndex
                                        ? 'bg-blue-100'
                                        : ''
                                }`}
                                role="option"
                                aria-selected={index === highlightedIndex}
                            >
                                {suggestion}
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-2 text-gray-500">
                            No results found
                        </li>
                    )}
                </ul>
            )}
        </div>
    )
}

export default AutoComplete
