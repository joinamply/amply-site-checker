import { useState } from 'react';
import styles from './UrlInput.module.css';

export default function UrlInput({ onSubmit, isLoading }) {
    const [url, setUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (url && !isLoading) {
            onSubmit(url);
        }
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <input
                type="url"
                className={styles.input}
                placeholder="Enter website URL (e.g., https://example.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                disabled={isLoading}
            />
            <button type="submit" className={styles.button} disabled={isLoading}>
                {isLoading ? 'Analyzing...' : 'Check Website'}
            </button>
        </form>
    );
}
