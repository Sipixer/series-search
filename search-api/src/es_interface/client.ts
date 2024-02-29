import { Client } from "@elastic/elasticsearch";


const ELASTICSEARCH_URL = process.env.ELASTICSEARCH_URL || "https://127.0.0.1:9200";
export const esClient = new Client({
    node: ELASTICSEARCH_URL,
    auth: {
        username: "elastic",
        password: "root_root"
    }
});
