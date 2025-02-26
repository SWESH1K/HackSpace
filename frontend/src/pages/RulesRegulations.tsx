import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import styles from "../SingleEventPage.module.css";

// Define the props interface with consistent types
interface EventProps {
  rules_and_regulations: string;
}

interface RulesRegulationsProps {
  event: EventProps;
}

const RulesRegulations = ({ event }: RulesRegulationsProps) => {
  return (
    <div className={styles.markdown}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {event.rules_and_regulations}
      </ReactMarkdown>
    </div>
  );
}

export default RulesRegulations;