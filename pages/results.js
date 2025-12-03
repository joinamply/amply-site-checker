import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import ScoreCard from '@/components/ScoreCard';
import IssueList from '@/components/IssueList';
import styles from '@/styles/Results.module.css';

export default function Results() {
    const router = useRouter();
    const { url } = router.query;
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!router.isReady || !url) return;

        const fetchData = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await fetch('/api/analyze', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ url }),
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.message || 'Failed to analyze');
                }

                const result = await res.json();
                setData(result);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router.isReady, url]);

    const handleShare = () => {
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            <Head>
                <title>Analysis Results - Amply Site Checker</title>
            </Head>
            <div className={styles.container}>
                <header className={styles.header}>
                    <h1 className={styles.logo} onClick={() => router.push('/')}>Amply</h1>
                    <div className={styles.actions}>
                        <button onClick={handleShare} className={styles.actionBtn}>Share</button>
                        <button onClick={handlePrint} className={styles.actionBtn}>Export PDF</button>
                    </div>
                </header>

                <main className={styles.main}>
                    {loading && (
                        <div className={styles.loading}>
                            <div className={styles.spinner}></div>
                            <p>Analyzing {url}...</p>
                            <p className={styles.subtext}>This may take up to 30 seconds.</p>
                        </div>
                    )}

                    {error && (
                        <div className={styles.error}>
                            <h2>Error</h2>
                            <p>{error}</p>
                            <button onClick={() => router.push('/')} className={styles.backBtn}>Try Another URL</button>
                        </div>
                    )}

                    {data && (
                        <div className={styles.content}>
                            <div className={styles.summary}>
                                <h2 className={styles.urlTitle}>Results for: <span>{url}</span></h2>
                                <ScoreCard score={data.score} />
                            </div>
                            <IssueList issues={data.violations} />
                        </div>
                    )}
                </main>
            </div>
        </>
    );
}
