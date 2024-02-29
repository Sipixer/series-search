import natural from 'natural';

// Fonction pour supprimer la ponctuation du texte
function removePunctuation(text: string): string {
    return text.replace(/[^\w\s]|_/g, '').replace(/\s+/g, ' ');
}

// Fonction pour convertir le texte en minuscules
function convertToLowercase(text: string): string {
    return text.toLowerCase();
}

// Fonction pour supprimer les accents des mots
function removeAccents(text: string): string {
    return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

// Fonction pour charger et filtrer les stopwords
function loadAndFilterStopwords(words: string[]): string[] {
    const stopwords = natural.stopwords;
    return words.filter(word => !stopwords.includes(word));
}

// Fonction principale qui effectue toutes les étapes
export function processText(text: string): string {
    let processedText = removePunctuation(text);
    processedText = convertToLowercase(processedText);
    let words = processedText.split(' ');
    words = words.map(removeAccents);
    words = loadAndFilterStopwords(words);
    words = words.filter(word => word.length > 1);
    words = words.filter(word => !/^\d+$/.test(word));
    return words.join(' ').toLowerCase();
}

