import EventEmitter from 'events';
import { ElasticSearch } from '../es_interface/eas';



export class ImportStatus {
    loaded: boolean = false;
    progress: number = 0;
    total: number = 0;
    constructor() {
        ElasticSearch.indexExists().then((exists) => {
            this.loaded = exists;
        });
    }

    setLoaded() {
        this.loaded = true;
    }
    setLoad() {
        this.loaded = false;
    }

    setImportProgress(progress: number, total: number) {
        this.progress = progress + 1;
        this.total = total;
    }

}

export const importStatus = new ImportStatus();