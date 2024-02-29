import { Data } from '../tools/loader';
import { esClient } from './client';
import { processText } from '../tools/textPreprocessor';
import { ImportStatus } from '../events/ImportStatus';



const indexName = "testing";

export class ElasticSearch {
    static async deleteIndex() {
        if (await this.indexExists())
            await esClient.indices.delete({ index: indexName })

    }

    static async indexExists() {
        return await esClient.indices.exists({ index: indexName });
    }

    static async createIndex() {
        if (await this.indexExists()) {
            console.log("Index already exists");
            return;
        }

        await esClient.indices.create({
            index: indexName,
            settings: {
                similarity: {
                    bm25: {
                        type: "BM25",
                        k1: 1.2,
                        b: 0.75,
                        discount_overlaps: true
                    }
                },
                index: {
                    max_result_window: 100000
                }
            },
            mappings: {
                properties: {
                    serie: {
                        type: "keyword",
                    },
                    episode: {
                        type: "text",
                        similarity: "bm25"
                    },
                    subtitle: {
                        type: "text",
                        similarity: "bm25"
                    }
                }
            }
        });
        esClient.indices.refresh({ index: indexName });
    }

    static async import(data: Data[], ImportStatus: ImportStatus) {
        let count = 0;
        for (const d of data) {
            await esClient.index({
                index: indexName,
                body: d
            });
            ImportStatus.setImportProgress(count++, data.length);
        }
        ImportStatus.setLoaded();
    }

    static async search(text: string) {
        if (!esClient.ping()) {
            return [];
        }

        if (!text) {
            return [];
        }

        const textWithoutSpace: string = text.replace(" ", "").toLowerCase();
        const textForQuery: string = processText(text);
        const searchQuery = {
            "_source": ["serie"],
            "size": 0,
            "query": {
                "bool": {
                    "should": [
                        { "match": { "serie": { "query": textWithoutSpace, "boost": 2 } } },
                        { "match": { "subtitle": { "query": textForQuery, "operator": "and" } } }
                    ]
                }
            },
            "aggs": {
                "series": {
                    "terms": { "field": "serie" },
                    "aggs": { "total_score": { "avg": { "script": "_score" } } }
                }
            }
        };

        const result = await esClient.search({ index: "testing", ...searchQuery });
        const ranking: {
            title: string,
            score: number
        }[] = [];
        const buckets = result.aggregations?.["series"]["buckets"];
        for (const bucket of buckets) {
            ranking.push({
                title: bucket.key,
                score: bucket.total_score.value
            });
        }

        return ranking.sort((a, b) => b.score - a.score);
    }
}
