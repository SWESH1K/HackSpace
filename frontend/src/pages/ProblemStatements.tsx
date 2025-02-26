import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from "remark-gfm";
import styles from "../SingleEventPage.module.css";

// Define the props interface with consistent types
interface EventProps {
  problem_statements: string;
}

interface ProblemStatementsProps {
  event: EventProps;
}

const ProblemStatements = ({ event }: ProblemStatementsProps) => {
  return (
    <div className={styles.markdown}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {event.problem_statements}
      </ReactMarkdown>
    </div>
  );
}

export default ProblemStatements;