import { analyzeUrl } from '@/lib/analyzer';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ message: 'URL is required' });
    }

    try {
        const results = await analyzeUrl(url);

        // Process results to be more frontend-friendly
        const violations = results.violations.map(v => ({
            id: v.id,
            impact: v.impact,
            description: v.description,
            help: v.help,
            helpUrl: v.helpUrl,
            nodes: v.nodes.map(n => ({
                html: n.html,
                target: n.target,
                failureSummary: n.failureSummary
            }))
        }));

        // Calculate a simple score (100 - (violations * weight))
        // This is arbitrary but gives a sense of quality
        // Critical = 5, Serious = 3, Moderate = 2, Minor = 1
        let scoreDeduction = 0;
        violations.forEach(v => {
            const count = v.nodes.length;
            let weight = 1;
            if (v.impact === 'critical') weight = 5;
            if (v.impact === 'serious') weight = 3;
            if (v.impact === 'moderate') weight = 2;
            scoreDeduction += (count * weight);
        });

        const score = Math.max(0, 100 - scoreDeduction);

        res.status(200).json({
            score,
            violations,
            timestamp: results.timestamp,
            url: results.url
        });
    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ message: 'Failed to analyze URL', error: error.message });
    }
}
