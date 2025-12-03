import styles from './IssueList.module.css';

export default function IssueList({ issues }) {
    if (!issues || issues.length === 0) {
        return (
            <div className={styles.empty}>
                <h3>No issues found! 🎉</h3>
                <p>Great job on accessibility.</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.heading}>Improvements Found ({issues.length})</h2>
            <div className={styles.list}>
                {issues.map((issue) => (
                    <div key={issue.id} className={styles.issue}>
                        <div className={styles.header}>
                            <span className={`${styles.tag} ${styles[issue.impact]}`}>
                                {issue.impact}
                            </span>
                            <h3 className={styles.issueTitle}>{issue.help}</h3>
                        </div>
                        <p className={styles.description}>{issue.description}</p>

                        <div className={styles.nodes}>
                            {issue.nodes.map((node, idx) => (
                                <div key={idx} className={styles.node}>
                                    <code className={styles.code}>{node.html}</code>
                                    <p className={styles.failure}>{node.failureSummary}</p>
                                </div>
                            ))}
                        </div>

                        <a href={issue.helpUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
                            Learn more
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
}
