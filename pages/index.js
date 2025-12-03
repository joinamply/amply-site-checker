import Head from 'next/head';
import { useRouter } from 'next/router';
import UrlInput from '@/components/UrlInput';
import styles from '@/styles/Home.module.css';

export default function Home() {
  const router = useRouter();

  const handleAnalyze = (url) => {
    router.push(`/results?url=${encodeURIComponent(url)}`);
  };

  return (
    <>
      <Head>
        <title>Amply Site Checker</title>
        <meta name="description" content="Check your website for accessibility improvements" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <main className={styles.main}>
          <h1 className={styles.title}>
            Amply Site Checker
          </h1>
          <p className={styles.description}>
            Enter a URL to check for accessibility improvements.
          </p>
          <UrlInput onSubmit={handleAnalyze} isLoading={false} />
        </main>
      </div>
    </>
  );
}
