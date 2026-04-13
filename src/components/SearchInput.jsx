import React from 'react';
import { Search } from 'lucide-react';

const SearchInput = ({ value, onChange }) => {
    return (
        <div className="relative w-full max-w-md mb-8">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-transparent rounded-full leading-5 bg-[#242424] text-white placeholder-gray-400 focus:outline-none focus:bg-[#2a2a2a] focus:ring-0 focus:border-white sm:text-sm transition"
                placeholder="What do you want to listen to?"
                value={value}
                onChange={onChange}
            />
        </div>
    );
};

export default SearchInput;
