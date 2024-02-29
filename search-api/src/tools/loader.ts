import * as fs from 'fs';
import * as path from 'path';


export type Data = {
    serie: string,
    episode: string,
    subtitle: string
}
export const dataLoader = async () => {
    const data: Data[] = [];
    const PATH = path.join('data', 'processed');
    const series = await fs.promises.readdir(PATH);
    for (const serie of series) {
        const episodesName = await fs.promises.readdir(path.join(PATH, serie));
        for (const episodeName of episodesName) {
            data.push({
                serie: serie,
                episode: episodeName.replace('.txt', ''),
                subtitle: await fs.promises.readFile(path.join(PATH, serie, episodeName), 'utf8')
            })
        }
    }
    return data;
}