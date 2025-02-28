import { useSpring, animated } from '@react-spring/web';

interface PrizeMoneyProps {
    amount: number;
}

const PrizeMoney: React.FC<PrizeMoneyProps> = ({ amount }) => {
    const firstPrizeProps = useSpring({ number: amount, from: { number: 0 }, config: { duration: 2000 }});
    const secondPrizeProps = useSpring({ number: amount / 2, from: { number: 0 }, config: { duration: 2000 }});

    return (
        <div className="mt-4 text-2xl font-bold flex justify-around items-center space-x-8">
            <div className="flex flex-col items-center">
                <img src="/Gold-Medal.png" alt="Gold Medal" className="w-12 h-auto mb-2" />
                <span>First Prize:</span>
                <div className="flex items-center">
                    <span>₹</span>
                    <animated.span>{firstPrizeProps.number.to(n => n.toFixed(0))}</animated.span>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <img src="/Silver-Medal.webp" alt="Silver Medal" className="w-12 h-auto mb-2" />
                <span>Second Prize:</span>
                <div className="flex items-center">
                    <span>₹</span>
                    <animated.span>{secondPrizeProps.number.to(n => n.toFixed(0))}</animated.span>
                </div>
            </div>
            <div className="flex flex-col items-center">
                <img src="/Bronze-Medal.png" alt="Bronze Medal" className="w-12 h-auto mb-2" />
                <span>Third Prize:</span>
                <div className="flex items-center">
                    <span>₹</span>
                    <animated.span>{secondPrizeProps.number.to(n => (n / 2).toFixed(0))}</animated.span>
                </div>
            </div>
        </div>
    );
};

export default PrizeMoney;