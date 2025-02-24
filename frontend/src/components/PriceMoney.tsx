import React from 'react';
import AnimatedNumbers from 'react-animated-numbers';

interface PrizeMoneyProps {
    amount: number;
}

const PrizeMoney: React.FC<PrizeMoneyProps> = ({ amount }) => {
    return (
        <div className="mt-4 text-2xl font-bold flex justify-around items-center space-x-8">
            <div className="flex flex-col items-center">
                <img src="https://www.pngplay.com/wp-content/uploads/2/Gold-Medal-PNG-Free-File-Download.png" alt="Gold Medal" className="w-12 h-auto mb-2" />
                <span>First Prize:</span>
                <div className="flex items-center">
                    <span>₹</span>
                    <AnimatedNumbers
                        includeComma
                        transitions={(index) => ({
                            type: "spring",
                            duration: index + 0.01,
                        })}
                        animateToNumber={amount}
                        fontStyle={{ fontSize: 32 }}
                    />
                </div>
            </div>
            <div className="flex flex-col items-center">
                <img src="https://static.vecteezy.com/system/resources/previews/029/474/759/non_2x/silver-medal-with-red-ribbon-for-second-place-pro-png.png" alt="Silver Medal" className="w-12 h-auto mb-2" />
                <span>Second Prize:</span>
                <div className="flex items-center">
                    <span>₹</span>
                    <AnimatedNumbers
                        includeComma
                        transitions={(index) => ({
                            type: "spring",
                            duration: index + 0.01,
                        })}
                        animateToNumber={amount / 2}
                        fontStyle={{ fontSize: 32 }}
                    />
                </div>
            </div>
            <div className="flex flex-col items-center">
                <img src="https://wallpapers.com/images/hd/bronze-medalwith-red-ribbon-5h57r9237p48my77.jpg" alt="Bronze Medal" className="w-12 h-auto mb-2" />
                <span>Third Prize:</span>
                <div className="flex items-center">
                    <span>₹</span>
                    <AnimatedNumbers
                        includeComma
                        transitions={(index) => ({
                            type: "spring",
                            duration: index + 0.01,
                        })}
                        animateToNumber={amount / 4}
                        fontStyle={{ fontSize: 32 }}
                    />
                </div>
            </div>
        </div>
    );
};

export default PrizeMoney;