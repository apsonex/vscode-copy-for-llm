// Always include defaults, but let user override/remove via settings
const defaultBinaryExtensions = [
    '.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg', '.ico', '.tif', '.tiff',
    '.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx',
    '.zip', '.rar', '.7z', '.tar', '.gz', '.bz2',
    '.exe', '.dll', '.so', '.dylib', '.bin', '.dat', '.db',
    '.mp3', '.mp4', '.avi', '.mov', '.mkv', '.wav', '.flac',
    '.ttf', '.otf', '.woff', '.woff2', '.eot'
];

module.exports = {
    defaultBinaryExtensions
};
