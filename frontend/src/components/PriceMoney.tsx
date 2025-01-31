import React from 'react';
import AnimatedNumbers from 'react-animated-numbers';

interface PrizeMoneyProps {
    amount: number;
}

const PrizeMoney: React.FC<PrizeMoneyProps> = ({ amount }) => {
    return (
        <div className="mt-4 text-2xl font-bold space-y-4">
            <div className="flex items-center">
                <span className='mr-8 text-gray-700 dark:text-gray-300'>First Price:</span><span className='text-gray-600 dark:text-gray-400'>₹</span>
                <AnimatedNumbers
                    includeComma
                    className='text-gray-600 dark:text-gray-400'
                    transitions={(index) => ({
                        type: "spring",
                        duration: index + 0.01,
                    })}
                    animateToNumber={amount}
                    fontStyle={{ fontSize: 32 }}
                />
            </div>
            <div className="flex items-stretch w-full">
                <span className='mr-2'>Second Price:</span><span className='text-gray-600 dark:text-gray-400'>₹</span>
                <AnimatedNumbers
                    includeComma
                    className='text-gray-600 dark:text-gray-400'
                    transitions={(index) => ({
                        type: "spring",
                        duration: index + 0.01,
                    })}
                    animateToNumber={amount/2}
                    fontStyle={{ fontSize: 32 }}
                />
            </div>
            <div className="flex items-center">
                <span className='mr-8'>Third Price:</span><span className='text-gray-600 dark:text-gray-400'>₹</span>
                <AnimatedNumbers
                    includeComma
                    className='text-gray-600 dark:text-gray-400'
                    transitions={(index) => ({
                        type: "spring",
                        duration: index + 0.01,
                    })}
                    animateToNumber={amount/4}
                    fontStyle={{ fontSize: 32 }}
                />
            </div>
        </div>
    );
};

export default PrizeMoney;