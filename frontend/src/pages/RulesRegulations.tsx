import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "../SingleEventPage.module.css";

// Define the props interface with consistent types
interface EventProps {
  rules_and_regulations: object;
}

interface RulesRegulationsProps {
  event: EventProps;
}

const RulesRegulations = ({ event }: RulesRegulationsProps) => {
  console.log(event.rules_and_regulations)
  return (
    <div className={styles.markdown}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {/* {event.rules_and_regulations} */}
        Rules and regulations.
      </ReactMarkdown>
    </div>
  );
};

export default RulesRegulations;
